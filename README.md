# Sekar Industries - Full Stack Industrial Platform

> A modern full-stack application for Sekar Industries with React frontend, Express/Mongo backend, admin analytics, and email-based password reset OTP.
-Demo  url : https://sekar-industries-3.onrender.com/
-Admin https://sekar-industries-3.onrender.com/admin/
-email:admin@sekarindustries.com
-password:Admin@12345
## Current Project Status

- Frontend and backend are integrated and running in local development.
- User authentication supports signup, login, logout, forgot password, and reset password.
- Forgot password sends OTP by email using Gmail SMTP app password configuration.
- Development OTP leak in API/UI has been removed.
- Product rating and review counts are normalized for consistent UI rendering.
- Admin dashboard supports live sales stats and trend visualization.

## Features

### Public Pages
- **Home** - Hero section, About, Featured Products, Categories Showcase, Contact
- **Products** - Product catalog with category filtering and search
- **Product Detail** - Detailed product information, ratings, and review section
- **Categories** - Browse all product categories
- **About** - Company history, mission, vision, and timeline
- **Forgot Password / Reset Password** - OTP-based account recovery
- **404** - Custom not found page

### Admin Features
- Admin login (JWT-protected routes)
- Dashboard KPI cards and trend charts
- Product management
- Request management

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
- Google Fonts (Playfair Display, Montserrat, Inter)
- Nursery brand palette (forest green, sage, warm cream)

### Email Experience
- Branded OTP email template aligned with theme tokens
- High-contrast OTP display for readability in email clients
- Resilient mail handling to avoid API crashes on SMTP issues

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Auth: Sessions (user) + JWT (admin)
- Email: Nodemailer + Gmail SMTP

## Installation

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd backend
npm install
node server.js
```

## Local URLs

- Frontend: http://localhost:5173 (or next available Vite port)
- Backend: http://localhost:5000

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

## Environment Variables (Backend)

Add these in backend/.env:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sekar-industries
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
NODE_ENV=development
EMAIL_USER=your-gmail-address
EMAIL_PASS=your-16-char-gmail-app-password
EMAIL_FROM="Sekar Industries <your-gmail-address>"
```

## Notes

- For Gmail SMTP, use an App Password (not your normal Gmail password).
- If forgot-password mail fails, backend logs include SMTP error details.
- In current behavior, API no longer returns `dev_otp`.

## Design Features

### Color Palette
- **Primary**: #2D473E (Deep Forest Green)
- **Secondary**: #C5CDC1 (Soft Sage Green)
- **Accent**: #F7F6F2 (Warm Cream)
- **Text**: #333333 (Dark Charcoal)

### Typography
- **Logo**: Playfair Display
- **Headings**: Montserrat
- **Body**: Inter

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

## Future Enhancements

- Email queue/retry strategy for OTP delivery
- OTP throttling and abuse protection hardening
- Shopping cart functionality
- Order management
- Payment gateway integration
- Advanced filtering and sorting

## 📄 License

This project is private and proprietary to Sekar Industries.

## 👨‍💻 Development

Built with ❤️ using modern web technologies and best practices.

---

**Sekar Industries** - Quality Products, Trusted Service Since 1995
