import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { themes } from './theme';

export function useTheme() {
  const { theme, toggleTheme, mode, toggleMode } = useContext(ThemeContext);
  const colors = themes[theme];
  
  return {
    theme,
    toggleTheme,
    mode,
    toggleMode,
    colors,
  };
}
