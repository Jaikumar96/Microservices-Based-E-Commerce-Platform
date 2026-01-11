import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function AccountWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      setItems(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (e) {
      setError('Wishlist API unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const moveToCart = async (productId) => {
    try {
      await api.post(`/wishlist/${productId}/move-to-cart`);
      // Optimistically add to local cart
      addToCart(items.find(i => i.productId === productId)?.product || { id: productId, name: 'Item', price: 0, skuCode: 'SKU' });
      load();
    } catch (_) { /* ignore */ }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && items.length === 0 && <div className="text-gray-500">No items in wishlist.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((w) => (
          <div key={w.id} className="p-4 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{w.product?.name || 'Product'}</div>
              <div className="text-sm text-gray-500">SKU: {w.product?.skuCode || '-'}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => moveToCart(w.productId)} className="btn-primary">Move to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
