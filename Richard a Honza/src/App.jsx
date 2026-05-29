import React, { useState } from 'react';
import { 
  Rocket, 
  Moon, 
  Cpu, 
  Terminal, 
  Radio, 
  ShieldAlert, 
  Compass
} from 'lucide-react';
import EarthModule from './modules/Earth/EarthModule';
import './App.css';

// --------------------------------------------------------------------------
// TEMPORARY MARS PLACEHOLDER COMPONENT
// --------------------------------------------------------------------------
function MarsPlaceholder() {
  return (
    <div className="placeholder-module">
      <div 
        className="placeholder-card" 
        style={{ 
          '--accent-color': '#ff5722', 
          '--laser-color': '#ff5722',
          '--shadow-color': 'rgba(255, 87, 34, 0.4)',
          '--bg-tag': 'rgba(255, 87, 34, 0.08)'
        }}
      >
        {/* Cybernetic outer diagnostic spinning ring */}
        <div className="cyber-icon-outer">
          <div className="cyber-ring-spin"></div>
          <div className="cyber-icon-inner cyber-icon-pulse">
            <Cpu size={36} />
          </div>
        </div>

        {/* Diagnostic console data */}
        <h2 className="placeholder-title">🔴 MODUL MARS</h2>
        <div className="placeholder-tag">
          <span className="pulse-dot"></span>
          SYSTÉMY SE PŘIPRAVUJÍ...
        </div>

        <p className="placeholder-desc">
          Připravujeme telemetrické rozhraní pro přenos meteorologických dat ze sondy <strong>InSight</strong>. Brzy zprovozníme 2D simulátor povrchových větrů a zobrazení nejnovějších fotografií z roveru <strong>Perseverance</strong>.
        </p>

        {/* Sci-fi Terminal log output */}
        <div className="cyber-terminal">
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text">SYS_INIT: MARS MODULE CORE v0.92 BETA...</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text">NASA INSIGHT API CONNECT: PENDING (SOL 142)</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text anim-blink">CHYBA: ČEKÁNÍ NA SCHVÁLENÍ ORBITÁLNÍ DRÁHY...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// TEMPORARY MOON PLACEHOLDER COMPONENT
// --------------------------------------------------------------------------
function MoonPlaceholder() {
  return (
    <div className="placeholder-module">
      <div 
        className="placeholder-card" 
        style={{ 
          '--accent-color': '#cbd5e1', 
          '--laser-color': '#ffffff',
          '--shadow-color': 'rgba(255, 255, 255, 0.3)',
          '--bg-tag': 'rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Cybernetic outer diagnostic spinning ring */}
        <div className="cyber-icon-outer">
          <div className="cyber-ring-spin"></div>
          <div className="cyber-icon-inner cyber-icon-pulse">
            <Moon size={36} />
          </div>
        </div>

        {/* Diagnostic console data */}
        <h2 className="placeholder-title">🌙 MODUL MĚSÍC</h2>
        <div className="placeholder-tag">
          <span className="pulse-dot"></span>
          KONTROLA OBĚŽNÉ DRÁHY...
        </div>

        <p className="placeholder-desc">
          Inicializujeme analytický modul pro výpočet fází Měsíce pomocí Juliánského kalendáře (JDN). Připravujeme dynamické zobrazení lunární stínové hemisféry a environmentální monitor radiačního rizika.
        </p>

        {/* Sci-fi Terminal log output */}
        <div className="cyber-terminal">
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text">LUNAR_CALC_INIT: ALGORITMUS EPHEMERIS SPECTRUM...</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text">GRAVITATIONAL ACCRETION RESOLVED: 100% OK</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text anim-blink">STATUS: ČEKÁNÍ TRVAJÍCÍ... TELEMETRICKÝ DOCK OFFLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// MAIN APPLICATION DASHBOARD ENTRY
// --------------------------------------------------------------------------
function App() {
  const [activeModule, setActiveModule] = useState('earth');

  return (
    <div className="app-container">
      {/* 
         Enhanced Cosmic Meteor Shower & Starfield Background 
         Moved to root level so it renders statically and smoothly without flickering 
      */}
      <div className="meteor-container">
        {/* Glowing Galactic Starfields */}
        <div className="starfield-layer starfield-small" />
        <div className="starfield-layer starfield-medium twinkling" />
        <div className="starfield-layer starfield-large twinkling-slow" />

        {/* Cyan trails (foreground/mid-ground) */}
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

        {/* White trails (foreground sparks & deep highlights) */}
        <div className="meteor meteor-4 meteor-white" />
        <div className="meteor meteor-7 meteor-white" />
        <div className="meteor meteor-10 meteor-white" />
        <div className="meteor meteor-12 meteor-white" />
        <div className="meteor meteor-13 meteor-white" />
        <div className="meteor meteor-17 meteor-white" />

        {/* Purple/Indigo trails (deep space spectral rays) */}
        <div className="meteor meteor-3 meteor-purple" />
        <div className="meteor meteor-8 meteor-purple" />
        <div className="meteor meteor-16 meteor-purple" />
        <div className="meteor meteor-18 meteor-purple" />
      </div>

      {/* Persistent Global Solaris Navigation Header */}
      <header className="dashboard-header">
        <div className="dashboard-nav-container">
          <div className="dashboard-logo">
            <div className="dashboard-logo-icon"></div>
            <h1 className="dashboard-title">
              SOLARIS OS <span>/ ORBITAL DASHBOARD</span>
            </h1>
          </div>

          <nav className="dashboard-nav-menu">
            <button 
              className={`nav-btn nav-btn-earth ${activeModule === 'earth' ? 'active' : ''}`}
              onClick={() => setActiveModule('earth')}
            >
              <span>🌍</span> ZEMĚ
            </button>
            <button 
              className={`nav-btn nav-btn-mars ${activeModule === 'mars' ? 'active' : ''}`}
              onClick={() => setActiveModule('mars')}
            >
              <span>🔴</span> MARS
            </button>
            <button 
              className={`nav-btn nav-btn-moon ${activeModule === 'moon' ? 'active' : ''}`}
              onClick={() => setActiveModule('moon')}
            >
              <span>🌙</span> MĚSÍC
            </button>
          </nav>
        </div>
      </header>

      {/* Dynamic Main Module Switcher Panel */}
      <div className="app-content-area">
        {activeModule === 'earth' && (
          <div className="module-fade-wrapper" key="earth">
            <EarthModule />
          </div>
        )}
        
        {activeModule === 'mars' && (
          <div className="module-fade-wrapper" key="mars">
            <MarsPlaceholder />
          </div>
        )}
        
        {activeModule === 'moon' && (
          <div className="module-fade-wrapper" key="moon">
            <MoonPlaceholder />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
