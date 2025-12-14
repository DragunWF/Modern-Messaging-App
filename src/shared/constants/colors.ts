/**
 * Modern Messaging App Color Palette
 * * Design Philosophy: "Fresh & Connected"
 * - Primary Green: Represents growth, safety, and active communication.
 * - Light Mode: Clean, spacious, and airy (like the reference image).
 * - Dark Mode: Deep forest tones to reduce eye strain while maintaining brand identity.
 */

// 🎨 1. THE RAW PALETTE (Primitives)
const palette = {
  // Fresh Green (Derived from the "FreshFood" reference)
  green50: "#E8F5E9", // Very light tint for backgrounds
  green100: "#C8E6C9", // User bubbles (light mode)
  green300: "#81C784", // Accents
  green500: "#22C55E", // MAIN BRAND COLOR (Vibrant Leaf Green)
  green600: "#16A34A", // Pressed states
  green800: "#14532D", // Deep green for dark mode elements
  green900: "#052e16", // Almost black green

  // Neutrals (Grays)
  white: "#FFFFFF",
  gray50: "#F9FAFB", // Off-white background
  gray100: "#F3F4F6", // Input fields (light)
  gray200: "#E5E7EB", // Dividers
  gray300: "#D1D5DB", // Disabled text
  gray500: "#6B7280", // Secondary text
  gray700: "#374151", // Primary text (soft black)
  gray800: "#1F2937", // Card background (dark)
  gray900: "#111827", // Main background (dark)
  black: "#000000",

  // Semantic Alerts
  red500: "#EF4444", // Error
  amber500: "#F59E0B", // Warning
  blue500: "#3B82F6", // Info / Links
};

// ☀️ 2. LIGHT THEME (The "Fresh" Look)
export const lightTheme = {
  // Backgrounds
  background: palette.white, // Main app background
  backgroundCard: palette.white, // Cards/Modals
  backgroundInput: palette.gray100, // Search bars, text inputs
  backgroundChatBubble: palette.gray100, // Incoming messages (Them)

  // Brand / Interactive
  primary: palette.green500, // Main buttons, active tabs, Outgoing messages (Me)
  primarySoft: palette.green50, // Active states background
  primaryPressed: palette.green600, // Button press state

  // Text
  textPrimary: palette.gray900, // Headings, main content
  textSecondary: palette.gray500, // Timestamps, subheaders
  textInverse: palette.white, // Text inside Green buttons/bubbles
  textPlaceholder: palette.gray300, // Input placeholders

  // Borders & Dividers
  border: palette.gray200,

  // Messaging Specific
  onlineStatus: palette.green500,
  offlineStatus: palette.gray300,

  // Utility
  error: palette.red500,
  success: palette.green500,
  warning: palette.amber500,

  // Status Bar Style (for Expo)
  statusBar: "dark" as const,
};

// 🌙 3. DARK THEME (The "Forest" Look)
export const darkTheme = {
  // Backgrounds
  background: palette.gray900, // Deep dark gray/black
  backgroundCard: palette.gray800, // Slightly lighter for elevation
  backgroundInput: palette.gray800, // Search bars, text inputs
  backgroundChatBubble: palette.gray700, // Incoming messages (Them)

  // Brand / Interactive
  primary: palette.green500, // Keep brand color vibrant (or use green600 for less glare)
  primarySoft: palette.green900, // Very subtle green tint for active lists
  primaryPressed: palette.green300, // Lighter green for feedback in dark mode

  // Text
  textPrimary: palette.white, // Main content
  textSecondary: palette.gray300, // Timestamps
  textInverse: palette.white, // Text inside Green buttons
  textPlaceholder: palette.gray500,

  // Borders & Dividers
  border: palette.gray700, // Darker dividers

  // Messaging Specific
  onlineStatus: palette.green500,
  offlineStatus: palette.gray500,

  // Utility
  error: palette.red500,
  success: palette.green300, // Brighter green for success in dark mode
  warning: palette.amber500,

  // Status Bar Style (for Expo)
  statusBar: "light" as const,
};

// TypeScript type inference for easy usage in components
export type ThemeColors = typeof lightTheme;
