import React from 'react';
import { Routes, Route } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InvestorDashboard from '../pages/InvestorDashboard';
import EntrepreneurDashboard from '../pages/EntrepreneurDashboard';
import InvestorProfile from '../pages/InvestorProfile';
import EntrepreneurProfile from '../pages/EntrepreneurProfile';
import Chat from '../pages/Chat';
import ProtectedRoute from '../components/common/ProtectedRoute';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboards (Protected) */}
      <Route path="/dashboard/investor" element={
        <ProtectedRoute>
          <InvestorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/entrepreneur" element={
        <ProtectedRoute>
          <EntrepreneurDashboard />
        </ProtectedRoute>
      } />

      {/* Profiles (Protected) */}
      <Route path="/profile/investor" element={
        <ProtectedRoute>
          <InvestorProfile />
        </ProtectedRoute>
      } />
      <Route path="/profile/entrepreneur" element={
        <ProtectedRoute>
          <EntrepreneurProfile />
        </ProtectedRoute>
      } />

      {/* Chat (Protected, role-based) */}
      <Route path="/chat/:role" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />

      {/* Main dashboard layout (optional, if you want a layout wrapper) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
