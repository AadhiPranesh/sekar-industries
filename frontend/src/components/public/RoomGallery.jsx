import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const RoomGallery = ({ isOpen, onClose, comboName }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Mock room gallery images
    const roomImages = [
        {
            id: 1,
            title: 'Modern Dining Setup',
            url: 'https://images.unsplash.com/photo-1585519967945-3c91287d83cf?w=800&q=80',
            description: 'Contemporary dining room with natural lighting'
        },
        {
            id: 2,
            title: 'Cozy Family Space',
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            description: 'Warm and inviting dining area for family gatherings'
        },
        {
            id: 3,
            title: 'Minimalist Elegance',
            url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
            description: 'Clean, minimalist dining space'
        },
        {
            id: 4,
            title: 'Luxury Entertainment',
            url: 'https://images.unsplash.com/photo-1598928506179-beb1d3f5a1eb?w=800&q=80',
            description: 'Premium dining room for entertaining'
        }
    ];

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    if (!isOpen) return null;

    const currentImage = roomImages[currentImageIndex];

    return (
        <div className="room-gallery-overlay" onClick={onClose}>
            <div className="room-gallery-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="room-gallery-header">
                    <h2>Room Gallery - {comboName}</h2>
                    <button className="room-gallery-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Main Image Viewer */}
                <div className="room-gallery-viewer">
                    <div className="room-gallery-main">
                        <img 
                            src={currentImage.url} 
                            alt={currentImage.title}
                            className="room-gallery-image"
                        />
                        <button 
                            className="room-gallery-nav room-gallery-nav-prev"
                            onClick={handlePrev}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button 
                            className="room-gallery-nav room-gallery-nav-next"
                            onClick={handleNext}
                            aria-label="Next image"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    {/* Image Info */}
                    <div className="room-gallery-info">
                        <h3>{currentImage.title}</h3>
                        <p>{currentImage.description}</p>
                        <div className="room-gallery-counter">
                            {currentImageIndex + 1} / {roomImages.length}
                        </div>
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="room-gallery-thumbnails">
                    {roomImages.map((image, index) => (
                        <button
                            key={image.id}
                            className={`room-gallery-thumbnail ${
                                index === currentImageIndex ? 'active' : ''
                            }`}
                            onClick={() => handleThumbnailClick(index)}
                            title={image.title}
                        >
                            <img src={image.url} alt={image.title} />
                        </button>
                    ))}
                </div>

                {/* Action Button */}
                <div className="room-gallery-action">
                    <button className="room-gallery-cta">
                        Interested? View Product Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomGallery;
