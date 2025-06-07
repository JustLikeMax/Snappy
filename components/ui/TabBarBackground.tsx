import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === 'dark'
    ? 'rgba(21, 23, 24, 0.95)'
    : 'rgba(255, 255, 255, 0.95)';

  const borderColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.08)';

  const shadowColor = colorScheme === 'dark' ? '#000' : '#000';

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
            shadowOpacity: colorScheme === 'dark' ? 0.4 : 0.15,
            shadowRadius: 24,
            elevation: 15,
          }
        ]}
      />
      {/* Additional glow effect for modern look */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: colorScheme === 'dark'
              ? 'rgba(255, 107, 107, 0.05)'
              : 'rgba(233, 30, 99, 0.05)',
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 8,
    height: 72,
    borderRadius: 28,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: 28,
    backdropFilter: 'blur(20px)', // Web only
  },
  glow: {
    position: 'absolute',
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
