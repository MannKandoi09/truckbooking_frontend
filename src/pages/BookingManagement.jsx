import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  getAllBookings, 
  createBooking, 
  updateBooking, 
  changeBookingStatus, 
  cancelBooking 
} from '../services/bookingService';
import { getAllCustomers } from '../services/customerService';
import { getAllTrucks } from '../services/truckService'; 
import { getAllDrivers } from '../services/driverService'; 
import { getActiveRoutes } from '../services/routeService';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE'); // 'CREATE', 'EDIT', or 'VIEW'
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [routeFilter, setRouteFilter] = useState('All Routes');

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    truckId: '',
    driverId: '',
    routeId: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    cargoDescription: '',
    cargoWeight: '',
    freightAmount: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, customersRes, trucksRes, driversRes, routesRes] = await Promise.all([
        getAllBookings().catch(() => ({ data: { data: [] } })),
        getAllCustomers().catch(() => ({ data: { data: [] } })),
        getAllTrucks().catch(() => ({ data: { data: [] } })),
        getAllDrivers().catch(() => ({ data: { data: [] } })),
        getActiveRoutes().catch(() => ({ data: { data: [] } }))
      ]);

      const bData = bookingsRes.data?.data || bookingsRes.data || [];
      const cData = customersRes.data?.data || customersRes.data || [];
      const tData = trucksRes.data?.data || trucksRes.data || [];
      const dData = driversRes.data?.data || driversRes.data || [];
      const rData = routesRes.data?.data || routesRes.data || [];

      setBookings(Array.isArray(bData) ? bData : []);
      setCustomers(Array.isArray(cData) ? cData : []);
      setTrucks(Array.isArray(tData) ? tData : []);
      setDrivers(Array.isArray(dData) ? dData : []);
      setActiveRoutes(Array.isArray(rData) ? rData : []);
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // When admin selects a route from dropdown, auto-prefill pickup and delivery location
  const handleRouteChange = (e) => {
    const selectedId = e.target.value;
    const selectedRoute = activeRoutes.find(r => r.id === Number(selectedId));

    setFormData(prev => ({
      ...prev,
      routeId: selectedId,
      pickupLocation: selectedRoute ? selectedRoute.source : prev.pickupLocation,
      deliveryLocation: selectedRoute ? selectedRoute.destination : prev.deliveryLocation
    }));
  };

  const handleOpenModal = (mode, booking = null) => {
    setModalMode(mode);
    setSelectedBooking(booking);

    if (booking) {
      setFormData({
        customerId: booking.customerId || '',
        truckId: booking.truckId || '',
        driverId: booking.driverId || '',
        routeId: booking.routeId || '',
        pickupLocation: booking.pickupLocation || '',
        deliveryLocation: booking.deliveryLocation || '',
        pickupDate: booking.pickupDate || booking.bookingDate || '',
        cargoDescription: booking.cargoDescription || '',
        cargoWeight: booking.cargoWeight || '',
        freightAmount: booking.freightAmount || ''
      });
    } else {
      setFormData({
        customerId: '',
        truckId: '',
        driverId: '',
        routeId: '',
        pickupLocation: '',
        deliveryLocation: '',
        pickupDate: '',
        cargoDescription: '',
        cargoWeight: '',
        freightAmount: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSaveBooking = async () => {
    // Validations
    if (!formData.customerId || !formData.pickupDate || !formData.cargoDescription.trim() || 
        !formData.cargoWeight || !formData.freightAmount || 
        !formData.pickupLocation.trim() || !formData.deliveryLocation.trim()) {
      alert("Please fill all required fields, including Customer, Pickup/Delivery Locations, Date, Cargo, and Freight.");
      return;
    }

    if (Number(formData.cargoWeight) <= 0 || Number(formData.freightAmount) <= 0) {
      alert("Cargo weight and Freight amount must be positive numbers.");
      return;
    }

    if (formData.pickupLocation.trim().toLowerCase() === formData.deliveryLocation.trim().toLowerCase()) {
      alert("Pickup location and Delivery location must be different.");
      return;
    }

    const payload = {
      customerId: Number(formData.customerId),
      truckId: formData.truckId ? Number(formData.truckId) : null,
      driverId: formData.driverId ? Number(formData.driverId) : null,
      routeId: formData.routeId ? Number(formData.routeId) : null,
      pickupLocation: formData.pickupLocation.trim(),
      deliveryLocation: formData.deliveryLocation.trim(),
      pickupDate: formData.pickupDate,
      cargoDescription: formData.cargoDescription.trim(),
      cargoWeight: Number(formData.cargoWeight),
      freightAmount: Number(formData.freightAmount)
    };

    try {
      let response;
      if (modalMode === 'CREATE') {
        response = await createBooking(payload);
      } else if (modalMode === 'EDIT') {
        response = await updateBooking(selectedBooking.id, payload);
      }

      if (response && response.data && response.data.success === false) {
        alert("Backend Rule Failed: " + response.data.message);
        return;
      }

      alert(modalMode === 'CREATE' ? "Booking created successfully!" : "Booking updated successfully!");
      fetchInitialData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving booking:", error);
      const actualError = error.response?.data?.message || error.response?.data?.error || error.message;
      alert("API Error: " + actualError);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to transition this booking to ${newStatus}?`)) return;

    try {
      const response = await changeBookingStatus(id, newStatus);
      if (response && response.data && response.data.success === false) {
        alert("Operation Failed: " + response.data.message);
        return;
      }
      alert(`Booking status changed to ${newStatus}`);
      fetchInitialData();
    } catch (error) {
      console.error("Failed to change status", error);
      const err = error.response?.data?.message || "Failed to update booking status.";
      alert("Error: " + err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This will release any assigned truck.")) return;

    try {
      const response = await cancelBooking(id);
      if (response && response.data && response.data.success === false) {
        alert("Cancellation Failed: " + response.data.message);
        return;
      }
      alert("Booking cancelled successfully!");
      fetchInitialData();
    } catch (error) {
      console.error("Failed to cancel booking", error);
      const err = error.response?.data?.message || "Failed to cancel booking.";
      alert("Error: " + err);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = !searchTerm ||
      (b.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.truckNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.driverName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.routeCode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.deliveryLocation?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All Status' || 
      (b.status && b.status.toUpperCase() === statusFilter.toUpperCase());
    const matchesCustomer = customerFilter === 'All Customers' || 
      b.customerName === customerFilter;
    const matchesRoute = routeFilter === 'All Routes' || 
      b.routeCode === routeFilter;

    return matchesSearch && matchesStatus && matchesCustomer && matchesRoute;
  });

  // KPI Calculations
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const inTransitBookings = bookings.filter(b => b.status === 'IN_TRANSIT').length;
  const deliveredBookings = bookings.filter(b => b.status === 'DELIVERED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

  // Selected route object in the modal form
  const selectedRouteObj = activeRoutes.find(r => r.id === Number(formData.routeId));

  // Helper for formatting duration
  const formatDurationDisplay = (seconds) => {
    if (!seconds) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800">Dispatch &amp; Booking Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-tight">Admin User</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Transportation Manager</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6" data-purpose="booking-management-page">
          
          {/* Header Title & Create Button */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-blue-100">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Booking Management</h2>
                <p className="text-xs text-slate-500 font-medium">Create freight bookings, assign available trucks/drivers, and monitor integrated route corridors.</p>
              </div>
            </div>
            <button 
              onClick={() => handleOpenModal('CREATE')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              <i className="fa-solid fa-plus"></i> Create New Booking
            </button>
          </section>

          {/* 6 Summary KPI Cards */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
              <div className="text-2xl font-black text-slate-800 mt-1">{totalBookings}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Pending</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{pendingBookings}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Confirmed</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{confirmedBookings}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">In Transit</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{inTransitBookings}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">Delivered</span>
              <div className="text-2xl font-black text-green-700 mt-1">{deliveredBookings}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Cancelled</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{cancelledBookings}</div>
            </div>
          </section>

          {/* Filters Bar */}
          <section className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-end gap-3 mb-6 shadow-sm">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Bookings</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Booking #, customer, truck, driver, route..." 
                />
              </div>
            </div>

            <div className="w-36">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer</label>
              <select 
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Customers">All Customers</option>
                {customers.map(c => <option key={c.id} value={c.fullName}>{c.fullName}</option>)}
              </select>
            </div>

            <div className="w-44">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Route Code</label>
              <select 
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Routes">All Routes</option>
                {[...new Set(activeRoutes.map(r => r.routeCode))].map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('All Status'); setCustomerFilter('All Customers'); setRouteFilter('All Routes'); }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate-right"></i> Reset
            </button>
          </section>

          {/* Bookings Table */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <i className="fa-solid fa-truck-ramp-box text-blue-600"></i> Active &amp; Historical Bookings
              </h3>
              <span className="text-xs text-slate-500 font-semibold bg-white px-3 py-1 rounded-full border border-slate-200">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-4 px-5">ID</th>
                    <th className="py-4 px-4">Booking Number</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Truck &amp; Driver</th>
                    <th className="py-4 px-4">Route Info</th>
                    <th className="py-4 px-4">Pickup &rarr; Delivery</th>
                    <th className="py-4 px-4 text-center">Date</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-10 text-slate-500">
                        <i className="fa-solid fa-circle-notch fa-spin text-blue-600 text-xl mb-2"></i>
                        <p className="font-medium">Loading bookings data...</p>
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-12 text-slate-400">
                        <i className="fa-solid fa-calendar-xmark text-3xl mb-2 opacity-40"></i>
                        <p className="font-semibold text-sm text-slate-600">No bookings found</p>
                        <p className="text-xs">Create a new booking or change active search filters.</p>
                      </td>
                    </tr>
                  ) : (
                    [...filteredBookings].sort((a, b) => b.id - a.id).map(booking => (
                      <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-500">#{booking.id}</td>
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            {booking.bookingNumber || `BK-${booking.id}`}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-800">{booking.customerName}</div>
                          <div className="text-[10px] text-slate-400">ID: #{booking.customerId}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <i className="fa-solid fa-truck text-[11px] text-blue-500"></i>
                            {booking.truckNumber || 'Not Assigned'}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <i className="fa-solid fa-user text-[9px] text-slate-400"></i>
                            {booking.driverName || 'No Driver'}
                          </div>
                        </td>

                        {/* Route Info Column */}
                        <td className="py-4 px-4">
                          {booking.routeCode ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] border border-blue-100 w-fit">
                                {booking.routeCode}
                              </span>
                              <span className="font-medium text-slate-700 text-xs mt-1">
                                {booking.routeName || 'Standard Route'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {booking.routeDistanceKm ? `${booking.routeDistanceKm} km` : ''} 
                                {booking.routeStops?.length ? ` • ${booking.routeStops.length} stops` : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Direct / Custom Route</span>
                          )}
                        </td>

                        {/* Pickup & Delivery Location */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 font-semibold text-slate-800 text-xs">
                            <span>{booking.pickupLocation}</span>
                            <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                            <span>{booking.deliveryLocation}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Cargo: {booking.cargoWeight}T ({booking.cargoDescription})
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-center font-medium text-slate-600">
                          {booking.pickupDate || booking.bookingDate || '-'}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            booking.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            booking.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {booking.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            {/* View Details */}
                            <button 
                              onClick={() => handleOpenModal('VIEW', booking)} 
                              title="View Booking Details & Route Stops" 
                              className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors shadow-sm"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </button>

                            {/* Edit (Pending only) */}
                            {booking.status === 'PENDING' && (
                              <button 
                                onClick={() => handleOpenModal('EDIT', booking)} 
                                title="Edit Booking" 
                                className="w-7 h-7 flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
                              >
                                <i className="fa-solid fa-pencil text-xs"></i>
                              </button>
                            )}

                            {/* Status Lifecycle Actions */}
                            {booking.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                                  title="Confirm Booking (Reserves Truck)"
                                  className="w-7 h-7 flex items-center justify-center border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors shadow-sm"
                                >
                                  <i className="fa-solid fa-check text-xs"></i>
                                </button>
                                <button 
                                  onClick={() => handleCancel(booking.id)}
                                  title="Cancel Booking"
                                  className="w-7 h-7 flex items-center justify-center border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shadow-sm"
                                >
                                  <i className="fa-solid fa-ban text-xs"></i>
                                </button>
                              </>
                            )}

                            {booking.status === 'CONFIRMED' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(booking.id, 'IN_TRANSIT')}
                                  title="Start Transit (Vehicle Departed)"
                                  className="w-7 h-7 flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
                                >
                                  <i className="fa-solid fa-truck-fast text-xs"></i>
                                </button>
                                <button 
                                  onClick={() => handleCancel(booking.id)}
                                  title="Cancel Booking"
                                  className="w-7 h-7 flex items-center justify-center border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shadow-sm"
                                >
                                  <i className="fa-solid fa-ban text-xs"></i>
                                </button>
                              </>
                            )}

                            {booking.status === 'IN_TRANSIT' && (
                              <button 
                                onClick={() => handleStatusChange(booking.id, 'DELIVERED')}
                                title="Mark as Delivered (Releases Truck)"
                                className="w-7 h-7 flex items-center justify-center border border-green-200 text-green-700 hover:bg-green-50 rounded-lg transition-colors shadow-sm"
                              >
                                <i className="fa-solid fa-box-open text-xs"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Create / Edit / View Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={handleCloseModal}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                      <i className={modalMode === 'VIEW' ? 'fa-regular fa-eye' : modalMode === 'EDIT' ? 'fa-solid fa-pencil' : 'fa-solid fa-calendar-plus'}></i>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg leading-tight">
                        {modalMode === 'CREATE' ? 'Create New Booking' : modalMode === 'EDIT' ? 'Edit Booking' : 'Booking & Route Inspection'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {modalMode === 'VIEW' 
                          ? `Reference: ${selectedBooking?.bookingNumber || selectedBooking?.id}` 
                          : 'Configure trip parameters, route stops, and freight details.'}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
                  
                  {/* VIEW MODE ONLY: Detailed Display */}
                  {modalMode === 'VIEW' && selectedBooking && (
                    <div className="space-y-6">
                      {/* Top Status Banner */}
                      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</p>
                          <p className="text-base font-extrabold text-slate-900">{selectedBooking.bookingNumber || `BK-${selectedBooking.id}`}</p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                            selectedBooking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            selectedBooking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            selectedBooking.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            selectedBooking.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {selectedBooking.status}
                          </span>
                        </div>
                      </div>

                      {/* 2-Column Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <h4 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i className="fa-solid fa-user"></i> Customer &amp; Vehicle
                          </h4>
                          <p className="text-xs"><span className="font-bold text-slate-500">Customer:</span> {selectedBooking.customerName} (#{selectedBooking.customerId})</p>
                          <p className="text-xs"><span className="font-bold text-slate-500">Truck Assigned:</span> {selectedBooking.truckNumber || 'None'}</p>
                          <p className="text-xs"><span className="font-bold text-slate-500">Driver Assigned:</span> {selectedBooking.driverName || 'None'}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <h4 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <i className="fa-solid fa-box-open"></i> Shipment Details
                          </h4>
                          <p className="text-xs"><span className="font-bold text-slate-500">Cargo:</span> {selectedBooking.cargoDescription} ({selectedBooking.cargoWeight} Tons)</p>
                          <p className="text-xs"><span className="font-bold text-slate-500">Freight Charge:</span> &#8377;{selectedBooking.freightAmount}</p>
                          <p className="text-xs"><span className="font-bold text-slate-500">Pickup Date:</span> {selectedBooking.pickupDate || '-'}</p>
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-blue-600">Pickup Location</p>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedBooking.pickupLocation}</p>
                        </div>
                        <i className="fa-solid fa-arrow-right-long text-blue-400 text-lg"></i>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-blue-600">Delivery Location</p>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedBooking.deliveryLocation}</p>
                        </div>
                      </div>

                      {/* Route Details with Ordered Stops */}
                      {selectedBooking.routeCode && (
                        <div className="border border-slate-200 rounded-xl p-4 bg-white">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                            <div>
                              <span className="font-extrabold text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {selectedBooking.routeCode}
                              </span>
                              <span className="font-bold text-slate-800 text-sm ml-2">{selectedBooking.routeName}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-600">
                              {selectedBooking.routeDistanceKm ? `${selectedBooking.routeDistanceKm} km` : ''} 
                              {selectedBooking.routeEstimatedDurationSeconds ? ` • ${formatDurationDisplay(selectedBooking.routeEstimatedDurationSeconds)}` : ''}
                            </div>
                          </div>

                          {/* Route Stops */}
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Checkpoints &amp; Stops ({selectedBooking.routeStops?.length || 0})
                          </p>
                          {(!selectedBooking.routeStops || selectedBooking.routeStops.length === 0) ? (
                            <p className="text-xs text-slate-400 italic">Direct route without intermediate stops.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedBooking.routeStops.map((stop, idx) => (
                                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                    {stop.stopOrder || (idx + 1)}
                                  </span>
                                  <div>
                                    <p className="font-bold text-slate-800 text-xs">{stop.stopName}</p>
                                    <p className="text-[10px] text-slate-500">{stop.stopAddress}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CREATE / EDIT FORM */}
                  {modalMode !== 'VIEW' && (
                    <div className="space-y-5">
                      
                      {/* Active Route Selection Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <i className="fa-solid fa-map-location-dot text-blue-600"></i> Active Corridors &amp; Routes (Optional)
                        </label>
                        <select 
                          name="routeId" 
                          value={formData.routeId} 
                          onChange={handleRouteChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">-- Direct Route / Custom Coordinates --</option>
                          {activeRoutes.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.routeCode} &bull; {r.routeName} ({r.source} &rarr; {r.destination}) &bull; {r.distanceKm} km
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dynamic Route Info Card if route selected */}
                      {selectedRouteObj && (
                        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-2">
                            <div>
                              <span className="font-black text-blue-700 text-xs bg-blue-100 px-2 py-0.5 rounded">
                                {selectedRouteObj.routeCode}
                              </span>
                              <span className="font-bold text-slate-800 text-sm ml-2">{selectedRouteObj.routeName}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                              <span><i className="fa-solid fa-road mr-1 text-blue-500"></i>{selectedRouteObj.distanceKm} km</span>
                              <span><i className="fa-regular fa-clock mr-1 text-blue-500"></i>{formatDurationDisplay(selectedRouteObj.estimatedDurationSeconds)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <span className="text-blue-600 font-bold">Corridor:</span>
                            <span>{selectedRouteObj.source}</span>
                            <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                            <span>{selectedRouteObj.destination}</span>
                          </div>

                          {/* Ordered Stops List */}
                          {selectedRouteObj.stops && selectedRouteObj.stops.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Checkpoints ({selectedRouteObj.stops.length} stops)
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedRouteObj.stops.map((s, idx) => (
                                  <span key={idx} className="bg-white border border-blue-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs">
                                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                                      {s.stopOrder || (idx + 1)}
                                    </span>
                                    {s.stopName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <p className="text-[10px] text-slate-500 italic">
                            * Note: Route stops are informational. Specific pickup and delivery locations can be customized below.
                          </p>
                        </div>
                      )}

                      {/* Customer, Truck, Driver 3-column row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Customer <span className="text-red-500">*</span>
                          </label>
                          <select 
                            name="customerId" 
                            value={formData.customerId} 
                            onChange={handleInputChange} 
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                              <option key={c.id} value={c.id}>{c.fullName} ({c.phone || c.email})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Assign Truck
                          </label>
                          <select 
                            name="truckId" 
                            value={formData.truckId} 
                            onChange={handleInputChange} 
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Assign Later / Available Trucks</option>
                            {trucks.map(t => (
                              <option key={t.id} value={t.id}>
                                {t.truckNumber} &bull; {t.truckType} ({t.capacity}T)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Assign Driver
                          </label>
                          <select 
                            name="driverId" 
                            value={formData.driverId} 
                            onChange={handleInputChange} 
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Assign Later / Available Drivers</option>
                            {drivers.map(d => (
                              <option key={d.id} value={d.id}>
                                {d.fullName} ({d.contactNumber})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Pickup Location & Delivery Location Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Pickup Location <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="pickupLocation" 
                            value={formData.pickupLocation} 
                            onChange={handleInputChange} 
                            placeholder="e.g. Vadodara GIDC Warehouse #4"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Delivery Location <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="deliveryLocation" 
                            value={formData.deliveryLocation} 
                            onChange={handleInputChange} 
                            placeholder="e.g. Ahmedabad Sanand Industrial Hub"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Pickup Date, Cargo Weight, Freight Amount */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Pickup Date <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="date" 
                            name="pickupDate" 
                            value={formData.pickupDate} 
                            onChange={handleInputChange} 
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Cargo Weight (Tons) <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="number" 
                            name="cargoWeight" 
                            value={formData.cargoWeight} 
                            onChange={handleInputChange} 
                            placeholder="e.g. 5.5" 
                            step="0.1" 
                            min="0.1"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Freight Amount (&#8377;) <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="number" 
                            name="freightAmount" 
                            value={formData.freightAmount} 
                            onChange={handleInputChange} 
                            placeholder="e.g. 14500" 
                            min="1"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Cargo Description */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Cargo Description <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="cargoDescription" 
                          value={formData.cargoDescription} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Industrial Machinery, Consumer Electronics, Textiles..." 
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                  <button 
                    onClick={handleCloseModal} 
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 text-sm transition-colors"
                  >
                    {modalMode === 'VIEW' ? 'Close Inspection' : 'Cancel'}
                  </button>
                  {modalMode !== 'VIEW' && (
                    <button 
                      onClick={handleSaveBooking} 
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 text-sm transition-colors"
                    >
                      {modalMode === 'CREATE' ? 'Confirm & Create Booking' : 'Save Changes'}
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
