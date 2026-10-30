import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings } from '../services/bookingService';

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      const all = res.data?.data || res.data || [];
      // Focus on delivered or completed records
      setHistory(Array.isArray(all) ? all : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Trip Archive &amp; History</h1>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            <i className="fa-solid fa-clock-rotate-left text-xs"></i>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Past Consignments</h2>
            <p className="text-xs text-slate-500 font-medium">Historical audit of delivered and completed freight shipments.</p>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base">Historical Logs</h3>
              <span className="text-xs text-slate-500 font-semibold">{history.length} Shipments</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Booking Ref</th>
                    <th className="py-4 px-4">Pickup Date</th>
                    <th className="py-4 px-4">Origin &rarr; Destination</th>
                    <th className="py-4 px-4">Assigned Vehicle</th>
                    <th className="py-4 px-4">Cargo</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-8 text-slate-400">Loading history...</td></tr>
                  ) : history.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-10 text-slate-400">No past consignments recorded yet.</td></tr>
                  ) : (
                    history.map(b => (
                      <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900">{b.bookingNumber || `BK-${b.id}`}</td>
                        <td className="py-4 px-4 font-medium text-slate-600">{b.pickupDate || b.bookingDate}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-800">{b.pickupLocation}</span>
                          <i className="fa-solid fa-arrow-right text-[10px] text-slate-400 mx-1.5"></i>
                          <span className="font-semibold text-slate-800">{b.deliveryLocation}</span>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-600">{b.truckNumber || 'N/A'}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{b.cargoWeight}T ({b.cargoDescription})</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            b.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                            b.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button 
                            onClick={() => setSelectedReceipt(b)} 
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors"
                          >
                            <i className="fa-solid fa-receipt mr-1"></i> View Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Receipt Modal */}
          {selectedReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setSelectedReceipt(null)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-truck-fast text-blue-600 text-lg"></i>
                    <h3 className="font-black text-slate-800 text-base">Consignment Waybill Receipt</h3>
                  </div>
                  <button onClick={() => setSelectedReceipt(null)} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Waybill / Booking #</span>
                    <span className="font-extrabold text-slate-900">{selectedReceipt.bookingNumber || `BK-${selectedReceipt.id}`}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Customer</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.customerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Origin</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Destination</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.deliveryLocation}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Carrier Vehicle</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.truckNumber || 'Standard Fleet Truck'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Cargo Details</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.cargoDescription} ({selectedReceipt.cargoWeight} Tons)</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-slate-200 text-sm">
                    <span className="font-extrabold text-slate-800">Total Freight Amount</span>
                    <span className="font-black text-blue-600">&#8377;{selectedReceipt.freightAmount}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5">
                    <i className="fa-solid fa-print"></i> Print
                  </button>
                  <button onClick={() => setSelectedReceipt(null)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookingHistory;
