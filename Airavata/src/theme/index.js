export const COLORS = {
  primary: "#2D5F3F",
  primaryLight: "#3A7A52",
  primaryDark: "#1E4029",

  secondary: "#FF6B35",
  secondaryLight: "#FF8A5B",
  secondaryDark: "#E85A2A",

  accent: "#FFD23F",
  accentLight: "#FFE066",
  accentDark: "#E6BD38",

  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  info: "#2196F3",

  background: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceDark: "#1A1A1A",

  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#BDBDBD",
    inverse: "#FFFFFF",
  },

  border: "#E0E0E0",
  divider: "#EEEEEE",

  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.1)",
};

export const GRADIENTS = {
  primary: ["#2D5F3F", "#3A7A52"],
  secondary: ["#FF6B35", "#FF8A5B"],
  accent: ["#FFD23F", "#FFE066"],
  dark: ["#1A1A1A", "#2D2D2D"],
  sunset: ["#FF6B35", "#FFD23F"],
  forest: ["#1E4029", "#2D5F3F", "#3A7A52"],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};
