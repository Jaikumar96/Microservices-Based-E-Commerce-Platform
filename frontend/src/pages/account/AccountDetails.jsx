import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AccountDetails() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/me');
        setForm({ name: res.data?.name || '', email: res.data?.email || '', phone: res.data?.phone || '' });
      } catch (_) {}
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
  await api.put('/auth/me', form);
      setStatus('Saved');
      setTimeout(()=>setStatus(''), 3000);
    } catch (_) { setStatus('Failed'); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
  await api.put('/auth/me', { passwordChange: passwordForm });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setStatus('Password changed');
      setTimeout(()=>setStatus(''), 3000);
    } catch (_) { setStatus('Failed to change password'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <form onSubmit={save} className="space-y-3">
          <input className="input-field" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="input-field" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">Save</button>
            {status && <span className="text-sm text-gray-500">{status}</span>}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <form onSubmit={changePassword} className="space-y-3">
          <input className="input-field" type="password" placeholder="Current Password" value={passwordForm.currentPassword} onChange={e=>setPasswordForm({...passwordForm, currentPassword:e.target.value})} />
          <input className="input-field" type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={e=>setPasswordForm({...passwordForm, newPassword:e.target.value})} />
          <button className="btn-secondary" type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}
