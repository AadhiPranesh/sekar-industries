import { useState } from 'react';

/**
 * BillVerification - First step in review flow
 * User must enter valid bill number before writing review
 */
const BillVerification = ({ onVerified }) => {
  const [billNumber, setBillNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);
  
  // Simulate backend verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - In production, call actual API
    const validBills = [
      'SK-2024-001234',
      'SK-2024-001235', 
      'SK-2024-001236',
      'SK-2023-005678'
    ];
    
    if (validBills.includes(billNumber.toUpperCase())) {
      // Mock product data from bill
      const mockProduct = {
        billNumber: billNumber.toUpperCase(),
        productName: 'Industrial Steel Office Desk',
        purchaseDate: purchaseDate || '2024-01-15',
        amount: '₹45,000'
      };
      
      setVerifiedData(mockProduct);
      setVerifying(false);
      
      // Notify parent component
      if (onVerified) {
        onVerified(mockProduct);
      }
    } else {
      setError('Invalid bill number. Please check and try again.');
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
            
            <div className="form-group">
              <label htmlFor="purchaseDate">Purchase Date (Optional)</label>
              <input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                disabled={verifying}
                max={new Date().toISOString().split('T')[0]}
              />
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
            <p>💡 Can't find your bill number? Contact our support team</p>
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
