import { useState, useEffect } from 'react';

/**
 * Custom hook that manages a smooth, continuous horizontal rotation offset for a globe.
 * It uses a periodic interval to update the offset.
 *
 * @param {number} speed - The number of pixels to rotate in each interval step. Positive or negative.
 * @param {number} mapWidth - The total width of the wrapped map image in pixels.
 * @param {number} intervalMs - The interval time in milliseconds between updates.
 * @returns {number} The current rotation offset in pixels, always in the range (-mapWidth, 0].
 * 
 * @example
 * const rotationOffset = useGlobeRotation(0.5, 1000, 50);
 */
export function useGlobeRotation(speed = 0.5, mapWidth = 1000, intervalMs = 50) {
  const [rotationOffset, setRotationOffset] = useState(0);

  useEffect(() => {
    const updateRotation = () => {
      setRotationOffset((prev) => {
        const next = prev - speed;
        // Reset when the offset reaches the end of the map width to allow seamless tiling
        if (next <= -mapWidth) {
          return 0;
        }
        return next;
      });
    };

    const interval = setInterval(updateRotation, intervalMs);
    return () => clearInterval(interval);
  }, [speed, mapWidth, intervalMs]);

  return rotationOffset;
}
