import { useState } from 'react';
import StarRating from '../common/StarRating';

/**
 * ReviewCard - Individual review display (Amazon/Meesho style)
 * Shows user info, rating, verified badge, review text, and images
 */
const ReviewCard = ({ review }) => {
  const [showFullReview, setShowFullReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const {
    userName,
    userAvatar,
    rating,
    isVerified,
    date,
    reviewText,
    images = [],
    helpfulCount = 0
  } = review;
  
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const truncatedText = reviewText?.length > 200 
    ? reviewText.substring(0, 200) + '...' 
    : reviewText;
  
  return (
    <div className="review-card">
      <div className="review-header">
        {/* User Avatar */}
        <div className="review-user">
          <div className="user-avatar">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <span>{userName?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            {isVerified && (
              <div className="verified-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" fill="#22C55E"/>
                  <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Verified Purchase</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Rating and Date */}
      <div className="review-meta">
        <StarRating rating={rating} size="sm" />
        <span className="review-date">{formattedDate}</span>
      </div>
      
      {/* Review Text */}
      <div className="review-text">
        <p>{showFullReview ? reviewText : truncatedText}</p>
        {reviewText?.length > 200 && (
          <button 
            className="read-more-btn"
            onClick={() => setShowFullReview(!showFullReview)}
          >
            {showFullReview ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {/* Review Images */}
      {images.length > 0 && (
        <div className="review-images">
          {images.map((img, index) => (
            <div 
              key={index} 
              className="review-image-thumbnail"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt={`Review ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
      
      {/* Helpful Button */}
      <div className="review-actions">
        <button className="helpful-btn">
          Helpful ({helpfulCount})
        </button>
      </div>
      
      {/* Image Lightbox */}
      {selectedImage && (
        <div className="image-lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full size" />
          <button className="close-lightbox">×</button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
