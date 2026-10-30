import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getAllTrucks } from '../services/truckService';
import { getAllDrivers } from '../services/driverService';
import { getAllCustomers } from '../services/customerService';
import { getAllBookings } from '../services/bookingService';
import { getAllRoutes } from '../services/routeService';

const AdminDashboard = () => {
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tRes, dRes, cRes, bRes, rRes] = await Promise.all([
        getAllTrucks().catch(() => ({ data: { data: [] } })),
        getAllDrivers().catch(() => ({ data: { data: [] } })),
        getAllCustomers().catch(() => ({ data: { data: [] } })),
        getAllBookings().catch(() => ({ data: { data: [] } })),
        getAllRoutes().catch(() => ({ data: { data: [] } }))
      ]);

      setTrucks(tRes.data?.data || tRes.data || []);
      setDrivers(dRes.data?.data || dRes.data || []);
      setCustomers(cRes.data?.data || cRes.data || []);
      setBookings(bRes.data?.data || bRes.data || []);
      setRoutes(rRes.data?.data || rRes.data || []);
    } catch (err) {
      console.error("Dashboard data load error", err);
    }
  };

  const totalTrucksCount = trucks.length || 0;
  const totalDriversCount = drivers.length || 0;
  const totalCustomersCount = customers.length || 0;
  const totalBookingsCount = bookings.length || 0;
  const activeRoutesCount = routes.filter(r => r.status === 'ACTIVE').length || 0;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.freightAmount) || 0), 0);

  return (
    <div className="h-screen flex overflow-hidden font-sans text-slate-800 bg-slate-50">
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-bold text-slate-800">Operations Command Center</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">Fleet Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-600/30">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Welcome to TruckMan Fleet Ops</h2>
              <p className="text-sm text-slate-500 font-medium">Real-time status across commercial vehicles, drivers, consignments, and transport routes.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <i className="fa-regular fa-calendar text-blue-600"></i>
              <span className="text-xs font-bold text-slate-700">FY 2026 Operations</span>
            </div>
          </div>

          {/* 6 Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <Link to="/trucks" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-all no-underline block">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-truck"></i>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Trucks</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{totalTrucksCount}</h3>
                </div>
              </div>
              <p className="text-[11px] text-blue-600 font-semibold">Active Fleet &rarr;</p>
            </Link>

            <Link to="/drivers" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-all no-underline block">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Drivers</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{totalDriversCount}</h3>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">Verified Crew &rarr;</p>
            </Link>

            <Link to="/customers" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-all no-underline block">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Customers</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{totalCustomersCount}</h3>
                </div>
              </div>
              <p className="text-[11px] text-purple-600 font-semibold">Client Base &rarr;</p>
            </Link>

            <Link to="/bookings" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-all no-underline block">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Bookings</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{totalBookingsCount}</h3>
                </div>
              </div>
              <p className="text-[11px] text-orange-600 font-semibold">Consignments &rarr;</p>
            </Link>

            <Link to="/routes" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-all no-underline block">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-route"></i>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Routes</p>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{activeRoutesCount}</h3>
                </div>
              </div>
              <p className="text-[11px] text-cyan-600 font-semibold">Active Paths &rarr;</p>
            </Link>

            <Link to="/payments" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-all no-underline block">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Revenue</p>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">&#8377;{totalRevenue.toLocaleString()}</h3>
                </div>
              </div>
              <p className="text-[11px] text-pink-600 font-semibold">Financials &rarr;</p>
            </Link>
          </div>

          {/* Middle Row: Recent Bookings & Route Corridors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Recent Bookings List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-blue-600"></i> Recent Consignments
                </h4>
                <Link to="/bookings" className="text-blue-600 text-xs font-bold hover:underline no-underline">
                  Manage All Bookings &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <i className="fa-solid fa-box"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{b.bookingNumber || `BK-${b.id}`} &bull; {b.customerName}</p>
                        <p className="text-[11px] text-slate-500">{b.pickupLocation} &rarr; {b.deliveryLocation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                        b.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        b.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        b.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {b.status}
                      </span>
                      <p className="text-[11px] font-black text-slate-800 mt-0.5">&#8377;{b.freightAmount}</p>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No bookings created yet.</p>
                )}
              </div>
            </div>

            {/* Active Corridors */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <i className="fa-solid fa-route text-blue-600"></i> Configured Corridors
                </h4>
                <Link to="/routes" className="text-blue-600 text-xs font-bold hover:underline no-underline">
                  Manage Routes &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {routes.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded mr-2">{r.routeCode}</span>
                      <span className="font-bold text-slate-800 text-xs">{r.routeName}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{r.source} &rarr; {r.destination}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{r.distanceKm} km</span>
                      <p className="text-[10px] text-slate-400">{r.stops?.length || 0} stops</p>
                    </div>
                  </div>
                ))}
                {routes.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No routes registered yet.</p>
                )}
              </div>
            </div>
          </div>
          
          <footer className="mt-8 py-6 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[11px] font-medium">
            <p>&copy; 2026 TruckMan Transportation Management System. All rights reserved.</p>
            <p>Full-Stack Spring Boot &amp; React Enterprise Architecture</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
