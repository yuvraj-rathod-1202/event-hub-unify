
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RequireAdmin = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-light">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    // Redirect to login page but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin()) {
    // Redirect to home page if user is not an admin
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default RequireAdmin;
