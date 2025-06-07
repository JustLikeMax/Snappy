import { useTheme } from '@/contexts/ThemeContext';

/**
 * Returns the current color scheme based on theme context (web version)
 */
export function useColorScheme() {
  const { isDark } = useTheme();
  return isDark ? 'dark' : 'light';
}
