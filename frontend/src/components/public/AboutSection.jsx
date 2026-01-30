/**
 * About Section Component
 * Company information and values
 */

const AboutSection = ({ businessInfo }) => {
    const checkIcon = (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );

    const aboutFeatures = [
        'Quality Assured Products',
        'Competitive Wholesale Prices',
        'Expert Technical Support',
        'Same-Day Delivery Available',
        'Bulk Order Discounts',
        'Easy Return Policy'
    ];

    return (
        <section className="section about-section" id="about">
            <div className="container">
                <div className="about-content">
                    <div className="about-image">
                        <img
                            src="/images/warehouse.png"
                            alt="Sekar Industries Warehouse - Industrial Supplies and Equipment"
                            className="about-image-main"
                            style={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-2xl)'
                            }}
                            onError={(e) => {
                                // Fallback if image doesn't load
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                        <div
                            className="about-image-fallback"
                            style={{
                                display: 'none',
                                width: '100%',
                                height: '500px',
                                background: 'linear-gradient(135deg, #1a5f7a 0%, #0d3d52 100%)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '6rem',
                                borderRadius: 'var(--radius-2xl)'
                            }}
                        >
                            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="8" width="20" height="14" rx="2"/>
                                <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
                                <path d="M2 12h20"/>
                                <path d="M6 16h.01"/>
                                <path d="M10 16h.01"/>
                                <path d="M14 16h.01"/>
                                <path d="M18 16h.01"/>
                            </svg>
                        </div>
                        <div className="about-image-badge">
                            <div className="years">{businessInfo?.stats?.yearsInBusiness || 29}+</div>
                            <div className="label">Years of Trust</div>
                        </div>
                    </div>

                    <div className="about-text">
                        <h2>About Sekar Industries</h2>
                        <p>
                            {businessInfo?.about || `Sekar Industries has been a trusted name in retail and wholesale trade for over 25 years. 
              We specialize in providing high-quality industrial supplies, hardware, and electrical components 
              to businesses and individuals across the region.`}
                        </p>
                        <p>
                            {businessInfo?.mission || `Our commitment to quality, fair pricing, and exceptional customer service has made us 
              the preferred choice for thousands of satisfied customers.`}
                        </p>

                        <div className="about-features">
                            {aboutFeatures.map((feature, index) => (
                                <div key={index} className="about-feature-item">
                                    {checkIcon}
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
