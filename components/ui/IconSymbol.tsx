// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
    SymbolViewProps["name"],
    ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

// Export the type for use in other components
export type IconName = IconSymbolName;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
    "house.fill": "home",
    "paperplane.fill": "send",
    "magnifyingglass.circle.fill": "search",
    "heart.fill": "favorite",
    "message.fill": "chat",
    "person.fill": "person",
    "chevron.left.forwardslash.chevron.right": "code",
    "chevron.right": "chevron-right",
    sparkles: "auto-awesome",
    "flame.fill": "local-fire-department",
    "star.fill": "star",
    "bolt.fill": "flash-on",
    "rectangle.portrait.and.arrow.right": "logout",
    "camera.fill": "camera-alt",
    pencil: "edit",
    person: "account-circle",
    calendar: "event",
    location: "location-on",
    "info.circle": "info",
    eye: "visibility",
    "eye.slash": "visibility-off",
    "hand.wave": "waving-hand",
    rocket: "rocket",
    smartphone: "smartphone",
    "arrow.clockwise": "refresh",
    "checkmark.circle": "check-circle",
    "xmark.circle": "cancel",
    "bag.fill": "shopping-bag",
    gear: "settings",
    globe: "public",
    "sun.max": "wb-sunny",
    moon: "nights-stay",
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}: {
    name: IconName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
    weight?: SymbolWeight;
}) {
    return (
        <MaterialIcons
            color={color}
            size={size}
            name={MAPPING[name]}
            style={style}
        />
    );
}
