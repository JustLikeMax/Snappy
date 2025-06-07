import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/useI18n";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, error, clearError } = useAuth();
    const { t } = useI18n();
    const router = useRouter();
    const validateForm = () => {
        if (!email.trim()) {
            Alert.alert(t("common.error"), t("auth.register.missingEmail"));
            return false;
        }

        if (!email.includes("@") || !email.includes(".")) {
            Alert.alert(t("common.error"), t("auth.register.invalidEmail"));
            return false;
        }

        if (!password.trim()) {
            Alert.alert(t("common.error"), t("auth.register.missingPassword"));
            return false;
        }

        if (password.length < 8) {
            Alert.alert(t("common.error"), t("auth.register.weakPassword"));
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert(t("common.error"), t("auth.register.passwordMismatch"));
            return false;
        }

        if (!firstName.trim()) {
            Alert.alert(t("common.error"), t("auth.register.missingFirstName"));
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        try {
            setIsLoading(true);
            clearError();

            const registerData = {
                email: email.trim().toLowerCase(),
                password,
                first_name: firstName.trim(),
                last_name: lastName.trim() || undefined,
            };

            await register(registerData);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/(tabs)/discover");
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/auth/login");
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>
                            {t("auth.register.title")}
                        </Text>
                    </View>
                    {/* Register Form */}
                    <View style={styles.formContainer}>
                        <View style={styles.form}>
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.row}>
                                <View
                                    style={[
                                        styles.inputContainer,
                                        styles.halfWidth,
                                    ]}
                                >
                                    <Text style={styles.inputLabel}>
                                        {t("auth.register.firstNameLabel")} *
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t(
                                            "auth.register.firstNamePlaceholder"
                                        )}
                                        placeholderTextColor="#94A3B8"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                    />
                                </View>

                                <View
                                    style={[
                                        styles.inputContainer,
                                        styles.halfWidth,
                                    ]}
                                >
                                    <Text style={styles.inputLabel}>
                                        {t("auth.register.lastNameLabel")}
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t(
                                            "auth.register.lastNamePlaceholder"
                                        )}
                                        placeholderTextColor="#94A3B8"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    {t("auth.register.emailLabel")} *
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t(
                                        "auth.register.emailPlaceholder"
                                    )}
                                    placeholderTextColor="#94A3B8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    {t("auth.register.passwordLabel")} *
                                </Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.passwordInput,
                                        ]}
                                        placeholder={t(
                                            "auth.register.passwordPlaceholder"
                                        )}
                                        placeholderTextColor="#94A3B8"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        disabled={isLoading}
                                    >
                                        <IconSymbol
                                            name={
                                                showPassword
                                                    ? "eye"
                                                    : "eye.slash"
                                            }
                                            size={20}
                                            color="#94A3B8"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    {t("auth.register.confirmPasswordLabel")} *
                                </Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.passwordInput,
                                        ]}
                                        placeholder={t(
                                            "auth.register.confirmPasswordPlaceholder"
                                        )}
                                        placeholderTextColor="#94A3B8"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        disabled={isLoading}
                                    >
                                        <IconSymbol
                                            name={
                                                showConfirmPassword
                                                    ? "eye"
                                                    : "eye.slash"
                                            }
                                            size={20}
                                            color="#94A3B8"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.registerButton,
                                    isLoading && styles.registerButtonDisabled,
                                ]}
                                onPress={handleRegister}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.registerButtonText}>
                                    {isLoading
                                        ? "Creating Account..."
                                        : t("auth.register.registerButton")}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.dividerLine} />
                            </View>
                            <Pressable
                                style={styles.loginLink}
                                onPress={navigateToLogin}
                                disabled={isLoading}
                            >
                                <Text style={styles.loginText}>
                                    {t("auth.register.loginLink")}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#F8FAFC",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: "#94A3B8",
        textAlign: "center",
    },
    formContainer: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#475569",
    },
    form: {
        // No additional styling needed
    },
    errorContainer: {
        backgroundColor: "#451A03",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#92400E",
    },
    errorText: {
        color: "#FED7AA",
        textAlign: "center",
        fontSize: 14,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15,
    },
    inputContainer: {
        marginBottom: 16,
    },
    halfWidth: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#E2E8F0",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#0F172A",
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#475569",
    },
    passwordContainer: {
        position: "relative",
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: "absolute",
        right: 16,
        top: 16,
        padding: 4,
    },
    registerButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonDisabled: {
        backgroundColor: "#94A3B8",
        shadowOpacity: 0,
        elevation: 0,
    },
    registerButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#475569",
    },
    dividerText: {
        color: "#94A3B8",
        marginHorizontal: 15,
        fontSize: 14,
    },
    loginLink: {
        alignItems: "center",
        padding: 8,
    },
    loginText: {
        color: "#94A3B8",
        fontSize: 14,
    },
    loginLinkText: {
        color: "#3B82F6",
        fontWeight: "500",
    },
});
