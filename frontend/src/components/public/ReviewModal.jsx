import { useState, useEffect } from 'react';
import BillVerification from './BillVerification';
import ReviewForm from './ReviewForm';

/**
 * ReviewModal - Orchestrates the review submission flow
 * Step 1: Verify bill number
 * Step 2: Write review
 * Step 3: Success confirmation
 */
const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmitted }) => {
  const [step, setStep] = useState(1); // 1: Verify, 2: Review Form, 3: Success
  const [verifiedProduct, setVerifiedProduct] = useState(null);
  const [submittedReview, setSubmittedReview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, [isOpen]);
  
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setVerifiedProduct(null);
        setSubmittedReview(null);
      }, 300);
    }
  }, [isOpen]);
  
  const handleVerified = (productData) => {
    setVerifiedProduct(productData);
    setTimeout(() => setStep(2), 800); // Small delay for better UX
  };
  
  const handleReviewSubmit = (reviewData) => {
    setSubmittedReview(reviewData);
    setStep(3);
    
    // Notify parent component
    if (onReviewSubmitted) {
      onReviewSubmitted({
        ...reviewData,
        productId,
        billNumber: verifiedProduct.billNumber
      });
    }
  };
  
  const handleClose = () => {
    if (step === 2) {
      // Confirm before closing if user is writing review
      const confirm = window.confirm('Are you sure you want to cancel? Your review will be lost.');
      if (!confirm) return;
    }
    onClose();
  };
  
  const handleFinalClose = () => {
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="review-modal-overlay" onClick={handleClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>
        
        {/* Progress Indicator */}
        <div className="modal-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">1</div>
            <span>Verify</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-circle">2</div>
            <span>Review</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Done</span>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="modal-content">
          {!isLoggedIn ? (
            <div className="login-required" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div className="login-icon" style={{ margin: '0 auto 24px', color: '#2D473E' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 auto', display: 'block' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '24px' }}>Login Required</h3>
              <p style={{ color: '#666', marginBottom: '32px' }}>Please login to your account to write a review</p>
              <div className="login-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a href="/login" className="btn-primary" style={{ padding: '12px 32px', borderRadius: '8px', textDecoration: 'none' }}>Login</a>
                <a href="/signup" className="btn-secondary" style={{ padding: '12px 32px', borderRadius: '8px', textDecoration: 'none' }}>Sign Up</a>
              </div>
            </div>
          ) : step === 1 ? (
            <BillVerification onVerified={handleVerified} />
          ) : null}
          
          {step === 2 && verifiedProduct && (
            <ReviewForm 
              productData={verifiedProduct}
              onSubmit={handleReviewSubmit}
              onCancel={handleClose}
            />
          )}
          
          {step === 3 && (
            <div className="review-success" style={{ textAlign: 'center' }}>
              <div className="success-animation" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px' }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="38" fill="#22C55E" opacity="0.1"/>
                  <circle cx="40" cy="40" r="30" fill="#22C55E"/>
                  <path d="M26 40L35 49L54 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Thank You!</h2>
              <p>Your review has been submitted successfully</p>
              <div className="success-details">
                <p>Your verified review helps other customers make informed decisions.</p>
              </div>
              <button className="done-btn" onClick={handleFinalClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
