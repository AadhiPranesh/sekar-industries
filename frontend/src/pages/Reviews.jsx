import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ReviewSummary from '../components/public/ReviewSummary';
import ReviewList from '../components/public/ReviewList';
import ReviewModal from '../components/public/ReviewModal';

/**
 * Reviews Page - Demo/Integration page for Review System
 * Shows how to integrate all review components
 */
const Reviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Rajesh Kumar',
      rating: 5,
      isVerified: true,
      date: '2024-01-15',
      reviewText: 'Excellent quality industrial desk! We purchased 10 units for our factory office. The steel construction is very robust and can handle heavy loads. Assembly was straightforward with clear instructions. After 3 months of daily use, there are no signs of wear. Highly recommended for industrial environments.',
      images: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
      ],
      helpfulCount: 24
    },
    {
      id: 2,
      userName: 'Priya Sharma',
      rating: 4,
      isVerified: true,
      date: '2024-01-10',
      reviewText: 'Good value for money. The desk is sturdy and spacious. Installation took about 45 minutes with 2 people. The powder coating finish looks professional. Only minor issue is that some bolt holes required slight adjustment, but overall very satisfied with the purchase.',
      images: [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400'
      ],
      helpfulCount: 18
    },
    {
      id: 3,
      userName: 'Mohammed Ali',
      rating: 5,
      isVerified: true,
      date: '2024-01-05',
      reviewText: 'Perfect for our workshop! This desk handles all our heavy equipment and tools without any issues. The surface is easy to clean and resistant to oil stains. We have been using it for 2 months now and it still looks brand new. Great investment!',
      images: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400'
      ],
      helpfulCount: 31
    },
    {
      id: 4,
      userName: 'Anita Desai',
      rating: 5,
      isVerified: true,
      date: '2023-12-28',
      reviewText: 'Outstanding product! We ordered 5 desks for our manufacturing unit. The quality exceeded our expectations. Very heavy-duty construction that can withstand industrial use. Delivery was on time and the team was professional.',
      images: [],
      helpfulCount: 15
    },
    {
      id: 5,
      userName: 'Suresh Reddy',
      rating: 4,
      isVerified: true,
      date: '2023-12-20',
      reviewText: 'Solid desk for the price. Using it in our quality control department. The drawer space is adequate and the surface area is generous. Packaging was excellent - no damage during transit. Would purchase again.',
      images: [
        'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400'
      ],
      helpfulCount: 12
    }
  ]);
  
  const handleReviewSubmitted = (newReview) => {
    // Add new review to the list
    const reviewToAdd = {
      id: reviews.length + 1,
      userName: 'You', // In production, get from auth
      ...newReview,
      helpfulCount: 0
    };
    
    setReviews([reviewToAdd, ...reviews]);
  };
  
  return (
    <>
      <Header />
      <div className="reviews-page">
        <div className="reviews-container">
          {/* Page Header */}
          <div className="reviews-page-header">
            <h1>Customer Reviews & Ratings</h1>
            <button 
              className="write-review-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Write a Verified Review
            </button>
          </div>
          
          {/* Review Summary */}
          <ReviewSummary reviews={reviews} />
          
          {/* Review List with Customer Photos */}
          <ReviewList reviews={reviews} />
        </div>
      </div>
      
      {/* Review Modal */}
      <ReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId="demo-product"
        onReviewSubmitted={handleReviewSubmitted}
      />
      
      <Footer />
    </>
  );
};

export default Reviews;
