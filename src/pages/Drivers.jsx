import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllDrivers, addDriver, updateDriver, deleteDriver, uploadDriverImage } from '../services/driverService';

const Drivers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); 
  const [driversData, setDriversData] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🚀 Form Data State matching Backend EXACTLY (phoneNumber use kiya hai) 🚀
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '', 
    email: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    experience: '',
    salary: '',
    status: 'ACTIVE',
    assignedTruck: '' 
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Initial Fetch
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await getAllDrivers();
      if (response.data && response.data.success) {
        setDriversData(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDriversData(response.data); // Fallback agar backend direct array bhej raha ho
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      fullName: '', phoneNumber: '', email: '', licenseNumber: '', licenseExpiryDate: '', experience: '', salary: '', status: 'ACTIVE', assignedTruck: '' 
    });
  };

  const handleEdit = (driver) => {
    setModalMode('EDIT');
    setSelectedDriverId(driver.id);
    setFormData({
      fullName: driver.fullName || '',
      phoneNumber: driver.phoneNumber || '', 
      email: driver.email || '',
      licenseNumber: driver.licenseNumber || '',
      licenseExpiryDate: driver.licenseExpiryDate || '',
      experience: driver.experience || '',
      salary: driver.salary || '',
      status: driver.status || 'ACTIVE',
      assignedTruck: driver.assignedTruck || ''
    });
    
    if (driver.image) {
      const previewUrl = driver.image.startsWith('http') ? driver.image : `http://localhost:8080/${driver.image}`;
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await deleteDriver(id);
        fetchDrivers();
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("Failed to delete driver!");
      }
    }
  };

  const handleSaveDriver = async () => {
    setLoading(true);
    try {
      if (modalMode === 'EDIT') {
        const response = await updateDriver(selectedDriverId, formData);
        
        // Check if response is successful and we have an image
        if (imageFile) {
          await uploadDriverImage(selectedDriverId, imageFile);
        }
        alert("Driver Updated Successfully!");
      } else {
        const response = await addDriver(formData);
        
        // Naya ID nikalna backend response ke format pe depend karega
        const newId = response.data?.data?.id || response.data?.id; 
        
        if (newId && imageFile) {
          await uploadDriverImage(newId, imageFile);
        }
        alert("Driver Added Successfully!");
      }
      fetchDrivers();
      handleCloseModal(); 
    } catch (error) {
      console.error("Error saving driver:", error);
      
      // 🚀 ASLI BACKEND ERROR NIKALNE KA CODE 🚀
      const actualError = error.response?.data?.message 
                       || error.response?.data?.error 
                       || error.message;
                       
      alert("Backend Error: " + actualError); 
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Driver Management</h2>
              <p className="text-sm text-slate-500 mt-1">Manage all drivers - add, view, edit and upload driver images.</p>
            </div>
            <button 
              onClick={() => { setModalMode('ADD'); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add Driver
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-users"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Total Drivers</p><h3 className="text-2xl font-bold text-slate-800">{driversData.length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-user-check"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Active Drivers</p><h3 className="text-2xl font-bold text-slate-800">{driversData.filter(d => d.status === 'ACTIVE').length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-user-xmark"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Inactive Drivers</p><h3 className="text-2xl font-bold text-slate-800">{driversData.filter(d => d.status === 'INACTIVE').length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-truck-fast"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Assigned Drivers</p><h3 className="text-2xl font-bold text-slate-800">{driversData.filter(d => d.assignedTruck).length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-person-walking-luggage"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Unassigned</p><h3 className="text-2xl font-bold text-slate-800">{driversData.filter(d => !d.assignedTruck).length}</h3></div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Search</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" placeholder="Search by Name, Phone, License..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option><option>Active</option><option>Inactive</option>
              </select>
            </div>
            <div className="w-48">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Truck Assigned</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Drivers</option><option>Assigned</option><option>Unassigned</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">Search</button>
              <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">Reset</button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200"><h3 className="font-bold text-slate-800 text-lg">Driver List</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Driver Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">License No</th>
                    <th className="px-6 py-4">License Expiry</th>
                    <th className="px-6 py-4">Exp (Yrs)</th>
                    <th className="px-6 py-4">Salary (₹)</th>
                    <th className="px-6 py-4">Truck Assigned</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {driversData.map((driver, idx) => (
                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-500">{idx + 1}</td>
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-slate-300">
                          {driver.image ? (
                            <img src={driver.image.startsWith('http') ? driver.image : `http://localhost:8080/${driver.image}`} alt="Driver" className="w-full h-full object-cover" />
                          ) : (
                            <i className="fa-solid fa-user text-slate-400"></i>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-700">{driver.fullName}</td>
                      <td className="px-6 py-3 text-slate-600">{driver.phoneNumber}</td>
                      <td className="px-6 py-3 text-slate-500 text-xs">{driver.email}</td>
                      <td className="px-6 py-3 text-slate-600 font-medium">{driver.licenseNumber}</td>
                      <td className="px-6 py-3 text-red-500 font-medium">{driver.licenseExpiryDate}</td>
                      <td className="px-6 py-3 text-slate-600">{driver.experience}</td>
                      <td className="px-6 py-3 text-slate-600 font-bold">₹{driver.salary}</td>
                      <td className="px-6 py-3 text-slate-600">{driver.assignedTruck || <span className="text-xs text-slate-400">Unassigned</span>}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold border rounded bg-white ${
                          driver.status === 'ACTIVE' ? 'border-green-300 text-green-600' : 'border-red-300 text-red-600'
                        }`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(driver)} className="w-8 h-8 rounded border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"><i className="fa-solid fa-pencil"></i></button>
                          <button onClick={() => handleDelete(driver.id)} className="w-8 h-8 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"><i className="fa-regular fa-trash-can"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ✨ Modal for Add/Edit Driver ✨ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-xl text-slate-800">{modalMode === 'EDIT' ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Rahul Sharma" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="e.g. 9876543210" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. rahul@example.com" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">License Number <span className="text-red-500">*</span></label>
                  <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} placeholder="e.g. DL123456789" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none uppercase" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">License Expiry Date <span className="text-red-500">*</span></label>
                  <input type="date" name="licenseExpiryDate" value={formData.licenseExpiryDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-600" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Experience (Years) <span className="text-red-500">*</span></label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 5" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Salary (₹) <span className="text-red-500">*</span></label>
                  <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. 30000" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-600">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Assign Truck</label>
                  <select name="assignedTruck" value={formData.assignedTruck} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-600">
                    <option value="">Select Truck (Unassigned)</option>
                    <option value="GJ01AB1234">GJ01AB1234</option>
                    <option value="MH12CD4567">MH12CD4567</option>
                  </select>
                </div>
              </div>
              
              {/* 🚀 Driver Image Upload 🚀 */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Driver Profile Image (JPG, PNG)</label>
                <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                
                <div onClick={handleImageClick} className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors w-full md:w-1/3">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected Driver" className="w-24 h-24 rounded-full object-cover shadow-md" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-blue-500"><i className="fa-solid fa-camera text-xl"></i></div>
                      <p className="text-xs font-bold text-slate-700">Upload Photo</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCloseModal} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100">Cancel</button>
              <button onClick={handleSaveDriver} disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30">
                {loading ? "Saving..." : "Save Driver"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Drivers;