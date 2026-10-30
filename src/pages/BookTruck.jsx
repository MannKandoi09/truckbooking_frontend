import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { createBooking } from '../services/bookingService';
import { getActiveRoutes } from '../services/routeService';
import { getAllTrucks } from '../services/truckService';
import { getAllDrivers } from '../services/driverService';
import { getAllCustomers } from '../services/customerService';

const BookTruck = () => {
  const navigate = useNavigate();
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userEmail = localStorage.getItem('email') || '';
  const userFirstName = localStorage.getItem('firstName') || 'Customer';

  const [formData, setFormData] = useState({
    customerId: '',
    routeId: '',
    truckId: '',
    driverId: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    cargoDescription: '',
    cargoWeight: '',
    freightAmount: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [rRes, tRes, dRes, cRes] = await Promise.all([
        getActiveRoutes().catch(() => ({ data: { data: [] } })),
        getAllTrucks().catch(() => ({ data: { data: [] } })),
        getAllDrivers().catch(() => ({ data: { data: [] } })),
        getAllCustomers().catch(() => ({ data: { data: [] } }))
      ]);

      const rData = rRes.data?.data || rRes.data || [];
      const tData = tRes.data?.data || tRes.data || [];
      const dData = dRes.data?.data || dRes.data || [];
      const cData = cRes.data?.data || cRes.data || [];

      setActiveRoutes(Array.isArray(rData) ? rData : []);
      setTrucks(Array.isArray(tData) ? tData : []);
      setDrivers(Array.isArray(dData) ? dData : []);
      setCustomers(Array.isArray(cData) ? cData : []);

      // Auto-match customer profile by logged-in user email
      if (Array.isArray(cData) && cData.length > 0) {
        const matchedCustomer = cData.find(c => 
          c.email?.toLowerCase() === userEmail.toLowerCase() || 
          c.fullName?.toLowerCase().includes(userFirstName.toLowerCase())
        );
        if (matchedCustomer) {
          setFormData(prev => ({ ...prev, customerId: matchedCustomer.id }));
        } else {
          setFormData(prev => ({ ...prev, customerId: cData[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load booking dependencies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Only show active and available trucks for booking
  const availableTrucks = trucks.filter(t => 
    t.status === 'ACTIVE' && (t.availability === 'AVAILABLE' || !t.availability)
  );

  // When route changes, auto-populate source and destination and calculate freight
  const handleRouteChange = (e) => {
    const selectedId = e.target.value;
    const selectedRoute = activeRoutes.find(r => r.id === Number(selectedId));

    let estimatedFreight = formData.freightAmount;
    if (selectedRoute && selectedRoute.distanceKm) {
      const weightFactor = Number(formData.cargoWeight) > 0 ? Number(formData.cargoWeight) * 350 : 2000;
      estimatedFreight = Math.round(4000 + (selectedRoute.distanceKm * 40) + weightFactor);
    }

    setFormData(prev => ({
      ...prev,
      routeId: selectedId,
      pickupLocation: selectedRoute ? selectedRoute.source : prev.pickupLocation,
      deliveryLocation: selectedRoute ? selectedRoute.destination : prev.deliveryLocation,
      freightAmount: estimatedFreight || prev.freightAmount
    }));
  };

  // When truck changes, auto-assign the verified driver assigned to that truck
  const handleTruckChange = (e) => {
    const tId = e.target.value;
    let assignedDriverId = '';

    if (tId) {
      const foundDriver = drivers.find(d => 
        (d.truckId === Number(tId) || (d.truck && d.truck.id === Number(tId))) && d.status === 'ACTIVE'
      );
      if (foundDriver) {
        assignedDriverId = foundDriver.id;
      } else {
        // Fallback: pick any active driver if none assigned
        const anyActiveDriver = drivers.find(d => d.status === 'ACTIVE');
        if (anyActiveDriver) assignedDriverId = anyActiveDriver.id;
      }
    }

    setFormData(prev => ({
      ...prev,
      truckId: tId,
      driverId: assignedDriverId
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      alert("Please select or confirm your customer account profile.");
      return;
    }

    if (!formData.truckId) {
      alert("Please select an available commercial truck for your cargo.");
      return;
    }

    if (!formData.pickupLocation.trim() || !formData.deliveryLocation.trim()) {
      alert("Pickup and delivery locations are required.");
      return;
    }

    if (formData.pickupLocation.trim().toLowerCase() === formData.deliveryLocation.trim().toLowerCase()) {
      alert("Pickup location and Delivery location must be different.");
      return;
    }

    if (!formData.pickupDate) {
      alert("Please select a pickup date.");
      return;
    }

    if (!formData.cargoDescription.trim()) {
      alert("Please provide cargo description.");
      return;
    }

    if (!formData.cargoWeight || Number(formData.cargoWeight) <= 0) {
      alert("Cargo weight must be greater than zero.");
      return;
    }

    // Verify truck capacity
    const chosenTruck = trucks.find(t => t.id === Number(formData.truckId));
    if (chosenTruck && chosenTruck.capacity && Number(formData.cargoWeight) > chosenTruck.capacity) {
      alert(`Cargo weight (${formData.cargoWeight}T) exceeds selected truck capacity (${chosenTruck.capacity}T). Please select a larger truck.`);
      return;
    }

    // Ensure driverId is assigned (if not assigned to truck, use any active driver to satisfy backend requirement)
    let finalDriverId = formData.driverId;
    if (!finalDriverId) {
      const activeDriver = drivers.find(d => d.truckId === Number(formData.truckId)) || drivers.find(d => d.status === 'ACTIVE');
      if (activeDriver) {
        finalDriverId = activeDriver.id;
      } else if (drivers.length > 0) {
        finalDriverId = drivers[0].id;
      } else {
        alert("No active driver is currently registered in the system. Please contact the administrator.");
        return;
      }
    }

    const payload = {
      customerId: Number(formData.customerId),
      truckId: Number(formData.truckId),
      driverId: Number(finalDriverId),
      routeId: formData.routeId ? Number(formData.routeId) : null,
      pickupLocation: formData.pickupLocation.trim(),
      deliveryLocation: formData.deliveryLocation.trim(),
      pickupDate: formData.pickupDate,
      cargoDescription: formData.cargoDescription.trim(),
      cargoWeight: Number(formData.cargoWeight),
      freightAmount: Number(formData.freightAmount) || 12000
    };

    setSubmitting(true);
    try {
      const res = await createBooking(payload);
      if (res && res.data && res.data.success === false) {
        alert("Booking Failed: " + res.data.message);
        return;
      }
      alert("🎉 Booking submitted successfully! Your consignment reference has been generated.");
      navigate('/my-bookings');
    } catch (err) {
      console.error("Booking error:", err);
      const actualError = err.response?.data?.message || err.response?.data?.error || err.message;
      alert("Submission Error: " + actualError);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRouteObj = activeRoutes.find(r => r.id === Number(formData.routeId));
  const selectedTruckObj = trucks.find(t => t.id === Number(formData.truckId));
  const assignedDriverObj = drivers.find(d => d.id === Number(formData.driverId));

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">Direct Consignment Booking</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">Signed in as {userFirstName}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <i className="fa-solid fa-truck"></i>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 max-w-4xl">
          <section className="mb-6">
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-blue-100">
                <i className="fa-solid fa-truck-moving"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Book a Commercial Truck</h2>
                <p className="text-xs text-slate-500 font-medium">Select an active corridor, choose an available fleet truck, and dispatch your freight.</p>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600 mb-3"></i>
              <p className="font-semibold text-sm text-slate-700">Loading available fleet trucks &amp; transport corridors...</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Customer Account Profile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Customer Account / Billing Entity <span className="text-red-500">*</span></span>
                    <span className="text-[11px] text-blue-600 font-semibold">{customers.length} customer profiles loaded</span>
                  </label>
                  <select 
                    name="customerId" 
                    value={formData.customerId} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Select Customer Account --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} &bull; {c.companyName || 'Individual'} ({c.phone || c.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Corridor Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-map-location-dot text-blue-600"></i> Select Established Corridor (Optional)
                  </label>
                  <select 
                    name="routeId" 
                    value={formData.routeId} 
                    onChange={handleRouteChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Custom Direct Route (Enter Pickup &amp; Delivery below) --</option>
                    {activeRoutes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.routeCode} &bull; {r.routeName} ({r.source} &rarr; {r.destination}) &bull; {r.distanceKm} km
                      </option>
                    ))}
                  </select>
                </div>

                {/* Corridor Preview if selected */}
                {selectedRouteObj && (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{selectedRouteObj.routeCode}</span>
                        <span className="font-bold text-slate-800 text-sm ml-2">{selectedRouteObj.routeName}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{selectedRouteObj.distanceKm} km</span>
                    </div>
                    {selectedRouteObj.stops && selectedRouteObj.stops.length > 0 && (
                      <p className="text-xs text-slate-500 mt-2">
                        <span className="font-bold">Intermediates:</span> {selectedRouteObj.stops.map(s => s.stopName).join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Available Trucks Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Available Commercial Trucks ({availableTrucks.length} ready for dispatch) <span className="text-red-500">*</span></span>
                    <span className="text-[11px] text-emerald-600 font-bold"><i className="fa-solid fa-circle-check"></i> Available Fleet</span>
                  </label>
                  
                  {availableTrucks.length === 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      No trucks currently marked as AVAILABLE. Displaying all registered fleet vehicles below:
                    </div>
                  ) : null}

                  <select 
                    name="truckId" 
                    value={formData.truckId} 
                    onChange={handleTruckChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Choose Truck Vehicle --</option>
                    {(availableTrucks.length > 0 ? availableTrucks : trucks).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.truckNumber} &bull; {t.truckName || t.truckType} &bull; Capacity: {t.capacity} Tons ({t.status})
                      </option>
                    ))}
                  </select>

                  {/* Truck & Driver Info Banner */}
                  {selectedTruckObj && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">
                          <i className="fa-solid fa-truck text-blue-600 mr-1.5"></i>
                          {selectedTruckObj.truckNumber} - {selectedTruckObj.truckName} ({selectedTruckObj.truckType})
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Payload Limit: {selectedTruckObj.capacity} Tons</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Driver</span>
                        <p className="font-extrabold text-blue-700">
                          {assignedDriverObj ? assignedDriverObj.fullName : 'Verified Fleet Driver'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pickup & Delivery Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickup Address <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="pickupLocation" 
                      value={formData.pickupLocation} 
                      onChange={handleChange} 
                      required 
                      placeholder="Factory, warehouse, or pickup location"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Address <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="deliveryLocation" 
                      value={formData.deliveryLocation} 
                      onChange={handleChange} 
                      required 
                      placeholder="Recipient warehouse or delivery destination"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Date, Weight, Freight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickup Date <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      name="pickupDate" 
                      value={formData.pickupDate} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Cargo Weight (Tons) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      name="cargoWeight" 
                      value={formData.cargoWeight} 
                      onChange={handleChange} 
                      required 
                      step="0.1" 
                      min="0.1" 
                      placeholder="e.g. 4.5"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimated Freight (&#8377;) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      name="freightAmount" 
                      value={formData.freightAmount} 
                      onChange={handleChange} 
                      required
                      placeholder="e.g. 12500"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Cargo Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cargo Description <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="cargoDescription" 
                    value={formData.cargoDescription} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Industrial machinery, electronic components, raw materials..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
                  >
                    {submitting ? 'Submitting Booking...' : 'Confirm Consignment Booking'}
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookTruck;
