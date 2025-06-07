import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Appearance } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
    isDark: boolean;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

const THEME_STORAGE_KEY = "@snappy_theme_mode";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
    const [systemColorScheme, setSystemColorScheme] = useState(
        Appearance.getColorScheme()
    );

    // Load saved theme preference on mount
    useEffect(() => {
        loadThemePreference();

        // Listen for system color scheme changes
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemColorScheme(colorScheme);
        });

        return () => subscription?.remove();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (
                savedTheme &&
                ["light", "dark", "system"].includes(savedTheme)
            ) {
                setThemeModeState(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error("Error loading theme preference:", error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            setThemeModeState(mode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error("Error saving theme preference:", error);
        }
    };

    // Determine if dark mode should be used
    const isDark =
        themeMode === "dark" ||
        (themeMode === "system" && systemColorScheme === "dark");

    const value: ThemeContextType = {
        isDark,
        themeMode,
        setThemeMode,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
