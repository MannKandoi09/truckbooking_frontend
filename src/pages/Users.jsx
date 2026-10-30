import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // System users listing (combines current logged in admin, standard accounts, customers)
  const [usersList] = useState([
    { id: 1, firstName: 'Super', lastName: 'Admin', email: 'admin@truckbooking.com', phone: '9999999999', role: 'ADMIN', enabled: true, createdAt: '2026-06-29' },
    { id: 2, firstName: 'Ramesh', lastName: 'Patel', email: 'ramesh.patel@example.com', phone: '9876543210', role: 'USER', enabled: true, createdAt: '2026-07-15' },
    { id: 3, firstName: 'Suresh', lastName: 'Sharma', email: 'suresh.sharma@example.com', phone: '9812345678', role: 'USER', enabled: true, createdAt: '2026-08-01' },
    { id: 4, firstName: 'Transport', lastName: 'Coordinator', email: 'dispatcher@truckbooking.com', phone: '9123456780', role: 'ADMIN', enabled: true, createdAt: '2026-08-20' },
    { id: 5, firstName: 'Kiran', lastName: 'Logistics', email: 'contact@kiranlogistics.com', phone: '9898989898', role: 'USER', enabled: true, createdAt: '2026-09-10' }
  ]);

  const filtered = usersList.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">User Administration</h1>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-blue-100">
                <i className="fa-solid fa-users-gear"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">System Users</h2>
                <p className="text-xs text-slate-500 font-medium">Manage internal administrators, dispatchers, and registered customer accounts.</p>
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 mb-6 shadow-sm">
            <i className="fa-solid fa-magnifying-glass text-slate-400 ml-2"></i>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="Search user by name, email, role..." 
              className="w-full text-sm outline-none border-none bg-transparent"
            />
          </div>

          {/* Users Table */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base">Registered Users</h3>
              <span className="text-xs text-slate-500 font-semibold bg-white px-3 py-1 rounded-full border border-slate-200">
                {filtered.length} Users Found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">ID</th>
                    <th className="py-4 px-4">User</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-500">#{user.id}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                            {user.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">{user.firstName} {user.lastName}</p>
                            <p className="text-[11px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-700">{user.phone}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          user.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-slate-500 font-medium">{user.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Users;
