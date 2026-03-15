import StarRating from '../common/StarRating';

/**
 * ReviewSummary - Amazon/Meesho style rating overview
 * Shows average rating and distribution bars
 */
const ReviewSummary = ({ reviews = [], fallbackRating = 0, fallbackReviewCount = 0 }) => {
  const normalizedFallbackRating = Number(fallbackRating) > 0 ? Number(fallbackRating) : 0;
  const normalizedFallbackCount = Number(fallbackReviewCount) > 0 ? Math.round(Number(fallbackReviewCount)) : 0;

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const hasLiveReviews = reviews.length > 0;
  const displayCount = hasLiveReviews ? reviews.length : normalizedFallbackCount;
  const averageRating = hasLiveReviews
    ? (totalRating / reviews.length).toFixed(1)
    : normalizedFallbackRating.toFixed(1);
  
  // Calculate distribution (count of each star rating)
  const roundedFallbackStar = Math.min(5, Math.max(1, Math.round(normalizedFallbackRating || 0)));
  const distribution = [5, 4, 3, 2, 1].map(star => {
    if (hasLiveReviews) {
      const count = reviews.filter(r => r.rating === star).length;
      return {
        star,
        count,
        percentage: ((count / reviews.length) * 100).toFixed(0)
      };
    }

    if (displayCount > 0 && star === roundedFallbackStar) {
      return { star, count: displayCount, percentage: '100' };
    }

    return { star, count: 0, percentage: '0' };
  });
  
  return (
    <div className="review-summary">
      <div className="review-summary-header">
        <h2>Customer Reviews</h2>
      </div>
      
      <div className="review-summary-content">
        {/* Left: Average Rating */}
        <div className="average-rating">
          <div className="average-score">{averageRating}</div>
          <StarRating rating={parseFloat(averageRating)} size="lg" />
          <div className="total-reviews">{displayCount} reviews</div>
        </div>
        
        {/* Right: Distribution Bars */}
        <div className="rating-distribution">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="distribution-row">
              <span className="star-label">{star} star</span>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="distribution-percent">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
