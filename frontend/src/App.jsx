import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import About from './pages/About';
import NotFound from './pages/NotFound';
// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSalesEntry from './pages/admin/AdminSalesEntry';
import AdminProductHealth from './pages/admin/AdminProductHealth';
// Components
import ScrollToTop from './components/common/ScrollToTop';
import WhatsAppButton from './components/common/WhatsAppButton';
// Styles
import './styles/variables.css';
import './styles/global.css';
import './styles/public.css';
import './styles/admin.css';
import './styles/responsive.css';
import './styles/dashboard.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes - Customer front entrance */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            {/* Admin Routes - Owner back office entrance */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="sales-entry" element={<AdminSalesEntry />} />
              <Route path="product-health" element={<AdminProductHealth />} />
            </Route>
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;

