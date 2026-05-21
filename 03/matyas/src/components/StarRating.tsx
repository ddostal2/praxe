import React, { useState } from 'react';

interface StarRatingProps {
  maxRating?: number;
  rating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  color?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  maxRating = 5,
  rating = 0,
  onRate,
  readOnly = false,
  size = 24,
  color = '#ffc107',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRate) {
      onRate(index);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {Array.from({ length: maxRating }, (_, i) => {
        const index = i + 1;
        const isFilled = index <= (hoverRating || rating);

        return (
          <svg
            key={index}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={isFilled ? color : 'none'}
            stroke={isFilled ? color : '#ccc'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ 
              cursor: readOnly ? 'default' : 'pointer', 
              transition: 'fill 0.2s, stroke 0.2s' 
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
};
