import { useAuth } from '@/contexts/AuthContext';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export interface ProfileFormData {
    first_name: string;
    last_name: string;
    bio: string;
    location: string;
    age: string;
}

export function useProfileForm() {
    const { user, updateProfile, isLoading } = useAuth();
    
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editFormData, setEditFormData] = useState<ProfileFormData>({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        bio: user?.bio || "",
        location: user?.location || "",
        age: user?.age?.toString() || "",
    });

    const resetFormData = () => {
        setEditFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            bio: user?.bio || "",
            location: user?.location || "",
            age: user?.age?.toString() || "",
        });
    };

    const openEditModal = () => {
        resetFormData();
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
    };

    const handleSaveProfile = async () => {
        try {
            const updatedData: any = {
                first_name: editFormData.first_name,
                last_name: editFormData.last_name,
                bio: editFormData.bio,
                location: editFormData.location,
            };

            if (editFormData.age) {
                updatedData.age = parseInt(editFormData.age);
            }

            await updateProfile(updatedData);
            setEditModalVisible(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const updateFormField = (field: keyof ProfileFormData, value: string) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        editModalVisible,
        editFormData,
        isLoading,
        openEditModal,
        closeEditModal,
        handleSaveProfile,
        updateFormField,
    };
}
