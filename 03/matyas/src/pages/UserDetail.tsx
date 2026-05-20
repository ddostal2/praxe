import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export function UserDetail() {
  // Získáme téma pro správný styling
  const { theme } = useTheme();

  /**
   * useParams je hook z react-router-dom, který vrací objekt obsahující všechny
   * dynamické parametry z aktuální URL adresy.
   * V naší definici routy v App.tsx máme napsáno path="/user/:id".
   * Klíč v objektu useParams se tedy bude jmenovat přesně 'id'.
   */
  const { id } = useParams<{ id: string }>();

  const isDark = theme === 'dark';

  const styles = {
    container: {
      padding: '2rem',
      textAlign: 'center' as const,
      color: isDark ? '#f8fafc' : '#0f172a',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '2rem auto',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    },
    highlight: {
      color: '#3b82f6',
      fontSize: '2rem',
      fontWeight: 800,
      display: 'block',
      margin: '1rem 0',
      background: 'linear-gradient(to right, #3b82f6, #10b981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    backLink: {
      display: 'inline-block',
      marginTop: '1.5rem',
      color: isDark ? '#38bdf8' : '#2563eb',
      textDecoration: 'none',
      fontWeight: 600,
    }
  };

  return (
    <div style={styles.container}>
      <h1>Detail uživatele</h1>
      <p>Byla načtena dynamická routa s parametrem:</p>
      
      {/* Zobrazujeme dynamický parametr id získaný z URL */}
      <span style={styles.highlight}>{id}</span>

      {/* Link slouží pro navigaci zpět na hlavní stránku bez znovunačtení prohlížeče */}
      <Link to="/" style={styles.backLink}>
        ← Zpět na hlavní stránku
      </Link>
    </div>
  );
}
