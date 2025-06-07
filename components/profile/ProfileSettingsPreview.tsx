import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { profileStyles } from "./ProfileStyles";

interface ProfileSettingsPreviewProps {
    themeMode: string;
    onSettingsPress: () => void;
}

export function ProfileSettingsPreview({
    themeMode,
    onSettingsPress,
}: ProfileSettingsPreviewProps) {
    const { isDark } = useTheme();
    const { t, getCurrentLanguage, getSupportedLanguages } = useI18n();
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
                    {t("profile.settings")}
                </ThemedText>
                <TouchableOpacity
                    onPress={onSettingsPress}
                    style={{ marginLeft: 8 }}
                >
                    <IconSymbol
                        name="gear"
                        size={20}
                        color={currentColors.icon}
                    />
                </TouchableOpacity>
            </View>

            <View
                style={[
                    profileStyles.settingRow,
                    { borderBottomColor: currentColors.border },
                ]}
            >
                <View style={profileStyles.settingRowLeft}>
                    <IconSymbol
                        name="sun.max"
                        size={20}
                        color={currentColors.icon}
                    />
                    <ThemedText
                        style={[
                            profileStyles.settingText,
                            { color: currentColors.text },
                        ]}
                    >
                        {t("profile.theme")}
                    </ThemedText>
                </View>
                <View style={profileStyles.settingRowRight}>
                    <ThemedText
                        style={[
                            profileStyles.settingValue,
                            { color: currentColors.textSecondary },
                        ]}
                    >
                        {t(`profile.theme.${themeMode}`)}
                    </ThemedText>
                </View>
            </View>

            <View
                style={[
                    profileStyles.settingRow,
                    { borderBottomColor: currentColors.border },
                ]}
            >
                <View style={profileStyles.settingRowLeft}>
                    <IconSymbol
                        name="globe"
                        size={20}
                        color={currentColors.icon}
                    />
                    <ThemedText
                        style={[
                            profileStyles.settingText,
                            { color: currentColors.text },
                        ]}
                    >
                        {t("profile.language")}
                    </ThemedText>
                </View>
                <View style={profileStyles.settingRowRight}>
                    <ThemedText
                        style={[
                            profileStyles.settingValue,
                            { color: currentColors.textSecondary },
                        ]}
                    >
                        {getSupportedLanguages().find(
                            (lang) => lang.code === getCurrentLanguage()
                        )?.flag || "🇺🇸"}{" "}
                        {getSupportedLanguages().find(
                            (lang) => lang.code === getCurrentLanguage()
                        )?.name || "English"}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}
