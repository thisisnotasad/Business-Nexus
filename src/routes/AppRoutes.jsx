import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundry from '../components/error/ErrorBoundry'


import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InvestorDashboard from '../pages/InvestorDashboard';
import EntrepreneurDashboard from '../pages/EntrepreneurDashboard';
import InvestorProfile from '../pages/InvestorProfile';
import EntrepreneurProfile from '../pages/EntrepreneurProfile';

import Chat from '../pages/Chat';
import ProtectedRoute from '../components/common/ProtectedRoute';
import NotFound from '../pages/NotFound';
import { useParams } from 'react-router-dom';


// DashboardSelector and ProfileSelector wrappers
function DashboardSelector() {
  const { role } = useParams();
  if (role === 'investor') return <InvestorDashboard />;
  if (role === 'entrepreneur') return <EntrepreneurDashboard />;
  return <NotFound />;
}

function ProfileSelector() {
  const { role } = useParams();
  if (role === 'investor') return <InvestorProfile />;
  if (role === 'entrepreneur') return <EntrepreneurProfile />;
  return <NotFound />;
}


const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboards (Protected) */}
      <Route path="/dashboard/:role" element={
        <ProtectedRoute>
          <DashboardSelector />
        </ProtectedRoute>
      } />

      {/* Profiles (Protected) */}
      <Route path="/profile/:role/:id" element={
        <ProtectedRoute>
          <ProfileSelector />
        </ProtectedRoute>
      } />

      {/* Chat (Protected, role-based) */}
      <Route path="/chat/:role/:id" element={
        <ErrorBoundry>
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        </ErrorBoundry>
      } />

      {/* Main dashboard layout (optional, if you want a layout wrapper) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      } />
      {/* 404 Not Found (catch-all) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
