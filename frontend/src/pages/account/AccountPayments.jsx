import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AccountPayments() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: null, brand: '', last4: '', expMonth: '', expYear: '', isDefault: false });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payment-methods');
      setMethods(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (e) {
      setError('Payment Methods API unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (form.id) await api.put(`/payment-methods/${form.id}`, form);
      else await api.post('/payment-methods', form);
      setShowForm(false);
      load();
    } catch (_) { setError('Failed to save'); }
  };

  const setDefault = async (id) => {
    try {
      await api.patch(`/payment-methods/${id}/default`);
      load();
    } catch (_) { setError('Failed to set default'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <button onClick={() => { setForm({ id: null, brand: '', last4: '', expMonth: '', expYear: '', isDefault: false }); setShowForm(true); }} className="btn-primary">Add</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="space-y-3">
        {methods.map(m => (
          <div key={m.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{m.brand} **** {m.last4}</div>
              <div className="text-sm text-gray-500">Exp: {m.expMonth}/{m.expYear} {m.isDefault && '· Default'}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => { setForm(m); setShowForm(true); }} className="btn-secondary">Edit</button>
              <button onClick={() => setDefault(m.id)} className="btn-secondary">Set Default</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-3">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Payment Method</h3>
            <input className="input-field" placeholder="Brand" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} required />
            <input className="input-field" placeholder="Last 4" value={form.last4} onChange={e=>setForm({...form, last4:e.target.value})} required />
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field" placeholder="Exp Month" value={form.expMonth} onChange={e=>setForm({...form, expMonth:e.target.value})} required />
              <input className="input-field" placeholder="Exp Year" value={form.expYear} onChange={e=>setForm({...form, expYear:e.target.value})} required />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={e=>setForm({...form, isDefault:e.target.checked})} /> Default</label>
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
