import { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/IconSymbol";

export function HelloWave() {
    const rotationAnimation = useSharedValue(0);

    useEffect(() => {
        rotationAnimation.value = withRepeat(
            withSequence(
                withTiming(25, { duration: 150 }),
                withTiming(0, { duration: 150 })
            ),
            4 // Run the animation 4 times
        );
    }, [rotationAnimation]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotationAnimation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <IconSymbol name="hand.wave" size={28} color="currentColor" />
        </Animated.View>
    );
}
