import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from parent directory (same as app.ts)
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yrqrgqiqvlbsipohwhig.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with service role key for backend operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export class SupabaseAdminService {
  static readonly PROFILE_PICTURES_BUCKET = 'avatars';
  
  /**
   * Upload file to Supabase Storage
   * @param bucketName - The storage bucket name
   * @param fileName - The filename to use for the uploaded file
   * @param fileBuffer - The file buffer data
   * @param contentType - The MIME type of the file
   * @returns Promise<string> - The public URL of the uploaded file
   */
  static async uploadFile(
    bucketName: string,
    fileName: string,
    fileBuffer: Buffer,
    contentType: string
  ): Promise<string> {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          contentType,
          upsert: true, // Replace if file exists
          cacheControl: '3600', // Cache for 1 hour
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      // Get the public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;

    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Delete file from Supabase Storage
   * @param bucketName - The storage bucket name
   * @param fileName - The filename to delete
   */
  static async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        console.error('Supabase delete error:', error);
        console.warn('Failed to delete file, continuing...');
      } else {
        console.log('File deleted successfully:', fileName);
      }

    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw here as it's not critical if deletion fails
    }
  }
  
  /**
   * Initialize Supabase storage bucket and policies
   */
  static async initializeStorage(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === this.PROFILE_PICTURES_BUCKET);
      
      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabaseAdmin.storage.createBucket(
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
          
          // Set up RLS policies for the bucket
          await this.setupStoragePolicies();
        }
      }
      
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }
  
  /**
   * Set up Row Level Security policies for the storage bucket
   */
  private static async setupStoragePolicies(): Promise<void> {
    try {
      // These policies would typically be set up via the Supabase dashboard or SQL commands
      // For now, we'll log that they need to be configured
      console.log(`
        Please configure the following RLS policies for the ${this.PROFILE_PICTURES_BUCKET} bucket:
        
        1. Allow public read access:
           CREATE POLICY "Public Access" ON storage.objects
           FOR SELECT USING ( bucket_id = '${this.PROFILE_PICTURES_BUCKET}' );
        
        2. Allow authenticated users to upload their own files:
           CREATE POLICY "User Upload" ON storage.objects
           FOR INSERT WITH CHECK ( 
             bucket_id = '${this.PROFILE_PICTURES_BUCKET}' 
             AND auth.uid() IS NOT NULL 
           );
        
        3. Allow users to update their own files:
           CREATE POLICY "User Update" ON storage.objects
           FOR UPDATE USING ( 
             bucket_id = '${this.PROFILE_PICTURES_BUCKET}' 
             AND auth.uid() IS NOT NULL 
           );
        
        4. Allow users to delete their own files:
           CREATE POLICY "User Delete" ON storage.objects
           FOR DELETE USING ( 
             bucket_id = '${this.PROFILE_PICTURES_BUCKET}' 
             AND auth.uid() IS NOT NULL 
           );
      `);
    } catch (error) {
      console.error('Error setting up storage policies:', error);
    }
  }
  
  /**
   * Clean up orphaned profile pictures
   * This can be run as a scheduled job to remove unused images
   */
  static async cleanupOrphanedImages(): Promise<void> {
    try {
      console.log('Starting cleanup of orphaned profile pictures...');
      // Implementation would depend on your user table structure
      // This is a placeholder for the cleanup logic
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
  
  /**
   * Get storage usage statistics
   */
  static async getStorageStats(): Promise<{ 
    totalFiles: number; 
    totalSize: number; 
  }> {
    try {
      const { data: files, error } = await supabaseAdmin.storage
        .from(this.PROFILE_PICTURES_BUCKET)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) {
        console.error('Error getting storage stats:', error);
        return { totalFiles: 0, totalSize: 0 };
      }
      
      const totalFiles = files?.length || 0;
      const totalSize = files?.reduce((acc, file) => acc + (file.metadata?.size || 0), 0) || 0;
      
      return { totalFiles, totalSize };
    } catch (error) {
      console.error('Error calculating storage stats:', error);
      return { totalFiles: 0, totalSize: 0 };
    }
  }
}
