import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard'; 
import UserDashboard from './pages/UserDashboard';   
import Trucks from './pages/Trucks';
import Drivers from './pages/Drivers'; 
import CustomerManagement from './pages/CustomerManagement';
import BookingManagement from './pages/BookingManagement'; // 🚀 Booking import add kar diya

function App() {
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Naye Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/trucks" element={<Trucks />} />
        <Route path="/drivers" element={<Drivers />} /> 
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/bookings" element={<BookingManagement />} /> {/* 🚀 Booking route add kar diya */}
      </Routes>
    </div>
  );
}

export default App;