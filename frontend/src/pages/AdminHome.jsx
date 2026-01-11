import React, { useEffect, useMemo, useState } from 'react';
import { orderService, productService } from '../services/api';

function ProgressBar({ value, max, color = 'bg-primary-600' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function AdminHome() {
  const [summary, setSummary] = useState({ orders: 0, revenue: 0, aov: 0 });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30'); // 7/30/90

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Optional: backend endpoints; fallback to mock if unavailable
        let ordersSummary = { orders: 0, revenue: 0, aov: 0 };
        try {
          const res = await orderService.summary();
          if (res?.data) ordersSummary = res.data;
        } catch (_) {}

        let products = [];
        try {
          const pr = await productService.getAllProducts();
          products = pr.data.slice(0, 5);
        } catch (_) {}

        setSummary(ordersSummary);
        setTopProducts(products);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  const chartData = useMemo(() => {
    const days = parseInt(range, 10);
    // Generate simple mock trend for visual placeholder
    const points = Array.from({ length: days }, (_, i) => ({ x: i + 1, y: Math.round(50 + 20 * Math.sin(i / 4)) }));
    return points;
  }, [range]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          {['7','30','90'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-sm ${range===r?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{r} days</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">${summary.revenue?.toFixed ? summary.revenue.toFixed(2) : summary.revenue}</div>
          <ProgressBar value={summary.revenue || 0} max={1000} />
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-2xl font-bold">{summary.orders}</div>
          <ProgressBar value={summary.orders || 0} max={100} color="bg-emerald-600" />
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Avg. Order Value</div>
          <div className="text-2xl font-bold">${summary.aov?.toFixed ? summary.aov.toFixed(2) : summary.aov}</div>
          <ProgressBar value={summary.aov || 0} max={200} color="bg-amber-600" />
        </div>
      </div>

      {/* Simple Chart Placeholder */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sales Trend</h2>
          <span className="text-xs text-gray-500">Last {range} days</span>
        </div>
        <div className="w-full h-48 relative">
          <svg viewBox="0 0 100 40" className="w-full h-full text-primary-600">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points={chartData.map((p, i) => `${(i/(chartData.length-1))*100},${40 - (p.y/100)*40}`).join(' ')}
            />
          </svg>
        </div>
      </div>

      {/* Top Products */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Top Products</h2>
        <div className="divide-y">
          {loading && <div className="py-3 text-gray-500">Loading...</div>}
          {!loading && topProducts.length === 0 && (
            <div className="py-3 text-gray-500">No data</div>
          )}
          {topProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {p.imageUrl && <img src={p.imageUrl} className="w-10 h-10 rounded object-cover" alt={p.name} />}
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">SKU: {p.skuCode}</div>
                </div>
              </div>
              <div className="text-sm font-medium">${p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
