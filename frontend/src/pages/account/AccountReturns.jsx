import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AccountReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/returns');
        setReturns(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (e) {
        setError('Returns API unavailable');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Returns</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && returns.length === 0 && <div className="text-gray-500">No returns found.</div>}
      <div className="space-y-3">
        {returns.map(r => (
          <div key={r.id} className="p-3 border rounded">
            <div className="font-medium">Return #{r.id}</div>
            <div className="text-sm text-gray-500">Status: {r.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
