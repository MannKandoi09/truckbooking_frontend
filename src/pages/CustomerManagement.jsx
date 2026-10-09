import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService'; 

const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); 
  const [customersData, setCustomersData] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [cityFilter, setCityFilter] = useState('All Cities');

  // Form Data State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '', 
    email: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'ACTIVE'
  });

  // Initial Fetch
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      if (response.data && response.data.success) {
        setCustomersData(response.data.data);
      } else if (Array.isArray(response.data)) {
        setCustomersData(response.data); 
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode('ADD');
    setSelectedCustomerId(null);
    setFormData({ 
      fullName: '', phone: '', email: '', companyName: '', address: '', city: '', state: '', pincode: '', status: 'ACTIVE' 
    });
  };

  // 🚀 Naya View Function
  const handleView = (customer) => {
    setModalMode('VIEW');
    setSelectedCustomerId(customer.id);
    setFormData({
      fullName: customer.fullName || '',
      phone: customer.phone || '', 
      email: customer.email || '',
      companyName: customer.companyName || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
      status: customer.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setModalMode('EDIT');
    setSelectedCustomerId(customer.id);
    setFormData({
      fullName: customer.fullName || '',
      phone: customer.phone || '', 
      email: customer.email || '',
      companyName: customer.companyName || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
      status: customer.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error("Error deactivating customer:", error);
        alert("Failed to deactivate customer!");
      }
    }
  };

  const handleSaveCustomer = async () => {
    if(!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        alert("Please fill all required fields.");
        return;
    }
    if(formData.phone.length !== 10) {
        alert("Phone number must be exactly 10 digits.");
        return;
    }
    if(formData.pincode.length !== 6) {
        alert("Pincode must be exactly 6 digits.");
        return;
    }

    setLoading(true);
    try {
      if (modalMode === 'EDIT') {
        await updateCustomer(selectedCustomerId, formData);
        alert("Customer Updated Successfully!");
      } else {
        await addCustomer(formData);
        alert("Customer Added Successfully!");
      }
      fetchCustomers();
      handleCloseModal(); 
    } catch (error) {
      console.error("Error saving customer:", error);
      const actualError = error.response?.data?.message || error.response?.data?.error || error.message;
      alert("Backend Error: " + actualError); 
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering logic
  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = (customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (customer.phone?.includes(searchTerm)) ||
                          (customer.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All Status' || customer.status === statusFilter;
    const matchesCity = cityFilter === 'All Cities' || customer.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Calculate dynamic stats
  const uniqueCities = [...new Set(customersData.map(c => c.city).filter(Boolean))];
  const uniqueCompanies = new Set(customersData.map(c => c.companyName).filter(Boolean)).size;

  const isViewMode = modalMode === 'VIEW';

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

        <main className="flex-1 overflow-y-auto p-6">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Customer Management</h2>
              <p className="text-sm text-slate-500 mt-1">Manage all customers - add, view, edit and manage customer details.</p>
            </div>
            <button 
              onClick={() => { setModalMode('ADD'); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add Customer
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-users"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Total Customers</p><h3 className="text-2xl font-bold text-slate-800">{customersData.length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-user-check"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Active Customers</p><h3 className="text-2xl font-bold text-slate-800">{customersData.filter(d => d.status === 'ACTIVE').length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-user-xmark"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Inactive Customers</p><h3 className="text-2xl font-bold text-slate-800">{customersData.filter(d => d.status === 'INACTIVE').length}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-xl"><i className="fa-regular fa-building"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Total Companies</p><h3 className="text-2xl font-bold text-slate-800">{uniqueCompanies}</h3></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-xl"><i className="fa-solid fa-city"></i></div>
              <div><p className="text-xs text-slate-500 font-semibold mb-0.5">Total Cities</p><h3 className="text-2xl font-bold text-slate-800">{uniqueCities.length}</h3></div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Search</label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Name, Phone, Email, Company..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All Status">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="w-48">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">City</label>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All Cities">All Cities</option>
                {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSearchTerm(''); setStatusFilter('All Status'); setCityFilter('All Cities'); }} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">Reset</button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200"><h3 className="font-bold text-slate-800 text-lg">Customer List</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center text-slate-500">No customers found.</td>
                    </tr>
                  ) : filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-500">{customer.id}</td>
                      <td className="px-6 py-3 font-bold text-slate-700">{customer.fullName}</td>
                      <td className="px-6 py-3 text-slate-600">{customer.phone}</td>
                      <td className="px-6 py-3 text-slate-500 text-xs">{customer.email}</td>
                      <td className="px-6 py-3 text-slate-600 font-medium">{customer.companyName || '-'}</td>
                      <td className="px-6 py-3 text-slate-600">{customer.city}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold border rounded bg-white ${
                          customer.status === 'ACTIVE' ? 'border-green-300 text-green-600' : 'border-red-300 text-red-600'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 text-xs">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center gap-2">
                          {/* 🚀 View Button Added Here */}
                          <button onClick={() => handleView(customer)} title="View Details" className="w-8 h-8 rounded border border-blue-200 text-blue-500 hover:bg-blue-50 transition-colors"><i className="fa-regular fa-eye"></i></button>
                          <button onClick={() => handleEdit(customer)} title="Edit" className="w-8 h-8 rounded border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"><i className="fa-solid fa-pencil"></i></button>
                          <button onClick={() => handleDelete(customer.id)} title="Deactivate" className="w-8 h-8 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"><i className="fa-regular fa-trash-can"></i></button>
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

      {/* Modal for Add/Edit/View Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-opacity" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-xl text-slate-800">
                {modalMode === 'EDIT' ? 'Edit Customer' : modalMode === 'VIEW' ? 'View Customer Details' : 'Add New Customer'}
              </h3>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                
                {/* 🚀 All inputs have disabled={isViewMode} */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Rahul Sharma" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10 Digits" maxLength="10" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. rahul@example.com" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Company Name</label>
                  <input disabled={isViewMode} type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Optional" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Address <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street Address" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Vadodara" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. Gujarat" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Pincode <span className="text-red-500">*</span></label>
                  <input disabled={isViewMode} type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6 Digits" maxLength="6" className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
                  <select disabled={isViewMode} name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-600 disabled:opacity-70 disabled:cursor-not-allowed">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCloseModal} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100">
                {isViewMode ? 'Close' : 'Cancel'}
              </button>
              
              {/* 🚀 Save button is hidden in VIEW mode */}
              {!isViewMode && (
                <button onClick={handleSaveCustomer} disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30">
                  {loading ? "Saving..." : "Save Customer"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;