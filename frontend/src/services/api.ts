import axios from 'axios';
import { Category, Product, Order, Discount, Customer, DashboardStats, CustomerInfo } from '../types';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories
export const getCategories = async (activeOnly = false): Promise<Category[]> => {
  const response = await api.get(`/categories?active_only=${activeOnly}`);
  return response.data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  const response = await api.post('/categories', category);
  return response.data;
};

export const updateCategory = async (id: string, category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

// Products
export const getProducts = async (params?: {
  category_id?: string;
  search?: string;
  active_only?: boolean;
  skip?: number;
  limit?: number;
}): Promise<Product[]> => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const updateStock = async (id: string, quantity: number): Promise<{ new_stock: number }> => {
  const response = await api.patch(`/products/${id}/stock`, null, { params: { quantity } });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// Orders
export const createOrder = async (orderData: {
  items: { product_id: string; quantity: number }[];
  customer: CustomerInfo;
  payment_method: string;
  notes?: string;
}): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async (params?: {
  status?: string;
  skip?: number;
  limit?: number;
}): Promise<Order[]> => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
  await api.patch(`/orders/${id}/status`, null, { params: { status } });
};

export const updatePaymentStatus = async (id: string, paymentStatus: string): Promise<void> => {
  await api.patch(`/orders/${id}/payment`, null, { params: { payment_status: paymentStatus } });
};

// Discounts
export const getDiscounts = async (activeOnly = false): Promise<Discount[]> => {
  const response = await api.get(`/discounts?active_only=${activeOnly}`);
  return response.data;
};

export const createDiscount = async (discount: Omit<Discount, 'id' | 'created_at'>): Promise<Discount> => {
  const response = await api.post('/discounts', discount);
  return response.data;
};

export const validateDiscount = async (code: string, orderAmount: number): Promise<Discount> => {
  const response = await api.get(`/discounts/validate/${code}`, { params: { order_amount: orderAmount } });
  return response.data;
};

export const deleteDiscount = async (id: string): Promise<void> => {
  await api.delete(`/discounts/${id}`);
};

// Customers
export const getCustomers = async (params?: { skip?: number; limit?: number }): Promise<Customer[]> => {
  const response = await api.get('/customers', { params });
  return response.data;
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

// Admin Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getSalesReport = async (startDate?: string, endDate?: string) => {
  const response = await api.get('/admin/reports/sales', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};

// Mock Payment
export const processMockPayment = async (orderId: string, success = true) => {
  const response = await api.post('/payment/mock', null, {
    params: { order_id: orderId, success },
  });
  return response.data;
};

// Seed Database
export const seedDatabase = async () => {
  const response = await api.post('/seed');
  return response.data;
};

export default api;
