import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/hooks/useI18n";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { profileStyles } from "./ProfileStyles";

interface SettingsModalProps {
    visible: boolean;
    themeMode: string;
    onClose: () => void;
    onThemeChange: (theme: string) => void;
    onLanguageChange: (language: string) => void;
}

export function SettingsModal({
    visible,
    themeMode,
    onClose,
    onThemeChange,
    onLanguageChange,
}: SettingsModalProps) {
    const { isDark } = useTheme();
    const { t, getCurrentLanguage, getSupportedLanguages } = useI18n();
    const currentColors = isDark ? Colors.dark : Colors.light;

    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showThemeDropdown, setShowThemeDropdown] = useState(false);

    const handleClose = () => {
        setShowLanguageDropdown(false);
        setShowThemeDropdown(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <SafeAreaView
                style={[
                    profileStyles.modalContainer,
                    { backgroundColor: currentColors.background },
                ]}
            >
                <View
                    style={[
                        profileStyles.modalHeader,
                        {
                            borderBottomColor: currentColors.border,
                            backgroundColor: currentColors.surface,
                        },
                    ]}
                >
                    <TouchableOpacity onPress={handleClose}>
                        <Text
                            style={[
                                profileStyles.cancelButton,
                                { color: currentColors.error },
                            ]}
                        >
                            {t("common.cancel")}
                        </Text>
                    </TouchableOpacity>
                    <ThemedText
                        type="defaultSemiBold"
                        style={[
                            profileStyles.modalTitle,
                            { color: currentColors.text },
                        ]}
                    >
                        {t("profile.settings")}
                    </ThemedText>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView style={profileStyles.modalBody}>
                    {/* Theme Selection Section */}
                    <View style={profileStyles.section}>
                        <ThemedText
                            type="defaultSemiBold"
                            style={profileStyles.sectionTitle}
                        >
                            {t("profile.appearance")}
                        </ThemedText>

                        {/* Theme Dropdown */}
                        <View style={{ marginTop: 16 }}>
                            <TouchableOpacity
                                style={[
                                    profileStyles.formInput,
                                    {
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingVertical: 14,
                                    },
                                ]}
                                onPress={() => {
                                    setShowLanguageDropdown(false);
                                    setShowThemeDropdown((prev) => !prev);
                                }}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <View
                                        style={[
                                            profileStyles.themeIcon,
                                            {
                                                backgroundColor:
                                                    currentColors.tint + "15",
                                            },
                                        ]}
                                    >
                                        <IconSymbol
                                            name={
                                                themeMode === "light"
                                                    ? "sun.max"
                                                    : themeMode === "dark"
                                                    ? "moon"
                                                    : "gear"
                                            }
                                            size={18}
                                            color={currentColors.tint}
                                        />
                                    </View>
                                    <ThemedText
                                        style={profileStyles.themeOptionTitle}
                                    >
                                        {t(`profile.theme.${themeMode}`)}
                                    </ThemedText>
                                </View>
                                <IconSymbol
                                    name="chevron.down"
                                    size={18}
                                    color={currentColors.icon}
                                />
                            </TouchableOpacity>

                            {/* Theme Dropdown List */}
                            {showThemeDropdown && (
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: currentColors.border,
                                        borderRadius: 8,
                                        backgroundColor: currentColors.surface,
                                        marginTop: 4,
                                        overflow: "hidden",
                                    }}
                                >
                                    {(["light", "dark", "system"] as const).map(
                                        (mode) => (
                                            <TouchableOpacity
                                                key={mode}
                                                style={[
                                                    profileStyles.themeOption,
                                                    themeMode === mode &&
                                                        profileStyles.selectedThemeOption,
                                                ]}
                                                onPress={() => {
                                                    onThemeChange(mode);
                                                    setShowThemeDropdown(false);
                                                    Haptics.impactAsync(
                                                        Haptics
                                                            .ImpactFeedbackStyle
                                                            .Light
                                                    );
                                                }}
                                            >
                                                <View
                                                    style={
                                                        profileStyles.themeOptionLeft
                                                    }
                                                >
                                                    <View
                                                        style={[
                                                            profileStyles.themeIcon,
                                                            {
                                                                backgroundColor:
                                                                    currentColors.tint +
                                                                    "15",
                                                            },
                                                        ]}
                                                    >
                                                        <IconSymbol
                                                            name={
                                                                mode === "light"
                                                                    ? "sun.max"
                                                                    : mode ===
                                                                      "dark"
                                                                    ? "moon"
                                                                    : "gear"
                                                            }
                                                            size={18}
                                                            color={
                                                                currentColors.tint
                                                            }
                                                        />
                                                    </View>
                                                    <View>
                                                        <ThemedText
                                                            style={
                                                                profileStyles.themeOptionTitle
                                                            }
                                                        >
                                                            {t(
                                                                `profile.theme.${mode}`
                                                            )}
                                                        </ThemedText>
                                                        <ThemedText
                                                            style={
                                                                profileStyles.themeOptionDescription
                                                            }
                                                        >
                                                            {t(
                                                                `profile.theme.${mode}Description`
                                                            )}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                                {themeMode === mode && (
                                                    <IconSymbol
                                                        name="checkmark"
                                                        size={20}
                                                        color={
                                                            currentColors.tint
                                                        }
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Language Selection Section */}
                    <View style={profileStyles.section}>
                        <ThemedText
                            type="defaultSemiBold"
                            style={profileStyles.sectionTitle}
                        >
                            {t("profile.selectLanguage")}
                        </ThemedText>

                        {/* Language Dropdown */}
                        <View style={{ marginTop: 16 }}>
                            <TouchableOpacity
                                style={[
                                    profileStyles.formInput,
                                    {
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingVertical: 14,
                                    },
                                ]}
                                onPress={() => {
                                    setShowThemeDropdown(false);
                                    setShowLanguageDropdown((prev) => !prev);
                                }}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={profileStyles.languageFlag}>
                                        {getSupportedLanguages().find(
                                            (lang) =>
                                                lang.code ===
                                                getCurrentLanguage()
                                        )?.flag || "🇺🇸"}
                                    </Text>
                                    <ThemedText
                                        style={profileStyles.languageName}
                                    >
                                        {getSupportedLanguages().find(
                                            (lang) =>
                                                lang.code ===
                                                getCurrentLanguage()
                                        )?.name || "English"}
                                    </ThemedText>
                                </View>
                                <IconSymbol
                                    name="chevron.down"
                                    size={18}
                                    color={currentColors.icon}
                                />
                            </TouchableOpacity>

                            {/* Language Dropdown List */}
                            {showLanguageDropdown && (
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: currentColors.border,
                                        borderRadius: 8,
                                        backgroundColor: currentColors.surface,
                                        marginTop: 4,
                                        overflow: "hidden",
                                    }}
                                >
                                    {getSupportedLanguages().map((language) => (
                                        <TouchableOpacity
                                            key={language.code}
                                            style={[
                                                profileStyles.languageOption,
                                                getCurrentLanguage() ===
                                                    language.code &&
                                                    profileStyles.selectedLanguageOption,
                                            ]}
                                            onPress={() => {
                                                onLanguageChange(language.code);
                                                setShowLanguageDropdown(false);
                                                Haptics.impactAsync(
                                                    Haptics.ImpactFeedbackStyle
                                                        .Light
                                                );
                                            }}
                                        >
                                            <View
                                                style={
                                                    profileStyles.languageOptionLeft
                                                }
                                            >
                                                <Text
                                                    style={
                                                        profileStyles.languageFlag
                                                    }
                                                >
                                                    {language.flag}
                                                </Text>
                                                <ThemedText
                                                    style={
                                                        profileStyles.languageName
                                                    }
                                                >
                                                    {language.name}
                                                </ThemedText>
                                            </View>
                                            {getCurrentLanguage() ===
                                                language.code && (
                                                <IconSymbol
                                                    name="checkmark"
                                                    size={20}
                                                    color={currentColors.tint}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}
