import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import {
  lightColors,
  darkColors,
} from '../theme/colors';


const ThemeContext =
  createContext();


export function ThemeProvider({
  children,
}) {

  const [
    isDark,
    setIsDark,
  ] = useState(false);


  const colors =
    isDark
      ? darkColors
      : lightColors;


  function toggleTheme() {

    setIsDark(
      previous =>
        !previous
    );

  }


  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {

  return useContext(
    ThemeContext
  );

}