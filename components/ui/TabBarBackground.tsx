import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, View } from "react-native";

export default function TabBarBackground() {
    const { isDark } = useTheme();
    const currentColors = isDark ? Colors.dark : Colors.light;

    const backgroundColor = isDark
        ? "rgba(15, 23, 42, 0.95)" // dark mode - slate-900 with opacity
        : "rgba(248, 250, 252, 0.95)"; // light mode - slate-50 with opacity
    const borderColor = currentColors.border;
    const shadowColor = isDark ? "#000" : "rgba(0, 0, 0, 0.1)";

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.background,
                    {
                        backgroundColor,
                        borderColor,
                        shadowColor,
                        shadowOffset: { width: 0, height: -8 },
                        shadowOpacity: isDark ? 0.4 : 0.2,
                        shadowRadius: 24,
                        elevation: 15,
                    },
                ]}
            />
            {/* Additional glow effect for modern look */}
            <View
                style={[
                    styles.glow,
                    {
                        backgroundColor: isDark
                            ? "rgba(59, 130, 246, 0.05)"
                            : "rgba(59, 130, 246, 0.02)",
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 8,
        height: 72,
        borderRadius: 28,
        overflow: "hidden",
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderRadius: 28,
        backdropFilter: "blur(20px)", // Web only
    },
    glow: {
        position: "absolute",
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 30,
        zIndex: -1,
    },
});

export function useBottomTabOverflow() {
    return 24; // Account for the floating design
}
