import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  
  try {
    const userData = JSON.parse(user);
    
    // Check if user has the required role
    if (userData.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  } catch (_error) {
    // Invalid user data in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;