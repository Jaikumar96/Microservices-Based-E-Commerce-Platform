import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('auth');
    if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Product Service APIs
export const productService = {
    getAllProducts: () => api.get('/products'),
    createProduct: (product) => api.post('/products', product),
    getById: (id) => api.get(`/products/${id}`),
};

// Inventory Service APIs
export const inventoryService = {
    checkStock: (skuCodes) => api.get('/inventory', {
        params: { skuCode: skuCodes }
    }),
};

// Order Service APIs
export const orderService = {
    placeOrder: (order) => api.post('/orders', order),
    summary: () => api.get('/orders/summary'),
};

// Auth APIs
export const authService = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (username, email, password, role = 'USER') => api.post(`/auth/register?role=${role}`, { username, email, password }),
    me: () => api.get('/auth/me'),
};

// Users APIs (Admin)
export const usersService = {
    list: () => api.get('/users'),
    create: (u) => api.post('/users', u),
    update: (id, u) => api.put(`/users/${id}`, u),
    deactivate: (id) => api.patch(`/users/${id}/deactivate`),
};

export default api;