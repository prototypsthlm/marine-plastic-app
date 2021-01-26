import { color } from "./color";
import { fontSize } from "./fontSize";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  color,
  fontSize,
  spacing,
  typography,
};

export type Theme = typeof theme;
