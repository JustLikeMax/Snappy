import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/hooks/useI18n";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useProfileImage } from "@/hooks/useProfileImage";

// Import styles
import { profileStyles } from "@/components/profile/ProfileStyles";

// Import modular components
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileImageSection } from "@/components/profile/ProfileImageSection";
import { ProfileInfoSection } from "@/components/profile/ProfileInfoSection";
import { ProfileSettingsPreview } from "@/components/profile/ProfileSettingsPreview";
import { SettingsModal } from "@/components/profile/SettingsModal";

export default function ProfileScreen() {
    const { user, logout, setUser } = useAuth();
    const { isDark, themeMode, setThemeMode } = useTheme();
    const { changeLanguage } = useI18n();
    const {
        isUploading: profileImageLoading,
        uploadProgress,
        showImagePicker,
    } = useProfileImage({
        onSuccess: (imageUrl: string, updatedUser: any) => {
            // Update the user context with the complete updated user data
            setUser(updatedUser);
        },
        onError: (error: Error) => {
            console.error("Profile image upload error:", error);
        },
    });

    // Profile form management
    const {
        editFormData,
        editModalVisible,
        isLoading,
        openEditModal,
        closeEditModal,
        updateFormField,
        handleSaveProfile,
    } = useProfileForm();

    // Settings modal state
    const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);

    const handleLogout = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await logout();
        router.replace("/auth/login");
    };

    const openSettingsModal = () => {
        setSettingsModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const closeSettingsModal = () => {
        setSettingsModalVisible(false);
    };
    const handleImagePress = () => {
        if (user?.id) {
            showImagePicker(user.id, user.profile_image_url);
        }
    };

    const handleThemeChange = (theme: string) => {
        setThemeMode(theme as "light" | "dark" | "system");
    };

    const handleLanguageChange = (language: string) => {
        changeLanguage(language);
    };

    if (!user) {
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <ThemedView style={profileStyles.container}>
                <ScrollView
                    style={profileStyles.scrollView}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileHeader
                        onSettingsPress={openSettingsModal}
                        onLogoutPress={handleLogout}
                    />
                    <ProfileImageSection
                        user={user}
                        profileImageLoading={profileImageLoading}
                        uploadProgress={uploadProgress}
                        onImagePress={handleImagePress}
                    />
                    <ProfileInfoSection
                        user={user}
                        onEditPress={openEditModal}
                    />
                    <ProfileSettingsPreview
                        themeMode={themeMode}
                        onSettingsPress={openSettingsModal}
                    />
                </ScrollView>
                <EditProfileModal
                    visible={editModalVisible}
                    onClose={closeEditModal}
                    formData={editFormData}
                    isLoading={isLoading}
                    onUpdateField={updateFormField}
                    onSave={handleSaveProfile}
                />
                <SettingsModal
                    visible={isSettingsModalVisible}
                    onClose={closeSettingsModal}
                    themeMode={themeMode}
                    onThemeChange={handleThemeChange}
                    onLanguageChange={handleLanguageChange}
                />
            </ThemedView>
        </SafeAreaView>
    );
}
