import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import StarRating from './components/star-rating-component/StarRating';

import './App.css';

import ProductList from './components/ProductList';
import About from './components/About';

const UserDetail = () => {
  const { id } = useParams();
  return <div className="content-area"><h2>Profil uživatele {id}</h2></div>;
};

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [hodnoceni, setHodnoceni] = useState(4);

  return (
      <BrowserRouter>
        {/* Třída se dynamicky mění na 'app-container light' nebo 'app-container dark' */}
        <div className={`app-container ${theme}`}>

          {/* Navigační lišta */}
          <nav className={`navbar ${theme}`}>
            <Link to="/" className="nav-link">Domů</Link>
            <Link to="/about" className="nav-link">O nás</Link>
            <Link to="/user/43" className="nav-link">Uživatel 43</Link>

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

          <div style={{ padding: '24px' }}>
            <h2>Ohodnoťte naši službu</h2>

            {/* Interaktivní hvězdy s krokem 0.5 */}
            <StarRating
                value={hodnoceni}
                precision={0.5}
                onChange={(noveHodnoceni) => setHodnoceni(noveHodnoceni)}
            />

            <p>Vybrali jste: {hodnoceni} z 5 hvězdiček</p>
          </div>

        </div>
      </BrowserRouter>
  );
}

export default App;