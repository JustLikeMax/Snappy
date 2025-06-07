import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import {
    LocationSuggestion,
    useLocationAutocomplete,
} from "@/hooks/useLocationAutocomplete";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface LocationAutocompleteInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    style?: any;
    inputStyle?: any;
}

export function LocationAutocompleteInput({
    value,
    onChangeText,
    placeholder,
    placeholderTextColor,
    style,
    inputStyle,
}: LocationAutocompleteInputProps) {
    const { isDark } = useTheme();
    const currentColors = isDark ? Colors.dark : Colors.light;
    const { suggestions, isLoading, searchLocations, clearSuggestions } =
        useLocationAutocomplete();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<TextInput>(null);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const timeout = setTimeout(() => {
            if (value && value.trim().length >= 2) {
                searchLocations(value);
                setShowSuggestions(true);
            } else {
                clearSuggestions();
                setShowSuggestions(false);
            }
        }, 300);

        searchTimeoutRef.current = timeout;

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [value, searchLocations, clearSuggestions]);

    const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
        // Extract a clean location name (city, country)
        const parts = suggestion.display_name.split(",");
        let cleanLocation = "";

        if (parts.length >= 2) {
            // Try to get city and country/state
            const city = parts[0]?.trim();
            const country = parts[parts.length - 1]?.trim();
            cleanLocation = `${city}, ${country}`;
        } else {
            cleanLocation = suggestion.display_name;
        }

        onChangeText(cleanLocation);
        setShowSuggestions(false);
        clearSuggestions();
        inputRef.current?.blur();
    };

    const handleInputFocus = () => {
        if (value && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding suggestions to allow for selection
        setTimeout(() => {
            setShowSuggestions(false);
        }, 150);
    };

    const renderSuggestionItem = ({ item }: { item: LocationSuggestion }) => {
        // Extract meaningful parts of the location
        const parts = item.display_name.split(",");
        const primaryLocation = parts[0]?.trim();
        const secondaryLocation = parts.slice(1, 3).join(",").trim();

        return (
            <TouchableOpacity
                style={[
                    styles.suggestionItem,
                    {
                        backgroundColor: currentColors.surface,
                        borderBottomColor: currentColors.border,
                    },
                ]}
                onPress={() => handleSelectSuggestion(item)}
                activeOpacity={0.7}
            >
                <IconSymbol
                    name="location"
                    size={18}
                    color={currentColors.icon}
                    style={styles.suggestionIcon}
                />
                <View style={styles.suggestionText}>
                    <ThemedText
                        style={[
                            styles.suggestionPrimary,
                            { color: currentColors.text },
                        ]}
                        numberOfLines={1}
                    >
                        {primaryLocation}
                    </ThemedText>
                    {secondaryLocation && (
                        <ThemedText
                            style={[
                                styles.suggestionSecondary,
                                { color: currentColors.textSecondary },
                            ]}
                            numberOfLines={1}
                        >
                            {secondaryLocation}
                        </ThemedText>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={[inputStyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                {isLoading && (
                    <ActivityIndicator
                        size="small"
                        color={currentColors.tint}
                        style={styles.loadingIndicator}
                    />
                )}
                {value.length > 0 && !isLoading && (
                    <TouchableOpacity
                        onPress={() => {
                            onChangeText("");
                            setShowSuggestions(false);
                            clearSuggestions();
                        }}
                        style={styles.clearButton}
                    >
                        <IconSymbol
                            name="xmark.circle"
                            size={18}
                            color={currentColors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {showSuggestions && suggestions.length > 0 && (
                <View
                    style={[
                        styles.suggestionsContainer,
                        {
                            backgroundColor: currentColors.surface,
                            borderColor: currentColors.border,
                            shadowColor: currentColors.shadow,
                        },
                    ]}
                >
                    <ScrollView
                        style={styles.suggestionsList}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {suggestions.map((item) => (
                            <View key={item.place_id}>
                                {renderSuggestionItem({ item })}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        zIndex: 1000,
    },
    inputContainer: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
    },
    loadingIndicator: {
        position: "absolute",
        right: 12,
    },
    clearButton: {
        position: "absolute",
        right: 12,
        padding: 4,
    },
    suggestionsContainer: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        maxHeight: 200,
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1001,
    },
    suggestionsList: {
        maxHeight: 200,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
    },
    suggestionIcon: {
        marginRight: 12,
    },
    suggestionText: {
        flex: 1,
    },
    suggestionPrimary: {
        fontSize: 16,
        fontWeight: "500",
    },
    suggestionSecondary: {
        fontSize: 14,
        marginTop: 2,
    },
});
