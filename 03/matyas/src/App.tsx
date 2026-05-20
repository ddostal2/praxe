import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { UserDetail } from './pages/UserDetail';
import { ProductList } from './ProductList';

/**
 * Pomocná vnitřní komponenta, která nám pomůže stylovat celé tělo aplikace.
 * Nemůžeme použít hook useTheme přímo v komponentě App, protože App samotná
 * teprve definuje <ThemeProvider>. Hook useTheme se smí použít pouze v komponentách,
 * které jsou potomky (uvnitř) <ThemeProvider>.
 */
function AppContent() {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  return (
    <div style={{ 
      backgroundColor: isDark ? '#0f172a' : '#f9fafb', 
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Vykreslíme navigaci, která je společná pro všechny podstránky */}
      <Navbar />

      {/* Hlavní obsah podstránek */}
      <main style={{ padding: '2rem 1rem' }}>
        {/**
         * Routes funguje jako přepínač (switch). Prochází všechny definované Route
         * a vykreslí první z nich, jejíž cesta 'path' odpovídá aktuální URL adrese v prohlížeči.
         */
        }
        <Routes>
          {/**
           * Route mapuje konkrétní cestu (URL) na React komponentu (element).
           * 
           * path="/" - Hlavní stránka (Home)
           * path="/about" - O nás (About)
           * path="/products" - Seznam produktů z prvního úkolu (useEffect)
           * path="/user/:id" - Dynamická stránka. Dvojtečka před 'id' značí, že se jedná o proměnný
           *                    (dynamický) parametr. Může to být cokoliv (např. /user/123, /user/pepa)
           *                    a tato hodnota bude dostupná přes useParams() v komponentě UserDetail.
           */
          }
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    /**
     * 1. ThemeProvider obalí celou aplikaci, aby měly všechny podstránky
     *    přístup k aktuálnímu tématu (light/dark) a funkci pro jeho přepínání.
     * 
     * 2. BrowserRouter je základní komponenta z react-router-dom.
     *    Umožňuje nám používat směrování (routing) v prohlížeči. Využívá HTML5 History API
     *    k tomu, aby synchronizovala URL v adresním řádku s vykresleným obsahem.
     */
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
