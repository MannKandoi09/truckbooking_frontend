import React from 'react';
import Sidebar from '../components/layout/Sidebar';

const AdminDashboard = () => {
  return (
    <div className="h-screen flex overflow-hidden font-sans text-slate-800 bg-slate-50">
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="text-slate-500 hover:text-slate-700">
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input className="block w-full pl-10 pr-3 py-2 border-none bg-slate-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search here..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">5</span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-[11px] text-slate-500">Administrator</p>
              </div>
              <img alt="Admin Avatar" className="w-10 h-10 rounded-full border border-slate-200" src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"/>
              <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
            </div>
          </div>
        </header>

        {/* Dashboard Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin! 👋</h2>
              <p className="text-sm text-slate-500">Here's what's happening with your fleet today.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50">
              <i className="fa-regular fa-calendar text-slate-400"></i>
              <span className="text-sm font-medium text-slate-600">May 18, 2026 - May 24, 2026</span>
              <i className="fa-solid fa-chevron-down text-slate-400 text-xs ml-2"></i>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl"><i className="fa-solid fa-truck"></i></div>
                <div><p className="text-xs text-slate-500 font-medium">Total Trucks</p><h3 className="text-2xl font-bold">128</h3></div>
              </div>
              <p className="text-[11px] text-emerald-500 font-bold"><i className="fa-solid fa-arrow-up"></i> 8 <span className="text-slate-400 font-normal">this week</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl"><i className="fa-solid fa-user-tie"></i></div>
                <div><p className="text-xs text-slate-500 font-medium">Total Drivers</p><h3 className="text-2xl font-bold">156</h3></div>
              </div>
              <p className="text-[11px] text-emerald-500 font-bold"><i className="fa-solid fa-arrow-up"></i> 12 <span className="text-slate-400 font-normal">this week</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl"><i className="fa-solid fa-users"></i></div>
                <div><p className="text-xs text-slate-500 font-medium">Total Customers</p><h3 className="text-2xl font-bold">532</h3></div>
              </div>
              <p className="text-[11px] text-emerald-500 font-bold"><i className="fa-solid fa-arrow-up"></i> 25 <span className="text-slate-400 font-normal">this week</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl"><i className="fa-solid fa-calendar-check"></i></div>
                <div><p className="text-xs text-slate-500 font-medium">Total Bookings</p><h3 className="text-2xl font-bold">236</h3></div>
              </div>
              <p className="text-[11px] text-emerald-500 font-bold"><i className="fa-solid fa-arrow-up"></i> 18 <span className="text-slate-400 font-normal">this week</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-xl"><i className="fa-solid fa-route"></i></div>
                <div><p className="text-xs text-slate-500 font-medium">Active Routes</p><h3 className="text-2xl font-bold">42</h3></div>
              </div>
              <p className="text-[11px] text-emerald-500 font-bold"><i className="fa-solid fa-arrow-up"></i> 5 <span className="text-slate-400 font-normal">this week</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center text-xl"><i className="fa-solid fa-indian-rupee-sign"></i></div>
                <div><p className="text-xs text-slate-500 font-medium">Total Payments</p><h3 className="text-lg font-bold">₹ 8,45,230</h3></div>
              </div>
              <p className="text-[11px] text-emerald-500 font-bold"><i className="fa-solid fa-arrow-up"></i> 15% <span className="text-slate-400 font-normal">this week</span></p>
            </div>
          </div>

          {/* Middle Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Fleet Status Donut */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6"><h4 className="font-bold text-slate-800">Fleet Status Overview</h4></div>
              <div className="flex-1 flex flex-col items-center justify-center py-4">
                <div className="relative w-48 h-48 rounded-full border-[18px] border-emerald-500 flex items-center justify-center" style={{ borderLeftColor: '#3b82f6', borderBottomColor: '#f59e0b', borderRightColor: '#ef4444' }}>
                  <div className="text-center"><span className="text-3xl font-bold block">128</span><span className="text-[10px] uppercase text-slate-400 font-semibold">Total Trucks</span></div>
                </div>
                <div className="w-full mt-8 grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> <span className="text-slate-600">Available</span></div><span className="font-bold text-slate-700">68 (53.13%)</span></div>
                  <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> <span className="text-slate-600">In Use</span></div><span className="font-bold text-slate-700">34 (26.56%)</span></div>
                  <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-400 rounded-sm"></span> <span className="text-slate-600">Maintenance</span></div><span className="font-bold text-slate-700">16 (12.50%)</span></div>
                  <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> <span className="text-slate-600">Out of Service</span></div><span className="font-bold text-slate-700">10 (7.81%)</span></div>
                </div>
              </div>
              <a className="mt-4 pt-4 border-t border-slate-100 text-blue-600 text-xs font-semibold flex items-center gap-1 hover:underline" href="#">View All Trucks <i className="fa-solid fa-chevron-right text-[10px]"></i></a>
            </div>

            {/* Bookings Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Bookings Overview</h4>
                <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 cursor-pointer">This Week <i className="fa-solid fa-chevron-down ml-1"></i></div>
              </div>
              <div className="h-64 relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
                  <path d="M0,180 L50,150 L100,120 L150,100 L200,110 L250,60 L300,140 L350,170" fill="none" stroke="#3b82f6" strokeLinecap="round" strokeWidth="2"></path>
                  <circle cx="0" cy="180" fill="#3b82f6" r="3"></circle><circle cx="50" cy="150" fill="#3b82f6" r="3"></circle><circle cx="100" cy="120" fill="#3b82f6" r="3"></circle><circle cx="150" cy="100" fill="#3b82f6" r="3"></circle><circle cx="200" cy="110" fill="#3b82f6" r="3"></circle><circle cx="250" cy="60" fill="white" r="4" stroke="#3b82f6" strokeWidth="2"></circle><circle cx="300" cy="140" fill="#3b82f6" r="3"></circle><circle cx="350" cy="170" fill="#3b82f6" r="3"></circle>
                </svg>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div><p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">Total Bookings</p><h3 className="text-3xl font-black text-slate-800">236</h3></div>
                <div className="text-right"><p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">This Week</p><span className="text-emerald-500 text-sm font-bold"><i className="fa-solid fa-arrow-up"></i> 18%</span></div>
              </div>
            </div>

            {/* Recent Bookings List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Recent Bookings</h4>
                <a className="text-blue-600 text-xs font-semibold hover:underline" href="#">View All</a>
              </div>
              <div className="space-y-5">
                {[
                  { id: 'BK-2025-00125', status: 'Confirmed', from: 'Delhi', to: 'Mumbai', color: 'emerald' },
                  { id: 'BK-2025-00124', status: 'In Progress', from: 'Bangalore', to: 'Chennai', color: 'blue' },
                  { id: 'BK-2025-00123', status: 'Confirmed', from: 'Kolkata', to: 'Guwahati', color: 'emerald' },
                  { id: 'BK-2025-00122', status: 'Pending', from: 'Pune', to: 'Hyderabad', color: 'orange' },
                  { id: 'BK-2025-00121', status: 'Confirmed', from: 'Ahmedabad', to: 'Vadodara', color: 'emerald' }
                ].map((booking, idx) => (
                  <div key={idx} className="flex items-start gap-4 hover:bg-slate-50 p-1 -m-1 rounded transition-colors">
                    <div className="bg-blue-50 text-blue-500 p-2.5 rounded-lg text-sm"><i className="fa-solid fa-calendar-days"></i></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-xs font-bold text-slate-800">{booking.id}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 bg-${booking.color}-50 text-${booking.color}-600 rounded uppercase`}>{booking.status}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-[11px] text-slate-500">{booking.from} <i className="fa-solid fa-arrow-right mx-1 text-[8px]"></i> {booking.to}</p>
                        <p className="text-[10px] text-slate-400">May 24, 2026</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800">Revenue Overview</h4>
                <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 cursor-pointer">This Week <i className="fa-solid fa-chevron-down ml-1"></i></div>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div><h3 className="text-2xl font-bold">₹ 8,45,230</h3><p className="text-[11px] text-slate-400 font-medium">Total Revenue</p></div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded flex items-center gap-1 justify-end"><i className="fa-solid fa-arrow-up text-[8px]"></i> 15%</span>
                  <p className="text-[10px] text-slate-400 mt-1 italic">vs last week</p>
                </div>
              </div>
              <div className="flex items-end justify-between h-40 gap-2 px-2">
                {['60%', '45%', '75%', '55%', '90%', '65%', '80%'].map((h, i) => (
                  <div key={i} className="w-full bg-emerald-400 hover:bg-emerald-500 transition-colors rounded-t-sm" style={{ height: h }}></div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </div>

            {/* Top Routes Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Top Routes</h4>
                <a className="text-blue-600 text-xs font-semibold hover:underline" href="#">View All</a>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-50">
                    <th className="text-left font-medium pb-3 uppercase tracking-tighter text-[10px]">Route</th>
                    <th className="text-center font-medium pb-3 uppercase tracking-tighter text-[10px]">Bookings</th>
                    <th className="text-right font-medium pb-3 uppercase tracking-tighter text-[10px]">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr><td className="py-4 font-medium text-slate-700">Delhi <i className="fa-solid fa-arrow-right mx-1 text-[8px] text-slate-400"></i> Mumbai</td><td className="py-4 text-center">32</td><td className="py-4 text-right font-bold text-slate-800">₹ 1,45,230</td></tr>
                  <tr><td className="py-4 font-medium text-slate-700">Vadodara <i className="fa-solid fa-arrow-right mx-1 text-[8px] text-slate-400"></i> Surat</td><td className="py-4 text-center">28</td><td className="py-4 text-right font-bold text-slate-800">₹ 1,25,400</td></tr>
                  <tr><td className="py-4 font-medium text-slate-700">Pune <i className="fa-solid fa-arrow-right mx-1 text-[8px] text-slate-400"></i> Hyderabad</td><td className="py-4 text-center">24</td><td className="py-4 text-right font-bold text-slate-800">₹ 1,05,600</td></tr>
                  <tr><td className="py-4 font-medium text-slate-700">Kolkata <i className="fa-solid fa-arrow-right mx-1 text-[8px] text-slate-400"></i> Guwahati</td><td className="py-4 text-center">20</td><td className="py-4 text-right font-bold text-slate-800">₹ 95,300</td></tr>
                </tbody>
              </table>
            </div>

            {/* Maintenance Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Maintenance Alerts</h4>
                <a className="text-blue-600 text-xs font-semibold hover:underline" href="#">View All</a>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 text-red-500 p-2.5 rounded-lg text-sm"><i className="fa-solid fa-wrench"></i></div>
                  <div className="flex-1 flex justify-between items-start">
                    <div><p className="text-xs font-bold text-slate-800">Truck GJ01AB1234</p><p className="text-[10px] text-slate-500 mt-1">Insurance Expiring on 25-May-2026</p></div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded">Urgent</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-50 text-orange-500 p-2.5 rounded-lg text-sm"><i className="fa-solid fa-wrench"></i></div>
                  <div className="flex-1 flex justify-between items-start">
                    <div><p className="text-xs font-bold text-slate-800">Truck MH12EF5678</p><p className="text-[10px] text-slate-500 mt-1">Service Due on 28-May-2026</p></div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded">Due Soon</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-rose-50 text-rose-500 p-2.5 rounded-lg text-sm"><i className="fa-solid fa-wrench"></i></div>
                  <div className="flex-1 flex justify-between items-start">
                    <div><p className="text-xs font-bold text-slate-800">Truck KA03GH9101</p><p className="text-[10px] text-slate-500 mt-1">Insurance Expired on 15-May-2026</p></div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded">Overdue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="mt-12 py-6 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[11px] font-medium">
            <p>© 2026 Truck Management System. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </footer>
        </main>
      </div>
    </div>
  );
};



export default AdminDashboard;