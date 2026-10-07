import { useContext } from "react";
import { ThemeContext } from "./themeContext";

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
