import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import "@/i18n";

function AppContent() {
    const { isDark } = useTheme();

    const customLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: "#FFFFFF",
            card: "#F8FAFC",
            primary: "#3B82F6",
            border: "#E2E8F0",
            notification: "#3B82F6",
        },
    };

    const customDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: "#0F172A",
            card: "#1E293B",
            primary: "#3B82F6",
            border: "#475569",
            notification: "#3B82F6",
        },
    };

    return (
        <AuthProvider>
            <NavigationThemeProvider
                value={isDark ? customDarkTheme : customLightTheme}
            >
                <Stack
                    screenOptions={{
                        animation: "none",
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="auth/index"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="auth/login"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="auth/register"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style={isDark ? "light" : "dark"} />
            </NavigationThemeProvider>
        </AuthProvider>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
