import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/useI18n";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppIndex() {
    const { isAuthenticated, isLoading } = useAuth();
    const { t } = useI18n();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.replace("/(tabs)/discover");
            } else {
                router.replace("/auth");
            }
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={["#0F172A", "#1E293B", "#334155"]}
                style={styles.gradient}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingText}>{t("index.loading")}</Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "white",
        fontSize: 16,
        marginTop: 12,
        textAlign: "center",
    },
});
