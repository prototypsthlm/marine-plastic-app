export const palette = {
  // name the colors after the figma design document
  black: "#000000",
  white: "#ffffff",
  cyan: "#03F6FA",
  dark: "#2C3339",
  gray: "#585F65",
};

export const shadow = {
  defaultBoxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  defaultElevation: "8",
};

export const color = {
  /**
   * The palette is available to use, but prefer using the name.
   */
  palette,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The screen background.
   */
  background: palette.white,
  /**
   * The main tinting color.
   */
  primary: palette.black,
  /**
   * The default color of text in many components.
   */
  text: palette.black,
  /**
   * Boxshadow
   */
  shadow,
};
