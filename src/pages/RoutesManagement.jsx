import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllRoutes, createRoute, updateRoute, changeRouteStatus } from '../services/routeService';

const RoutesManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Side Panel / Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('CREATE'); // 'CREATE' or 'EDIT'
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // View Details Modal State
  const [viewRoute, setViewRoute] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Form Data State
  const [formData, setFormData] = useState({
    routeCode: '',
    routeName: '',
    source: '',
    destination: '',
    distanceKm: '',
    estimatedDurationSeconds: '',
    status: 'ACTIVE',
    stops: [] // Array of { stopName: '', stopAddress: '', stopOrder: 1 }
  });

  // UI State for Duration input (HH:MM)
  const [durationInput, setDurationInput] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await getAllRoutes();
      const data = response.data?.data || response.data || [];
      setRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load routes", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert Seconds to HH:MM format for Form UI
  const formatDurationInput = (seconds) => {
    if (!seconds && seconds !== 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Convert HH:MM input to Seconds for Backend
  const handleDurationChange = (e) => {
    const val = e.target.value;
    setDurationInput(val);
    if (val && val.includes(':')) {
      const parts = val.split(':');
      const hours = parseInt(parts[0] || 0, 10);
      const minutes = parseInt(parts[1] || 0, 10);
      const totalSeconds = (hours * 3600) + (minutes * 60);
      setFormData(prev => ({ ...prev, estimatedDurationSeconds: totalSeconds }));
    } else if (!val) {
      setFormData(prev => ({ ...prev, estimatedDurationSeconds: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Stop Handlers
  const handleAddStop = () => {
    const newOrder = formData.stops.length + 1;
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { stopName: '', stopAddress: '', stopOrder: newOrder }]
    }));
  };

  const handleStopChange = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const handleRemoveStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    // Reorder remaining stops sequentially
    const reorderedStops = newStops.map((stop, i) => ({ ...stop, stopOrder: i + 1 }));
    setFormData(prev => ({ ...prev, stops: reorderedStops }));
  };

  const openPanel = (mode, routeData = null) => {
    setFormMode(mode);
    if (routeData) {
      setSelectedRouteId(routeData.id);
      setFormData({
        routeCode: routeData.routeCode || '',
        routeName: routeData.routeName || '',
        source: routeData.source || '',
        destination: routeData.destination || '',
        distanceKm: routeData.distanceKm || '',
        estimatedDurationSeconds: routeData.estimatedDurationSeconds || '',
        status: routeData.status || 'ACTIVE',
        stops: Array.isArray(routeData.stops) 
          ? routeData.stops.map((s, idx) => ({ stopName: s.stopName || '', stopAddress: s.stopAddress || '', stopOrder: s.stopOrder || (idx + 1) }))
          : []
      });
      setDurationInput(formatDurationInput(routeData.estimatedDurationSeconds));
    } else {
      setSelectedRouteId(null);
      setFormData({
        routeCode: '',
        routeName: '',
        source: '',
        destination: '',
        distanceKm: '',
        estimatedDurationSeconds: '',
        status: 'ACTIVE',
        stops: []
      });
      setDurationInput('');
    }
    setIsFormOpen(true);
  };

  const closePanel = () => {
    setIsFormOpen(false);
  };

  const handleSaveRoute = async () => {
    if (!formData.routeCode.trim() || !formData.routeName.trim() || !formData.source.trim() || !formData.destination.trim()) {
      alert("Please fill all required route identity fields (Code, Name, Source, Destination).");
      return;
    }
    if (!formData.distanceKm || Number(formData.distanceKm) <= 0) {
      alert("Please enter a valid positive distance in KM.");
      return;
    }
    if (!formData.estimatedDurationSeconds || Number(formData.estimatedDurationSeconds) <= 0) {
      alert("Please enter an estimated duration (HH:MM).");
      return;
    }

    // Validate stops: if any stop is partially filled, warn user
    for (let i = 0; i < formData.stops.length; i++) {
      const s = formData.stops[i];
      if (!s.stopName?.trim() || !s.stopAddress?.trim()) {
        alert(`Stop #${i + 1} has an empty Name or Address. Please fill both or remove the stop.`);
        return;
      }
    }

    const payload = {
      routeCode: formData.routeCode.trim(),
      routeName: formData.routeName.trim(),
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      distanceKm: Number(formData.distanceKm),
      estimatedDurationSeconds: Number(formData.estimatedDurationSeconds),
      status: formData.status,
      stops: formData.stops.map((s, i) => ({
        stopName: s.stopName.trim(),
        stopAddress: s.stopAddress.trim(),
        stopOrder: i + 1
      }))
    };

    try {
      if (formMode === 'CREATE') {
        const res = await createRoute(payload);
        if (res && res.data && res.data.success === false) {
          alert("Error: " + res.data.message);
          return;
        }
        alert("Route created successfully!");
      } else {
        const res = await updateRoute(selectedRouteId, payload);
        if (res && res.data && res.data.success === false) {
          alert("Error: " + res.data.message);
          return;
        }
        alert("Route updated successfully!");
      }
      fetchRoutes();
      closePanel();
    } catch (error) {
      console.error("Error saving route", error);
      const actualError = error.response?.data?.message || error.response?.data?.error || error.message;
      alert("Backend Error: " + actualError);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmMsg = `Are you sure you want to change route status to ${newStatus}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await changeRouteStatus(id, newStatus);
      if (res && res.data && res.data.success === false) {
        alert("Status update failed: " + res.data.message);
        return;
      }
      alert(`Route is now ${newStatus}`);
      fetchRoutes();
    } catch (error) {
      console.error("Failed to change status", error);
      const err = error.response?.data?.message || "Failed to change route status.";
      alert("Error: " + err);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = !searchTerm || 
      (route.routeCode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (route.routeName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (route.source?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (route.destination?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Status' || (route.status && route.status.toUpperCase() === statusFilter.toUpperCase());

    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic stats from fetched routes
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter(r => r.status === 'ACTIVE').length;
  const inactiveRoutes = routes.filter(r => r.status === 'INACTIVE').length;
  const totalStops = routes.reduce((acc, route) => acc + (route.stops?.length || 0), 0);

  // Helper to format duration display in table (e.g., 7500s -> 2h 5m)
  const formatDurationDisplay = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800">Route Operations</h1>
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

        {/* Page Main Content */}
        <main className="flex-1 overflow-y-auto p-6" data-purpose="routes-management-page">
          
          {/* Header Title & Action */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-blue-100">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Routes Management</h2>
                <p className="text-xs text-slate-500 font-medium">Create, monitor and configure transport corridors, distances, and intermediate stops.</p>
              </div>
            </div>
            {!isFormOpen && (
              <button 
                onClick={() => openPanel('CREATE')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all"
              >
                <i className="fa-solid fa-plus"></i> Add New Route
              </button>
            )}
          </section>

          {/* 4 Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-route"></i>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Routes</span>
                <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{totalRoutes}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Routes</span>
                <div className="text-2xl font-black text-emerald-600 leading-tight mt-0.5">{activeRoutes}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-circle-pause"></i>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactive Routes</span>
                <div className="text-2xl font-black text-rose-600 leading-tight mt-0.5">{inactiveRoutes}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stops</span>
                <div className="text-2xl font-black text-purple-600 leading-tight mt-0.5">{totalStops}</div>
              </div>
            </div>
          </section>

          {/* Main Layout: Table on Left, Form Panel on Right (If Open) */}
          <div className="flex gap-6 items-start">
            
            {/* Left Side: Table & Filters */}
            <div className={`flex-1 flex flex-col gap-4 ${isFormOpen ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
              
              {/* Filters */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-end shadow-sm">
                <div className="flex-1 min-w-[220px]">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Routes</label>
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Search by route code, name, source, destination..." 
                    />
                  </div>
                </div>

                <div className="w-44">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Filter</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)} 
                    className="w-full bg-white px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Status">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <button 
                  onClick={() => { setSearchTerm(''); setStatusFilter('All Status'); }} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-rotate-right"></i> Reset
                </button>
              </div>

              {/* Table Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-base">
                    <i className="fa-solid fa-list-check text-blue-600"></i> Routes Listing
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold bg-white px-3 py-1 rounded-full border border-slate-200">
                    Showing {filteredRoutes.length} of {routes.length} routes
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200 bg-slate-50/70 tracking-wider">
                      <tr>
                        <th className="py-4 px-5">ID</th>
                        <th className="py-4 px-4">Route Code</th>
                        <th className="py-4 px-4">Route Name</th>
                        <th className="py-4 px-4">Source &rarr; Destination</th>
                        <th className="py-4 px-4">Distance</th>
                        <th className="py-4 px-4">Duration</th>
                        <th className="py-4 px-4 text-center">Stops</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {loading ? (
                        <tr>
                          <td colSpan="9" className="text-center py-10 text-slate-500">
                            <i className="fa-solid fa-circle-notch fa-spin text-blue-600 text-xl mb-2"></i>
                            <p className="font-medium">Loading routes from server...</p>
                          </td>
                        </tr>
                      ) : filteredRoutes.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-12 text-slate-400">
                            <i className="fa-solid fa-map-location-dot text-3xl mb-2 opacity-40"></i>
                            <p className="font-semibold text-sm text-slate-600">No routes found</p>
                            <p className="text-xs">Try adjusting your search criteria or add a new route.</p>
                          </td>
                        </tr>
                      ) : (
                        [...filteredRoutes].sort((a, b) => b.id - a.id).map(route => (
                          <tr key={route.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-4 px-5 font-bold text-slate-500">#{route.id}</td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                {route.routeCode}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-800">{route.routeName}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                <span>{route.source}</span>
                                <i className="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
                                <span>{route.destination}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-700">{route.distanceKm} km</td>
                            <td className="py-4 px-4 font-medium text-slate-600">
                              <i className="fa-regular fa-clock text-slate-400 mr-1"></i>
                              {formatDurationDisplay(route.estimatedDurationSeconds)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs border border-purple-100">
                                {route.stops?.length || 0}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                                route.status === 'ACTIVE' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                {route.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex justify-center items-center gap-1.5">
                                {/* View Details */}
                                <button 
                                  onClick={() => setViewRoute(route)} 
                                  title="View Route Details & Stops" 
                                  className="w-8 h-8 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                {/* Edit */}
                                <button 
                                  onClick={() => openPanel('EDIT', route)} 
                                  title="Edit Route" 
                                  className="w-8 h-8 flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
                                >
                                  <i className="fa-solid fa-pencil"></i>
                                </button>
                                {/* Toggle Active/Inactive */}
                                <button 
                                  onClick={() => handleStatusToggle(route.id, route.status)} 
                                  title={route.status === 'ACTIVE' ? 'Deactivate Route' : 'Activate Route'} 
                                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-colors shadow-sm ${
                                    route.status === 'ACTIVE' 
                                      ? 'border-amber-200 text-amber-600 hover:bg-amber-50' 
                                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                >
                                  <i className={`fa-solid ${route.status === 'ACTIVE' ? 'fa-ban' : 'fa-check'}`}></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Side: Add/Edit Route Panel */}
            {isFormOpen && (
              <div className="w-1/3 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col shrink-0 sticky top-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 rounded-t-2xl">
                  <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-base">
                    <i className="fa-solid fa-route text-blue-600"></i>
                    {formMode === 'CREATE' ? 'Add New Route' : 'Edit Route Details'}
                  </h3>
                  <button onClick={closePanel} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Route Code <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="routeCode" 
                        value={formData.routeCode} 
                        onChange={handleInputChange} 
                        placeholder="RT-VAD-AHM-001" 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Route Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="routeName" 
                        value={formData.routeName} 
                        onChange={handleInputChange} 
                        placeholder="Express Corridor" 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Source <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="source" 
                        value={formData.source} 
                        onChange={handleInputChange} 
                        placeholder="Vadodara, Gujarat" 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Destination <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="destination" 
                        value={formData.destination} 
                        onChange={handleInputChange} 
                        placeholder="Ahmedabad, Gujarat" 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Distance (KM) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        name="distanceKm" 
                        value={formData.distanceKm} 
                        onChange={handleInputChange} 
                        placeholder="115" 
                        min="1"
                        step="0.1"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Est. Duration <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="time" 
                        value={durationInput} 
                        onChange={handleDurationChange} 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <p className="text-[10px] text-slate-400 mt-1">HH:MM format</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                  {/* Route Stops Section */}
                  <div className="mt-2 border-t border-slate-100 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-location-dot text-blue-600"></i> Route Stops ({formData.stops.length})
                      </label>
                      <button 
                        type="button"
                        onClick={handleAddStop} 
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-blue-200"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i> Add Stop
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.stops.map((stop, index) => (
                        <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 border border-slate-200 rounded-xl relative">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-1 shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <input 
                              type="text" 
                              placeholder="Stop Name (e.g. Anand Toll Plaza)" 
                              value={stop.stopName} 
                              onChange={(e) => handleStopChange(index, 'stopName', e.target.value)} 
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                            <input 
                              type="text" 
                              placeholder="Full Address / Landmark" 
                              value={stop.stopAddress} 
                              onChange={(e) => handleStopChange(index, 'stopAddress', e.target.value)} 
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveStop(index)} 
                            title="Remove Stop"
                            className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      ))}

                      {formData.stops.length === 0 && (
                        <div className="text-center p-5 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                          <i className="fa-solid fa-signs-post text-slate-300 text-xl mb-1"></i>
                          <p className="text-xs text-slate-500 font-medium">No intermediate stops configured.</p>
                          <p className="text-[10px] text-slate-400">Click &ldquo;+ Add Stop&rdquo; above to attach checkpoints.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 rounded-b-2xl shrink-0">
                  <button 
                    type="button"
                    onClick={closePanel} 
                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveRoute} 
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 text-sm transition-colors"
                  >
                    {formMode === 'CREATE' ? 'Create Route' : 'Update Route'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Route Details Modal */}
          {viewRoute && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setViewRoute(null)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                      <i className="fa-solid fa-route"></i>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{viewRoute.routeName}</h3>
                      <p className="text-xs text-blue-600 font-bold">{viewRoute.routeCode}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewRoute(null)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Source</p>
                      <p className="font-bold text-slate-800 text-sm">{viewRoute.source}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                      <p className="font-bold text-slate-800 text-sm">{viewRoute.destination}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Distance</p>
                      <p className="font-bold text-slate-800 text-sm">{viewRoute.distanceKm} km</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Est. Duration</p>
                      <p className="font-bold text-slate-800 text-sm">{formatDurationDisplay(viewRoute.estimatedDurationSeconds)}</p>
                    </div>
                  </div>

                  {/* Stops Timeline */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-timeline text-blue-600"></i> Route Checkpoints &amp; Stops ({viewRoute.stops?.length || 0})
                    </h4>

                    {(!viewRoute.stops || viewRoute.stops.length === 0) ? (
                      <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">No intermediate stops configured for this direct route.</p>
                    ) : (
                      <div className="relative pl-6 border-l-2 border-blue-200 space-y-6 ml-3 my-2">
                        {/* Origin */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-100"></div>
                          <p className="text-xs font-bold text-blue-600 uppercase">Origin Point</p>
                          <p className="text-sm font-extrabold text-slate-800">{viewRoute.source}</p>
                        </div>

                        {/* Intermediate Stops */}
                        {viewRoute.stops.map((stop, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-white ring-2 ring-purple-100"></div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                              <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                Stop #{stop.stopOrder || (idx + 1)}
                              </span>
                              <p className="font-bold text-slate-800 text-sm mt-1">{stop.stopName}</p>
                              <p className="text-xs text-slate-500 mt-0.5"><i className="fa-solid fa-map-pin text-[10px] mr-1 text-slate-400"></i>{stop.stopAddress}</p>
                            </div>
                          </div>
                        ))}

                        {/* Destination */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-100"></div>
                          <p className="text-xs font-bold text-emerald-600 uppercase">Destination Point</p>
                          <p className="text-sm font-extrabold text-slate-800">{viewRoute.destination}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                  <button onClick={() => setViewRoute(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm">
                    Close Details
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

export default RoutesManagement;
