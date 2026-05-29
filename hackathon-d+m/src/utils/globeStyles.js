/**
 * Default size of the globe used to scale responsive styling.
 * @type {number}
 */
const DEFAULT_GLOBE_SIZE = 400;

/**
 * Calculates a responsive outer glow shadow style for the planet globes.
 * 
 * @param {number} size - The current size of the globe in pixels.
 * @param {string} glow - The color value/CSS variable for the planet's glow (e.g. 'var(--glow-earth)').
 * @returns {string} The CSS box-shadow value for the outer glow.
 * 
 * @example
 * const glowStyle = getGlobeGlowShadow(400, 'rgba(0, 100, 255, 0.4)');
 */
export function getGlobeGlowShadow(size, glow) {
  const spread = Math.max(8, Math.round(size * 0.18));
  return `0 0 ${spread}px ${glow}`;
}

/**
 * Calculates a complex 3D-like inset atmospheric shadow style for the planet globes.
 * Supports different visual variants (standard vs compare mode).
 * 
 * @param {number} size - The current size of the globe in pixels.
 * @param {string} highlight - The highlight color value for the light-facing side.
 * @param {'default'|'compare'} [variant='default'] - The layout variant of the globe.
 * @returns {string} The CSS box-shadow value for the inner/inset shadows.
 * 
 * @example
 * const insetStyle = getGlobeInsetShadow(400, 'rgba(255, 255, 255, 0.4)', 'default');
 */
export function getGlobeInsetShadow(size, highlight, variant = 'default') {
  if (variant === 'compare') {
    const edge = Math.max(4, Math.round(size * 0.1));
    const depth = Math.max(6, Math.round(size * 0.14));
    return [
      `inset 0 0 ${edge}px rgba(0, 0, 0, 0.25)`,
      `inset -${depth}px -${depth}px ${depth * 2}px rgba(0, 0, 0, 0.3)`,
      `inset ${Math.round(depth * 0.35)}px ${Math.round(depth * 0.35)}px ${depth}px ${highlight}`,
    ].join(', ');
  }

  const scale = size / DEFAULT_GLOBE_SIZE;
  const edge = Math.round(60 * scale);
  const depth = Math.round(40 * scale);
  const glow = Math.round(80 * scale);
  const highlightSize = Math.round(40 * scale);
  const highlightOffset = Math.round(15 * scale);

  return [
    `inset 0 0 ${edge}px rgba(0, 0, 0, 0.8)`,
    `inset -${depth}px -${depth}px ${glow}px rgba(0, 0, 0, 0.9)`,
    `inset ${highlightOffset}px ${highlightOffset}px ${highlightSize}px ${highlight}`,
  ].join(', ');
}
