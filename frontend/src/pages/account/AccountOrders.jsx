import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders', { params: {} });
        setOrders(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (e) {
        setError('Orders API unavailable');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 && <div className="text-gray-500">No orders found.</div>}
      <div className="divide-y">
        {orders.map((o) => (
          <div key={o.id} className="py-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-gray-500">Status: {o.status} · Total: ${o.total}</div>
            </div>
            <div className="space-x-2">
              <button className="btn-secondary">View</button>
              <button className="btn-primary">Reorder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
