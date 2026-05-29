import { useState } from 'react';
import EarthModule from './modules/Earth/EarthModule.jsx';
import MarsModule from './modules/Mars/MarsModule.jsx';
import { MoonModule } from './moon/index.js';
import CompareModule from './modules/Compare/CompareModule.jsx';
import './App.css';

function App() {
  const [activeModule, setActiveModule] = useState('earth');

  return (
    <div className="app">
      <div className="app-container">
        <div className="meteor-container">
          <div className="starfield-layer starfield-small" />
          <div className="starfield-layer starfield-medium twinkling" />
          <div className="starfield-layer starfield-large twinkling-slow" />

          <div className="meteor meteor-1 meteor-cyan" />
          <div className="meteor meteor-2 meteor-cyan" />
          <div className="meteor meteor-5 meteor-cyan" />
          <div className="meteor meteor-6 meteor-cyan" />
          <div className="meteor meteor-9 meteor-cyan" />
          <div className="meteor meteor-11 meteor-cyan" />
          <div className="meteor meteor-14 meteor-cyan" />
          <div className="meteor meteor-15 meteor-cyan" />
          <div className="meteor meteor-19 meteor-cyan" />
          <div className="meteor meteor-20 meteor-cyan" />

          <div className="meteor meteor-4 meteor-white" />
          <div className="meteor meteor-7 meteor-white" />
          <div className="meteor meteor-10 meteor-white" />
          <div className="meteor meteor-12 meteor-white" />
          <div className="meteor meteor-13 meteor-white" />
          <div className="meteor meteor-17 meteor-white" />

          <div className="meteor meteor-3 meteor-purple" />
          <div className="meteor meteor-8 meteor-purple" />
          <div className="meteor meteor-16 meteor-purple" />
          <div className="meteor meteor-18 meteor-purple" />
        </div>

        <header className="dashboard-header">
          <div className="dashboard-nav-container">
            <div className="dashboard-logo">
              <div className="dashboard-logo-icon" />
              <h1 className="dashboard-title">
                SOLARIS OS <span>/ ORBITAL DASHBOARD</span>
              </h1>
            </div>

            <nav className="dashboard-nav-menu">
              <button
                type="button"
                className={`nav-btn nav-btn-earth ${activeModule === 'earth' ? 'active' : ''}`}
                onClick={() => setActiveModule('earth')}
              >
                <span>🌍</span> ZEMĚ
              </button>
              <button
                type="button"
                className={`nav-btn nav-btn-mars ${activeModule === 'mars' ? 'active' : ''}`}
                onClick={() => setActiveModule('mars')}
              >
                <span>🔴</span> MARS
              </button>
              <button
                type="button"
                className={`nav-btn nav-btn-moon ${activeModule === 'moon' ? 'active' : ''}`}
                onClick={() => setActiveModule('moon')}
              >
                <span>🌙</span> MĚSÍC
              </button>
              <button
                type="button"
                className={`nav-btn nav-btn-compare ${activeModule === 'compare' ? 'active' : ''}`}
                onClick={() => setActiveModule('compare')}
              >
                <span>⚖️</span> POROVNÁNÍ
              </button>
            </nav>
          </div>
        </header>

        <div className="app-content-area">
          {activeModule === 'earth' && (
            <div className="module-fade-wrapper" key="earth">
              <EarthModule />
            </div>
          )}

          {activeModule === 'mars' && (
            <div className="module-fade-wrapper" key="mars">
              <MarsModule />
            </div>
          )}

          {activeModule === 'moon' && (
            <div className="module-fade-wrapper" key="moon">
              <MoonModule />
            </div>
          )}

          {activeModule === 'compare' && (
            <div className="module-fade-wrapper" key="compare">
              <CompareModule />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
