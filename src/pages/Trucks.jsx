import React, { useState, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Link } from 'react-router-dom';

const Trucks = () => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🚀 Form Data State (Backend ke liye) 🚀
  const [formData, setFormData] = useState({
    truckNumber: '',
    truckName: '',
    truckType: '',
    capacity: '',
    model: '',
    insurance: '',
    status: '',
    availability: ''
  });

  // 🚀 Image Upload States 🚀
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Fake Data (UI check karne ke liye)
  const trucksData = [
    { id: 1, number: 'GJ01AB1234', name: 'Tata Ace', type: 'Mini Truck', capacity: '10.00', model: '2024', insurance: '2027-12-31', status: 'ACTIVE', availability: 'AVAILABLE' },
    { id: 2, number: 'MH12XY5678', name: 'Eicher Pro 2049', type: 'Medium Truck', capacity: '18.00', model: '2023', insurance: '2026-08-15', status: 'ACTIVE', availability: 'BOOKED' },
    { id: 3, number: 'KA03CD9101', name: 'Tata 407', type: 'Medium Truck', capacity: '15.00', model: '2022', insurance: '2025-11-20', status: 'INACTIVE', availability: 'AVAILABLE' },
    { id: 4, number: 'RJ14GH1122', name: 'BharatBenz 1214', type: 'Heavy Truck', capacity: '25.00', model: '2023', insurance: '2026-01-10', status: 'ACTIVE', availability: 'BOOKED' },
    { id: 5, number: 'UP78JK3344', name: 'Ashok Leyland 2820', type: 'Container Truck', capacity: '30.00', model: '2024', insurance: '2026-03-05', status: 'ACTIVE', availability: 'AVAILABLE' },
  ];

  // Jab user input fields mein kuch type kare
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Image box pe click karne par hidden input trigger hoga
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Jab user file select kar le
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Backend ke liye file save ki
      setImagePreview(URL.createObjectURL(file)); // Preview URL banaya
    }
  };

  // Modal band karne ka function (sath mein fields aur image bhi clear karni padegi)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setImagePreview(null);
    setFormData({ // Form reset kar diya
      truckNumber: '', truckName: '', truckType: '', capacity: '', model: '', insurance: '', status: '', availability: ''
    });
  };

  // 🚀 Save Button Click (Backend API ke liye Ready) 🚀
  const handleSaveTruck = () => {
    // Yahan Backend developer API integrate karega
    console.log("📝 Data ready for Backend:", formData);
    console.log("📸 Image ready for Backend:", imageFile);
    
    alert("Task Completed! Check browser console (F12) to see the form data.");
    handleCloseModal(); // Save hone ke baad modal close
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700">
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
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
              <div className="w-9 h-9 rounded-full bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Truck Management</h2>
              <p className="text-sm text-slate-500 mt-1">Manage all trucks - add, view, edit, delete and upload truck images.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-500/30 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add Truck
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Stats div elements (hidden to save space, keeping yours exact) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-truck"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Total Trucks</p><h3 className="text-2xl font-bold text-slate-800">25</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl"><i className="fa-regular fa-circle-check"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Active Trucks</p><h3 className="text-2xl font-bold text-slate-800">18</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl"><i className="fa-regular fa-circle-xmark"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Inactive Trucks</p><h3 className="text-2xl font-bold text-slate-800">7</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-xl"><i className="fa-regular fa-calendar"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Available Trucks</p><h3 className="text-2xl font-bold text-slate-800">14</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-xl"><i className="fa-regular fa-calendar-check"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Booked Trucks</p><h3 className="text-2xl font-bold text-slate-800">11</h3></div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Search</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" placeholder="Search by Truck Number, Truck Name or Truck Type" className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="w-48">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Truck Type</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white">
                <option>All Types</option>
                <option>Mini Truck</option>
                <option>Medium Truck</option>
                <option>Heavy Truck</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Availability</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white">
                <option>All Availability</option>
                <option>Available</option>
                <option>Booked</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">Search</button>
              <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">Reset</button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg">Truck List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Truck Number</th>
                    <th className="px-6 py-4">Truck Name</th>
                    <th className="px-6 py-4">Truck Type</th>
                    <th className="px-6 py-4">Capacity (Tons)</th>
                    <th className="px-6 py-4">Model</th>
                    <th className="px-6 py-4">Insurance</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Availability</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {trucksData.map((truck, idx) => (
                    <tr key={truck.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-500">{idx + 1}</td>
                      <td className="px-6 py-3">
                        <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center overflow-hidden">
                          <i className="fa-solid fa-truck text-slate-400"></i>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-700">{truck.number}</td>
                      <td className="px-6 py-3 text-slate-600">{truck.name}</td>
                      <td className="px-6 py-3 text-slate-600">{truck.type}</td>
                      <td className="px-6 py-3 text-slate-600">{truck.capacity}</td>
                      <td className="px-6 py-3 text-slate-600">{truck.model}</td>
                      <td className="px-6 py-3 text-slate-600">{truck.insurance}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold border rounded bg-white ${
                          truck.status === 'ACTIVE' ? 'border-green-300 text-green-600' : 'border-red-300 text-red-600'
                        }`}>
                          {truck.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold border rounded bg-white ${
                          truck.availability === 'AVAILABLE' ? 'border-green-300 text-green-600' : 'border-orange-300 text-orange-600'
                        }`}>
                          {truck.availability}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center gap-2">
                          <button className="w-8 h-8 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"><i className="fa-regular fa-eye"></i></button>
                          <button className="w-8 h-8 rounded border border-orange-200 text-orange-500 hover:bg-orange-50 flex items-center justify-center transition-colors"><i className="fa-solid fa-pencil"></i></button>
                          <button className="w-8 h-8 rounded border border-cyan-200 text-cyan-600 hover:bg-cyan-50 flex items-center justify-center transition-colors"><i className="fa-solid fa-cloud-arrow-up"></i></button>
                          <button className="w-8 h-8 rounded border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"><i className="fa-regular fa-trash-can"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm text-slate-500">Showing 1 to 5 of 25 entries</span>
              <div className="flex gap-2 items-center">
                <div className="flex rounded border border-slate-200 overflow-hidden text-sm">
                  <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-500 border-r border-slate-200"><i className="fa-solid fa-chevron-left"></i></button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white font-medium border-r border-slate-200">1</button>
                  <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200">2</button>
                  <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200">3</button>
                  <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200">4</button>
                  <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200">5</button>
                  <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-500"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
                <select className="border border-slate-200 rounded px-2 py-1.5 text-sm text-slate-600 bg-white outline-none">
                  <option>5 / page</option>
                  <option>10 / page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Legends */}
          <div className="flex gap-10 mt-6 pb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Status</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-600"><span className="px-2 py-0.5 font-bold border border-green-300 text-green-600 rounded bg-white w-20 text-center">ACTIVE</span> - Active Truck</div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><span className="px-2 py-0.5 font-bold border border-red-300 text-red-600 rounded bg-white w-20 text-center">INACTIVE</span> - Inactive Truck</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Availability</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-600"><span className="px-2 py-0.5 font-bold border border-green-300 text-green-600 rounded bg-white w-20 text-center">AVAILABLE</span> - Available for Booking</div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><span className="px-2 py-0.5 font-bold border border-orange-300 text-orange-600 rounded bg-white w-20 text-center">BOOKED</span> - Already Booked</div>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ✨ Beautiful Enterprise Modal ✨ */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity"
          onClick={handleCloseModal} 
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-xl text-slate-800">Add New Truck</h3>
              <button 
                onClick={handleCloseModal} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            {/* Modal Body / Form */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Truck Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="truckNumber" value={formData.truckNumber} onChange={handleInputChange} 
                    placeholder="e.g. GJ01AB1234" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Truck Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="truckName" value={formData.truckName} onChange={handleInputChange}
                    placeholder="e.g. Tata Ace" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Truck Type <span className="text-red-500">*</span></label>
                  <select 
                    name="truckType" value={formData.truckType} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-600"
                  >
                    <option value="">Select Truck Type</option>
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Medium Truck">Medium Truck</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Capacity (Tons) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="capacity" value={formData.capacity} onChange={handleInputChange}
                    placeholder="e.g. 10.5" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Model Year <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="model" value={formData.model} onChange={handleInputChange}
                    placeholder="e.g. 2024" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Insurance Expiry <span className="text-red-500">*</span></label>
                  <input 
                    type="date" name="insurance" value={formData.insurance} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
                  <select 
                    name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-600"
                  >
                    <option value="">Select Status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Availability <span className="text-red-500">*</span></label>
                  <select 
                    name="availability" value={formData.availability} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-600"
                  >
                    <option value="">Select Availability</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                  </select>
                </div>
              </div>
              
              {/* 🚀 HIDDEN INPUT & IMAGE UPLOAD UI 🚀 */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Truck Image</label>
                
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                />
                
                <div 
                  onClick={handleImageClick}
                  className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors group relative overflow-hidden h-40"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected Truck" className="h-full object-contain" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-cloud-arrow-up text-xl text-blue-500"></i>
                      </div>
                      <p className="text-sm font-bold text-slate-700">Click to upload image</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG (Max 2MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTruck} 
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all"
              >
                Save Truck
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};



export default Trucks;