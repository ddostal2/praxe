export const globeGlowShadow = (size, color) => {
  if (size && size < 200) {
    return `0 0 20px ${color}`;
  }
  return `0 0 60px ${color}`;
};

export const globeInsetShadow = (size, highlightColor, mode = 'normal') => {
  if (mode === 'compare' || (size && size < 200)) {
    return `inset 0 0 20px rgba(0,0,0,0.8), inset -10px -10px 20px rgba(0,0,0,0.9), inset 5px 5px 15px ${highlightColor}`;
  }
  return `inset 0 0 60px rgba(0,0,0,0.8), inset -40px -40px 80px rgba(0,0,0,0.9), inset 15px 15px 40px ${highlightColor}`;
};
