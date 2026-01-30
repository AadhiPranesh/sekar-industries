# Sekar Industries - Industrial Supplies Website

> A modern, responsive React web application for Sekar Industries - Your trusted partner for quality industrial supplies, hardware, and electrical components since 1995.

## 🚀 Features

### Pages
- **Home** - Hero section, About, Featured Products, Categories Showcase, Contact
- **Products** - Product catalog with category filtering and search
- **Product Detail** - Detailed product information with related products
- **Categories** - Browse all product categories
- **About** - Company history, mission, vision, and timeline
- **404** - Custom not found page

### Components
- **Header** - Responsive navigation with search functionality
- **Footer** - Company info and quick links
- **SearchBar** - Product search with autocomplete
- **ProductCard** - Clickable product cards
- **CategoryCard** - Interactive category cards
- **Breadcrumb** - Navigation breadcrumb trail
- **ScrollToTop** - Floating scroll-to-top button
- **WhatsAppButton** - Floating WhatsApp contact button

### Design System
- CSS Variables for consistent theming
- Responsive grid layouts
- Smooth animations and transitions
- Modern glassmorphism effects
- Professional color palette
- Google Fonts (Inter, Outfit)

## 🛠️ Tech Stack

- **React** 19.2.0
- **React Router DOM** 7.13.0
- **Vite** 7.2.4
- **CSS3** with CSS Variables

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Development Server

The development server runs on `http://localhost:5173` (or the next available port).

## 📁 Project Structure

```
sekar-industries/
├── src/
│   ├── api/
│   │   └── config.js              # API configuration
│   ├── components/
│   │   ├── common/                # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── WhatsAppButton.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   └── public/                # Public-facing components
│   │       ├── HeroSection.jsx
│   │       ├── AboutSection.jsx
│   │       ├── FeaturedProducts.jsx
│   │       ├── CategoriesShowcase.jsx
│   │       ├── ContactSection.jsx
│   │       ├── ProductCard.jsx
│   │       ├── ProductGrid.jsx
│   │       ├── CategoryCard.jsx
│   │       ├── CategoryFilter.jsx
│   │       ├── RelatedProducts.jsx
│   │       └── AvailabilityBadge.jsx
│   ├── data/
│   │   ├── mockProducts.js        # Product data
│   │   ├── mockCategories.js      # Category data
│   │   └── mockBusiness.js        # Business info
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Categories.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── productService.js      # Product operations
│   │   ├── categoryService.js     # Category operations
│   │   └── businessService.js     # Business info operations
│   ├── styles/
│   │   ├── variables.css          # Design tokens
│   │   ├── global.css             # Global styles
│   │   ├── public.css             # Component styles
│   │   └── responsive.css         # Responsive styles
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design Features

### Color Palette
- **Primary**: #1a5f7a (Industrial Blue)
- **Secondary**: #f39c12 (Warm Orange)
- **Accent**: #16a085 (Teal Green)
- **Success**: #27ae60
- **Warning**: #f39c12
- **Danger**: #e74c3c

### Typography
- **Headings**: Outfit (Google Fonts)
- **Body**: Inter (Google Fonts)
- **Monospace**: Fira Code

### Key Interactions
- Smooth hover effects on cards
- Animated page transitions
- Interactive category cards with color theming
- Responsive mobile menu
- Search autocomplete
- Scroll-to-top functionality

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔍 Search Functionality

The search bar provides:
- Real-time product search
- Autocomplete suggestions
- Product name and description matching
- Click to view product details

## 🛒 Product Features

### Product Catalog
- 20 sample products across 6 categories
- Category filtering
- Availability status badges (In Stock, Low Stock, Out of Stock)
- Price display in Indian Rupees (₹)

### Product Categories
1. **Electrical** - Switches, wires, MCBs
2. **Hardware** - Tools, fasteners, building hardware
3. **Plumbing** - Pipes, fittings, valves
4. **Paints** - Interior, exterior paints
5. **Safety** - Safety equipment and gear
6. **Adhesives** - Glues, sealants, tapes

## 📞 Contact Information

- **Phone**: +91 98765 43210
- **Alternate**: +91 44 2345 6789
- **Email**: info@sekarindustries.com
- **Address**: 123 Industrial Avenue, Commerce District, Chennai - 600001

### Business Hours
- **Monday - Friday**: 9:00 AM - 8:00 PM
- **Saturday**: 9:00 AM - 6:00 PM
- **Sunday**: 10:00 AM - 2:00 PM

## 🚧 Future Enhancements

- Backend API integration
- User authentication
- Shopping cart functionality
- Order management
- Admin dashboard
- Payment gateway integration
- Product reviews and ratings
- Email notifications
- Advanced filtering and sorting

## 📄 License

This project is private and proprietary to Sekar Industries.

## 👨‍💻 Development

Built with ❤️ using modern web technologies and best practices.

---

**Sekar Industries** - Quality Products, Trusted Service Since 1995
