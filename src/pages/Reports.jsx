import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings } from '../services/bookingService';
import { getAllTrucks } from '../services/truckService';
import { getAllRoutes } from '../services/routeService';

const Reports = () => {
  const [bookings, setBookings] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [bRes, tRes, rRes] = await Promise.all([
        getAllBookings().catch(() => ({ data: { data: [] } })),
        getAllTrucks().catch(() => ({ data: { data: [] } })),
        getAllRoutes().catch(() => ({ data: { data: [] } }))
      ]);
      setBookings(bRes.data?.data || bRes.data || []);
      setTrucks(tRes.data?.data || tRes.data || []);
      setRoutes(rRes.data?.data || rRes.data || []);
    } catch (err) {
      console.error("Error loading reports", err);
    }
  };

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.freightAmount) || 0), 0);
  const totalWeightTons = bookings.reduce((sum, b) => sum + (Number(b.cargoWeight) || 0), 0);
  const completedTrips = bookings.filter(b => b.status === 'DELIVERED').length;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Business Intelligence &amp; Analytics</h1>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-blue-100">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Operational Reports</h2>
                <p className="text-xs text-slate-500 font-medium">Aggregated performance indicators for fleet, bookings, revenue, and active transport corridors.</p>
              </div>
            </div>
          </section>

          {/* Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Freight Revenue</span>
              <div className="text-2xl font-black text-slate-900 mt-1">&#8377;{totalRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1"><i className="fa-solid fa-arrow-trend-up"></i> Generated across {totalBookings} consignments</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cargo Hauled</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{totalWeightTons.toFixed(1)} Tons</div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">Industrial &amp; commercial tonnage</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Size</span>
              <div className="text-2xl font-black text-purple-600 mt-1">{trucks.length} Trucks</div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">Active transportation fleet</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Successful Deliveries</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{completedTrips} Trips</div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">Concluded without incident</p>
            </div>
          </section>

          {/* Route Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
                <i className="fa-solid fa-road text-blue-600"></i> Top Corridors &amp; Routes
              </h3>
              <div className="space-y-3">
                {routes.slice(0, 5).map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded mr-2">{r.routeCode}</span>
                      <span className="font-semibold text-slate-800 text-sm">{r.routeName}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{r.source} &rarr; {r.destination}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-800 text-sm">{r.distanceKm} km</span>
                      <p className="text-[10px] text-slate-400">{r.stops?.length || 0} checkpoints</p>
                    </div>
                  </div>
                ))}
                {routes.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No routes registered yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
                <i className="fa-solid fa-truck-front text-blue-600"></i> Fleet Distribution Breakdown
              </h3>
              <div className="space-y-3">
                {trucks.slice(0, 5).map((t) => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        <i className="fa-solid fa-truck"></i>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{t.truckNumber}</p>
                        <p className="text-xs text-slate-500">{t.truckType} &bull; {t.capacity} Tons capacity</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {t.status || 'ACTIVE'}
                    </span>
                  </div>
                ))}
                {trucks.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No trucks registered yet.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
