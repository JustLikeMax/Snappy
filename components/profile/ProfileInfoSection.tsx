import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/hooks/useI18n";
import { User } from "@/services/AuthService";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { profileStyles } from "./ProfileStyles";

interface ProfileInfoSectionProps {
    user: User;
    onEditPress: () => void;
}

export function ProfileInfoSection({
    user,
    onEditPress,
}: ProfileInfoSectionProps) {
    const { isDark } = useTheme();
    const { t } = useI18n();
    const currentColors = isDark ? Colors.dark : Colors.light;

    return (
        <View
            style={[
                profileStyles.section,
                {
                    backgroundColor: currentColors.surface,
                    borderColor: currentColors.border,
                    shadowColor: currentColors.shadow,
                },
            ]}
        >
            <View style={profileStyles.sectionHeader}>
                <ThemedText
                    type="defaultSemiBold"
                    style={[
                        profileStyles.sectionTitle,
                        { color: currentColors.text },
                    ]}
                >
                    {t("profile.information")}
                </ThemedText>
                <TouchableOpacity
                    onPress={onEditPress}
                    style={[
                        profileStyles.editButton,
                        {
                            backgroundColor: currentColors.tint,
                            shadowColor: currentColors.tint,
                        },
                    ]}
                >
                    <Text style={profileStyles.editButtonText}>
                        {t("common.edit")}
                    </Text>
                </TouchableOpacity>
            </View>

            {user.age && (
                <View
                    style={[
                        profileStyles.infoRow,
                        { borderBottomColor: currentColors.border },
                    ]}
                >
                    <IconSymbol
                        name="calendar"
                        size={20}
                        color={currentColors.icon}
                    />
                    <ThemedText
                        style={[
                            profileStyles.infoText,
                            { color: currentColors.textSecondary },
                        ]}
                    >
                        {t("profile.yearsOld", { age: user.age })}
                    </ThemedText>
                </View>
            )}

            {user.location && (
                <View
                    style={[
                        profileStyles.infoRow,
                        { borderBottomColor: currentColors.border },
                    ]}
                >
                    <IconSymbol
                        name="location"
                        size={20}
                        color={currentColors.icon}
                    />
                    <ThemedText
                        style={[
                            profileStyles.infoText,
                            { color: currentColors.textSecondary },
                        ]}
                    >
                        {user.location}
                    </ThemedText>
                </View>
            )}

            <View style={[profileStyles.infoRow, profileStyles.infoRowLast]}>
                <IconSymbol
                    name="info.circle"
                    size={20}
                    color={currentColors.icon}
                />
                <ThemedText
                    style={[
                        profileStyles.infoText,
                        { color: currentColors.textSecondary },
                    ]}
                >
                    {t("profile.memberSince", {
                        date: new Date(user.created_at).toLocaleDateString(),
                    })}
                </ThemedText>
            </View>
        </View>
    );
}
