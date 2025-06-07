import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
    const { isDark } = useTheme();
    const currentColors = isDark ? Colors.dark : Colors.light;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: currentColors.tint,
                tabBarInactiveTintColor: currentColors.tabIconDefault,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "700",
                    marginBottom: 2,
                    letterSpacing: 0.5,
                },
                tabBarItemStyle: {
                    paddingVertical: 6,
                    marginHorizontal: 2,
                    borderRadius: 16,
                },
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                        backgroundColor: "transparent",
                        borderTopWidth: 0,
                        paddingTop: 12,
                        paddingBottom: 32,
                        paddingHorizontal: 16,
                        height: 95,
                        elevation: 0,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0,
                    },
                    default: {
                        position: "absolute",
                        backgroundColor: "transparent",
                        borderTopWidth: 0,
                        paddingTop: 12,
                        paddingBottom: 16,
                        paddingHorizontal: 16,
                        height: 85,
                        elevation: 0,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0,
                    },
                }),
            }}
        >
            <Tabs.Screen
                name="discover"
                options={{
                    title: "Entdecken",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={focused ? 28 : 24}
                            name="house.fill"
                            color={color}
                            style={{
                                transform: [{ scale: focused ? 1.1 : 1 }],
                                opacity: focused ? 1 : 0.7,
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Suchen",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={focused ? 28 : 24}
                            name="magnifyingglass.circle.fill"
                            color={color}
                            style={{
                                transform: [{ scale: focused ? 1.1 : 1 }],
                                opacity: focused ? 1 : 0.7,
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="matches"
                options={{
                    title: "Matches",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={focused ? 28 : 24}
                            name="heart.fill"
                            color={color}
                            style={{
                                transform: [{ scale: focused ? 1.1 : 1 }],
                                opacity: focused ? 1 : 0.7,
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: "Nachrichten",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={focused ? 28 : 24}
                            name="message.fill"
                            color={color}
                            style={{
                                transform: [{ scale: focused ? 1.1 : 1 }],
                                opacity: focused ? 1 : 0.7,
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={focused ? 28 : 24}
                            name="person.fill"
                            color={color}
                            style={{
                                transform: [{ scale: focused ? 1.1 : 1 }],
                                opacity: focused ? 1 : 0.7,
                            }}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
