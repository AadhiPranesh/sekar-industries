import { useState } from 'react';
import StarRating from '../common/StarRating';
import { buildApiUrl } from '../../api/config';

/**
 * ReviewForm - Submit review with rating, text, and images
 * Second step after bill verification
 */

// Static image URLs for review photos
const STATIC_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', label: 'Product in use' },
  { id: 2, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', label: 'Workshop setup' },
  { id: 3, url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400', label: 'Detail shot' },
  { id: 4, url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400', label: 'Factory setting' },
  { id: 5, url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400', label: 'Assembly' },
];

const ReviewForm = ({ productData, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const toggleImage = (imageId) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else if (prev.length < 5) {
        return [...prev, imageId];
      }
      return prev;
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!reviewText.trim()) {
      newErrors.reviewText = 'Please write a review';
    } else if (reviewText.trim().length < 20) {
      newErrors.reviewText = 'Review must be at least 20 characters';
    } else if (reviewText.trim().length > 1000) {
      newErrors.reviewText = 'Review must not exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    try {
      // Get selected image URLs
      const selectedImageUrls = selectedImages
        .map(imageId => STATIC_IMAGES.find(img => img.id === imageId)?.url)
        .filter(Boolean);

      const payload = {
        billNumber: productData?.billNumber,
        productId: productData?.productId,
        rating,
        reviewText: reviewText.trim(),
        images: selectedImageUrls
      };

      const response = await fetch(buildApiUrl('/reviews/submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        setErrors((prev) => ({
          ...prev,
          submit: result?.message || 'Failed to submit review. Please try again.'
        }));
        return;
      }

      const reviewData = {
        rating,
        reviewText: reviewText.trim(),
        images: selectedImageUrls,
        productData,
        date: new Date().toISOString(),
        isVerified: true
      };

      if (onSubmit) {
        onSubmit(reviewData);
      }
    } catch (error) {
      console.error('Review submit error:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to submit review. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };
  
  const charCount = reviewText.length;
  const minChars = 20;
  const maxChars = 1000;
  
  return (
    <div className="review-form">
      <div className="review-form-header">
        <h3>Write Your Review</h3>
        <p>Share your experience with {productData?.productName}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="form-group">
          <label>
            Your Rating <span className="required">*</span>
          </label>
          <StarRating 
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
            size="xl"
            showLabel={true}
          />
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>
        
        {/* Review Text */}
        <div className="form-group">
          <label htmlFor="reviewText">
            Share Your Experience <span className="required">*</span>
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us what you think about this product. How has it performed in your workshop/site?"
            rows="6"
            maxLength={maxChars}
            disabled={submitting}
          />
          <div className="textarea-footer">
            <span className={`char-count ${charCount < minChars ? 'below-min' : ''}`}>
              {charCount}/{maxChars} characters
              {charCount < minChars && ` (minimum ${minChars})`}
            </span>
          </div>
          {errors.reviewText && <span className="error-text">{errors.reviewText}</span>}
        </div>
        
        {/* Image Selection */}
        <div className="form-group">
          <label>Add Photos (Optional)</label>
          <p className="help-text">Select photos of the product at your site/workshop (Max 5)</p>
          
          <div className="image-selection-grid">
            {STATIC_IMAGES.map((img) => (
              <label key={img.id} className="image-option">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(img.id)}
                  onChange={() => toggleImage(img.id)}
                  disabled={submitting || (selectedImages.length >= 5 && !selectedImages.includes(img.id))}
                />
                <div className="image-preview-checkbox">
                  <img src={img.url} alt={img.label} />
                  <div className="image-label">{img.label}</div>
                  {selectedImages.includes(img.id) && (
                    <div className="image-selected">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          
          {selectedImages.length > 0 && (
            <p className="selected-count">Selected: {selectedImages.length}/5 images</p>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-review-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
        {errors.submit && <span className="error-text">{errors.submit}</span>}
      </form>
    </div>
  );
};

export default ReviewForm;
