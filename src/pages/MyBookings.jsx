import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings } from '../services/bookingService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      const all = res.data?.data || res.data || [];
      setBookings(Array.isArray(all) ? all : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'PENDING': return 1;
      case 'CONFIRMED': return 2;
      case 'IN_TRANSIT': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">My Shipments &amp; Consignments</h1>
          <Link to="/book-truck" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs no-underline flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-plus"></i> New Booking
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Shipment Tracking</h2>
            <p className="text-xs text-slate-500 font-medium">Live status tracking for active and recent freight consignments.</p>
          </section>

          {loading ? (
            <div className="text-center py-16 text-slate-400">
              <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
              <p className="text-sm">Retrieving your shipments...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <i className="fa-solid fa-truck-ramp-box text-4xl text-slate-300 mb-3"></i>
              <h3 className="font-bold text-slate-800 text-base">No Active Bookings</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">You have not booked any shipments yet.</p>
              <Link to="/book-truck" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs no-underline shadow-md">
                Book a Truck Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => {
                const step = getStatusStep(b.status);
                return (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    {/* Header bar of shipment */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {b.bookingNumber || `BK-${b.id}`}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm ml-3">
                          {b.cargoDescription} ({b.cargoWeight} Tons)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          b.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          b.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          b.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-xs font-bold text-slate-700">&#8377;{b.freightAmount}</span>
                      </div>
                    </div>

                    {/* Corridor & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-slate-100 text-xs">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Pickup</p>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">{b.pickupLocation}</p>
                        <p className="text-slate-500 text-[11px]">Date: {b.pickupDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">{b.deliveryLocation}</p>
                        <p className="text-slate-500 text-[11px]">{b.routeCode ? `Corridor: ${b.routeCode}` : 'Custom Route'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Carrier</p>
                        <p className="font-bold text-slate-800 text-sm mt-0.5">{b.truckNumber || 'Assigning Vehicle...'}</p>
                        <p className="text-slate-500 text-[11px]">{b.driverName ? `Driver: ${b.driverName}` : 'Assigning Driver...'}</p>
                      </div>
                    </div>

                    {/* Step Tracker */}
                    {b.status !== 'CANCELLED' && (
                      <div className="pt-4">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
                          <span className={step >= 1 ? 'text-blue-600' : ''}>1. Request Pending</span>
                          <span className={step >= 2 ? 'text-blue-600' : ''}>2. Vehicle Assigned</span>
                          <span className={step >= 3 ? 'text-blue-600' : ''}>3. In Transit</span>
                          <span className={step >= 4 ? 'text-emerald-600' : ''}>4. Delivered</span>
                        </div>
                        <div className="relative mt-2">
                          <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                          <div 
                            className="h-2 bg-blue-600 rounded-full absolute top-0 transition-all duration-500" 
                            style={{ width: `${(step / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyBookings;
