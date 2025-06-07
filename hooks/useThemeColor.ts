/**
 * Returns colors from the appropriate theme palette (light or dark)
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string; color?: string },
  colorName: keyof typeof Colors.light
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme] || props.color;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
