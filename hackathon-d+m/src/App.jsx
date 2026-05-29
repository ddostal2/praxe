import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import MoonDashboard from './components/MoonDashboard';
import CompareDashboard from './components/CompareDashboard';
import CosmicBackground from './components/CosmicBackground';
import './App.css';
import MarsDashboard from "./components/MarsDashboard.jsx";
import EarthDashboard from "./components/EarthDashboard.jsx"; // Optional, but keeping for standard Vite

export default function App() {
  const [activeTab, setActiveTab] = useState('earth');

  return (
    <CosmicBackground>
      <div className="app-container">
        <nav className="navbar">
          <div className="brand">
            <Rocket size={24} color="#8b8bb0" />
            Cosmic Explorer
          </div>
          <div className="nav-links">
            <button
              className={`nav-btn ${activeTab === 'earth' ? 'active-earth' : ''}`}
              onClick={() => setActiveTab('earth')}
            >
              Země
            </button>
            <button
              className={`nav-btn ${activeTab === 'mars' ? 'active-mars' : ''}`}
              onClick={() => setActiveTab('mars')}
            >
              Mars
            </button>
            <button
              className={`nav-btn ${activeTab === 'moon' ? 'active-moon' : ''}`}
              onClick={() => setActiveTab('moon')}
            >
              Měsíc
            </button>
            <button
                className={`nav-btn ${activeTab === 'compare' ? 'active-compare' : ''}`}
                onClick={() => setActiveTab('compare')}
            >
              Porovnání
            </button>
          </div>
        </nav>

        <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {activeTab === 'earth' && <EarthDashboard />}
          {activeTab === 'mars' && <MarsDashboard />}
          {activeTab === 'moon' && <MoonDashboard />}
          {activeTab === 'compare' && <CompareDashboard />}
        </main>
      </div>
    </CosmicBackground>
  );
}
