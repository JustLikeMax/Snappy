import { ThemedText } from "@/components/ThemedText";
import { LocationAutocompleteInput } from "@/components/ui/LocationAutocompleteInput";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/hooks/useI18n";
import { ProfileFormData } from "@/hooks/useProfileForm";
import React from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { profileStyles } from "./ProfileStyles";

interface EditProfileModalProps {
    visible: boolean;
    formData: ProfileFormData;
    isLoading: boolean;
    onClose: () => void;
    onSave: () => void;
    onUpdateField: (field: keyof ProfileFormData, value: string) => void;
}

export function EditProfileModal({
    visible,
    formData,
    isLoading,
    onClose,
    onSave,
    onUpdateField,
}: EditProfileModalProps) {
    const { isDark } = useTheme();
    const { t } = useI18n();
    const currentColors = isDark ? Colors.dark : Colors.light;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={[
                    profileStyles.modalContainer,
                    { backgroundColor: currentColors.background },
                ]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <SafeAreaView
                    style={[
                        profileStyles.modalContent,
                        { backgroundColor: currentColors.background },
                    ]}
                    edges={["top"]}
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
                        <TouchableOpacity onPress={onClose}>
                            <ThemedText
                                style={[
                                    profileStyles.cancelButton,
                                    { color: currentColors.error },
                                ]}
                            >
                                {t("common.cancel")}
                            </ThemedText>
                        </TouchableOpacity>
                        <ThemedText
                            type="defaultSemiBold"
                            style={[
                                profileStyles.modalTitle,
                                { color: currentColors.text },
                            ]}
                        >
                            {t("profile.editProfile")}
                        </ThemedText>
                        <TouchableOpacity onPress={onSave} disabled={isLoading}>
                            <ThemedText
                                style={[
                                    profileStyles.saveButton,
                                    { color: currentColors.tint },
                                ]}
                            >
                                {isLoading
                                    ? t("common.saving")
                                    : t("common.save")}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={profileStyles.modalBody}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={profileStyles.formGroup}>
                            <ThemedText
                                style={[
                                    profileStyles.formLabel,
                                    { color: currentColors.textLabel },
                                ]}
                            >
                                {t("profile.firstName")}
                            </ThemedText>
                            <TextInput
                                style={[
                                    profileStyles.formInput,
                                    {
                                        backgroundColor: currentColors.surface,
                                        color: currentColors.text,
                                        borderColor: currentColors.border,
                                    },
                                ]}
                                value={formData.first_name}
                                onChangeText={(text) =>
                                    onUpdateField("first_name", text)
                                }
                                placeholder={t("profile.firstNamePlaceholder")}
                                placeholderTextColor={
                                    currentColors.textSecondary
                                }
                            />
                        </View>
                        <View style={profileStyles.formGroup}>
                            <ThemedText
                                style={[
                                    profileStyles.formLabel,
                                    { color: currentColors.textLabel },
                                ]}
                            >
                                {t("profile.lastName")}
                            </ThemedText>
                            <TextInput
                                style={[
                                    profileStyles.formInput,
                                    {
                                        backgroundColor: currentColors.surface,
                                        color: currentColors.text,
                                        borderColor: currentColors.border,
                                    },
                                ]}
                                value={formData.last_name}
                                onChangeText={(text) =>
                                    onUpdateField("last_name", text)
                                }
                                placeholder={t("profile.lastNamePlaceholder")}
                                placeholderTextColor={
                                    currentColors.textSecondary
                                }
                            />
                        </View>
                        <View style={profileStyles.formGroup}>
                            <ThemedText
                                style={[
                                    profileStyles.formLabel,
                                    { color: currentColors.textLabel },
                                ]}
                            >
                                {t("profile.age")}
                            </ThemedText>
                            <TextInput
                                style={[
                                    profileStyles.formInput,
                                    {
                                        backgroundColor: currentColors.surface,
                                        color: currentColors.text,
                                        borderColor: currentColors.border,
                                    },
                                ]}
                                value={formData.age}
                                onChangeText={(text) =>
                                    onUpdateField("age", text)
                                }
                                placeholder={t("profile.agePlaceholder")}
                                placeholderTextColor={
                                    currentColors.textSecondary
                                }
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={profileStyles.formGroup}>
                            <ThemedText
                                style={[
                                    profileStyles.formLabel,
                                    { color: currentColors.textLabel },
                                ]}
                            >
                                {t("profile.bio")}
                            </ThemedText>
                            <TextInput
                                style={[
                                    profileStyles.formInput,
                                    profileStyles.textArea,
                                    {
                                        backgroundColor: currentColors.surface,
                                        color: currentColors.text,
                                        borderColor: currentColors.border,
                                    },
                                ]}
                                value={formData.bio}
                                onChangeText={(text) =>
                                    onUpdateField("bio", text)
                                }
                                placeholder={t("profile.bioPlaceholder")}
                                placeholderTextColor={
                                    currentColors.textSecondary
                                }
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                        <View style={profileStyles.formGroup}>
                            <ThemedText
                                style={[
                                    profileStyles.formLabel,
                                    { color: currentColors.textLabel },
                                ]}
                            >
                                {t("profile.location")}
                            </ThemedText>
                            <LocationAutocompleteInput
                                style={[
                                    profileStyles.formInput,
                                    {
                                        backgroundColor: currentColors.surface,
                                        borderColor: currentColors.border,
                                    },
                                ]}
                                inputStyle={[
                                    {
                                        backgroundColor: currentColors.surface,
                                        color: currentColors.text,
                                        borderColor: currentColors.border,
                                    },
                                ]}
                                value={formData.location}
                                onChangeText={(text) =>
                                    onUpdateField("location", text)
                                }
                                placeholder={t("profile.locationPlaceholder")}
                                placeholderTextColor={
                                    currentColors.textSecondary
                                }
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
