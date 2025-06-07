import { createClient } from '@supabase/supabase-js';
import * as FileSystem from 'expo-file-system';
import { User } from './AuthService';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yrqrgqiqvlbsipohwhig.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycXJncWlxdmxic2lwb2h3aGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTAyNDYsImV4cCI6MjA2NDg4NjI0Nn0.EEnTk07F4OAxx-n0TFqp52PNRFCse3vn1Js3Sr0tvJw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseStorageService {
  static readonly PROFILE_PICTURES_BUCKET = 'avatars';
    /**
   * Upload profile picture to Supabase Storage with optimization
   * @param userId - The user's ID to create a unique filename
   * @param imageUri - The local image URI from image picker
   * @param options - Upload options
   * @returns Promise<{imageUrl: string, user: User}> - The public URL of the uploaded image and updated user data
   */  static async uploadProfilePicture(
    userId: number, 
    imageUri: string,
    options: {
      quality?: number;
      maxWidth?: number;
      maxHeight?: number;
    } = {}
  ): Promise<{imageUrl: string, user: User}> {
    try {
      const { quality = 0.8, maxWidth = 1024, maxHeight = 1024 } = options;
      
      // Get file info to check size
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image file not found');
      }
      
      // Check file size (limit to 5MB)
      if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
        throw new Error('Image file size too large. Please choose an image smaller than 5MB.');
      }
      
      // Import AuthService for the token and API URL
      const { AuthService } = await import('./AuthService');
      const token = await AuthService.getToken();
        if (!token) {
        throw new Error('User not authenticated');
      }      // Create FormData for React Native
      const formData = new FormData();
      
      // In React Native, we need to use a different approach for FormData
      // The imageUri should be used directly for React Native FormData
      const timestamp = Date.now();
      let filename = `profile-${userId}-${timestamp}.jpg`;
      
      // Get file extension from URI if possible
      let mimeType = 'image/jpeg';
      if (imageUri.includes('.')) {
        const extension = imageUri.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'png':
            mimeType = 'image/png';
            filename = `profile-${userId}-${timestamp}.png`;
            break;
          case 'webp':
            mimeType = 'image/webp';
            filename = `profile-${userId}-${timestamp}.webp`;
            break;
          default:
            mimeType = 'image/jpeg';
            filename = `profile-${userId}-${timestamp}.jpg`;
        }
      }
      
      console.log('Image URI:', imageUri);
      console.log('Detected MIME type:', mimeType);
      console.log('Generated filename:', filename);
      
      // For React Native, FormData expects an object with uri, type, and name
      formData.append('image', {
        uri: imageUri,
        type: mimeType,
        name: filename,
      } as any);
        // Get the working API URL
      const apiUrl = await AuthService.findWorkingApiUrl();
      console.log('Uploading to:', `${apiUrl}/upload/profile-picture`);
      console.log('FormData prepared for image:', filename);
      
      // Upload to your backend endpoint
      const response = await fetch(`${apiUrl}/upload/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let the browser/React Native set it automatically for FormData
        },
        body: formData,
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
      }
        const result = await response.json();
      console.log('Profile picture uploaded successfully:', result.imageUrl);
      console.log('Updated user data:', result.user);
      
      // Return both the image URL and the updated user data
      return {
        imageUrl: result.imageUrl,
        user: result.user
      };
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
    /**
   * Delete profile picture from Supabase Storage via backend
   * @param imageUrl - The full URL of the image to delete
   */
  static async deleteProfilePicture(imageUrl: string): Promise<void> {
    try {
      // Import AuthService for the token and API URL
      const { AuthService } = await import('./AuthService');
      const token = await AuthService.getToken();
      
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      // Get the working API URL
      const apiUrl = await AuthService.findWorkingApiUrl();
      
      // Delete via your backend endpoint
      const response = await fetch(`${apiUrl}/upload/profile-picture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Failed to delete profile picture:', errorData.error);
        // Don't throw here as it's not critical if deletion fails
      } else {
        console.log('Profile picture deleted successfully');
      }
      
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      // Don't throw here as it's not critical if deletion fails
    }
  }
    /**
   * Get optimized image URL with transformations (resize, quality, format)
   * Uses Supabase's built-in image transformation capabilities via CDN
   * @param imageUrl - The original image URL
   * @param options - Transformation options
   * @returns string - The optimized image URL with CDN transformations
   */
  static getOptimizedImageUrl(
    imageUrl: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
      resize?: 'cover' | 'contain' | 'fill';
    } = {}
  ): string {
    const { width = 300, height = 300, quality = 80, format = 'webp', resize = 'cover' } = options;
    
    // Check if this is a Supabase storage URL
    if (!imageUrl.includes('supabase') || !imageUrl.includes('storage/v1/object/public/')) {
      return imageUrl;
    }
    
    // Supabase image transformations via URL parameters
    // This leverages Supabase's built-in CDN capabilities
    const transformParams = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      quality: quality.toString(),
      format: format,
      resize: resize
    });
    
    // Add transformation parameters to the URL
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}${transformParams.toString()}`;
  }

  /**
   * Generate multiple image sizes for responsive loading
   * @param imageUrl - The original image URL
   * @returns object with different sized URLs
   */
  static getResponsiveImageUrls(imageUrl: string) {
    return {
      thumbnail: this.getOptimizedImageUrl(imageUrl, { width: 100, height: 100, quality: 70 }),
      small: this.getOptimizedImageUrl(imageUrl, { width: 200, height: 200, quality: 75 }),
      medium: this.getOptimizedImageUrl(imageUrl, { width: 400, height: 400, quality: 80 }),
      large: this.getOptimizedImageUrl(imageUrl, { width: 800, height: 800, quality: 85 }),
      original: imageUrl
    };
  }

  /**
   * Get a CDN-optimized avatar URL with fallback
   * @param imageUrl - The profile image URL
   * @param size - The desired size (will be used for both width and height)
   * @returns string - Optimized avatar URL
   */
  static getAvatarUrl(imageUrl: string | null | undefined, size: number = 120): string {
    if (!imageUrl) {
      // Return a default avatar or placeholder
      return `https://ui-avatars.com/api/?name=User&size=${size}&background=6366f1&color=ffffff&bold=true`;
    }
    
    return this.getOptimizedImageUrl(imageUrl, { 
      width: size, 
      height: size, 
      quality: 90,
      format: 'webp',
      resize: 'cover'
    });
  }
    /**
   * Ensure storage bucket exists and is properly configured
   */
  static async initializeStorage(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === this.PROFILE_PICTURES_BUCKET);
      
      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(
          this.PROFILE_PICTURES_BUCKET,
          {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            fileSizeLimit: 5242880, // 5MB
          }
        );
        
        if (createError) {
          console.error('Error creating bucket:', createError);
        } else {
          console.log('Profile pictures bucket created successfully');
        }
      }
      
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  /**
   * Preload images for better performance
   * @param imageUrls - Array of image URLs to preload
   */
  static async preloadImages(imageUrls: string[]): Promise<void> {
    try {
      const preloadPromises = imageUrls.map(url => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't fail if one image fails
          img.src = url;
        });
      });
      
      await Promise.all(preloadPromises);
      console.log(`Preloaded ${imageUrls.length} images`);
    } catch (error) {
      console.error('Error preloading images:', error);
    }
  }

  /**
   * Get image metadata from Supabase Storage
   * @param fileName - The filename of the image
   * @returns Promise with image metadata
   */
  static async getImageMetadata(fileName: string): Promise<any> {
    try {
      const { data, error } = await supabase.storage
        .from(this.PROFILE_PICTURES_BUCKET)
        .list('', {
          search: fileName
        });
      
      if (error) {
        console.error('Error getting image metadata:', error);
        return null;
      }
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return null;
    }
  }

  /**
   * Test network connectivity to the backend server
   * @returns Promise<boolean> - true if connection successful
   */
  static async testNetworkConnectivity(): Promise<boolean> {
    try {
      console.log('Testing network connectivity...');
      const { AuthService } = await import('./AuthService');
      const apiUrl = await AuthService.findWorkingApiUrl();
      
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Network test response status:', response.status);
      console.log('Network test response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Network test response data:', data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Network connectivity test failed:', error);
      return false;
    }
  }
}
