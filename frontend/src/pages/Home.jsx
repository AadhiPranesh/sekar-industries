/**
 * Home Page
 * Landing page with business identity and featured products
 */

import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HeroSection from '../components/public/HeroSection';
import AboutSection from '../components/public/AboutSection';
import FeaturedProducts from '../components/public/FeaturedProducts';
import CategoriesShowcase from '../components/public/CategoriesShowcase';
import ContactSection from '../components/public/ContactSection';
import { getBusinessInfo } from '../services/businessService';
import { getFeaturedProducts } from '../services/productService';

const Home = () => {
    const [businessInfo, setBusinessInfo] = useState(null);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch business info and featured products in parallel
                const [businessResponse, productsResponse] = await Promise.all([
                    getBusinessInfo(),
                    getFeaturedProducts()
                ]);

                if (businessResponse.success) {
                    setBusinessInfo(businessResponse.data);
                }

                if (productsResponse.success) {
                    setFeaturedProducts(productsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="page home-page">
            <Header />

            <main>
                <HeroSection businessInfo={businessInfo} />
                <AboutSection businessInfo={businessInfo} />
                <FeaturedProducts products={featuredProducts} loading={loading} />
                <CategoriesShowcase />
                <ContactSection businessInfo={businessInfo} />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
