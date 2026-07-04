import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Yeh function check karega ki link active hai ya nahi aur uske hisaab se premium classes dega
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`;
  };

  return (
    <aside className="w-64 bg-[#0a192f] flex flex-col h-full shrink-0 border-r border-slate-800 z-20 shadow-2xl">
      
      {/* Logo Section */}
      <div className="h-20 px-6 flex items-center gap-4 border-b border-slate-800 shrink-0">
        <div className="bg-white p-2 rounded-lg flex items-center justify-center shadow-sm">
          <i className="fa-solid fa-truck-fast text-[#0a192f] text-lg"></i>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white font-black text-sm tracking-widest uppercase leading-none mb-1">TRUCKMAN</h1>
          <p className="text-[9px] text-blue-400 uppercase tracking-widest font-bold leading-none">Management</p>
        </div>
      </div>

      {/* Navigation Menu with Hidden Scrollbar CSS */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <Link to="/admin-dashboard" className={getLinkClass('/admin-dashboard')}>
          <i className="fa-solid fa-house w-5 text-center text-lg"></i> Dashboard
        </Link>
        <Link to="/trucks" className={getLinkClass('/trucks')}>
          <i className="fa-solid fa-truck w-5 text-center text-lg"></i> Trucks
        </Link>
        <Link to="/drivers" className={getLinkClass('/drivers')}>
          <i className="fa-solid fa-user-tie w-5 text-center text-lg"></i> Drivers
        </Link>
        <Link to="/customers" className={getLinkClass('/customers')}>
          <i className="fa-solid fa-users w-5 text-center text-lg"></i> Customers
        </Link>
        <Link to="/bookings" className={getLinkClass('/bookings')}>
          <i className="fa-solid fa-calendar-check w-5 text-center text-lg"></i> Bookings
        </Link>
        <Link to="/routes" className={getLinkClass('/routes')}>
          <i className="fa-solid fa-map-location-dot w-5 text-center text-lg"></i> Routes
        </Link>
        <Link to="/payments" className={getLinkClass('/payments')}>
          <i className="fa-solid fa-circle-dollar-to-slot w-5 text-center text-lg"></i> Payments
        </Link>
        <Link to="/reports" className={getLinkClass('/reports')}>
          <i className="fa-solid fa-chart-line w-5 text-center text-lg"></i> Reports
        </Link>
        
        <div className="pt-6 pb-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest px-4">
          Personal
        </div>
        
        <Link to="/profile" className={getLinkClass('/profile')}>
          <i className="fa-solid fa-circle-user w-5 text-center text-lg"></i> Profile
        </Link>
        <Link to="/settings" className={getLinkClass('/settings')}>
          <i className="fa-solid fa-gear w-5 text-center text-lg"></i> Settings
        </Link>
        <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-2 no-underline">
          <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-lg"></i> Logout
        </Link>
      </nav>

      {/* Sidebar Bottom Image */}
      <div className="p-4 shrink-0">
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-700/50 group cursor-pointer">
          <img 
            alt="Truck Fleet" 
            className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-500" 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=300&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent"></div>
        </div>
      </div>
      
    </aside>
  );
};

export default Sidebar;