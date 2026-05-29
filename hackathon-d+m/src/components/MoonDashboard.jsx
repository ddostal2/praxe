import React from 'react';

export default function MoonDashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
        <h2 className="panel-title" style={{ justifyContent: 'center', color: 'var(--accent-moon)' }}>
          Moon Telemetry Offline
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Our lunar receivers are currently undergoing maintenance. Please explore Earth or Mars in the meantime.
        </p>
      </div>
    </div>
  );
}
