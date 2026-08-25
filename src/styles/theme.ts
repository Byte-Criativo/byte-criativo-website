const theme = {
  color: {
    bg: "#FAFAF7",
    surface: "#FFFFFF",
    surface2: "#F1F1EC",
    ink: "#121216",
    muted: "#55555E",
    border: "#E4E4DE",
    accent: "#F65606",
    accentStrong: "#C24405",
    accentSoft: "rgba(246, 86, 6, 0.10)",
    success: "#1E8F5A",
    destructive: "#C43B3B",
    dark: {
      bg: "#121216",
      surface: "#1C1C21",
      text: "#FAFAF7",
      muted: "#A8A8B3",
      border: "#2A2A31",
    },
  },

  glass: {
    bg: "rgba(255, 255, 255, 0.55)",
    border: "rgba(255, 255, 255, 0.65)",
    highlight: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    blur: "16px",
    shadow: "0 18px 44px rgba(18, 18, 22, 0.08)",
    fallbackBg: "rgba(255, 255, 255, 0.95)",
    darkBg: "rgba(28, 28, 33, 0.55)",
    darkBorder: "rgba(255, 255, 255, 0.12)",
    darkFallbackBg: "rgba(28, 28, 33, 0.95)",
  },

  font: {
    display: "var(--font-display), sans-serif",
    body: "var(--font-body), sans-serif",
    mono: "var(--font-mono), monospace",
  },

  text: {
    display: "clamp(2.5rem, 5vw + 1rem, 4.25rem)",
    h1: "clamp(2.25rem, 4vw + 0.75rem, 3.5rem)",
    h2: "clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)",
    h3: "1.375rem",
    bodyLg: "1.125rem",
    body: "1rem",
    small: "0.875rem",
    caption: "0.75rem",
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  space: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    x2: "3rem",
    x3: "4rem",
    x4: "6rem",
    x5: "8rem",
  },

  radius: {
    sm: "8px",
    md: "14px",
    lg: "22px",
    pill: "999px",
  },

  shadow: {
    soft: "0 1px 2px rgba(18, 18, 22, 0.06)",
    lift: "0 12px 32px -12px rgba(18, 18, 22, 0.16)",
  },

  motion: {
    fast: "120ms",
    base: "200ms",
    slow: "320ms",
    ease: "cubic-bezier(0.32, 0.72, 0, 1)",
  },

  bp: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
}

export default theme
