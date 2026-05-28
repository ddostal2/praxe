import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { useTheme } from "../../hooks/useTheme.js";
import "../../styles/AppLayout.css";

/**
 * Společný layout s navigací a výstupem pro vnořené routy.
 * @component
 * @returns {JSX.Element}
 */
const AppLayout = () => {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <header className="app-header">
        <nav className="app-nav" aria-label="Hlavní navigace">
          <NavLink to="/" className="app-nav__logo">
            <img src="/logo.png" alt="Logo" className="app-nav__logo-img" />
          </NavLink>

          <div className="app-nav__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
              }
            >
              Domů
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
              }
            >
              Produkty
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
              }
            >
              Kontakt
            </NavLink>
          </div>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "app-nav__cart app-nav__cart--active" : "app-nav__cart"
            }
          >
            <span className="app-nav__cart-label">Košík</span>
            {totalItems > 0 && (
              <span
                className="app-nav__badge"
                aria-label={`Počet položek v košíku: ${totalItems}`}
              >
                {totalItems}
              </span>
            )}
          </NavLink>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Přepnout na tmavý režim" : "Přepnout na světlý režim"}
            title={theme === "light" ? "Přepnout na tmavý režim" : "Přepnout na světlý režim"}
          >
            {theme === "light" ? (
              // Ikona Měsíce pro přepnutí na tmavý režim
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.5-.1 1 .2 1.2.7.2.5 0 1.1-.4 1.4-2.8 2-3.7 5.7-2.1 8.7 1.6 3 4.9 4.7 8.2 4.1.5-.1 1 .2 1.2.7.2.5 0 1.1-.4 1.4-1.7 1.8-4 2.8-6.3 2.8z"/>
              </svg>
            ) : (
              // Ikona Slunce pro přepnutí na světlý režim
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zM2 13h2c.6 0 1-.4 1-1s-.4-1-1-1H2c-.6 0-1 .4-1 1s.4 1 1 1zm18 0h2c.6 0 1-.4 1-1s-.4-1-1-1h-2c-.6 0-1 .4-1 1s.4 1 1 1zM11 2v2c0 .6.4 1 1 1s1-.4 1-1V2c0-.6-.4-1-1-1s-1 .4-1 1zm0 18v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1s-1 .4-1 1zM5.9 4.5c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L5.9 4.5zm12.2 12.2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-1.4-1.4zM7.3 16.7l-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0zm12.2-12.2c-.4-.4-1-.4-1.4 0l-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.4.4-1 0-1.4z"/>
              </svg>
            )}
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
