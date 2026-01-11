import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: null, name: '', email: '', role: 'USER', status: 'ACTIVE' });
  const [showForm, setShowForm] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const editUser = (u) => {
    setForm({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status });
    setShowForm(true);
  };

  const createUser = () => {
    setForm({ id: null, name: '', email: '', role: 'USER', status: 'ACTIVE' });
    setShowForm(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/users/${form.id}`, form);
      } else {
        await api.post('/users', form);
      }
      setShowForm(false);
      loadUsers();
    } catch (e) {
      setError('Failed to save user');
    }
  };

  const deactivateUser = async (id) => {
    try {
      await api.patch(`/users/${id}/deactivate`);
      loadUsers();
    } catch (e) {
      setError('Failed to deactivate user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <button onClick={createUser} className="btn-primary">New User</button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr><td className="p-3" colSpan={5}>Loading...</td></tr>
            )}
            {!loading && users.map(u => (
              <tr key={u.id} className="text-sm">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.status}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => editUser(u)} className="text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => deactivateUser(u.id)} className="text-red-600 hover:underline">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={saveUser} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">{form.id ? 'Edit User' : 'Create User'}</h2>
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input className="input-field" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <select className="input-field" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
                <option value="USER">User</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
