/**
 * Login Page
 * User authentication page
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // TODO: Replace with actual API call
        setTimeout(() => {
            console.log('Login attempt:', formData);
            setIsLoading(false);
            // Navigate to home after successful login
            navigate('/');
        }, 1500);
    };

    return (
        <div className="page login-page">
            <Header />

            <main>
                <section className="section auth-section">
                    <div className="container">
                        <div className="auth-container">
                            <div className="auth-card">
                                <div className="auth-header">
                                    <h1>Welcome Back</h1>
                                    <p>Sign in to your account</p>
                                </div>

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
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={errors.password ? 'error' : ''}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                        />
                                        {errors.password && <span className="error-message">{errors.password}</span>}
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>Remember me</span>
                                        </label>
                                        <Link to="/forgot-password" className="text-link">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button type="submit" className="btn-primary btn-block" disabled={isLoading}>
                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                    </button>
                                </form>

                                <div className="auth-footer">
                                    <p>
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="text-link">Sign up</Link>
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

export default Login;
