const DEFAULT_GLOBE_SIZE = 400;

export function globeGlowShadow(size, glow) {
  const spread = Math.max(8, Math.round(size * 0.18));
  return `0 0 ${spread}px ${glow}`;
}

export function globeInsetShadow(size, highlight, variant = 'default') {
  if (variant === 'compare') {
    const edge = Math.max(4, Math.round(size * 0.1));
    const depth = Math.max(6, Math.round(size * 0.14));
    return [
      `inset 0 0 ${edge}px rgba(0,0,0,0.25)`,
      `inset -${depth}px -${depth}px ${depth * 2}px rgba(0,0,0,0.3)`,
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
    `inset 0 0 ${edge}px rgba(0,0,0,0.8)`,
    `inset -${depth}px -${depth}px ${glow}px rgba(0,0,0,0.9)`,
    `inset ${highlightOffset}px ${highlightOffset}px ${highlightSize}px ${highlight}`,
  ].join(', ');
}
