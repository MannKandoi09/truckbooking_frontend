import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllRoutes, createRoute, updateRoute, changeRouteStatus } from '../services/routeService';

const RoutesManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Side Panel Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('CREATE'); // 'CREATE' or 'EDIT'
  const [selectedRouteId, setSelectedRouteId] = useState(null);

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
    estimatedDurationSeconds: '', // Stored as seconds for backend
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
      setRoutes(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to load routes", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert Seconds to HH:MM format for Form UI
  const formatDurationInput = (seconds) => {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Convert HH:MM input to Seconds for Backend
  const handleDurationChange = (e) => {
    const val = e.target.value;
    setDurationInput(val);
    if(val.includes(':')) {
      const [hours, minutes] = val.split(':');
      const totalSeconds = (parseInt(hours || 0) * 3600) + (parseInt(minutes || 0) * 60);
      setFormData({ ...formData, estimatedDurationSeconds: totalSeconds });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Stop Handlers
  const handleAddStop = () => {
    const newOrder = formData.stops.length + 1;
    setFormData({
      ...formData,
      stops: [...formData.stops, { stopName: '', stopAddress: '', stopOrder: newOrder }]
    });
  };

  const handleStopChange = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index][field] = value;
    setFormData({ ...formData, stops: newStops });
  };

  const handleRemoveStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    // Reorder remaining stops
    const reorderedStops = newStops.map((stop, i) => ({ ...stop, stopOrder: i + 1 }));
    setFormData({ ...formData, stops: reorderedStops });
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
        stops: routeData.stops || []
      });
      setDurationInput(formatDurationInput(routeData.estimatedDurationSeconds));
    } else {
      setSelectedRouteId(null);
      setFormData({
        routeCode: '', routeName: '', source: '', destination: '', distanceKm: '', estimatedDurationSeconds: '', status: 'ACTIVE', stops: []
      });
      setDurationInput('');
    }
    setIsFormOpen(true);
  };

  const closePanel = () => {
    setIsFormOpen(false);
  };

  const handleSaveRoute = async () => {
    if(!formData.routeCode || !formData.routeName || !formData.source || !formData.destination || !formData.distanceKm || !formData.estimatedDurationSeconds) {
      alert("Please fill all required route fields.");
      return;
    }

    const payload = {
      ...formData,
      distanceKm: Number(formData.distanceKm),
      estimatedDurationSeconds: Number(formData.estimatedDurationSeconds)
    };

    try {
      if(formMode === 'CREATE') {
        await createRoute(payload);
        alert("Route added successfully!");
      } else {
        await updateRoute(selectedRouteId, payload);
        alert("Route updated successfully!");
      }
      fetchRoutes();
      closePanel();
    } catch (error) {
      console.error("Error saving route", error);
      const actualError = error.response?.data?.message || error.message;
      alert("Backend Error: " + actualError);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await changeRouteStatus(id, newStatus);
      fetchRoutes();
    } catch (error) {
      console.error("Failed to change status", error);
      alert("Failed to change route status.");
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

  // Calculate Stats
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter(r => r.status === 'ACTIVE').length;
  const inactiveRoutes = routes.filter(r => r.status === 'INACTIVE').length;
  const totalStops = routes.reduce((acc, route) => acc + (route.stops?.length || 0), 0);

  // Helper to display duration neatly in table
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700"><i className="fa-solid fa-bars text-lg"></i></button>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 border-l pl-6 border-slate-200 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Admin User</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-wider">ADMIN</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6" data-purpose="routes-management-page">
          
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <i className="fa-solid fa-map-location-dot text-2xl px-1"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 leading-tight">Routes Management</h2>
                <p className="text-xs text-slate-500 font-medium">View, manage and maintain all transport routes with stops and details.</p>
              </div>
            </div>
            {!isFormOpen && (
                <button 
                    onClick={() => openPanel('CREATE')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
                >
                  <i className="fa-solid fa-plus"></i> Add New Route
                </button>
            )}
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-route"></i></div>
              <div><span className="text-xs font-medium text-slate-500">Total Routes</span><div className="text-2xl font-extrabold text-slate-900 leading-tight">{totalRoutes}</div></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-circle-check"></i></div>
              <div><span className="text-xs font-medium text-slate-500">Active Routes</span><div className="text-2xl font-extrabold text-slate-900 leading-tight">{activeRoutes}</div></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-pause"></i></div>
              <div><span className="text-xs font-medium text-slate-500">Inactive Routes</span><div className="text-2xl font-extrabold text-slate-900 leading-tight">{inactiveRoutes}</div></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-location-dot"></i></div>
              <div><span className="text-xs font-medium text-slate-500">Total Stops</span><div className="text-2xl font-extrabold text-slate-900 leading-tight">{totalStops}</div></div>
            </div>
          </section>

          {/* Main Layout: Table on Left, Form Panel on Right (If Open) */}
          <div className="flex gap-6 items-start">
              
              {/* Left Side: Table & Filters */}
              <div className={`flex-1 flex flex-col gap-4 ${isFormOpen ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
                  {/* Filters */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search by route code, name, source, destination..." />
                      </div>
                    </div>
                    <div className="w-40">
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-white px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="All Status">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                    <button onClick={() => {setSearchTerm(''); setStatusFilter('All Status');}} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                        <i className="fa-solid fa-rotate-right"></i> Reset
                    </button>
                  </div>

                  {/* Table */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><i className="fa-regular fa-folder-open text-blue-500"></i> Routes List</h3>
                        <span className="text-xs text-slate-500 font-medium">Showing {filteredRoutes.length} routes</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 bg-white">
                          <tr>
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-4">Route Code</th>
                            <th className="py-4 px-4">Route Name</th>
                            <th className="py-4 px-4">Source → Dest</th>
                            <th className="py-4 px-4">Dist. (KM)</th>
                            <th className="py-4 px-4">Duration</th>
                            <th className="py-4 px-4 text-center">Stops</th>
                            <th className="py-4 px-4 text-center">Status</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredRoutes.length === 0 ? (
                                <tr><td colSpan="9" className="text-center py-8 text-slate-500">{loading ? "Loading..." : "No routes found."}</td></tr>
                            ) : (
                                [...filteredRoutes].sort((a,b) => b.id - a.id).map(route => (
                                     <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 font-bold text-slate-900">{route.id}</td>
                                        <td className="py-4 px-4 font-bold text-slate-600 tracking-tight">{route.routeCode}</td>
                                        <td className="py-4 px-4 text-slate-600 font-medium">{route.routeName}</td>
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-slate-800">{route.source}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{route.destination}</div>
                                        </td>
                                        <td className="py-4 px-4 font-semibold">{route.distanceKm}</td>
                                        <td className="py-4 px-4 font-semibold">{formatDurationDisplay(route.estimatedDurationSeconds)}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">{route.stops?.length || 0}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-2 py-1 border rounded text-[9px] font-bold tracking-wider ${
                                                route.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'
                                            }`}>
                                                {route.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => openPanel('EDIT', route)} title="Edit Route" className="w-7 h-7 flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-50 rounded shadow-sm"><i className="fa-solid fa-pencil text-xs"></i></button>
                                                <button onClick={() => handleStatusToggle(route.id, route.status)} title="Toggle Status" className={`w-7 h-7 flex items-center justify-center border rounded shadow-sm ${route.status==='ACTIVE' ? 'border-orange-200 text-orange-500 hover:bg-orange-50' : 'border-green-200 text-green-500 hover:bg-green-50'}`}>
                                                    <i className={`fa-solid ${route.status==='ACTIVE' ? 'fa-ban' : 'fa-check'} text-xs`}></i>
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
                  <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col shrink-0 sticky top-0" style={{maxHeight: 'calc(100vh - 120px)'}}>
                      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 rounded-t-xl">
                          <h3 className="font-extrabold text-blue-900 flex items-center gap-2">
                              <i className="fa-solid fa-route text-blue-500"></i>
                              {formMode === 'CREATE' ? 'Add New Route' : 'Edit Route'}
                          </h3>
                          <button onClick={closePanel} className="text-slate-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
                      </div>
                      
                      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Route Code <span className="text-red-500">*</span></label>
                                  <input type="text" name="routeCode" value={formData.routeCode} onChange={handleInputChange} placeholder="e.g. RT-VAD-AHM-001" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Route Name <span className="text-red-500">*</span></label>
                                  <input type="text" name="routeName" value={formData.routeName} onChange={handleInputChange} placeholder="e.g. Vadodara Express" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Source <span className="text-red-500">*</span></label>
                                  <input type="text" name="source" value={formData.source} onChange={handleInputChange} placeholder="City Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Destination <span className="text-red-500">*</span></label>
                                  <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="City Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Distance (KM) <span className="text-red-500">*</span></label>
                                  <input type="number" name="distanceKm" value={formData.distanceKm} onChange={handleInputChange} placeholder="e.g. 115" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Est. Duration <span className="text-red-500">*</span></label>
                                  <input type="time" value={durationInput} onChange={handleDurationChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                                  <p className="text-[9px] text-slate-400 mt-1">Format: HH:MM</p>
                              </div>
                          </div>

                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Status <span className="text-red-500">*</span></label>
                              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500">
                                  <option value="ACTIVE">Active</option>
                                  <option value="INACTIVE">Inactive</option>
                              </select>
                          </div>

                          <div className="mt-2 border-t border-slate-100 pt-4">
                              <div className="flex justify-between items-center mb-3">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><i className="fa-solid fa-location-dot text-blue-500"></i> Route Stops</label>
                                  <button onClick={handleAddStop} className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded transition-colors">+ Add Stop</button>
                              </div>
                              
                              <div className="space-y-3">
                                  {formData.stops.map((stop, index) => (
                                      <div key={index} className="flex gap-2 items-start bg-slate-50 p-2.5 border border-slate-200 rounded-lg relative group">
                                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">{index + 1}</div>
                                          <div className="flex-1 space-y-2">
                                              <input type="text" placeholder="Stop Name (e.g. Anand Toll)" value={stop.stopName} onChange={(e) => handleStopChange(index, 'stopName', e.target.value)} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none" />
                                              <input type="text" placeholder="Full Address" value={stop.stopAddress} onChange={(e) => handleStopChange(index, 'stopAddress', e.target.value)} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none" />
                                          </div>
                                          <button onClick={() => handleRemoveStop(index)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><i className="fa-solid fa-xmark"></i></button>
                                      </div>
                                  ))}
                                  {formData.stops.length === 0 && (
                                      <div className="text-center p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                                          <p className="text-xs text-slate-400 font-medium">No stops added yet.</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex gap-3 rounded-b-xl shrink-0">
                          <button onClick={closePanel} className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-100 text-sm">Cancel</button>
                          <button onClick={handleSaveRoute} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 text-sm">Save Route</button>
                      </div>
                  </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoutesManagement;