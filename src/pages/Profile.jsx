import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const Profile = () => {
  const role = (localStorage.getItem('role') || 'ADMIN').toUpperCase();
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || (role === 'ADMIN' ? 'Super' : 'Demo'));
  const [lastName, setLastName] = useState(localStorage.getItem('lastName') || (role === 'ADMIN' ? 'Admin' : 'User'));
  const [email] = useState(localStorage.getItem('email') || (role === 'ADMIN' ? 'admin@truckbooking.com' : 'user@truckbooking.com'));
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '9999999999');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('phone', phone);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Account Profile</h1>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {firstName.charAt(0)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 max-w-4xl">
          <section className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 leading-tight">My Profile</h2>
            <p className="text-xs text-slate-500 font-medium">Manage your personal details, contact credentials, and system identity.</p>
          </section>

          {savedMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-base"></i> Profile details updated successfully!
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
            {/* Header Identity Bar */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-600/30">
                {firstName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{firstName} {lastName}</h3>
                <p className="text-xs text-slate-500 font-medium">{email}</p>
                <span className={`inline-block mt-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {role} Access Level
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address (Read Only)</label>
                  <input 
                    type="email" 
                    value={email} 
                    disabled 
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/30 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
