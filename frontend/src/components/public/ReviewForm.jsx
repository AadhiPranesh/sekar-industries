import { useState } from 'react';
import StarRating from '../common/StarRating';

/**
 * ReviewForm - Submit review with rating, text, and images
 * Second step after bill verification
 */
const ReviewForm = ({ productData, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    
    // Create preview URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages([...images, ...newImages]);
  };
  
  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview); // Clean up
    newImages.splice(index, 1);
    setImages(newImages);
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reviewData = {
      rating,
      reviewText: reviewText.trim(),
      images: images.map(img => img.preview), // In production, upload to server first
      productData,
      date: new Date().toISOString()
    };
    
    setSubmitting(false);
    
    if (onSubmit) {
      onSubmit(reviewData);
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
        
        {/* Image Upload */}
        <div className="form-group">
          <label>Add Photos (Optional)</label>
          <p className="help-text">Upload images of the product at your site/workshop (Max 5)</p>
          
          <div className="image-upload-container">
            {/* Upload Button */}
            {images.length < 5 && (
              <label className="add-photo-btn">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={submitting}
                  style={{ display: 'none' }}
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Add Photo</span>
              </label>
            )}
            
            {/* Image Previews */}
            {images.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img.preview} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                  disabled={submitting}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
      </form>
    </div>
  );
};

export default ReviewForm;
