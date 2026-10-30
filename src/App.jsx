import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Operations
import AdminDashboard from './pages/AdminDashboard'; 
import Trucks from './pages/Trucks';
import Drivers from './pages/Drivers'; 
import CustomerManagement from './pages/CustomerManagement';
import BookingManagement from './pages/BookingManagement'; 
import RoutesManagement from './pages/RoutesManagement';
import PaymentManagement from './pages/PaymentManagement';
import Reports from './pages/Reports';
import Users from './pages/Users';

// Shared Account Pages
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

// User / Customer Pages
import UserDashboard from './pages/UserDashboard';
import BookTruck from './pages/BookTruck';
import MyBookings from './pages/MyBookings';
import UserPayments from './pages/UserPayments';
import BookingHistory from './pages/BookingHistory';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc]">
      <Routes>
        {/* Default redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Navigation */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/trucks" element={<Trucks />} />
        <Route path="/drivers" element={<Drivers />} /> 
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/bookings" element={<BookingManagement />} /> 
        <Route path="/routes" element={<RoutesManagement />} />
        <Route path="/payments" element={<PaymentManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        
        {/* User Navigation */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/book-truck" element={<BookTruck />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/user-payments" element={<UserPayments />} />
        <Route path="/booking-history" element={<BookingHistory />} />

        {/* Account Management */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/settings" element={<Profile />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
