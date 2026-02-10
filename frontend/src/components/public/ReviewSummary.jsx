import StarRating from '../common/StarRating';

/**
 * ReviewSummary - Amazon/Meesho style rating overview
 * Shows average rating and distribution bars
 */
const ReviewSummary = ({ reviews = [] }) => {
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
  
  // Calculate distribution (count of each star rating)
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 
      ? ((reviews.filter(r => r.rating === star).length / reviews.length) * 100).toFixed(0)
      : 0
  }));
  
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
          <div className="total-reviews">{reviews.length} reviews</div>
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
