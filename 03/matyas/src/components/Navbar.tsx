import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2563eb' }}>
        React cvičení
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Domů</Link>
        <Link to="/about" className="nav-link">O nás</Link>
        <Link to="/user/matyas" className="nav-link">Profil</Link>
        <Link to="/products" className="nav-link">Produkty</Link>
      </div>

      <button 
        className="theme-btn"
        onClick={toggleTheme} 
        title="Přepnout režim"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
