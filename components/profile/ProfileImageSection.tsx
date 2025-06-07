import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Avatar } from "@/components/ui/OptimizedImage";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { User } from "@/services/AuthService";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { profileStyles } from "./ProfileStyles";

interface ProfileImageSectionProps {
    user: User;
    profileImageLoading: boolean;
    uploadProgress: number;
    onImagePress: () => void;
}

export function ProfileImageSection({
    user,
    profileImageLoading,
    uploadProgress,
    onImagePress,
}: ProfileImageSectionProps) {
    const { isDark } = useTheme();
    const currentColors = isDark ? Colors.dark : Colors.light;

    return (
        <View
            style={[
                profileStyles.profileSection,
                {
                    backgroundColor: currentColors.surface,
                    borderColor: currentColors.border,
                    shadowColor: currentColors.shadow,
                },
            ]}
        >
            <View style={profileStyles.profileImageContainer}>
                <TouchableOpacity
                    onPress={onImagePress}
                    disabled={profileImageLoading}
                >
                    <View
                        style={[
                            profileStyles.profileImageWrapper,
                            { borderColor: currentColors.tint },
                        ]}
                    >
                        {profileImageLoading ? (
                            <View style={profileStyles.profileImagePlaceholder}>
                                <ActivityIndicator
                                    size="large"
                                    color={currentColors.tint}
                                />
                                {uploadProgress > 0 && (
                                    <Text
                                        style={{
                                            color: currentColors.text,
                                            marginTop: 8,
                                        }}
                                    >
                                        {Math.round(uploadProgress)}%
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Avatar
                                imageUrl={user.profile_image_url}
                                size={114}
                                containerStyle={{ margin: 0 }}
                            />
                        )}
                        <View
                            style={[
                                profileStyles.cameraIcon,
                                {
                                    backgroundColor: currentColors.tint,
                                    borderColor: currentColors.surface,
                                },
                            ]}
                        >
                            <IconSymbol
                                name="camera.fill"
                                size={16}
                                color="white"
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <ThemedText
                type="title"
                style={[profileStyles.userName, { color: currentColors.text }]}
            >
                {user.first_name} {user.last_name}
            </ThemedText>
            <ThemedText
                style={[
                    profileStyles.userEmail,
                    { color: currentColors.textSecondary },
                ]}
            >
                {user.email}
            </ThemedText>
            {user.bio && (
                <ThemedText
                    style={[
                        profileStyles.userBio,
                        { color: currentColors.text },
                    ]}
                >
                    {user.bio}
                </ThemedText>
            )}
        </View>
    );
}
