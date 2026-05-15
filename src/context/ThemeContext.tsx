import React, { createContext, useContext, useState } from 'react';

const lightTheme = {
  background: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  subText: '#64748b',
  primary: '#2563eb',
  border: '#cbd5e1',
};

const darkTheme = {
  background: '#0f172a',
  card: '#1e293b',
  text: '#f8fafc',
  subText: '#94a3b8',
  primary: '#3b82f6',
  border: '#334155',
};

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        theme: darkMode ? darkTheme : lightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);