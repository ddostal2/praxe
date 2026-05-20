import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

import './App.css';

import ProductList from './components/ProductList';
import About from './components/About';

const UserDetail = () => {
  const { id } = useParams();
  return <div className="content-area"><h2>Profil uživatele {id}</h2></div>;
};

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
      <BrowserRouter>
        {/* Třída se dynamicky mění na 'app-container light' nebo 'app-container dark' */}
        <div className={`app-container ${theme}`}>

          {/* Navigační lišta */}
          <nav className={`navbar ${theme}`}>
            <Link to="/" className="nav-link">Domů</Link>
            <Link to="/about" className="nav-link">O nás</Link>
            <Link to="/user/5" className="nav-link">Uživatel 5</Link>

            {/* Tlačítko přepínače */}
            <button
                onClick={toggleTheme}
                className={`theme-toggle-btn ${theme}`}
            >
              {theme === 'light' ? '🌙 Tmavý režim' : '☀️ Světlý režim'}
            </button>
          </nav>

          {/* Hlavní obsah webu */}
          <div className="content-area">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/about" element={<About />} />
              <Route path="/user/:id" element={<UserDetail />} />
            </Routes>
          </div>

        </div>
      </BrowserRouter>
  );
}

export default App;