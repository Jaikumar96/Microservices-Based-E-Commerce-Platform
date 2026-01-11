import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const items = [
  { name: 'Orders', path: '/account/orders' },
  { name: 'Returns', path: '/account/returns' },
  { name: 'Addresses', path: '/account/addresses' },
  { name: 'Payment Methods', path: '/account/payments' },
  { name: 'Account Details', path: '/account' },
  { name: 'Wishlist', path: '/account/wishlist' },
];

export default function AccountLayout() {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="bg-white rounded-lg shadow-sm p-4">
          <nav className="space-y-1">
            {items.map(i => {
              const active = location.pathname === i.path;
              return (
                <Link key={i.path} to={i.path} className={`block px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}>
                  {i.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
