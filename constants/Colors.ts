/**
 * Beautiful gradient-inspired color palette for Snappy dating app
 * Based on the gorgeous gradient colors from auth screens
 */

export const Colors = {
  light: {
    // Primary text colors
    text: '#1E293B',           // slate-800 - primary text
    textSecondary: '#64748B',  // slate-500 - secondary text
    textLabel: '#374151',      // slate-700 - labels
    
    // Background colors
    background: '#FFFFFF',     // white - main background
    surface: '#F8FAFC',        // slate-50 - cards/containers
    accent: '#E2E8F0',         // slate-200 - accents
    
    // Gradient colors
    gradientStart: '#FFFFFF',  // white
    gradientMiddle: '#F8FAFC', // slate-50
    gradientEnd: '#E2E8F0',    // slate-200
    
    // UI element colors
    tint: '#3B82F6',          // blue-500 - primary accent
    icon: '#64748B',          // slate-500 - default icons
    tabIconDefault: '#94A3B8', // slate-400 - inactive tab icons
    tabIconSelected: '#3B82F6', // blue-500 - active tab icons
    
    // Border and shadow colors
    border: '#E2E8F0',         // slate-200 - borders
    borderLight: '#F1F5F9',    // slate-100 - lighter borders
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Status colors
    success: '#10B981',        // emerald-500
    warning: '#F59E0B',        // amber-500
    error: '#EF4444',          // red-500
  },
  dark: {
    // Primary text colors
    text: '#F8FAFC',           // slate-50 - primary text
    textSecondary: '#94A3B8',  // slate-400 - secondary text
    textLabel: '#E2E8F0',      // slate-200 - labels
    
    // Background colors
    background: '#0F172A',     // slate-900 - main background
    surface: '#1E293B',        // slate-800 - cards/containers
    accent: '#334155',         // slate-700 - accents
    
    // Gradient colors
    gradientStart: '#0F172A',  // slate-900 - dark blue
    gradientMiddle: '#1E293B', // slate-800 - medium blue
    gradientEnd: '#334155',    // slate-700 - light blue
    
    // UI element colors
    tint: '#3B82F6',          // blue-500 - primary accent
    icon: '#94A3B8',          // slate-400 - default icons
    tabIconDefault: '#64748B', // slate-500 - inactive tab icons
    tabIconSelected: '#3B82F6', // blue-500 - active tab icons
    
    // Border and shadow colors
    border: '#475569',         // slate-600 - borders
    borderLight: '#334155',    // slate-700 - lighter borders
    shadow: 'rgba(0, 0, 0, 0.4)',
    
    // Status colors
    success: '#10B981',        // emerald-500
    warning: '#F59E0B',        // amber-500
    error: '#EF4444',          // red-500
  }
};
