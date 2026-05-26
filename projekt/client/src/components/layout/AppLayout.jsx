import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";

/**
 * Společný layout s navigací a výstupem pro vnořené routy.
 * @component
 * @returns {JSX.Element}
 */
const AppLayout = () => {
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
            Košík
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
