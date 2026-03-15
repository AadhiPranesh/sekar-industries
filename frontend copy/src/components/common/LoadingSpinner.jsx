/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: '24px',
        medium: '40px',
        large: '60px'
    };

    return (
        <div className="loading-spinner-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <div
                className="loading-spinner"
                style={{
                    width: sizeClasses[size],
                    height: sizeClasses[size],
                    border: '3px solid var(--color-gray-200)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto'
                }}
            />
            {text && (
                <p style={{
                    marginTop: '1rem',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                }}>
                    {text}
                </p>
            )}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default LoadingSpinner;
