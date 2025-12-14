/**
 * CogniTrack Dark Theme Color Palette
 *
 * Psychology-based color selection:
 * - Deep purples/blues: Promote focus, mindfulness, and self-reflection
 * - Teal accents: Represent balance, clarity, and positive change
 * - Warm warnings: Gentle alerts without harsh red (reduces anxiety)
 * - Dark backgrounds: Reduce eye strain and create a calm, introspective environment
 */

export const mainColors = {
  // 🔮 Primary (Deep Purple/Blue) – Mindfulness, focus, and cognitive awareness
  primary100: "#C8C4E6", // Lightest tint - for disabled states or very subtle highlights
  primary300: "#8B82D9", // Soft interactive states, active tabs
  primary500: "#6B5FCC", // Main brand color - primary buttons, active elements
  primary700: "#4A3FA3", // Pressed states, emphasis
  primary900: "#2D2566", // Deepest shade - text on light backgrounds

  // � Accent (Calm Teal) – Balance, clarity, and positive transformation
  accent100: "#B8E6E1", // Lightest tint for highlights
  accent300: "#7DD4CB", // Success states, positive feedback
  accent500: "#4DBDB3", // Main accent - success indicators, progress
  accent700: "#3A9990", // Hover states for accent elements
  accent900: "#2A7069", // Deep accent for contrast

  // 🌑 Backgrounds (Dark, calming base)
  background: "#0F0E17", // Deep navy-black - main app background
  backgroundElevated: "#1A1823", // Slightly elevated surfaces (cards, modals)
  backgroundCard: "#232135", // Card backgrounds with slight purple tint
  backgroundInput: "#2A2838", // Input fields, interactive surfaces

  // 📝 Text (Optimized for dark backgrounds)
  textPrimary: "#FFFFFE", // Primary readable text - high contrast
  textSecondary: "#A7A9BE", // Secondary info, less emphasis
  textMuted: "#6E7191", // Muted text, placeholders, disabled
  textOnPrimary: "#FFFFFF", // Text on colored buttons/surfaces
  textOnAccent: "#0F0E17", // Text on accent colored elements

  // 🧱 Borders & Dividers
  border: "#2E2D3D", // Subtle borders for cards and dividers
  borderActive: "#4A4766", // Active/focused input borders
  borderHighlight: "#6B5FCC", // Highlighted or selected borders

  // 🎯 Overlays & Shadows
  overlay: "rgba(15, 14, 23, 0.8)", // Modal overlays
  shadowLight: "rgba(0, 0, 0, 0.2)", // Subtle shadows
  shadowMedium: "rgba(0, 0, 0, 0.4)", // Card shadows
  shadowStrong: "rgba(0, 0, 0, 0.6)", // Strong elevation shadows
};

export const utilityColors = {
  // ✅ Success (Calm teal - aligned with accent)
  success100: "#B8E6E1",
  success500: "#4DBDB3", // Confirmations, achievements
  success700: "#3A9990",

  // ⚠️ Warning (Warm amber - less aggressive than red)
  warning100: "#FFE4BA",
  warning500: "#FFB84D", // Gentle warnings, caution indicators
  warning700: "#E69A2E",

  // 🚫 Error (Soft coral - serious but not harsh)
  error100: "#FFD4CC",
  error500: "#FF6B6B", // Validation errors, critical alerts
  error700: "#E64E4E",

  // ℹ️ Info (Soft blue - neutral information)
  info100: "#C4D9F2",
  info500: "#5B9FE3", // Informational messages, tips
  info700: "#3D7FC2",
};
