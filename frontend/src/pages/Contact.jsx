/**
 * Contact Page
 * Dedicated contact page with form and business information
 */

import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Breadcrumb from '../components/common/Breadcrumb';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Contact Us' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setSuccessMessage('');

        try {
            // Simulate sending email - in production, replace with actual backend call
            console.log('Contact form submitted:', formData);
            
            setSuccessMessage('Thank you for your message! We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: '📍',
            title: 'Visit Us',
            content: 'Sekar Industries, Erode - 600001, India'
        },
        {
            icon: '📞',
            title: 'Call Us',
            content: '+91 98765 43210 / +91 42 2345 6789'
        },
        {
            icon: '✉️',
            title: 'Email Us',
            content: 'info@sekarindustries.com'
        }
    ];

    const businessHours = [
        { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM' },
        { day: 'Saturday', time: '9:00 AM - 6:00 PM' },
        { day: 'Sunday', time: '10:00 AM - 2:00 PM' }
    ];

    return (
        <div className="page contact-page">
            <Header />

            <main>
                <div className="contact-page-header">
                    <div className="container">
                        <Breadcrumb items={breadcrumbItems} />
                        <div className="page-title-section">
                            <h1>Contact Us</h1>
                            <p>We'd love to hear from you. Get in touch with us today!</p>
                        </div>
                    </div>
                </div>

                <section className="contact-page-section">
                    <div className="container">
                        <div className="contact-page-content">
                            {/* Contact Information */}
                            <div className="contact-info-grid">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="contact-info-card">
                                        <div className="contact-info-icon">{info.icon}</div>
                                        <h3>{info.title}</h3>
                                        <p>{info.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="contact-main-content">
                                {/* Contact Form */}
                                <div className="contact-form-container">
                                    <h2>Send us a Message</h2>
                                    
                                    {successMessage && (
                                        <div className="success-message">
                                            {successMessage}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="contact-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="name">Full Name *</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={errors.name ? 'error' : ''}
                                                    placeholder="Your full name"
                                                />
                                                {errors.name && <span className="error-message">{errors.name}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email">Email Address *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={errors.email ? 'error' : ''}
                                                    placeholder="your@email.com"
                                                />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="phone">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={errors.phone ? 'error' : ''}
                                                    placeholder="Your phone number"
                                                />
                                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="subject">Subject *</label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className={errors.subject ? 'error' : ''}
                                                    placeholder="What is this about?"
                                                />
                                                {errors.subject && <span className="error-message">{errors.subject}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">Message *</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className={errors.message ? 'error' : ''}
                                                placeholder="Your message here..."
                                                rows="6"
                                            />
                                            {errors.message && <span className="error-message">{errors.message}</span>}
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                                            {isLoading ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>

                                {/* Business Hours */}
                                <div className="business-hours-container">
                                    <h2>Business Hours</h2>
                                    <div className="business-hours">
                                        {businessHours.map((item, index) => (
                                            <div key={index} className="hour-item">
                                                <span className="day">{item.day}</span>
                                                <span className="time">{item.time}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="contact-note">
                                        <p>📧 <strong>Quick Response:</strong> We typically respond to all inquiries within 24 business hours.</p>
                                    </div>
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

export default Contact;
