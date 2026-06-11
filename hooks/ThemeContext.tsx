import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const context : {
  theme: 'light' | 'dark',
  toggleTheme: () => void,
  mode: 'calendar' | 'garden',
  toggleMode: () => void,
} = {
  theme: 'dark',
  mode: 'calendar',
  toggleTheme: () => {},
  toggleMode: () => {},
}

export const ThemeContext = createContext(context);

const THEME_STORAGE_KEY = '@app_theme';
const MODE_STORAGE_KEY = '@app_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mode, setMode] = useState<'calendar' | 'garden'>('calendar');

  useEffect(() => {
    loadSavedTheme();
    loadSavedMode();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setTheme(savedTheme === 'light' ? 'light' : 'dark'); 
      } else {
        // Use system theme as default if no saved theme
        setTheme(systemColorScheme || 'light');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const loadSavedMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(MODE_STORAGE_KEY);
      if (savedMode) {
        setMode(savedMode === 'calendar' ? 'calendar' : 'garden'); 
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleMode = async () => {
    const newMode = mode === 'calendar' ? 'garden' : 'calendar';
    setMode(newMode);
    try {
      await AsyncStorage.setItem(MODE_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save mode:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
