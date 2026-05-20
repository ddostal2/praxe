import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * createRoot vyhledá v HTML souboru (index.html) element s id="root"
 * a inicializuje do něj celou React aplikaci.
 * Vykřičník na konci (!) říká TypeScriptu: "Tento element určitě existuje, nemusíš se bát, že bude null."
 */
createRoot(document.getElementById('root')!).render(
  /**
   * StrictMode je speciální pomocná komponenta v Reactu.
   * Ve vývojovém režimu pomáhá odhalit potenciální chyby v aplikaci tím, že úmyslně renderuje
   * komponenty dvakrát (což například pomáhá ověřit, zda máme správně napsané cleanup funkce v useEffectech).
   */
  <StrictMode>
    {/* Vykreslíme naši hlavní komponentu App */}
    <App />
  </StrictMode>,
)
