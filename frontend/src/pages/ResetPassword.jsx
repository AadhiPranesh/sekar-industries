/**
 * Reset Password Page
 * Verify OTP and set new password
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [formData, setFormData] = useState({
        email: emailFromState,
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.otp) {
            newErrors.otp = 'OTP is required';
        } else if (!/^\d{6}$/.test(formData.otp)) {
            newErrors.otp = 'OTP must be 6 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setMessage('');

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('http://localhost:5000/api/auth/reset-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         email: formData.email,
            //         otp: formData.otp,
            //         password: formData.password
            //     })
            // });
            // const data = await response.json();

            // Simulate API call
            setTimeout(() => {
                console.log('Reset password attempt:', {
                    email: formData.email,
                    otp: formData.otp
                });
                setIsLoading(false);
                setMessage('Password reset successful! Redirecting to login...');
                
                // Navigate to login after success
                setTimeout(() => {
                    navigate('/login', { 
                        state: { message: 'Password reset successful. Please login with your new password.' }
                    });
                }, 2000);
            }, 1500);

        } catch (err) {
            setIsLoading(false);
            setErrors({ form: 'Failed to reset password. Please try again.' });
        }
    };

    const handleResendOTP = async () => {
        if (!formData.email) {
            setErrors({ email: 'Please enter your email' });
            return;
        }

        try {
            // TODO: Call resend OTP API
            setMessage('New OTP sent to your email');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setErrors({ form: 'Failed to resend OTP' });
        }
    };

    return (
        <div className="page reset-password-page">
            <Header />

            <main>
                <section className="section auth-section">
                    <div className="container">
                        <div className="auth-container">
                            <div className="auth-card">
                                <div className="auth-header">
                                    <div className="auth-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                            <path d="M2 17l10 5 10-5" />
                                            <path d="M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <h1>Reset Password</h1>
                                    <p>Enter OTP and create new password</p>
                                </div>

                                {message && (
                                    <div className="alert alert-success">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{message}</span>
                                    </div>
                                )}

                                {errors.form && (
                                    <div className="alert alert-error">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.form}</span>
                                    </div>
                                )}

                                <form className="auth-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? 'error' : ''}
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                            disabled={isLoading}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="otp">
                                            OTP Code
                                            <button 
                                                type="button" 
                                                className="resend-link" 
                                                onClick={handleResendOTP}
                                                disabled={isLoading}
                                            >
                                                Resend OTP
                                            </button>
                                        </label>
                                        <input
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            className={errors.otp ? 'error' : ''}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength="6"
                                            disabled={isLoading}
                                        />
                                        {errors.otp && <span className="error-message">{errors.otp}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">New Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={errors.password ? 'error' : ''}
                                            placeholder="Create new password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                        />
                                        {errors.password && <span className="error-message">{errors.password}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={errors.confirmPassword ? 'error' : ''}
                                            placeholder="Confirm new password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                        />
                                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn-primary btn-block" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Resetting Password...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </form>

                                <div className="auth-footer">
                                    <p>
                                        Didn't receive OTP?{' '}
                                        <Link to="/forgot-password" className="text-link">Request new OTP</Link>
                                    </p>
                                    <p>
                                        <Link to="/login" className="text-link">Back to Login</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ResetPassword;
