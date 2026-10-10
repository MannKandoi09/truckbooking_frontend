import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllBookings, createBooking, updateBooking, changeBookingStatus, cancelBooking } from '../services/bookingService';
import { getAllCustomers } from '../services/customerService';
import { getAllTrucks } from '../services/truckService'; 
import { getAllDrivers } from '../services/driverService'; 
import { getActiveRoutes } from '../services/routeService'; // 🚀 Naya Route Service Import

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]); // 🚀 Routes ki state
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE'); 
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [routeFilter, setRouteFilter] = useState('All Routes'); // 🚀 Naya Route Filter

  const [formData, setFormData] = useState({
    customerId: '',
    routeId: '', // 🚀 Naya Route ID Field
    pickupDate: '',
    cargoDescription: '',
    cargoWeight: '',
    truckId: '',
    driverId: '',
    freightAmount: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 🚀 Promise.all me getActiveRoutes() add kar diya
      const [bookingsRes, customersRes, trucksRes, driversRes, routesRes] = await Promise.all([
        getAllBookings().catch(() => ({ data: { data: [] } })),
        getAllCustomers().catch(() => ({ data: { data: [] } })),
        getAllTrucks().catch(() => ({ data: { data: [] } })),
        getAllDrivers().catch(() => ({ data: { data: [] } })),
        getActiveRoutes().catch(() => ({ data: { data: [] } }))
      ]);
      
      setBookings(bookingsRes.data?.data || bookingsRes.data || []);
      setCustomers(customersRes.data?.data || customersRes.data || []);
      setTrucks(trucksRes.data?.data || trucksRes.data || []);
      setDrivers(driversRes.data?.data || driversRes.data || []);
      setRoutes(routesRes.data?.data || routesRes.data || []);
      
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenModal = (mode, booking = null) => {
    setModalMode(mode);
    if (booking) {
      setSelectedBookingId(booking.id);
      setFormData({
        customerId: booking.customerId || '',
        routeId: booking.routeId || '', // 🚀 Populate routeId for Edit/View
        pickupDate: booking.pickupDate || booking.bookingDate || '',
        cargoDescription: booking.cargoDescription || '',
        cargoWeight: booking.cargoWeight || '',
        truckId: booking.truckId || '',
        driverId: booking.driverId || '',
        freightAmount: booking.freightAmount || ''
      });
    } else {
      setSelectedBookingId(null);
      setFormData({
        customerId: '', routeId: '', pickupDate: '', cargoDescription: '', cargoWeight: '', truckId: '', driverId: '', freightAmount: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveBooking = async () => {
      // Validation check
      if(!formData.customerId || !formData.routeId || !formData.pickupDate || !formData.cargoWeight || !formData.truckId || !formData.driverId || !formData.freightAmount){
          alert("Please fill all required fields.");
          return;
      }
      if(formData.cargoWeight <= 0 || formData.freightAmount <= 0) {
          alert("Cargo weight and Freight amount must be positive.");
          return;
      }

      // 🚀 IDs aur Amounts ko Number me convert kiya hai
      const payload = {
        ...formData,
        customerId: Number(formData.customerId),
        routeId: Number(formData.routeId), // 🚀 Route ID Number me bheja
        truckId: Number(formData.truckId),
        driverId: Number(formData.driverId),
        cargoWeight: Number(formData.cargoWeight),
        freightAmount: Number(formData.freightAmount)
      };

    try {
        let response;
        if(modalMode === 'CREATE') {
            response = await createBooking(payload); 
        } else if (modalMode === 'EDIT') {
            response = await updateBooking(selectedBookingId, payload); 
        }

        if (response && response.data && response.data.success === false) {
            alert("Backend Rule Failed: " + response.data.message);
            return;
        }

        alert(modalMode === 'CREATE' ? "Booking created successfully!" : "Booking updated successfully!");
        fetchInitialData();
        handleCloseModal();
    } catch(error) {
         console.error("Error saving booking:", error);
         const actualError = error.response?.data?.message || error.response?.data?.error || error.message;
         alert("API Error: " + actualError);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        const response = await changeBookingStatus(id, newStatus);
        if (response && response.data && response.data.success === false) {
            alert("Backend Rule Failed: " + response.data.message);
            return;
        }
        alert(`Status changed to ${newStatus}`);
        fetchInitialData();
    } catch(error) {
        console.error("Failed to change status", error);
        alert("API Error");
    }
  };

  const handleCancelBooking = async (id) => {
      if(window.confirm("Are you sure you want to cancel this booking?")) {
        try {
            const response = await cancelBooking(id);
            if (response && response.data && response.data.success === false) {
                alert("Backend Rule Failed: " + response.data.message);
                return;
            }
            alert("Booking Cancelled successfully!");
            fetchInitialData();
        } catch(error){
            console.error("Failed to cancel booking", error);
            alert("API Error");
        }
      }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
                          (booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (booking.truckNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (booking.driverName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (booking.routeCode?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Status' || (booking.status && booking.status.toUpperCase() === statusFilter.toUpperCase());
    const matchesCustomer = customerFilter === 'All Customers' || booking.customerName === customerFilter;
    const matchesRoute = routeFilter === 'All Routes' || booking.routeCode === routeFilter;

    return matchesSearch && matchesStatus && matchesCustomer && matchesRoute;
  });

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const inTransitBookings = bookings.filter(b => b.status === 'IN_TRANSIT').length;
  const deliveredBookings = bookings.filter(b => b.status === 'DELIVERED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

  const isViewMode = modalMode === 'VIEW';

  // Find selected route to show details dynamically
  const selectedRouteInfo = routes.find(r => r.id === Number(formData.routeId));

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700"><i className="fa-solid fa-bars text-lg"></i></button>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Admin User</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-wider">ADMIN</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6" data-purpose="booking-management-page">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 leading-tight">Booking Management</h2>
                <p className="text-xs text-slate-500 font-medium">Create, view and manage all transport bookings with route details.</p>
              </div>
            </div>
            <button 
                onClick={() => handleOpenModal('CREATE')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Create New Booking</span>
            </button>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Total Bookings</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalBookings}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Pending</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{pendingBookings}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Confirmed</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{confirmedBookings}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
               <span className="text-xs font-medium text-slate-500">In Transit</span>
               <div className="text-2xl font-extrabold text-slate-900 mt-1">{inTransitBookings}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
               <span className="text-xs font-medium text-slate-500">Delivered</span>
               <div className="text-2xl font-extrabold text-slate-900 mt-1">{deliveredBookings}</div>
            </div>
             <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
               <span className="text-xs font-medium text-slate-500">Cancelled</span>
               <div className="text-2xl font-extrabold text-slate-900 mt-1">{cancelledBookings}</div>
            </div>
          </section>

          <section className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Search</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Search booking, customer, truck, driver..." 
                />
              </div>
            </div>
            <div className="w-36">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Status">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
             <div className="w-44">
               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Customer</label>
                <select 
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All Customers">All Customers</option>
                    {customers.map(c => <option key={c.id} value={c.fullName}>{c.fullName}</option>)}
                </select>
            </div>
            {/* 🚀 Naya Route Filter Add Kiya Hai */}
            <div className="w-44">
               <label className="block text-xs font-semibold text-slate-600 mb-1.5">Route</label>
                <select 
                    value={routeFilter}
                    onChange={(e) => setRouteFilter(e.target.value)}
                    className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All Routes">All Routes</option>
                    {[...new Set(routes.map(r => r.routeCode))].map(code => <option key={code} value={code}>{code}</option>)}
                </select>
            </div>
            <div className="flex gap-2">
              <button 
                 onClick={() => {setSearchTerm(''); setStatusFilter('All Status'); setCustomerFilter('All Customers'); setRouteFilter('All Routes');}}
                 className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate-right"></i> Reset
              </button>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Bookings List</h3>
                <span className="text-xs text-slate-400 font-medium">Showing {filteredBookings.length} bookings</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#f8fafc] text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-4">Booking Number</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Truck</th>
                    <th className="py-3 px-4">Driver</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Booking Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.length === 0 ? (
                        <tr><td colSpan="9" className="text-center py-6 text-slate-500">
                          {loading ? "Loading bookings..." : "No bookings found."}
                        </td></tr>
                    ) : (
                        [...filteredBookings].sort((a, b) => b.id - a.id).map(booking => (
                             <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-4 px-6 font-semibold text-slate-500">{booking.id}</td>
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{booking.bookingNumber}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-semibold text-slate-800">{booking.customerName}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-semibold text-slate-700">{booking.truckNumber}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-semibold text-slate-700">{booking.driverName}</div>
                                </td>
                                {/* 🚀 Update Route Display Column */}
                                <td className="py-4 px-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-blue-600 text-[11px]">{booking.routeCode || 'Custom Route'}</span>
                                    <span className="font-semibold text-slate-800">{booking.source || booking.pickupLocation} → {booking.destination || booking.deliveryLocation}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{booking.distance ? `${booking.distance} km` : ''} {booking.stops ? `• ${booking.stops} stops` : ''}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className={`px-2 py-1 border rounded-full text-[10px] font-bold ${
                                        booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                        booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                        booking.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        booking.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-200' :
                                        'bg-rose-50 text-rose-600 border-rose-200'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center font-medium text-slate-600">{new Date(booking.bookingDate || booking.pickupDate).toLocaleDateString()}</td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center items-center gap-1.5">
                                        <button onClick={() => handleOpenModal('VIEW', booking)} title="View" className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500"><i className="fa-regular fa-eye"></i></button>
                                        
                                        {booking.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleOpenModal('EDIT', booking)} title="Edit" className="w-7 h-7 flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"><i className="fa-solid fa-pencil"></i></button>
                                            </>
                                        )}
                                        {/* Status Update Dropdown/Menu can go here as per the dots icon in image */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
              </table>
            </div>
          </section>

           {/* Form Modal */}
           {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity" onClick={handleCloseModal}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
                    <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-extrabold text-xl text-slate-800">
                            {modalMode === 'CREATE' ? 'Create New Booking' : modalMode === 'EDIT' ? 'Edit Booking' : 'View Booking Details'}
                        </h3>
                        <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>
                    
                    <div className="p-8 max-h-[70vh] overflow-y-auto">
                        
                        {/* 🚀 Dynamic Route Display Box */}
                        {selectedRouteInfo && (
                           <div className="mb-6 bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                               <div>
                                   <p className="text-xs font-bold text-blue-600 mb-1">SELECTED ROUTE ({selectedRouteInfo.routeCode})</p>
                                   <p className="font-semibold text-slate-800">{selectedRouteInfo.source} <i className="fa-solid fa-arrow-right-long text-slate-400 mx-1"></i> {selectedRouteInfo.destination}</p>
                               </div>
                               <div className="flex gap-4">
                                   <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center shadow-sm">
                                       <p className="text-[10px] text-slate-500 font-bold">DISTANCE</p>
                                       <p className="font-bold text-slate-800">{selectedRouteInfo.distance} km</p>
                                   </div>
                                   <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center shadow-sm">
                                       <p className="text-[10px] text-slate-500 font-bold">STOPS</p>
                                       <p className="font-bold text-slate-800">{selectedRouteInfo.stopsCount || selectedRouteInfo.stops || 0}</p>
                                   </div>
                               </div>
                           </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Customer <span className="text-red-500">*</span></label>
                                <select name="customerId" value={formData.customerId} onChange={handleInputChange} disabled={isViewMode} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                                    <option value="">Select Customer</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                                </select>
                            </div>

                             {/* 🚀 New Route Dropdown */}
                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Select Route <span className="text-red-500">*</span></label>
                                <select name="routeId" value={formData.routeId} onChange={handleInputChange} disabled={isViewMode} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                                    <option value="">Select Route</option>
                                     {routes.map(r => <option key={r.id} value={r.id}>{r.routeName || `${r.source} to ${r.destination}`} ({r.routeCode})</option>)}
                                </select>
                            </div>

                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Truck <span className="text-red-500">*</span></label>
                                <select name="truckId" value={formData.truckId} onChange={handleInputChange} disabled={isViewMode} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                                    <option value="">Select Truck</option>
                                     {trucks.map(t => <option key={t.id} value={t.id}>{t.truckNumber}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Driver <span className="text-red-500">*</span></label>
                                <select name="driverId" value={formData.driverId} onChange={handleInputChange} disabled={isViewMode} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                                    <option value="">Select Driver</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Pickup Date <span className="text-red-500">*</span></label>
                                <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleInputChange} disabled={isViewMode} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed"/>
                            </div>
                            <div>
                                 <label className="block text-xs font-bold text-slate-700 mb-2">Cargo Weight (Tons) <span className="text-red-500">*</span></label>
                                 <input type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleInputChange} disabled={isViewMode} placeholder="e.g. 5" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed"/>
                            </div>
                             <div>
                                 <label className="block text-xs font-bold text-slate-700 mb-2">Freight Amount (₹) <span className="text-red-500">*</span></label>
                                 <input type="number" name="freightAmount" value={formData.freightAmount} onChange={handleInputChange} disabled={isViewMode} placeholder="e.g. 15000" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed"/>
                            </div>
                             <div className="md:col-span-2">
                                 <label className="block text-xs font-bold text-slate-700 mb-2">Cargo Description</label>
                                 <input type="text" name="cargoDescription" value={formData.cargoDescription} onChange={handleInputChange} disabled={isViewMode} placeholder="e.g. Electronics, Furniture..." className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed"/>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                         <button onClick={handleCloseModal} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100">
                            {isViewMode ? 'Close' : 'Cancel'}
                         </button>
                         {!isViewMode && (
                             <button onClick={handleSaveBooking} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30">
                                 Save Booking
                             </button>
                         )}
                    </div>
                </div>
            </div>
           )}

        </main>
      </div>
    </div>
  );
};

export default BookingManagement;