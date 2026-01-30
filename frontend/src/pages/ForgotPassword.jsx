/**
 * Forgot Password Page
 * Request password reset OTP via email
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate email
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });
            // const data = await response.json();

            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
                setMessage('OTP has been sent to your email. Please check your inbox.');
                
                // Navigate to reset password page after 2 seconds
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 2000);
            }, 1500);

        } catch (err) {
            setIsLoading(false);
            setError('Failed to send reset email. Please try again.');
        }
    };

    return (
        <div className="page forgot-password-page">
            <Header />

            <main>
                <section className="section auth-section">
                    <div className="container">
                        <div className="auth-container">
                            <div className="auth-card">
                                <div className="auth-header">
                                    <div className="auth-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <h1>Forgot Password?</h1>
                                    <p>Enter your email to receive a reset OTP</p>
                                </div>

                                {message && (
                                    <div className="alert alert-success">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{message}</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-error">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form className="auth-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Enter your registered email"
                                            autoComplete="email"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn-primary btn-block" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Sending OTP...
                                            </>
                                        ) : (
                                            'Send Reset OTP'
                                        )}
                                    </button>
                                </form>

                                <div className="auth-footer">
                                    <p>
                                        Remember your password?{' '}
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

export default ForgotPassword;
