import { useTheme } from '../ThemeContext';

export function About() {
  // Získáme aktuální téma z kontextu (funkci toggleTheme zde nepotřebujeme, tak ji neimportujeme)
  const { theme } = useTheme();

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
    }
  };

  return (
    <div style={styles.container}>
      <h1>O nás (About)</h1>
      <p style={{ lineHeight: '1.6' }}>
        Tato stránka představuje statickou routu <code>/about</code> v naší aplikaci.
      </p>
    </div>
  );
}
