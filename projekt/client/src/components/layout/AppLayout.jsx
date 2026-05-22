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
            to="/o-nas"
            className={({ isActive }) =>
              isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
            }
          >
            O nás
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
