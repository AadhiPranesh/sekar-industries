import { useState, useEffect } from 'react';

/**
 * QuoteModal - Request quote for specific product with quantity
 * Includes wholesale/retail toggle and priority handling
 */
const QuoteModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '1',
    purchaseType: 'retail',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Pre-fill user data if logged in
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.name) {
        setFormData(prev => ({
          ...prev,
          name: user.name,
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (parseInt(formData.quantity) < 1) newErrors.quantity = 'Quantity must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const priority = parseInt(formData.quantity) >= 10 ? 'HIGH' : 'NORMAL';

    try {
      // Simulate API call
      console.log(`Quote Request [${priority} PRIORITY]:`, {
        product: {
          id: product.id,
          name: product.name,
          price: product.price
        },
        customer: formData,
        isWholesale: formData.purchaseType === 'wholesale',
        priority
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage(
        parseInt(formData.quantity) >= 10
          ? '🎉 Bulk order request received! Our sales team will contact you within 24 hours with special pricing.'
          : '✅ Quote request sent successfully! We\'ll get back to you within 48 hours.'
      );

      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          quantity: '1',
          purchaseType: 'retail',
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Quote submission error:', error);
      setErrors({ form: 'Failed to submit quote. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal quote-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <div className="modal-content" style={{ padding: '32px' }}>
          {successMessage ? (
            <div className="quote-success" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '80px', marginBottom: '20px', lineHeight: 1 }}>
                {parseInt(formData.quantity) >= 10 ? '🎉' : '✅'}
              </div>
              <h2 style={{ fontSize: '28px', marginBottom: '16px', color: '#1a1a1a' }}>Success!</h2>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>{successMessage}</p>
            </div>
          ) : (
            <>
              <div className="quote-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '12px', color: '#1a1a1a', fontWeight: '700' }}>Request a Quote</h2>
                <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
                  Get the best price for <strong style={{ color: '#2D473E' }}>{product?.name}</strong>
                </p>
              </div>

              {errors.form && (
                <div className="error-message-banner" style={{ marginBottom: '24px' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} className="quote-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Personal Information Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '600', color: '#333' }}>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={errors.name ? 'error' : ''}
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', transition: 'all 0.2s' }}
                    />
                    {errors.name && <span className="error-message" style={{ fontSize: '13px', color: '#dc3545', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '600', color: '#333' }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? 'error' : ''}
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', transition: 'all 0.2s' }}
                    />
                    {errors.email && <span className="error-message" style={{ fontSize: '13px', color: '#dc3545', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '600', color: '#333' }}>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className={errors.phone ? 'error' : ''}
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', transition: 'all 0.2s' }}
                    />
                    {errors.phone && <span className="error-message" style={{ fontSize: '13px', color: '#dc3545', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '500', color: '#666' }}>Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company name"
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', transition: 'all 0.2s' }}
                    />
                  </div>
                </div>

                {/* Order Details Section */}
                <div style={{ borderTop: '2px solid #f1f3f5', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>Order Details</h3>
                  
                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '600', color: '#333' }}>Purchase Type *</label>
                    <select
                      name="purchaseType"
                      value={formData.purchaseType}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer' }}
                    >
                      <option value="retail">🛒 Retail (Small Quantity)</option>
                      <option value="wholesale">📦 Wholesale (Bulk Order)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '600', color: '#333' }}>
                      Quantity Needed *
                      {parseInt(formData.quantity) >= 10 && (
                        <span style={{ 
                          color: '#d97706', 
                          fontSize: '13px', 
                          fontWeight: 'bold', 
                          marginLeft: '10px',
                          padding: '4px 10px',
                          background: '#fff3cd',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          🔥 BULK ORDER
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Number of units"
                      className={errors.quantity ? 'error' : ''}
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', transition: 'all 0.2s' }}
                    />
                    {errors.quantity && <span className="error-message" style={{ fontSize: '13px', color: '#dc3545', marginTop: '4px', display: 'block' }}>{errors.quantity}</span>}
                    <small style={{ color: '#666', fontSize: '13px', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
                      💡 Orders of 10+ units get priority response & special pricing
                    </small>
                  </div>

                  <div className="form-group" style={{ width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '500', color: '#666' }}>Additional Requirements (Optional)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any specific requirements or questions..."
                      rows="4"
                      style={{ width: '100%', padding: '14px 16px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '8px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
                    />
                  </div>
                </div>

                {/* Quote Summary */}
                <div className="quote-summary" style={{ 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
                  padding: '24px', 
                  borderRadius: '12px',
                  border: '2px solid #dee2e6'
                }}>
                  <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>📋 Quote Summary</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #ced4da' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Product:</span>
                    <strong style={{ fontSize: '15px', color: '#1a1a1a', textAlign: 'right', maxWidth: '60%' }}>{product?.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #ced4da' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Base Price:</span>
                    <strong style={{ fontSize: '16px', color: '#2D473E' }}>{product?.price}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Quantity:</span>
                    <strong style={{ fontSize: '16px', color: '#2D473E' }}>{formData.quantity} {product?.unit}</strong>
                  </div>
                  {parseInt(formData.quantity) >= 10 && (
                    <div style={{ 
                      marginTop: '16px', 
                      padding: '12px 16px', 
                      background: '#fff3cd', 
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#856404',
                      fontWeight: '500',
                      lineHeight: '1.5',
                      border: '1px solid #ffeaa7'
                    }}>
                      💰 Bulk discount available! Our team will provide special pricing for orders of 10+ units.
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="form-actions" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button 
                    type="button" 
                    onClick={onClose}
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      color: '#666',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{
                      flex: 2,
                      padding: '16px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2D473E 0%, #1e3a2f 100%)',
                      color: '#fff',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isSubmitting ? 0.7 : 1,
                      boxShadow: '0 4px 12px rgba(45, 71, 62, 0.3)'
                    }}
                  >
                    {isSubmitting ? '⏳ Sending...' : '📨 Submit Quote Request'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
