'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // First, clear any local storage and cookies
      localStorage.clear();
      sessionStorage.clear();
      
      // Delete the session cookie
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Then sign out
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      
      // Force a complete page reload to ensure all session data is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if there's an error, we should still try to clear the session
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
} 