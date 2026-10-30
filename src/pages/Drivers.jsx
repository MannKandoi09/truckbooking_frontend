import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllDrivers, addDriver, updateDriver, deleteDriver, uploadDriverImage } from '../services/driverService';
import { getAllTrucks } from '../services/truckService';

const Drivers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); 
  const [driversData, setDriversData] = useState([]);
  const [trucksList, setTrucksList] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [truckFilter, setTruckFilter] = useState('All Drivers');

  // Form Data State matching Spring Boot DriverRequest exactly
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '', 
    email: '',
    licenseNumber: '',
    licenseExpiry: '',
    experience: '',
    salary: '',
    status: 'ACTIVE',
    truckId: '' 
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Initial Fetch: Drivers and Trucks
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [dRes, tRes] = await Promise.all([
        getAllDrivers().catch(() => ({ data: { data: [] } })),
        getAllTrucks().catch(() => ({ data: { data: [] } }))
      ]);

      const drivers = dRes.data?.data || dRes.data || [];
      const trucks = tRes.data?.data || tRes.data || [];

      setDriversData(Array.isArray(drivers) ? drivers : []);
      setTrucksList(Array.isArray(trucks) ? trucks : []);
    } catch (error) {
      console.error("Error fetching drivers/trucks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode('ADD');
    setSelectedDriverId(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({ 
      fullName: '', 
      phone: '', 
      email: '', 
      licenseNumber: '', 
      licenseExpiry: '', 
      experience: '', 
      salary: '', 
      status: 'ACTIVE', 
      truckId: '' 
    });
  };

  const handleEdit = (driver) => {
    setModalMode('EDIT');
    setSelectedDriverId(driver.id);
    setFormData({
      fullName: driver.fullName || '',
      phone: driver.phone || '', 
      email: driver.email || '',
      licenseNumber: driver.licenseNumber || '',
      licenseExpiry: driver.licenseExpiry || '',
      experience: driver.experience !== undefined && driver.experience !== null ? driver.experience : '',
      salary: driver.salary !== undefined && driver.salary !== null ? driver.salary : '',
      status: driver.status || 'ACTIVE',
      truckId: driver.truckId || ''
    });
    
    if (driver.image) {
      const previewUrl = driver.image.startsWith('http') 
        ? driver.image 
        : `http://localhost:8080/${driver.image.startsWith('/') ? driver.image.slice(1) : driver.image}`;
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate/delete this driver?")) {
      try {
        const res = await deleteDriver(id);
        if (res && res.data && res.data.success === false) {
          alert("Error: " + res.data.message);
          return;
        }
        alert("Driver deactivated successfully!");
        fetchInitialData();
      } catch (error) {
        console.error("Error deleting driver:", error);
        const err = error.response?.data?.message || "Failed to delete driver!";
        alert("Error: " + err);
      }
    }
  };

  const handleSaveDriver = async () => {
    // Validations matching backend constraints
    if (!formData.fullName.trim()) {
      alert("Please enter driver full name.");
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!formData.licenseNumber.trim()) {
      alert("Please enter driving license number.");
      return;
    }

    if (!formData.licenseExpiry) {
      alert("Please select license expiry date.");
      return;
    }

    if (formData.experience === '' || Number(formData.experience) < 0) {
      alert("Please enter driver experience in years (0 or greater).");
      return;
    }

    if (formData.salary === '' || Number(formData.salary) <= 0) {
      alert("Please enter a valid positive salary.");
      return;
    }

    // Build payload exactly as required by DriverRequest DTO
    const payload = {
      fullName: formData.fullName.trim(),
      phone: cleanPhone,
      email: formData.email.trim(),
      licenseNumber: formData.licenseNumber.trim().toUpperCase(),
      licenseExpiry: formData.licenseExpiry,
      experience: parseInt(formData.experience, 10),
      salary: parseFloat(formData.salary),
      status: formData.status,
      truckId: formData.truckId ? Number(formData.truckId) : null
    };

    setLoading(true);
    try {
      if (modalMode === 'EDIT') {
        const res = await updateDriver(selectedDriverId, payload);
        if (res && res.data && res.data.success === false) {
          alert("Update Failed: " + res.data.message);
          return;
        }
        
        if (imageFile) {
          await uploadDriverImage(selectedDriverId, imageFile).catch(err => console.error("Image upload failed", err));
        }
        alert("Driver Updated Successfully!");
      } else {
        const res = await addDriver(payload);
        if (res && res.data && res.data.success === false) {
          alert("Failed to Add Driver: " + res.data.message);
          return;
        }
        
        const newId = res.data?.data?.id || res.data?.id; 
        if (newId && imageFile) {
          await uploadDriverImage(newId, imageFile).catch(err => console.error("Image upload failed", err));
        }
        alert("Driver Added Successfully!");
      }

      fetchInitialData();
      handleCloseModal(); 
    } catch (error) {
      console.error("Error saving driver:", error);
      const actualError = error.response?.data?.message 
                       || error.response?.data?.error 
                       || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : error.message);
                       
      alert("Backend Error: " + actualError); 
    } finally {
      setLoading(false);
    }
  };

  // Filter Drivers
  const filteredDrivers = driversData.filter(d => {
    const matchesSearch = !searchTerm || 
      (d.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.truckNumber?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All Status' || 
      (d.status && d.status.toUpperCase() === statusFilter.toUpperCase());

    const matchesTruck = truckFilter === 'All Drivers' || 
      (truckFilter === 'Assigned' ? Boolean(d.truckId || d.truckNumber) : !Boolean(d.truckId || d.truckNumber));

    return matchesSearch && matchesStatus && matchesTruck;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800">Driver Workforce Management</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Admin User</p>
                <p className="text-[10px] text-blue-600 font-bold tracking-wider">ADMIN</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">A</div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Driver Management</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Onboard drivers, verify licenses, track assigned commercial trucks, and maintain driver records.</p>
            </div>
            <button 
              onClick={() => { setModalMode('ADD'); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add Driver
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl"><i className="fa-solid fa-users"></i></div>
              <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Total Drivers</p><h3 className="text-2xl font-black text-slate-800">{driversData.length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl"><i className="fa-solid fa-user-check"></i></div>
              <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Active Drivers</p><h3 className="text-2xl font-black text-emerald-600">{driversData.filter(d => d.status === 'ACTIVE').length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-xl"><i className="fa-solid fa-user-xmark"></i></div>
              <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Inactive</p><h3 className="text-2xl font-black text-rose-600">{driversData.filter(d => d.status === 'INACTIVE').length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl"><i className="fa-solid fa-truck-fast"></i></div>
              <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Truck Assigned</p><h3 className="text-2xl font-black text-purple-600">{driversData.filter(d => d.truckId || d.truckNumber).length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl"><i className="fa-solid fa-person-walking-luggage"></i></div>
              <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Unassigned</p><h3 className="text-2xl font-black text-amber-600">{driversData.filter(d => !d.truckId && !d.truckNumber).length}</h3></div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-wrap items-end gap-3 shadow-sm">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, phone, license, truck..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
            <div className="w-40">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All Status">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="w-44">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Truck Assignment</label>
              <select 
                value={truckFilter}
                onChange={e => setTruckFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All Drivers">All Drivers</option>
                <option value="Assigned">Assigned</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('All Status'); setTruckFilter('All Drivers'); }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-b-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-base">Driver Workforce List</h3>
              <span className="text-xs text-slate-500 font-semibold bg-white px-3 py-1 rounded-full border border-slate-200">
                {filteredDrivers.length} Drivers
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-4 py-4">Image</th>
                    <th className="px-4 py-4">Driver Name</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">License No</th>
                    <th className="px-4 py-4">License Expiry</th>
                    <th className="px-4 py-4 text-center">Exp (Yrs)</th>
                    <th className="px-4 py-4">Salary (&#8377;)</th>
                    <th className="px-4 py-4">Assigned Truck</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="text-center py-10 text-slate-400">
                        <i className="fa-solid fa-user-slash text-2xl mb-1 opacity-50"></i>
                        <p className="font-semibold text-sm text-slate-600">No drivers found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver, idx) => (
                      <tr key={driver.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-3 font-bold text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-2xs">
                            {driver.image ? (
                              <img 
                                src={driver.image.startsWith('http') ? driver.image : `http://localhost:8080/${driver.image.startsWith('/') ? driver.image.slice(1) : driver.image}`} 
                                alt="Driver" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <i className="fa-solid fa-user text-slate-400 text-sm"></i>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-extrabold text-slate-800">{driver.fullName}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700">{driver.phone}</td>
                        <td className="px-4 py-3 text-slate-500">{driver.email}</td>
                        <td className="px-4 py-3 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{driver.licenseNumber}</td>
                        <td className="px-4 py-3 font-medium text-slate-600">{driver.licenseExpiry}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">{driver.experience} Yrs</td>
                        <td className="px-4 py-3 font-black text-slate-900">&#8377;{Number(driver.salary).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {driver.truckNumber ? (
                            <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                              <i className="fa-solid fa-truck text-[10px] mr-1"></i>{driver.truckNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-black border rounded-full uppercase tracking-wider ${
                            driver.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}>
                            {driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button 
                              onClick={() => handleEdit(driver)} 
                              title="Edit Driver" 
                              className="w-7 h-7 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors shadow-2xs"
                            >
                              <i className="fa-solid fa-pencil text-xs"></i>
                            </button>
                            <button 
                              onClick={() => handleDelete(driver.id)} 
                              title="Deactivate Driver" 
                              className="w-7 h-7 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shadow-2xs"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
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
        </main>
      </div>

      {/* Modal for Add/Edit Driver */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-800 leading-tight">
                    {modalMode === 'EDIT' ? 'Edit Driver Details' : 'Add New Commercial Driver'}
                  </h3>
                  <p className="text-xs text-slate-500">Provide personal identity, 10-digit phone number, license specs, and assigned truck.</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Rahul Sharma" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    maxLength={10} 
                    placeholder="9876543210" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="rahul@example.com" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                
                {/* License Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="licenseNumber" 
                    value={formData.licenseNumber} 
                    onChange={handleInputChange} 
                    placeholder="DL123456789" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none uppercase" 
                  />
                </div>
                
                {/* License Expiry */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    License Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="licenseExpiry" 
                    value={formData.licenseExpiry} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700" 
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Experience (Years) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleInputChange} 
                    min="0"
                    placeholder="5" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Monthly Salary (&#8377;) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="salary" 
                    value={formData.salary} 
                    onChange={handleInputChange} 
                    min="1"
                    placeholder="30000" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Driver Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                {/* Assign Truck Dropdown populated from Real Trucks API */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Assign Commercial Truck</label>
                  <select 
                    name="truckId" 
                    value={formData.truckId} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Unassigned (No Vehicle)</option>
                    {trucksList.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.truckNumber} &bull; {t.truckName || t.truckType} ({t.capacity}T)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Driver Image Upload */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Driver Profile Photo (JPG, PNG)</label>
                <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                
                <div onClick={handleImageClick} className="border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors w-full md:w-1/3">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected Driver" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 text-blue-600"><i className="fa-solid fa-camera text-xl"></i></div>
                      <p className="text-xs font-bold text-slate-700">Upload Driver Photo</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCloseModal} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 text-sm">Cancel</button>
              <button onClick={handleSaveDriver} disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 text-sm">
                {loading ? "Saving..." : (modalMode === 'EDIT' ? "Update Driver" : "Save Driver")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Drivers;
