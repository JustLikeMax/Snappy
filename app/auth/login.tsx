import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/useI18n";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login, error, clearError } = useAuth();
    const { t } = useI18n();
    const router = useRouter();
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
                t("auth.login.missingInfo"),
                t("auth.login.missingInfoMessage")
            );
            return;
        }

        try {
            setIsLoading(true);
            clearError();
            await login(email.trim().toLowerCase(), password);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/(tabs)/discover");
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/auth/register");
    };
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

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
                            {t("auth.login.title")}
                        </Text>
                        <Text style={styles.subtitleText}>
                            {t("auth.login.subtitle")}
                        </Text>
                    </View>
                    {/* Login Form */}
                    <View style={styles.formContainer}>
                        <View style={styles.form}>
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    {t("auth.login.emailLabel")}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t(
                                        "auth.login.emailPlaceholder"
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
                                    {t("auth.login.passwordLabel")}
                                </Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.passwordInput,
                                        ]}
                                        placeholder={t(
                                            "auth.login.passwordPlaceholder"
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

                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    isLoading && styles.loginButtonDisabled,
                                ]}
                                onPress={handleLogin}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.loginButtonText}>
                                    {isLoading
                                        ? "Signing In..."
                                        : t("auth.login.loginButton")}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <Pressable
                                style={styles.registerLink}
                                onPress={navigateToRegister}
                                disabled={isLoading}
                            >
                                <Text style={styles.registerText}>
                                    {t("auth.login.registerLink")}
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
        marginBottom: 48,
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
        elevation: 8,
        borderWidth: 1,
        borderColor: "#334155",
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
    inputContainer: {
        marginBottom: 20,
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
    loginButton: {
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
    loginButtonDisabled: {
        backgroundColor: "#475569",
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#475569",
    },
    dividerText: {
        color: "#94A3B8",
        marginHorizontal: 16,
        fontSize: 14,
    },
    registerLink: {
        alignItems: "center",
        padding: 8,
    },
    registerText: {
        color: "#94A3B8",
        fontSize: 14,
    },
    registerLinkText: {
        color: "#3B82F6",
        fontWeight: "500",
    },
});
