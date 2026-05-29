import { useMemo } from 'react';
import '../index.css'; // ensure it pulls in global css

const generateStars = (count, className) => {
  return Array.from({ length: count }).map((_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const r = Math.random() * 1.5 + 0.5; // Random radius between 0.5 and 2
    return (
      <circle 
        key={i} 
        cx={`${x}%`} 
        cy={`${y}%`} 
        r={r} 
        fill="#ffffff" 
        className={className} 
      />
    );
  });
};

export default function CosmicBackground({ children }) {
  // useMemo ensures that the random star positions don't jump around on every re-render
  const starsFast = useMemo(() => generateStars(40, 'star-twinkle-fast'), []);
  const starsMedium = useMemo(() => generateStars(70, 'star-twinkle-medium'), []);
  const starsSlow = useMemo(() => generateStars(100, 'star-twinkle-slow'), []);
  const starsStatic = useMemo(() => generateStars(150, 'star-static'), []);

  return (
    <>
      <div className="cosmic-bg-container">
        {/* Dynamic Colored Nebulas */}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <div className="nebula nebula-4" />
        
        {/* Twinkling Starfield */}
        <svg className="starfield-svg">
           {starsStatic}
           {starsSlow}
           {starsMedium}
           {starsFast}
        </svg>
      </div>
      
      {/* Rest of the App Content */}
      {children}
    </>
  );
}
