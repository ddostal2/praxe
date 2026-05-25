import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";

/** Placeholder počtu položek v košíku — nahradit stavem z CartContext. */
const CART_BADGE_PLACEHOLDER = 0;

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
          <NavLink to="/" end className="app-nav__logo" aria-label="Domů">
            <img src="/logo.png" alt="" className="app-nav__logo-img" />
          </NavLink>

          <div className="app-nav__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "app-nav__link app-nav__link--active"
                  : "app-nav__link"
              }
            >
              Domů
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "app-nav__link app-nav__link--active"
                  : "app-nav__link"
              }
            >
              Produkty
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "app-nav__link app-nav__link--active"
                  : "app-nav__link"
              }
            >
              Kontakt
            </NavLink>
          </div>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "app-nav__cart app-nav__cart--active"
                : "app-nav__cart"
            }
          >
            <span className="app-nav__cart-label">Košík</span>
            <span
              className="app-nav__badge"
              aria-label={`Počet položek v košíku: ${CART_BADGE_PLACEHOLDER}`}
            >
              {CART_BADGE_PLACEHOLDER}
            </span>
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
