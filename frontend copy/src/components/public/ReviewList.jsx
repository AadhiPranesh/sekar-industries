import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * ReviewList - Container for all reviews with customer photos gallery
 * Includes empty states and loading states
 */
const ReviewList = ({ reviews = [], loading = false }) => {
  // Extract all images from reviews for gallery
  const allCustomerPhotos = reviews
    .flatMap(review => review.images || [])
    .slice(0, 12); // Show max 12 photos in gallery
  
  if (loading) {
    return (
      <div className="review-list-loading">
        <LoadingSpinner />
        <p>Loading reviews...</p>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="review-list-empty">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#E5E7EB" strokeWidth="2"/>
          <path d="M32 20V34M32 42V42.5" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <h3>No reviews yet</h3>
        <p>Be the first to review this product!</p>
      </div>
    );
  }
  
  return (
    <div className="review-list-container">
      {/* Customer Photos Gallery */}
      {allCustomerPhotos.length > 0 && (
        <div className="customer-photos-section">
          <h3>Customer Photos ({allCustomerPhotos.length})</h3>
          <div className="customer-photos-gallery">
            {allCustomerPhotos.map((photo, index) => (
              <div key={index} className="customer-photo-item">
                <img src={photo} alt={`Customer photo ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* All Reviews */}
      <div className="reviews-section">
        <h3>All Reviews ({reviews.length})</h3>
        <div className="review-list">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id || index} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
