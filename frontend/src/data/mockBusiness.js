/**
 * Mock Business Data
 * Structured to match future API response format
 */

export const mockBusinessInfo = {
    name: 'Sekar Industries',
    tagline: 'Quality Products, Trusted Service Since 1995',
    established: 1995,
    about: `Sekar Industries has been a trusted name in retail and wholesale trade for over 25 years. 
  We specialize in providing high-quality industrial supplies, hardware, and electrical components 
  to businesses and individuals across the region. Our commitment to quality, fair pricing, and 
  exceptional customer service has made us the preferred choice for thousands of satisfied customers.`,
    mission: 'To provide reliable, quality products with honest service and fair prices.',
    vision: 'To be the most trusted industrial supply partner in the region.',
    owner: 'Mr. Sekar Kumar',
    contact: {
        address: '123 Industrial Avenue, Commerce District, Chennai - 600001',
        phone: '+91 98765 43210',
        alternatePhone: '+91 44 2345 6789',
        email: 'info@sekarindustries.com',
        website: 'www.sekarindustries.com'
    },
    timings: {
        weekdays: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '10:00 AM - 2:00 PM'
    },
    socialMedia: {
        facebook: 'https://facebook.com/sekarindustries',
        instagram: 'https://instagram.com/sekarindustries',
        whatsapp: '+919876543210'
    },
    stats: {
        yearsInBusiness: 29,
        productsAvailable: 500,
        happyCustomers: 10000,
        categories: 8
    },
    features: [
        {
            icon: 'Trophy',
            title: 'Quality Assured',
            description: 'Every product is quality checked before delivery'
        },
        {
            icon: 'Sales',
            title: 'Best Prices',
            description: 'Competitive wholesale and retail pricing'
        },
        {
            icon: 'Truck',
            title: 'Fast Delivery',
            description: 'Same-day delivery within city limits'
        },
        {
            icon: 'Users',
            title: 'Trusted Partner',
            description: '25+ years of reliable service'
        }
    ]
};

export const getBusinessInfo = () => mockBusinessInfo;
