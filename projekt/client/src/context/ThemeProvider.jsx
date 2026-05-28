import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext(undefined);

/**
 * Poskytovatel motivu (ThemeProvider).
 * Spravuje stav světlého/tmavého režimu, synchronizuje ho s localStorage
 * a reaguje na změny systémových preferencí.
 * 
 * @component
 * @param {Object} props - Vlastnosti komponenty.
 * @param {React.ReactNode} props.children - Potomci komponenty.
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
    // Inicializace stavu na základě aktuální třídy na <html>,
    // kterou nastavil inline skript v <head> (tím zamezíme nesouladu stavů při načtení).
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark") ? "dark" : "light";
        }
        return "light";
    });

    // Funkce pro přepínání motivu
    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newTheme;
        });
    }, []);

    // Sledování změn systémových preferencí (prefers-color-scheme)
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleChange = (e) => {
            // Reagujeme pouze v případě, že uživatel nemá uloženou volbu v localStorage
            const savedTheme = localStorage.getItem("theme");
            if (!savedTheme) {
                const systemTheme = e.matches ? "dark" : "light";
                setTheme(systemTheme);
                if (systemTheme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }
        };

        // Přidání posluchače
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const value = useMemo(() => ({
        theme,
        toggleTheme,
        isDark: theme === "dark"
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
