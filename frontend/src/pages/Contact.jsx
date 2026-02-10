/**
 * Contact Page
 * Dedicated contact page with form and business information
 */

import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import Icons from '../components/common/Icons';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        quantity: '1',
        purchaseType: 'retail'
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
            const priority = parseInt(formData.quantity) >= 10 ? 'HIGH PRIORITY' : 'NORMAL';
            console.log(`Contact form submitted (${priority}):`, {
                ...formData,
                priority,
                isWholesale: formData.purchaseType === 'wholesale'
            });
            
            setSuccessMessage(
                parseInt(formData.quantity) >= 10 
                    ? '🎉 Thank you for your bulk inquiry! Our sales team will prioritize your request and contact you within 24 hours.' 
                    : 'Thank you for your message! We will get back to you soon.'
            );
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                quantity: '1',
                purchaseType: 'retail'
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
            icon: Icons.Location,
            title: 'Visit Us',
            content: 'Perundurai Road, Erode - 638011, Tamil Nadu, India',
            link: null,
            type: 'address'
        },
        {
            icon: Icons.Phone,
            title: 'Call Us',
            content: '+91 98765 43210',
            secondaryContent: '+91 42 2345 6789',
            link: 'tel:+919876543210',
            secondaryLink: 'tel:+914223456789',
            type: 'phone'
        },
        {
            icon: Icons.Email,
            title: 'Email Us',
            content: 'info@sekarindustries.com',
            link: 'mailto:info@sekarindustries.com',
            type: 'email'
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
                            {/* Contact Information - Slim Horizontal Cards */}
                            <div className="contact-info-grid">
                                {contactInfo.map((info, index) => {
                                    const IconComponent = info.icon;
                                    return (
                                        <div key={index} className="contact-info-card">
                                            <div className="contact-info-icon">
                                                <IconComponent />
                                            </div>
                                            <div className="contact-info-text">
                                                <h3>{info.title}</h3>
                                                {info.link ? (
                                                    <>
                                                        <a href={info.link} className="contact-link">
                                                            {info.content}
                                                        </a>
                                                        {info.secondaryContent && (
                                                            <a href={info.secondaryLink} className="contact-link">
                                                                {info.secondaryContent}
                                                            </a>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p>{info.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="contact-main-content">
                                {/* Contact Form */}
                                <div className="contact-form-container">
                                    <h2>Send us a Message</h2>
                                    <p className="form-subtitle">We typically respond within 24 hours</p>
                                    
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

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="purchaseType">Purchase Type *</label>
                                                <select
                                                    id="purchaseType"
                                                    name="purchaseType"
                                                    value={formData.purchaseType}
                                                    onChange={handleChange}
                                                    className="form-select"
                                                >
                                                    <option value="retail">Retail (Small Quantity)</option>
                                                    <option value="wholesale">Wholesale (Bulk Order)</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="quantity">
                                                    Quantity Needed *
                                                    {parseInt(formData.quantity) >= 10 && (
                                                        <span style={{ color: '#d97706', fontSize: '12px', fontWeight: 'bold', marginLeft: '8px' }}>
                                                            🔥 BULK ORDER
                                                        </span>
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    name="quantity"
                                                    min="1"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    placeholder="Number of units"
                                                />
                                                <small style={{ color: '#666', fontSize: '12px' }}>
                                                    Orders of 10+ units get priority response
                                                </small>
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

                                        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isLoading}>
                                            {isLoading ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>

                                {/* Map & Facility Section */}
                                <div className="map-facility-container">
                                    {/* Google Maps */}
                                    <div className="map-container">
                                        <h2>Find Us</h2>
                                        <div className="map-wrapper">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62641.5!2d77.7174!3d11.3410!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f46762f4671%3A0xd97da6e3d9e8d397!2sErode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                                                width="100%"
                                                height="300"
                                                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="Sekar Industries - Erode, Tamil Nadu"
                                            ></iframe>
                                        </div>
                                    </div>

                                    {/* Business Hours */}
                                    <div className="business-hours-card">
                                        <h3>Business Hours</h3>
                                        <div className="business-hours">
                                            {businessHours.map((item, index) => (
                                                <div key={index} className="hour-item">
                                                    <span className="day">{item.day}</span>
                                                    <span className="time">{item.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trust Section */}
                                    <div className="facility-showcase">
                                        <h3>Meet Our Support Team</h3>
                                        <div className="facility-image">
                                            <div className="facility-placeholder">
                                                <div className="facility-icon">
                                                    <Icons.Business />
                                                </div>
                                                <p>Sekar Industries Facility</p>
                                                <small>Serving you since 1995</small>
                                            </div>
                                        </div>
                                        <div className="trust-badges">
                                            <div className="trust-item">
                                                <span className="trust-icon">✓</span>
                                                <span>29+ Years Experience</span>
                                            </div>
                                            <div className="trust-item">
                                                <span className="trust-icon">✓</span>
                                                <span>10,000+ Happy Customers</span>
                                            </div>
                                            <div className="trust-item">
                                                <span className="trust-icon">✓</span>
                                                <span>24hr Response Time</span>
                                            </div>
                                        </div>
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
