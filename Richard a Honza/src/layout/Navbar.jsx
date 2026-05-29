import { PLANETS } from '../planets/index.js';
import './Navbar.css';

export default function Navbar({ activePlanet, onPlanetChange }) {
  return (
    <nav className="navbar" aria-label="Planet navigation">
      <span className="navbar__brand">Planetary Explorer</span>
      <ul className="navbar__list">
        {PLANETS.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              className={`navbar__link ${activePlanet === id ? 'navbar__link--active' : ''}`}
              onClick={() => onPlanetChange(id)}
              aria-current={activePlanet === id ? 'page' : undefined}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
