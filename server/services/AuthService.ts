import { sql } from '@vercel/postgres';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
  static async storeSession(userId: string, token: string): Promise<void> {
    const sessionId = nanoid();
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await sql`
      INSERT INTO user_sessions (id, user_id, token_hash, expires_at)
      VALUES (${sessionId}, ${userId}, ${tokenHash}, ${expiresAt.toISOString()})
    `;

    // Clean up expired sessions
    await sql`
      DELETE FROM user_sessions 
      WHERE expires_at < CURRENT_TIMESTAMP
    `;
  }
  static async validateSession(userId: string, token: string): Promise<boolean> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const result = await sql`
      SELECT id FROM user_sessions 
      WHERE user_id = ${userId} 
      AND token_hash = ${tokenHash} 
      AND expires_at > CURRENT_TIMESTAMP
    `;

    return result.rows.length > 0;
  }

  static async revokeSession(userId: string, token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    await sql`
      DELETE FROM user_sessions 
      WHERE user_id = ${userId} AND token_hash = ${tokenHash}
    `;
  }

  static async revokeAllSessions(userId: string): Promise<void> {
    await sql`
      DELETE FROM user_sessions 
      WHERE user_id = ${userId}
    `;
  }
}
