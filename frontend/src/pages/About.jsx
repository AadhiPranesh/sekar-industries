/**
 * About Page
 * Company information, history, and values
 */

import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { getBusinessInfo } from '../services/businessService';
import Icons from '../components/common/Icons';

const About = () => {
    const [businessInfo, setBusinessInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBusinessInfo();
                if (response.success) {
                    setBusinessInfo(response.data);
                }
            } catch (error) {
                console.error('Error fetching business info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const milestones = [
        { year: '1995', title: 'Company Founded', description: 'Started as a small retail shop in Chennai' },
        { year: '2000', title: 'Expansion', description: 'Expanded to wholesale distribution' },
        { year: '2010', title: 'Modern Facility', description: 'Moved to larger warehouse facility' },
        { year: '2015', title: '10,000 Customers', description: 'Reached milestone of serving 10,000+ customers' },
        { year: '2020', title: 'Digital Presence', description: 'Launched online catalog and ordering system' },
        { year: '2024', title: 'Industry Leader', description: 'Recognized as leading supplier in the region' }
    ];

    const getIcon = (iconName) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent /> : <Icons.Orders />;
    };

    return (
        <div className="page about-page">
            <Header />

            <main>
                <div className="about-page-header">
                    <div className="container">
                        <h1>About Sekar Industries</h1>
                        <p className="about-tagline">
                            {businessInfo?.tagline || 'Quality Products, Trusted Service Since 1995'}
                        </p>
                    </div>
                </div>

                <section className="section about-story">
                    <div className="container">
                        <div className="about-content-grid">
                            <div className="about-text-content">
                                <h2>Our Story</h2>
                                <p>
                                    {businessInfo?.about || `Sekar Industries has been a trusted name in retail and wholesale trade for over 25 years. 
                                    We specialize in providing high-quality industrial supplies, hardware, and electrical components 
                                    to businesses and individuals across the region.`}
                                </p>
                                <p>
                                    Founded by {businessInfo?.owner || 'Mr. Sekar Kumar'}, our company has grown from a small retail
                                    shop to a comprehensive industrial supply partner serving thousands of satisfied customers.
                                </p>
                            </div>
                            <div className="about-image-content">
                                <div className="about-stats-card">
                                    <div className="stat-item-large">
                                        <div className="stat-number">{businessInfo?.stats?.yearsInBusiness || 29}+</div>
                                        <div className="stat-label">Years in Business</div>
                                    </div>
                                    <div className="stat-item-large">
                                        <div className="stat-number">{(businessInfo?.stats?.happyCustomers / 1000).toFixed(0) || 10}K+</div>
                                        <div className="stat-label">Happy Customers</div>
                                    </div>
                                    <div className="stat-item-large">
                                        <div className="stat-number">{businessInfo?.stats?.productsAvailable || 23}+</div>
                                        <div className="stat-label">Products Available</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-mission">
                    <div className="container">
                        <div className="mission-vision-grid">
                            <div className="mission-card">
                                <div className="mission-icon"><Icons.Target /></div>
                                <h3>Our Mission</h3>
                                <p>{businessInfo?.mission || 'To provide reliable, quality products with honest service and fair prices.'}</p>
                            </div>
                            <div className="mission-card">
                                <div className="mission-icon"><Icons.Rocket /></div>
                                <h3>Our Vision</h3>
                                <p>{businessInfo?.vision || 'To be the most trusted industrial supply partner in the region.'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-timeline">
                    <div className="container">
                        <h2 className="section-title">Our Journey</h2>
                        <div className="timeline">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-year">{milestone.year}</div>
                                        <h4 className="timeline-title">{milestone.title}</h4>
                                        <p className="timeline-description">{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section about-values">
                    <div className="container">
                        <h2 className="section-title">Why Choose Us</h2>
                        <div className="values-grid">
                            {businessInfo?.features?.map((feature, index) => (
                                <div key={index} className="value-card">
                                    <div className="value-icon">{getIcon(feature.icon)}</div>
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            )) || (
                                    <>
                                        <div className="value-card">
                                            <div className="value-icon"><Icons.Trophy /></div>
                                            <h4>Quality Assured</h4>
                                            <p>Every product is quality checked before delivery</p>
                                        </div>
                                        <div className="value-card">
                                            <div className="value-icon"><Icons.Sales /></div>
                                            <h4>Best Prices</h4>
                                            <p>Competitive wholesale and retail pricing</p>
                                        </div>
                                        <div className="value-card">
                                            <div className="value-icon"><Icons.Truck /></div>
                                            <h4>Fast Delivery</h4>
                                            <p>Same-day delivery within city limits</p>
                                        </div>
                                        <div className="value-card">
                                            <div className="value-icon"><Icons.Users /></div>
                                            <h4>Trusted Partner</h4>
                                            <p>25+ years of reliable service</p>
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;

