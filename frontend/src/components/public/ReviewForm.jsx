import { useState } from 'react';
import StarRating from '../common/StarRating';
import { buildApiUrl } from '../../api/config';

/**
 * ReviewForm - Submit review with rating, text, and images
 * Second step after bill verification
 */

const ReviewForm = ({ productData, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = uploadedImages.length;

    // Limit to 5 total images
    if (totalImages + files.length > 5) {
      alert(`You can upload a maximum of 5 images total. Currently uploaded: ${totalImages}`);
      return;
    }

    // Convert files to base64
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          preview: event.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
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
      // Get uploaded images (already base64)
      const uploadedImageUrls = uploadedImages.map(img => img.preview);

      const payload = {
        billNumber: productData?.billNumber,
        productId: productData?.productId,
        rating,
        reviewText: reviewText.trim(),
        images: uploadedImageUrls
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
        images: uploadedImageUrls,
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
        
        {/* Image Upload */}
        <div className="form-group">
          <label>Add Photos (Optional)</label>
          <p className="help-text">Upload images of the product from your device or camera (Max 5)</p>
          
          {/* File Upload Section */}
          <label className="add-photo-btn">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={submitting || uploadedImages.length >= 5}
              style={{ display: 'none' }}
              capture="environment"
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Upload Photo from Device or Camera</span>
          </label>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="uploaded-images-preview">
              {uploadedImages.map((img) => (
                <div key={img.id} className="image-preview">
                  <img src={img.preview} alt={img.name} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeUploadedImage(img.id)}
                    disabled={submitting}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Image Count */}
          {uploadedImages.length > 0 && (
            <p className="selected-count">Uploaded: {uploadedImages.length}/5 images</p>
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
