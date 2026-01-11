import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: null, fullName: '', line1: '', city: '', state: '', zip: '', country: '', isDefaultShipping: false, isDefaultBilling: false });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/addresses');
      setAddresses(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (e) {
      setError('Addresses API unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (form.id) await api.put(`/addresses/${form.id}`, form);
      else await api.post('/addresses', form);
      setShowForm(false);
      load();
    } catch (_) { setError('Failed to save'); }
  };

  const setDefault = async (id, type) => {
    try {
      await api.patch(`/addresses/${id}/default`, { type });
      load();
    } catch (_) { setError('Failed to set default'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Addresses</h2>
        <button onClick={() => { setForm({ id: null, fullName: '', line1: '', city: '', state: '', zip: '', country: '', isDefaultShipping: false, isDefaultBilling: false }); setShowForm(true); }} className="btn-primary">Add Address</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(a => (
          <div key={a.id} className="p-4 border rounded">
            <div className="font-medium">{a.fullName}</div>
            <div className="text-sm text-gray-600">{a.line1}, {a.city}, {a.state} {a.zip}, {a.country}</div>
            <div className="text-xs text-gray-500 mt-1">
              {a.isDefaultShipping && <span className="mr-2">Default Shipping</span>}
              {a.isDefaultBilling && <span>Default Billing</span>}
            </div>
            <div className="mt-2 space-x-2">
              <button onClick={() => { setForm(a); setShowForm(true); }} className="btn-secondary">Edit</button>
              <button onClick={() => setDefault(a.id, 'shipping')} className="btn-secondary">Set Default Shipping</button>
              <button onClick={() => setDefault(a.id, 'billing')} className="btn-secondary">Set Default Billing</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Address</h3>
            <input className="input-field" placeholder="Full Name" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required />
            <input className="input-field" placeholder="Address Line" value={form.line1} onChange={e=>setForm({...form, line1:e.target.value})} required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input className="input-field" placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required />
              <input className="input-field" placeholder="State" value={form.state} onChange={e=>setForm({...form, state:e.target.value})} required />
              <input className="input-field" placeholder="ZIP" value={form.zip} onChange={e=>setForm({...form, zip:e.target.value})} required />
            </div>
            <input className="input-field" placeholder="Country" value={form.country} onChange={e=>setForm({...form, country:e.target.value})} required />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefaultShipping} onChange={e=>setForm({...form, isDefaultShipping:e.target.checked})} /> Default Shipping</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefaultBilling} onChange={e=>setForm({...form, isDefaultBilling:e.target.checked})} /> Default Billing</label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
