import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get saved theme from localStorage
  const getSavedTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Get saved density from localStorage
  const getSavedDensity = () => {
    const saved = localStorage.getItem('density');
    return saved || 'comfortable';
  };

  const [theme, setTheme] = useState(getSavedTheme);
  const [density, setDensity] = useState(getSavedDensity);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      document.documentElement.classList.remove('dark', 'light');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply density
    document.documentElement.classList.remove('compact', 'comfortable', 'spacious');
    document.documentElement.classList.add(density);
    localStorage.setItem('density', density);
  }, [density]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleDensity = (newDensity) => {
    setDensity(newDensity);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, density, toggleDensity }}>
      {children}
    </ThemeContext.Provider>
  );
};