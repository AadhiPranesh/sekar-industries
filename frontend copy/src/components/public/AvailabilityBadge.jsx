/**
 * Availability Badge Component
 * Shows product stock status
 */

const AvailabilityBadge = ({ availability }) => {
    const { status, label } = availability || { status: 'in-stock', label: 'In Stock' };

    return (
        <span className={`availability-badge ${status}`}>
            <span className="availability-dot"></span>
            {label}
        </span>
    );
};

export default AvailabilityBadge;
