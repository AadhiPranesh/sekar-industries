import { useState } from 'react';

/**
 * StarRating Component - Amazon/Meesho style
 * Supports both interactive (for selection) and display (read-only) modes
 */
const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  size = 'md', 
  interactive = false,
  showLabel = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  };
  
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  
  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };
  
  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  const displayRating = hoverRating || rating;
  
  return (
    <div className="star-rating-container">
      <div 
        className={`star-rating ${interactive ? 'interactive' : ''}`}
        style={{ fontSize: sizes[size] }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= displayRating ? 'filled' : 'empty'}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            role={interactive ? 'button' : 'presentation'}
            tabIndex={interactive ? 0 : -1}
            onKeyDown={(e) => {
              if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                handleClick(star);
              }
            }}
          >
            ★
          </span>
        ))}
      </div>
      {showLabel && interactive && (
        <span className="rating-label">{labels[Math.floor(displayRating)]}</span>
      )}
    </div>
  );
};

export default StarRating;
