import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { profileStyles } from "./ProfileStyles";

interface ProfileHeaderProps {
    onSettingsPress: () => void;
    onLogoutPress: () => void;
}

export function ProfileHeader({
    onSettingsPress,
    onLogoutPress,
}: ProfileHeaderProps) {
    const { isDark } = useTheme();
    const { t } = useI18n();
    const currentColors = isDark ? Colors.dark : Colors.light;

    return (
        <View
            style={[
                profileStyles.header,
                {
                    borderBottomColor: currentColors.border,
                    backgroundColor: currentColors.surface,
                },
            ]}
        >
            <ThemedText
                type="title"
                style={[
                    profileStyles.headerTitle,
                    { color: currentColors.text },
                ]}
            >
                {t("profile.title")}
            </ThemedText>
            <View style={profileStyles.headerActions}>
                <TouchableOpacity
                    onPress={onSettingsPress}
                    style={profileStyles.settingsButton}
                >
                    <IconSymbol
                        name="gear"
                        size={20}
                        color={currentColors.tint}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onLogoutPress}
                    style={profileStyles.logoutButton}
                >
                    <IconSymbol
                        name="rectangle.portrait.and.arrow.right"
                        size={20}
                        color={currentColors.tint}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
