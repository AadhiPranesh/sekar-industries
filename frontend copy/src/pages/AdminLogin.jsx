import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAdminAuth } from '../auth/AdminAuthContext';

const AdminLogin = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAdminAuth();

	const [formData, setFormData] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const redirectTo = location.state?.from || '/admin';

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name] || errors.form) {
			setErrors((prev) => ({ ...prev, [name]: '', form: '' }));
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
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const success = await login(formData.email, formData.password);
			if (!success) {
				setErrors({ form: 'Invalid credentials. Please try again.' });
				return;
			}
			navigate(redirectTo, { replace: true });
		} catch (error) {
			console.error('Admin login error:', error);
			setErrors({ form: 'Network error. Please try again.' });
		} finally {
			setIsLoading(false);
		}
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
									<h1>Admin Console Login</h1>
									<p>Authenticate to continue to dashboard controls</p>
								</div>

								{location.state?.error && (
									<div className="error-message-banner">{location.state.error}</div>
								)}

								{errors.form && (
									<div className="error-message-banner">{errors.form}</div>
								)}

								<form className="auth-form" onSubmit={handleSubmit}>
									<div className="form-group">
										<label htmlFor="email">Admin Email</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className={errors.email ? 'error' : ''}
											placeholder="admin@company.com"
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
											placeholder="Enter secure password"
											autoComplete="current-password"
										/>
										{errors.password && <span className="error-message">{errors.password}</span>}
									</div>

									<button type="submit" className="btn-primary btn-block" disabled={isLoading}>
										{isLoading ? 'Signing in...' : 'Access Admin Panel'}
									</button>
								</form>

								<div className="auth-footer">
									<p>
										Back to customer login?{' '}
										<Link to="/login" className="text-link">User Sign In</Link>
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

export default AdminLogin;
