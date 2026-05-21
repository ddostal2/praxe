import React, { useState, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import './StarRating.css';

/**
 * Premium StarRating Component
 * Supports fractional values, hover states, keyboard navigation, customizable styles, and localization.
 */
const StarRating = ({
  value = 0,
  maxStars = 5,
  precision = 1, // 0.5 or 1 for interactive mode; readonly mode supports any float (e.g. 4.2)
  readonly = false,
  size = '32px',
  colorActive = '#ffb300',
  colorInactive = '#e0e0e0',
  colorGlow = 'rgba(255, 179, 0, 0.4)',
  showTooltip = true,
  tooltips = {
    0.5: 'Katastrofální',
    1.0: 'Hrozné',
    1.5: 'Špatné',
    2.0: 'Slabé',
    2.5: 'Průměrné',
    3.0: 'Dobré',
    3.5: 'Velmi dobré',
    4.0: 'Skvělé',
    4.5: 'Výjimečné',
    5.0: 'Dokonalé'
  },
  onChange,
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const uniqueId = useId().replace(/:/g, ''); // Generate a safe ID for SVG clipPaths

  const displayValue = hoverValue !== null ? hoverValue : value;

  // Handle mouse movement to detect precision-based rating values
  const handleMouseMove = (event, index) => {
    if (readonly) return;

    const starElement = event.currentTarget;
    const rect = starElement.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the star element
    const width = rect.width;

    let computedValue = index + 1;

    if (precision === 0.5) {
      if (x < width / 2) {
        computedValue = index + 0.5;
      }
    }

    setHoverValue(computedValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  const handleClick = (computedValue) => {
    if (readonly || !onChange) return;
    onChange(computedValue);
  };

  // Keyboard navigation support
  const handleKeyDown = (event) => {
    if (readonly || !onChange) return;

    let newValue = value;

    switch (event.key) {
      case 'ArrowRight':
        newValue = Math.min(maxStars, value + precision);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        newValue = Math.max(precision, value - precision);
        event.preventDefault();
        break;
      case 'Home':
        newValue = precision;
        event.preventDefault();
        break;
      case 'End':
        newValue = maxStars;
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        if (hoverValue !== null) {
          newValue = hoverValue;
        }
        event.preventDefault();
        break;
      default:
        return;
    }

    onChange(newValue);
  };

  // Helper to determine the fill percentage of each star
  const getStarFillPercentage = (starIndex) => {
    const diff = displayValue - starIndex;
    if (diff >= 1) return 100;
    if (diff <= 0) return 0;
    return Math.round(diff * 100);
  };

  // Helper to get text representation of the current rating value
  const getTooltipText = () => {
    // If precision is 0.5, we round to nearest 0.5 to find tooltip
    const roundedValue = Math.round(displayValue * 2) / 2;
    return tooltips[roundedValue] || `${displayValue} / ${maxStars}`;
  };

  return (
    <div
      ref={containerRef}
      className={`star-rating-container ${readonly ? 'readonly' : 'interactive'} ${isFocused ? 'focused' : ''} ${className}`}
      onMouseLeave={handleMouseLeave}
      onFocus={() => !readonly && setIsFocused(true)}
      onBlur={() => !readonly && setIsFocused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={readonly ? -1 : 0}
      role={readonly ? 'img' : 'slider'}
      aria-label={`Hodnocení hvězdičkami. Aktuálně vybráno ${value} z ${maxStars} hvězd.`}
      aria-valuemin={0}
      aria-valuemax={maxStars}
      aria-valuenow={value}
      aria-readonly={readonly}
      style={{
        '--star-size': size,
        '--color-active': colorActive,
        '--color-inactive': colorInactive,
        '--color-glow': colorGlow
      }}
    >
      <div className="star-rating-stars-wrapper">
        {[...Array(maxStars)].map((_, index) => {
          const fillPercent = getStarFillPercentage(index);
          const clipPathId = `star-clip-${uniqueId}-${index}`;

          return (
            <div
              key={index}
              className={`star-wrapper ${fillPercent > 0 ? 'active' : ''} ${fillPercent === 100 ? 'full' : ''} ${fillPercent > 0 && fillPercent < 100 ? 'partial' : ''}`}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onClick={() => handleClick(displayValue)}
              style={{ cursor: readonly ? 'default' : 'pointer' }}
            >
              <svg
                viewBox="0 0 24 24"
                className="star-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Clip path representing the filled portion of the star */}
                  <clipPath id={clipPathId}>
                    <rect x="0" y="0" width={`${fillPercent}%`} height="100%" />
                  </clipPath>
                </defs>

                {/* Background Star (Empty) */}
                <path
                  className="star-bg"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="var(--color-inactive)"
                />

                {/* Foreground Star (Filled) - Clipped to the calculated percentage */}
                <path
                  className="star-fg"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="var(--color-active)"
                  clipPath={`url(#${clipPathId})`}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {showTooltip && displayValue > 0 && (
        <span className="star-rating-tooltip" aria-hidden="true">
          {getTooltipText()}
        </span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  /** Current active value of the rating (can be float, e.g. 4.2) */
  value: PropTypes.number,
  /** Total number of stars to display */
  maxStars: PropTypes.number,
  /** Interactive step size (1 or 0.5) */
  precision: PropTypes.oneOf([0.5, 1]),
  /** If true, user interaction is disabled */
  readonly: PropTypes.bool,
  /** CSS size for stars, e.g., '24px', '2rem' */
  size: PropTypes.string,
  /** Color of active stars */
  colorActive: PropTypes.string,
  /** Color of inactive stars */
  colorInactive: PropTypes.string,
  /** Glow color applied on hover/focus */
  colorGlow: PropTypes.string,
  /** Set to false to hide the rating text label */
  showTooltip: PropTypes.bool,
  /** Map of rating values to localized text representation */
  tooltips: PropTypes.objectOf(PropTypes.string),
  /** Callback fired when rating is clicked */
  onChange: PropTypes.func,
  /** Additional CSS class for the container */
  className: PropTypes.string
};

export default StarRating;
