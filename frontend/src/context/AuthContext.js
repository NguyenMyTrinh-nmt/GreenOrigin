import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, getWalletAddress, logout } from '../utils/web3Auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token khi component mount
    const token = getAuthToken();
    const address = getWalletAddress();
    
    if (token && address) {
      setIsAuthenticated(true);
      setWalletAddress(address);
    }
    
    setLoading(false);
  }, []);

  const login = (address, token) => {
    setIsAuthenticated(true);
    setWalletAddress(address);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        walletAddress,
        loading,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
