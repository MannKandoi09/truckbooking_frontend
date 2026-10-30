import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and Confirm password do not match.' });
      return;
    }
    // Simulation / Notification
    setStatusMessage({ type: 'success', text: 'Password successfully updated! Your account credentials are secured.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Security &amp; Credentials</h1>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            <i className="fa-solid fa-lock text-xs"></i>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 max-w-xl">
          <section className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Change Password</h2>
            <p className="text-xs text-slate-500 font-medium">Update your account authentication credentials with secure encryption.</p>
          </section>

          {statusMessage && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <i className={`fa-solid ${statusMessage.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-base`}></i>
              {statusMessage.text}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/30 transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePassword;
