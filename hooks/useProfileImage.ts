import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { User } from '../services/AuthService';
import { SupabaseStorageService } from '../services/SupabaseService';

interface UseProfileImageOptions {
  onSuccess?: (imageUrl: string, user: User) => void;
  onError?: (error: Error) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export function useProfileImage(options: UseProfileImageOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const {
    onSuccess,
    onError,
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8
  } = options;

  const pickAndUploadImage = async (userId: number, currentImageUrl?: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: quality,
      });      if (!result.canceled && result.assets[0]) {
        // Add detailed logging of the image picker result
        console.log('Image picker result:', {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].type,
          fileSize: result.assets[0].fileSize,
          fileName: result.assets[0].fileName
        });
        
        setIsUploading(true);
        setUploadProgress(0);

        // Declare progressInterval in broader scope so it can be cleared in catch block
        let progressInterval: ReturnType<typeof setInterval> | null = null;

        try {
          // Delete old profile picture if it exists
          if (currentImageUrl) {
            await SupabaseStorageService.deleteProfilePicture(currentImageUrl);
          }

          // Simulate upload progress (since we can't track actual progress with current implementation)
          progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
          }, 100);          // Upload new profile picture to Supabase with optimized settings
          const uploadResult = await SupabaseStorageService.uploadProfilePicture(
            userId, 
            result.assets[0].uri,
            {
              quality,
              maxWidth,
              maxHeight
            }
          );

          clearInterval(progressInterval);
          setUploadProgress(100);

          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSuccess?.(uploadResult.imageUrl, uploadResult.user);
          
        } catch (uploadError) {
          if (progressInterval) {
            clearInterval(progressInterval);
          }
          console.error('Error uploading profile picture:', uploadError);
          
          // Enhanced error logging
          if (uploadError instanceof Error) {
            console.error('Upload error name:', uploadError.name);
            console.error('Upload error message:', uploadError.message);
            console.error('Upload error stack:', uploadError.stack);
          }
          
          const error = uploadError instanceof Error ? uploadError : new Error('Upload failed');
          onError?.(error);
          
          // More descriptive error message based on error type
          let errorMessage = 'Failed to upload image. Please try again.';
          if (error.message.includes('Network request failed')) {
            errorMessage = 'Network connection failed. Please check your internet connection and try again.';
          } else if (error.message.includes('Failed to read image file')) {
            errorMessage = 'Could not read the selected image. Please try selecting a different image.';
          } else if (error.message.includes('Upload failed: 413')) {
            errorMessage = 'Image file is too large. Please select a smaller image (under 5MB).';
          } else if (error.message.includes('Upload failed: 401')) {
            errorMessage = 'Authentication failed. Please log in again and try uploading.';
          }
          
          Alert.alert('Upload Failed', errorMessage);
        }
      }
    } catch (error) {      console.error('Error picking image:', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to pick image');
      onError?.(errorObj);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const takePhoto = async (userId: number, currentImageUrl?: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);      // Request camera permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: quality,
      });      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        setUploadProgress(0);

        // Declare progressInterval in broader scope so it can be cleared in catch block
        let progressInterval: ReturnType<typeof setInterval> | null = null;

        try {
          // Delete old profile picture if it exists
          if (currentImageUrl) {
            await SupabaseStorageService.deleteProfilePicture(currentImageUrl);
          }

          // Simulate upload progress
          progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
          }, 100);          // Upload new profile picture
          const uploadResult = await SupabaseStorageService.uploadProfilePicture(
            userId, 
            result.assets[0].uri,
            {
              quality,
              maxWidth,
              maxHeight
            }
          );

          clearInterval(progressInterval);
          setUploadProgress(100);

          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSuccess?.(uploadResult.imageUrl, uploadResult.user);
          
        } catch (uploadError) {
          if (progressInterval) {
            clearInterval(progressInterval);
          }          console.error('Error uploading photo:', uploadError);
          const error = uploadError instanceof Error ? uploadError : new Error('Upload failed');
          onError?.(error);
          
          Alert.alert('Upload Failed', error.message || 'Failed to upload photo. Please try again.');
        }
      }    } catch (error) {
      console.error('Error taking photo:', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to take photo');
      onError?.(errorObj);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const showImagePicker = (userId: number, currentImageUrl?: string) => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => takePhoto(userId, currentImageUrl), style: 'default' },
        { text: 'Photo Library', onPress: () => pickAndUploadImage(userId, currentImageUrl), style: 'default' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return {
    isUploading,
    uploadProgress,
    pickAndUploadImage,
    takePhoto,
    showImagePicker
  };
}
