import { createContext, useContext, useState, type ReactNode } from 'react';

// Definice typu pro možná témata
type Theme = 'light' | 'dark';

// Typový předpis pro hodnoty, které bude náš kontext sdílet
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * createContext vytvoří samotný "kontejner" (kontext) pro sdílení dat.
 * Jako výchozí hodnotu předáváme undefined, protože skutečné hodnoty dodá až Provider.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider je komponenta, která obalí naši aplikaci (nebo její část).
 * Všechny komponenty uvnitř (children) budou mít přístup k datům v tomto kontextu
 * bez toho, abychom museli data předávat ručně dolů přes props (tzv. prop drilling).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Stav pro uchování aktuálního tématu ('light' nebo 'dark')
  const [theme, setTheme] = useState<Theme>('light');

  // Funkce, která přepne téma na opačné
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    /**
     * ThemeContext.Provider zpřístupňuje hodnotu 'value' (aktuální téma a funkci pro přepnutí)
     * všem podřízeným komponentám (children).
     */
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Vlastní hook useTheme pro snadné použití kontextu v jiných komponentách.
 * Nemusíme pokaždé psát useContext(ThemeContext) a kontrolovat null stav,
 * tento hook to udělá za nás.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  // Pokud se pokusíme použít useTheme v komponentě, která není obalená v <ThemeProvider>, vyhodíme chybu
  if (!context) {
    throw new Error('useTheme musí být použit uvnitř ThemeProvideru!');
  }
  
  return context;
}
