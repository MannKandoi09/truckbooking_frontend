import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user role from localStorage (defaults to ADMIN if not set)
  const role = (localStorage.getItem('role') || 'ADMIN').toUpperCase();
  const firstName = localStorage.getItem('firstName') || (role === 'ADMIN' ? 'Super' : 'Demo');
  const lastName = localStorage.getItem('lastName') || (role === 'ADMIN' ? 'Admin' : 'User');
  const email = localStorage.getItem('email') || (role === 'ADMIN' ? 'admin@truckbooking.com' : 'user@truckbooking.com');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`;
  };

  return (
    <aside className="w-64 bg-[#0a192f] flex flex-col h-full shrink-0 border-r border-slate-800 z-20 shadow-2xl">
      
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center gap-3.5 border-b border-slate-800 shrink-0">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30">
          <i className="fa-solid fa-truck-fast text-lg"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black text-base tracking-widest leading-none">TRUCKMAN</span>
          <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase mt-1">Management System</span>
        </div>
      </div>

      {/* Role Badge & User Info Preview */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
            {firstName.charAt(0)}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 leading-tight truncate">{firstName} {lastName}</p>
            <p className="text-[10px] text-slate-400 leading-none truncate">{email}</p>
          </div>
        </div>
        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${
          role === 'ADMIN' ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
        }`}>
          {role}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {role === 'ADMIN' ? (
          <>
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3 mb-1">
              Operations
            </div>
            {/* 1. Dashboard */}
            <Link to="/admin-dashboard" className={getLinkClass('/admin-dashboard')}>
              <i className="fa-solid fa-chart-pie w-5 text-center text-base"></i> Dashboard
            </Link>
            {/* 2. Trucks */}
            <Link to="/trucks" className={getLinkClass('/trucks')}>
              <i className="fa-solid fa-truck w-5 text-center text-base"></i> Trucks
            </Link>
            {/* 3. Drivers */}
            <Link to="/drivers" className={getLinkClass('/drivers')}>
              <i className="fa-solid fa-user-tie w-5 text-center text-base"></i> Drivers
            </Link>
            {/* 4. Customers */}
            <Link to="/customers" className={getLinkClass('/customers')}>
              <i className="fa-solid fa-users w-5 text-center text-base"></i> Customers
            </Link>
            {/* 5. Bookings */}
            <Link to="/bookings" className={getLinkClass('/bookings')}>
              <i className="fa-solid fa-calendar-check w-5 text-center text-base"></i> Bookings
            </Link>
            {/* 6. Routes */}
            <Link to="/routes" className={getLinkClass('/routes')}>
              <i className="fa-solid fa-map-location-dot w-5 text-center text-base"></i> Routes
            </Link>

            <div className="pt-4 pb-1 text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3">
              Management
            </div>
            {/* 7. Payment Management */}
            <Link to="/payments" className={getLinkClass('/payments')}>
              <i className="fa-solid fa-wallet w-5 text-center text-base"></i> Payments
            </Link>
            {/* 8. Reports */}
            <Link to="/reports" className={getLinkClass('/reports')}>
              <i className="fa-solid fa-chart-line w-5 text-center text-base"></i> Reports
            </Link>
            {/* 9. Users */}
            <Link to="/users" className={getLinkClass('/users')}>
              <i className="fa-solid fa-users-gear w-5 text-center text-base"></i> Users
            </Link>

            <div className="pt-4 pb-1 text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3">
              Account
            </div>
            {/* 10. Profile */}
            <Link to="/profile" className={getLinkClass('/profile')}>
              <i className="fa-solid fa-user-circle w-5 text-center text-base"></i> Profile
            </Link>
            {/* 11. Change Password */}
            <Link to="/change-password" className={getLinkClass('/change-password')}>
              <i className="fa-solid fa-key w-5 text-center text-base"></i> Change Password
            </Link>
          </>
        ) : (
          <>
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3 mb-1">
              Customer Portal
            </div>
            {/* 1. Dashboard */}
            <Link to="/user-dashboard" className={getLinkClass('/user-dashboard')}>
              <i className="fa-solid fa-house w-5 text-center text-base"></i> Dashboard
            </Link>
            {/* 2. Book Truck */}
            <Link to="/book-truck" className={getLinkClass('/book-truck')}>
              <i className="fa-solid fa-truck-moving w-5 text-center text-base"></i> Book Truck
            </Link>
            {/* 3. My Bookings */}
            <Link to="/my-bookings" className={getLinkClass('/my-bookings')}>
              <i className="fa-solid fa-calendar-check w-5 text-center text-base"></i> My Bookings
            </Link>
            {/* 4. Payment */}
            <Link to="/user-payments" className={getLinkClass('/user-payments')}>
              <i className="fa-solid fa-credit-card w-5 text-center text-base"></i> Payment
            </Link>
            {/* 5. Booking History */}
            <Link to="/booking-history" className={getLinkClass('/booking-history')}>
              <i className="fa-solid fa-clock-rotate-left w-5 text-center text-base"></i> Booking History
            </Link>

            <div className="pt-4 pb-1 text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3">
              Account
            </div>
            {/* 6. Profile */}
            <Link to="/profile" className={getLinkClass('/profile')}>
              <i className="fa-solid fa-user-circle w-5 text-center text-base"></i> Profile
            </Link>
            {/* 7. Change Password */}
            <Link to="/change-password" className={getLinkClass('/change-password')}>
              <i className="fa-solid fa-key w-5 text-center text-base"></i> Change Password
            </Link>
          </>
        )}

        {/* 12. Logout / 8. Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-3 text-left"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-base"></i> Logout
        </button>
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800 shrink-0 text-center text-[11px] text-slate-500">
        TruckMan v1.0.0 &bull; Spring Boot &amp; React
      </div>
      
    </aside>
  );
};

export default Sidebar;
