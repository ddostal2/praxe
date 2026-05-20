import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export function Navbar() {
  // Získáme globální téma a funkci pro jeho přepnutí z kontextu
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === 'dark';

  const styles = {
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      /* Převod rgba(0, 0, 0, 0.05) na hexadecimální #0000000d */
      boxShadow: '0 1px 3px 0 #0000000d',
      fontFamily: 'Inter, sans-serif',
    },
    linksContainer: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
    },
    /**
     * Styly pro navigační odkazy.
     * Upozornění: Link se v prohlížeči vyrenderuje jako klasický tag <a>,
     * proto můžeme stylovat a nastavovat vlastnosti jako na běžném odkazu.
     */
    link: {
      textDecoration: 'none',
      color: isDark ? '#cbd5e1' : '#4b5563',
      fontWeight: 500,
      fontSize: '0.95rem',
      transition: 'color 0.2s',
    },
    themeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.25rem',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: isDark ? '#38bdf8' : '#2563eb' }}>
        React cvičení
      </div>

      <div style={styles.linksContainer}>
        {/**
         * DŮLEŽITÉ: Používáme komponentu Link z react-router-dom namísto tagu <a>.
         * 
         * Klasický tag <a href="..."> způsobí při kliknutí znovunačtení celé stránky v prohlížeči.
         * Tím by se ztratil veškerý aktuální React stav (state).
         * 
         * Link interně odchytí kliknutí, zabrání načtení stránky a pouze aktualizuje adresní řádek.
         * React Router následně na pozadí vymění zobrazenou komponentu. Aplikace se chová plynuleji.
         */
        }
        <Link to="/" style={styles.link}>Domů</Link>
        <Link to="/about" style={styles.link}>O nás</Link>
        {/* Příklad přímého prolinku na dynamickou routu s ID 'matyas' */}
        <Link to="/user/matyas" style={styles.link}>Profil</Link>
        {/* Ponecháváme přístup k našemu prvnímu úkolu - seznamu produktů */}
        <Link to="/products" style={styles.link}>Produkty</Link>
      </div>

      {/* Rychlý přepínač témat v navigaci */}
      <button 
        onClick={toggleTheme} 
        style={styles.themeBtn} 
        title={isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
