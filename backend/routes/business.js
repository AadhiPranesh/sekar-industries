import express from 'express';

const router = express.Router();

const businessInfo = {
    name: 'Sekar Industries',
    tagline: 'Quality Products, Trusted Service Since 1995',
    established: 1995,
    about: 'Sekar Industries has been a trusted name in retail and wholesale trade for over 25 years. We specialize in quality industrial supplies, hardware, and electrical components.',
    mission: 'To provide reliable, quality products with honest service and fair prices.',
    vision: 'To be the most trusted industrial supply partner in the region.',
    owner: 'Mr. Sekar Kumar',
    contact: {
        address: 'Perundurai Road, Erode - 638011, Tamil Nadu, India',
        phone: '+91 7708 644 431',
        alternatePhone: '+91 42 2345 6789',
        email: 'info@sekarindustries.com',
        website: 'www.sekarindustries.com'
    },
    timings: {
        weekdays: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '10:00 AM - 2:00 PM'
    },
    socialMedia: {
        whatsapp: '+917708644431'
    },
    stats: {
        yearsInBusiness: 29,
        productsAvailable: 23,
        happyCustomers: 10000,
        categories: 4
    },
    features: [
        { title: 'Quality Assured', description: 'Every product is quality checked before delivery' },
        { title: 'Best Prices', description: 'Competitive wholesale and retail pricing' },
        { title: 'Fast Delivery', description: 'Same-day delivery within city limits' },
        { title: 'Trusted Partner', description: '25+ years of reliable service' }
    ]
};

router.get('/', (req, res) => {
    res.json({ success: true, data: businessInfo });
});

router.get('/contact', (req, res) => {
    res.json({
        success: true,
        data: {
            contact: businessInfo.contact,
            timings: businessInfo.timings,
            socialMedia: businessInfo.socialMedia
        }
    });
});

router.get('/stats', (req, res) => {
    res.json({ success: true, data: businessInfo.stats });
});

router.get('/features', (req, res) => {
    res.json({ success: true, data: businessInfo.features });
});

export default router;
