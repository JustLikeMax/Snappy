import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/User';
import { AuthService } from '../services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const payload = AuthService.verifyToken(token);
    if (!payload) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    // Validate session in database
    const isValidSession = await AuthService.validateSession(payload.userId, token);
    if (!isValidSession) {
      res.status(403).json({ error: 'Session expired or invalid' });
      return;
    }

    // Verify user still exists
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      res.status(403).json({ error: 'User not found' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
