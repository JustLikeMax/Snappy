import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import { CreateUserData, UserModel } from '../models/User';
import { AuthService } from '../services/AuthService';

const router = express.Router();

// Input validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return errors;
};

// Register endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name, age, bio, location }: CreateUserData = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ 
        error: 'Email and password are required' 
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      res.status(400).json({ 
        error: 'Password requirements not met',
        details: passwordErrors
      });
      return;
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email.toLowerCase());
    if (existingUser) {
      res.status(409).json({ 
        error: 'An account with this email already exists' 
      });
      return;
    }

    // Create user
    const userData: CreateUserData = {
      email: email.toLowerCase(),
      password,
      first_name,
      last_name,
      age: age ? parseInt(String(age)) : undefined,
      bio,
      location
    };

    const user = await UserModel.create(userData);

    // Generate token
    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email
    });

    // Store session
    await AuthService.storeSession(user.id, token);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        bio: user.bio,
        location: user.location,
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ 
        error: 'Email and password are required' 
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
      return;
    }

    // Find user with password
    const user = await UserModel.findByEmailWithPassword(email.toLowerCase());
    if (!user) {
      res.status(401).json({ 
        error: 'Invalid email or password' 
      });
      return;
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ 
        error: 'Invalid email or password' 
      });
      return;
    }

    // Generate token
    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email
    });

    // Store session
    await AuthService.storeSession(user.id, token);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        bio: user.bio,
        location: user.location,
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await UserModel.findById(String(req.user.id));
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        bio: user.bio,
        location: user.location,
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { first_name, last_name, age, bio, location, profile_image_url } = req.body;

    const updatedUser = await UserModel.updateProfile(String(req.user.id), {
      first_name,
      last_name,
      age: age ? parseInt(String(age)) : undefined,
      bio,
      location,
      profile_image_url
    });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        age: updatedUser.age,
        bio: updatedUser.bio,
        location: updatedUser.location,
        profile_image_url: updatedUser.profile_image_url,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await AuthService.revokeSession(String(req.user.id), token);
    }

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Logout from all devices
router.post('/logout-all', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    await AuthService.revokeAllSessions(String(req.user.id));

    res.json({ message: 'Logged out from all devices successfully' });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
