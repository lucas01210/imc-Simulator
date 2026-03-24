export const IMC_THEME = {
  bg: "#070a0f",
  panel: "#06080d",
  mint: "#00ffaa",
  text: "#e8eef6",
  muted: "#a8b3c7",
  subtle: "#7f8aa3",
  warn: "#ffd166",
  danger: "#ff4d6d",
} as const;

export const IMC_TYPO = {
  fontFamilyMono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  // 在像素风教育模拟器里，保持较紧的行高让信息更“可读且干净”
  lineHeightTight: "1.2",
} as const;

// Recommended spacing tokens (use Tailwind equivalents in className)
export const IMC_SPACING = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem",
} as const;

export const IMC_RADIUS = {
  pixel: 0,
} as const;


