import express from 'express';
import multer from 'multer';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import { UserModel } from '../models/User';
import { SupabaseAdminService } from '../services/SupabaseService';

const router = express.Router();

// Configure multer for file uploads (in memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

/**
 * Upload profile picture
 * POST /upload/profile-picture
 */
router.post('/profile-picture', authenticateToken, upload.single('image'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.id;
    
    // Get current user to check for existing profile picture
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      // Delete old profile picture if it exists
      if (user.profile_image_url) {
        // Extract filename from URL and delete from Supabase
        const urlParts = user.profile_image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        if (fileName) {
          await SupabaseAdminService.deleteFile('avatars', fileName);
        }
      }

      // Generate unique filename
      const timestamp = new Date().getTime();
      const fileExtension = req.file.originalname.split('.').pop() || 'jpg';
      const fileName = `profile-${userId}-${timestamp}.${fileExtension}`;

      // Upload to Supabase Storage
      const imageUrl = await SupabaseAdminService.uploadFile(
        'avatars',
        fileName,
        req.file.buffer,
        req.file.mimetype
      );

      // Update user profile with new image URL
      const updatedUser = await UserModel.updateProfile(userId, {
        profile_image_url: imageUrl
      });

      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user profile' });
      }

      res.json({
        message: 'Profile picture uploaded successfully',
        imageUrl,
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

    } catch (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      res.status(500).json({ 
        error: 'Failed to upload image to storage',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload profile picture',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Delete profile picture
 * DELETE /upload/profile-picture
 */
router.delete('/profile-picture', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    
    if (!user || !user.profile_image_url) {
      return res.status(404).json({ error: 'No profile picture found' });
    }

    try {
      // Extract filename from URL and delete from Supabase
      const urlParts = user.profile_image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (fileName) {
        await SupabaseAdminService.deleteFile('avatars', fileName);
      }

      // Update user profile to remove image URL
      const updatedUser = await UserModel.updateProfile(userId, {
        profile_image_url: null
      });

      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user profile' });
      }

      res.json({
        message: 'Profile picture deleted successfully',
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

    } catch (deleteError) {
      console.error('Error deleting from Supabase:', deleteError);
      res.status(500).json({ 
        error: 'Failed to delete image from storage',
        details: deleteError instanceof Error ? deleteError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Profile picture delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete profile picture',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
