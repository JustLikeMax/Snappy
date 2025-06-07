import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(props.accessibilityState?.selected ? 1 : 0.7);

  useEffect(() => {
    if (props.accessibilityState?.selected) {
      scale.value = withSpring(1.05, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(0.7, { damping: 15, stiffness: 200 });
    }
  }, [props.accessibilityState?.selected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <PlatformPressable
        {...props}
        style={[
          props.style,
          {
            borderRadius: 16,
            marginHorizontal: 4,
            paddingVertical: 8,
          }
        ]}
        android_ripple={null}
        pressColor="transparent"
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            // Add a more subtle haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          // Scale down animation on press
          scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });

          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          // Scale back up animation on release
          scale.value = withSpring(props.accessibilityState?.selected ? 1.05 : 1, {
            damping: 15,
            stiffness: 200
          });

          props.onPressOut?.(ev);
        }}
      />
    </Animated.View>
  );
}
