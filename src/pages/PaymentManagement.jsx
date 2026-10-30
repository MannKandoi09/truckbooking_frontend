import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings } from '../services/bookingService';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      const bookingsData = res.data?.data || res.data || [];
      
      // Map bookings into payment records
      const paymentList = (Array.isArray(bookingsData) ? bookingsData : []).map(b => ({
        id: b.id,
        transactionId: `TXN-${100000 + b.id}`,
        bookingNumber: b.bookingNumber || `BK-${b.id}`,
        customerName: b.customerName || 'General Freight Customer',
        amount: b.freightAmount || 12000,
        paymentMethod: b.id % 2 === 0 ? 'Bank Transfer (NEFT)' : 'UPI / NetBanking',
        status: b.status === 'DELIVERED' ? 'PAID' : b.status === 'CANCELLED' ? 'REFUNDED' : 'PENDING',
        date: b.bookingDate || b.pickupDate || '2026-10-25'
      }));

      setPayments(paymentList);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    const matchesSearch = !searchTerm || 
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + Number(p.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + Number(p.amount), 0);
  const totalTransactions = payments.length;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Payment &amp; Financial Ledger</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-blue-100">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Payment Management</h2>
                <p className="text-xs text-slate-500 font-medium">Monitor freight billing, transactions, receivables, and payment clearances.</p>
              </div>
            </div>
          </section>

          {/* KPI Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settled Revenue</span>
                <div className="text-2xl font-black text-emerald-600 leading-tight mt-0.5">&#8377;{totalRevenue.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Receivables</span>
                <div className="text-2xl font-black text-amber-600 leading-tight mt-0.5">&#8377;{pendingAmount.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Invoices</span>
                <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{totalTransactions}</div>
              </div>
            </div>
          </section>

          {/* Filters Bar */}
          <section className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-3 items-end mb-6 shadow-sm">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Invoices</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Transaction ID, booking number, customer..." 
                />
              </div>
            </div>

            <div className="w-44">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="w-full bg-white px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid / Settled</option>
                <option value="PENDING">Pending Payment</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate-right"></i> Reset
            </button>
          </section>

          {/* Payments Table */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base">Transactions &amp; Invoices</h3>
              <span className="text-xs text-slate-500 font-semibold bg-white px-3 py-1 rounded-full border border-slate-200">
                {filtered.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Txn ID</th>
                    <th className="py-4 px-4">Booking Ref</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Method</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-500">
                        <i className="fa-solid fa-circle-notch fa-spin text-blue-600 text-xl mb-2"></i>
                        <p>Loading payment records...</p>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        <p className="font-semibold text-sm text-slate-600">No payment records found.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-blue-600">{item.transactionId}</td>
                        <td className="py-4 px-4 font-semibold text-slate-800">{item.bookingNumber}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{item.customerName}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">&#8377;{Number(item.amount).toLocaleString()}</td>
                        <td className="py-4 px-4 font-medium text-slate-600">{item.paymentMethod}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            item.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            item.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-500 font-medium">{item.date}</td>
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

export default PaymentManagement;
