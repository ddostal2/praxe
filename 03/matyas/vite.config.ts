import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Konfigurace pro sestavovací nástroj Vite.
 * defineConfig je pomocná funkce, která poskytuje nápovědu typů v editoru (auto-completion).
 * 
 * https://vite.dev/config/
 */
export default defineConfig({
  // plugins definuje seznam rozšiřujících doplňků pro Vite.
  // react() plugin aktivuje podporu pro React JSX/TSX syntaxi, rychlé překreslování (Fast Refresh) a další.
  plugins: [react()],
})

