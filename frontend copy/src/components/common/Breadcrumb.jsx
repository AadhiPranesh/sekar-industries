/**
 * Breadcrumb Component
 * Navigation breadcrumb trail
 */

import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="breadcrumb-item">
                        <svg className="breadcrumb-separator" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {item.link ? (
                            <Link to={item.link} className="breadcrumb-link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="breadcrumb-current">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
