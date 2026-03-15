import { useState } from 'react';

/**
 * BillVerification - First step in review flow
 * User must enter valid bill number before writing review
 */
const BillVerification = ({ productId, onVerified }) => {
  const [billNumber, setBillNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);
  const [showContactHelp, setShowContactHelp] = useState(false);
  
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setShowContactHelp(false);
    setVerifying(true);

    try {
      const response = await fetch('http://localhost:5000/api/reviews/verify-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ billNumber, productId })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        setError(data?.message || 'Invalid bill number. Please check and try again.');
        if (response.status === 404) {
          setShowContactHelp(true);
        }
        return;
      }

      setVerifiedData(data.product);
      if (onVerified) {
        onVerified(data.product);
      }
    } catch {
      setError('Unable to verify bill right now. Please try again.');
    } finally {
      setVerifying(false);
    }
  };
  
  return (
    <div className="bill-verification">
      {!verifiedData ? (
        <>
          <div className="verification-header">
            <h3>Verify Your Purchase</h3>
            <p>Enter your bill number to write a verified review</p>
          </div>
          
          <form onSubmit={handleVerify} className="verification-form">
            <div className="form-group">
              <label htmlFor="billNumber">
                Bill Number <span className="required">*</span>
              </label>
              <input
                id="billNumber"
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="e.g., SK-2024-001234"
                required
                disabled={verifying}
                className="bill-input"
              />
              <small>Find this on your purchase invoice</small>
            </div>
            
            {error && (
              <div className="verification-error">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#EF4444" strokeWidth="1.5"/>
                  <path d="M10 6V11M10 14V14.5" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {showContactHelp && (
              <div style={{ marginBottom: '1rem' }}>
                <a
                  href={`https://wa.me/917708644431?text=${encodeURIComponent(`Hi, my bill number ${billNumber.toUpperCase()} is not found. Please check and add it for review.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-block', textDecoration: 'none' }}
                >
                  Contact on WhatsApp
                </a>
              </div>
            )}
            
            <button 
              type="submit" 
              className="verify-btn"
              disabled={verifying || !billNumber}
            >
              {verifying ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify Purchase'
              )}
            </button>
          </form>
          
          <div className="verification-help">
            <p>Tip: Enter bill number exactly as on invoice.</p>
          </div>
        </>
      ) : (
        <div className="verification-success">
          <div className="success-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="#22C55E" opacity="0.1"/>
              <circle cx="24" cy="24" r="18" fill="#22C55E"/>
              <path d="M16 24L21 29L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4>Purchase Verified!</h4>
          <div className="verified-product-info">
            <p><strong>Product:</strong> {verifiedData.productName}</p>
            <p><strong>Bill Number:</strong> {verifiedData.billNumber}</p>
            <p><strong>Purchase Date:</strong> {new Date(verifiedData.purchaseDate).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillVerification;
