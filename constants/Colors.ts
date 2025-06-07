/**
 * Modern color palette for Snappy dating app with enhanced contrast and accessibility
 */

const tintColorLight = '#E91E63'; // Modern pink
const tintColorDark = '#FF6B6B';  // Coral red

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#9CA3AF',      // Neutral gray
    tabIconSelected: tintColorLight,
    accent: '#F8F9FA',              // Subtle background
    border: 'rgba(0, 0, 0, 0.08)',  // Subtle border
    surface: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F0F0F',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',      // Muted gray
    tabIconSelected: tintColorDark,
    accent: '#1A1A1A',              // Dark surface
    border: 'rgba(255, 255, 255, 0.12)', // Subtle dark border
    surface: '#151718',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};
