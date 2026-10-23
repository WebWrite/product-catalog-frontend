import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../../app/theme/useTheme";

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      className="theme-toggle"
    >
      {isDarkMode ? <MdLightMode size={19} /> : <MdDarkMode size={19} />}
    </button>
  );
}

export default ThemeToggle;
