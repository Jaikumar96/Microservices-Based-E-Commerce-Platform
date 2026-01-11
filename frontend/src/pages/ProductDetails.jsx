import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await productService.getById ? productService.getById(id) : null;
        if (res && res.data) setProduct(res.data);
        else {
          // fallback: fetch all and find
          const list = await productService.getAllProducts();
          const found = (list.data || []).find(p => String(p.id) === String(id));
          if (found) setProduct(found);
          else setError('Product not found');
        }
      } catch (_) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    if (product) addToCart(product);
  };

  if (loading) return <div className="max-w-5xl mx-auto p-6">Loading...</div>;
  if (error) return <div className="max-w-5xl mx-auto p-6 text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-contain bg-white rounded" />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-3xl font-bold text-primary-600 mb-4">${product.price}</div>
          <div className="text-sm text-gray-500 mb-4">SKU: {product.skuCode}</div>
          <div className="flex gap-3">
            <button onClick={onAddToCart} className="btn-primary">Add to Cart</button>
            <button className="btn-secondary">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
