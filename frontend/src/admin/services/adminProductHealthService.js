import { fetchData, createResponse } from '../../api/config';
import { getAdminProducts } from '../data/adminProductsMock';
import { getSalesLast30DaysMock } from '../data/adminSalesMock';

export const getProductHealthSummary = () => {
  return fetchData('/admin/product-health', () => {
    const products = getAdminProducts();
    const sales = getSalesLast30DaysMock();

    const salesCountByProduct = new Map();
    sales.forEach((s) => {
      salesCountByProduct.set(s.productId, (salesCountByProduct.get(s.productId) || 0) + s.quantity);
    });

    const items = products.map((p) => {
      const salesFrequency = salesCountByProduct.get(p.id) || 0;
      let healthStatus = 'Healthy';
      if (salesFrequency === 0 || p.stock === 0) {
        healthStatus = 'Critical';
      } else if (salesFrequency < 5) {
        healthStatus = 'Slow';
      }

      return {
        id: p.id,
        name: p.name,
        currentStock: p.stock,
        salesFrequency,
        healthStatus,
      };
    });

    return createResponse(items);
  });
};

