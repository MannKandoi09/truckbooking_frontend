import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings } from '../services/bookingService';
import { getActiveRoutes } from '../services/routeService';

const UserDashboard = () => {
  const firstName = localStorage.getItem('firstName') || 'Customer';
  const [userBookings, setUserBookings] = useState([]);
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([
        getAllBookings().catch(() => ({ data: { data: [] } })),
        getActiveRoutes().catch(() => ({ data: { data: [] } }))
      ]);
      const allB = bRes.data?.data || bRes.data || [];
      const allR = rRes.data?.data || rRes.data || [];
      setUserBookings(Array.isArray(allB) ? allB : []);
      setActiveRoutes(Array.isArray(allR) ? allR : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeShipments = userBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_TRANSIT');
  const deliveredShipments = userBookings.filter(b => b.status === 'DELIVERED');
  const pendingShipments = userBookings.filter(b => b.status === 'PENDING');

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Customer Portal</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Welcome, {firstName}!</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {firstName.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] rounded-2xl p-6 text-white mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">TruckMan Freight Service</span>
              <h2 className="text-2xl font-black mt-1">Book Commercial Trucks on Verified Corridors</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">Reliable logistics, verified drivers, transparent pricing, and real-time transit visibility.</p>
            </div>
            <Link 
              to="/book-truck" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0 no-underline inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-truck-moving"></i> Book a Truck Now
            </Link>
          </div>

          {/* KPI Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Shipments</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">{activeShipments.length}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Confirmation</span>
                <div className="text-2xl font-black text-amber-600 mt-0.5">{pendingShipments.length}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered Trips</span>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{deliveredShipments.length}</div>
              </div>
            </div>
          </section>

          {/* Active Shipments Table */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base">Recent Shipments &amp; Consignments</h3>
              <Link to="/my-bookings" className="text-xs font-bold text-blue-600 hover:text-blue-800 no-underline">
                View All &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Ref Number</th>
                    <th className="py-4 px-4">Origin &rarr; Destination</th>
                    <th className="py-4 px-4">Assigned Vehicle</th>
                    <th className="py-4 px-4">Cargo Weight</th>
                    <th className="py-4 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">Loading your shipments...</td>
                    </tr>
                  ) : userBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-slate-400">
                        <p className="font-semibold text-sm text-slate-600">No active bookings yet</p>
                        <Link to="/book-truck" className="text-xs text-blue-600 font-bold mt-1 inline-block">Book your first shipment &rarr;</Link>
                      </td>
                    </tr>
                  ) : (
                    userBookings.slice(0, 5).map(b => (
                      <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900">{b.bookingNumber || `BK-${b.id}`}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-800">{b.pickupLocation}</span>
                          <i className="fa-solid fa-arrow-right text-[10px] text-slate-400 mx-1.5"></i>
                          <span className="font-semibold text-slate-800">{b.deliveryLocation}</span>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-600">{b.truckNumber || 'Pending Assignment'}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{b.cargoWeight} Tons</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            b.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            b.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            b.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Popular Corridors */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
              <i className="fa-solid fa-map-location-dot text-blue-600"></i> Active Transportation Corridors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeRoutes.slice(0, 3).map(r => (
                <div key={r.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">{r.routeCode}</span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1.5">{r.routeName}</h4>
                    <p className="text-xs text-slate-500 mt-1">{r.source} &rarr; {r.destination}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>{r.distanceKm} km</span>
                    <Link to="/book-truck" className="text-blue-600 hover:text-blue-800 no-underline">Book Route &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
