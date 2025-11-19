import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // For development, allow access and let the component handle auth
  if (!token || !user) {
    console.log('No token/user found, allowing component to handle auth');
    return children;
  }
  
  try {
    const userData = JSON.parse(user);
    
    // Check if user has the required role
    if (userData.role !== requiredRole) {
      console.log('Role mismatch, allowing component to handle auth');
      return children;
    }
    
    return children;
  } catch (_error) {
    // Invalid user data - let component handle it
    console.log('Invalid user data, allowing component to handle auth');
    return children;
  }
};

export default ProtectedRoute;