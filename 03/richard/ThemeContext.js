import React, { createContext, useState } from 'react';

// 1. Inicializace samotného contextu
export const ThemeContext = createContext();

// 2. Vytvoření Provider komponenty, která bude obalovat naši aplikaci
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Výchozí motiv je light

    // Funkce pro přepínání stavu
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        // Přes vlastnost 'value' posíláme dál aktuální stav i funkci
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};