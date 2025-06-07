import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthIndexScreen() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/(tabs)/discover");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/auth/login");
    };

    const handleRegister = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/auth/register");
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <StatusBar style="light" />
                <View style={styles.loadingContent}>
                    <Text style={styles.appName}>Snappy</Text>
                    <ActivityIndicator
                        size="large"
                        color="#3B82F6"
                        style={styles.loader}
                    />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                {/* Logo/App Name Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <IconSymbol
                            name="bag.fill"
                            size={40}
                            color="#3B82F6"
                            style={styles.logoIcon}
                        />
                    </View>
                    <Text style={styles.appName}>Snappy</Text>
                    <Text style={styles.tagline}>
                        Your marketplace for everything
                    </Text>
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome to Snappy</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Discover amazing deals and connect with sellers in your
                        area
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleRegister}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>
                            Get Started
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>
                            By continuing, you agree to our Terms of Service and
                            Privacy Policy
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        padding: 24,
        paddingTop: 80,
    },
    loadingContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F172A",
    },
    logoSection: {
        alignItems: "center",
        marginTop: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#334155",
    },
    logoIcon: {
        // Icon styling is handled by the IconSymbol component
    },
    appName: {
        fontSize: 36,
        fontWeight: "700",
        color: "#F8FAFC",
        marginBottom: 8,
        textAlign: "center",
    },
    tagline: {
        fontSize: 16,
        color: "#94A3B8",
        textAlign: "center",
        fontWeight: "400",
    },
    welcomeSection: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#F8FAFC",
        textAlign: "center",
        marginBottom: 16,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: "#94A3B8",
        textAlign: "center",
        lineHeight: 24,
    },
    buttonContainer: {
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#475569",
        marginBottom: 24,
    },
    secondaryButtonText: {
        color: "#E2E8F0",
        fontSize: 16,
        fontWeight: "500",
    },
    termsContainer: {
        alignItems: "center",
    },
    termsText: {
        color: "#64748B",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 18,
    },
    loader: {
        marginVertical: 20,
    },
    loadingText: {
        color: "#94A3B8",
        fontSize: 16,
        marginTop: 10,
    },
});
