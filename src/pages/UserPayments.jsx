import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings } from '../services/bookingService';

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      const all = res.data?.data || res.data || [];
      const mapped = (Array.isArray(all) ? all : []).map(b => ({
        id: b.id,
        invoiceNumber: `INV-${202600 + b.id}`,
        bookingNumber: b.bookingNumber || `BK-${b.id}`,
        route: `${b.pickupLocation} → ${b.deliveryLocation}`,
        amount: b.freightAmount || 11500,
        status: b.status === 'DELIVERED' ? 'PAID' : 'PENDING',
        date: b.pickupDate || b.bookingDate || '2026-10-25'
      }));
      setPayments(mapped);
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
          <h1 className="text-lg font-bold text-slate-800">Invoices &amp; Freight Billing</h1>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            <i className="fa-solid fa-credit-card text-xs"></i>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Billing &amp; Payment History</h2>
            <p className="text-xs text-slate-500 font-medium">Review invoices and payment statuses for your transported consignments.</p>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base">Invoices</h3>
              <span className="text-xs text-slate-500 font-semibold">{payments.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Invoice #</th>
                    <th className="py-4 px-4">Booking Ref</th>
                    <th className="py-4 px-4">Route Corridors</th>
                    <th className="py-4 px-4">Freight Charges</th>
                    <th className="py-4 px-4 text-center">Payment Status</th>
                    <th className="py-4 px-4 text-center">Invoice Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-8 text-slate-400">Loading billing records...</td></tr>
                  ) : payments.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-400">No invoices generated yet.</td></tr>
                  ) : (
                    payments.map(p => (
                      <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-blue-600">{p.invoiceNumber}</td>
                        <td className="py-4 px-4 font-semibold text-slate-800">{p.bookingNumber}</td>
                        <td className="py-4 px-4 font-medium text-slate-700">{p.route}</td>
                        <td className="py-4 px-4 font-black text-slate-900">&#8377;{Number(p.amount).toLocaleString()}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            p.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-500 font-medium">{p.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserPayments;
