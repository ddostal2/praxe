import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Konfigurace pro ESLint (statický analyzátor kódu).
 * ESLint automaticky kontroluje váš kód na přítomnost běžných chyb, překlepů a hlídá dodržování osvědčených postupů.
 */
export default defineConfig([
  // Ignoruje složku 'dist' (kam se generuje hotový build aplikace), protože tam není potřeba kód kontrolovat.
  globalIgnores(['dist']),
  {
    // Konfigurace se vztahuje pouze na TypeScript a TSX (React) soubory
    files: ['**/*.{ts,tsx}'],
    
    // extends načítá doporučená přednastavená pravidla od různých pluginů:
    extends: [
      js.configs.recommended,                // Standardní doporučená pravidla pro JavaScript
      tseslint.configs.recommended,          // Doporučená pravidla pro TypeScript
      reactHooks.configs.flat.recommended,  // Pravidla hlídající správné používání React hooků (např. useEffect)
      reactRefresh.configs.vite,             // Pravidla pro správné fungování rychlého překreslování (Fast Refresh) ve Vite
    ],
    
    languageOptions: {
      // Definuje globální proměnné, které jsou dostupné v prohlížeči (např. window, document, fetch), aby na ně ESLint neukazoval jako na neznámé proměnné.
      globals: globals.browser,
    },
  },
])

