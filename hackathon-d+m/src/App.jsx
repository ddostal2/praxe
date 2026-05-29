import { useState } from 'react';
import { Rocket } from 'lucide-react';
import MoonDashboard from './components/MoonDashboard';
import CosmicBackground from './components/CosmicBackground';
import './App.css'; // Optional, but keeping for standard Vite

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
              Earth
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
              Moon
            </button>
          </div>
        </nav>

<<<<<<< Updated upstream
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {activeTab === 'moon' && <MoonDashboard />}
      </main>
    </div>
=======
        <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {activeTab === 'earth' && <EarthDashboard />}
          {activeTab === 'mars' && <MarsDashboard />}
          {activeTab === 'moon' && <MoonDashboard />}
        </main>
      </div>
    </CosmicBackground>
>>>>>>> Stashed changes
  );
}
