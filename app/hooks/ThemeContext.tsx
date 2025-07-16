import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const context : {
  theme: 'light' | 'dark',
  toggleTheme: () => void,
} = {
  theme: 'dark',
  toggleTheme: () => {},
}

export const ThemeContext = createContext(context);

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  console.log('System color scheme:', systemColorScheme);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
 
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      console.log('Saved theme:', savedTheme);
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

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
