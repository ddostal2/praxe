import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeProvider.jsx';

/**
 * Přístup ke stavu a ovládání motivu (světlý / tmavý režim).
 * Musí být volán uvnitř ThemeProvider.
 * 
 * @returns {{theme: string, toggleTheme: function, isDark: boolean}}
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme musí být použit uvnitř ThemeProvider.');
  }

  return context;
}
