import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export function Home() {
  // Získáme aktuální téma a funkci pro jeho změnu z našeho kontextu
  const { theme, toggleTheme } = useTheme();

  // Stav pro uchování ID uživatele, které uživatel napíše do políčka
  const [userIdInput, setUserIdInput] = useState('');

  /**
   * useNavigate je hook z react-router-dom, který nám vrací funkci 'navigate'.
   * Tuto funkci můžeme zavolat k programovému přesměrování uživatele na jinou routu (URL),
   * např. po kliknutí na tlačítko nebo odeslání formuláře.
   */
  const navigate = useNavigate();

  // Funkce zpracovávající odeslání formuláře pro vyhledání uživatele
  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Zabrání výchozímu chování prohlížeče (znovunačtení stránky)
    if (userIdInput.trim()) {
      // Přesměrujeme uživatele na dynamickou adresu /user/:id (např. /user/42)
      navigate(`/user/${userIdInput.trim()}`);
    }
  };

  // Vzhled stránky se přizpůsobí aktuálnímu tématu
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
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: isDark ? '#38bdf8' : '#2563eb',
      color: isDark ? '#0f172a' : '#ffffff',
      transition: 'opacity 0.2s',
    },
    input: {
      padding: '0.75rem',
      fontSize: '1rem',
      borderRadius: '8px',
      border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      marginRight: '0.5rem',
      width: '180px',
    },
    form: {
      marginTop: '2rem',
      paddingTop: '2rem',
      borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    }
  };

  return (
    <div style={styles.container}>
      <h1>Vítejte na hlavní stránce!</h1>

      {/* Tlačítko pro přepnutí tématu */}
      <button 
        style={styles.button} 
        onClick={toggleTheme}
      >
        Přepnout na {isDark ? 'Světlý režim' : 'Tmavý režim'}
      </button>

      {/* Formulář pro test dynamického routování */}
      <form onSubmit={handleUserSearch} style={styles.form}>
        <h3>Vyzkoušejte dynamické routování</h3>
        <p style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '1rem' }}>
          Zadejte libovolné ID uživatele a klikněte na tlačítko Zobrazit.
        </p>
        <input
          type="text"
          placeholder="Např. 42, honza, atd."
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)} // Ukládáme psaný text do stavu
          style={styles.input}
        />
        <button type="submit" style={{ ...styles.button, backgroundColor: '#10b981', color: '#fff' }}>
          Zobrazit uživatele
        </button>
      </form>
    </div>
  );
}
