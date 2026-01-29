import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, getWalletAddress, logout } from '../utils/web3Auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [user, setUser] = useState(null); // chứa thông tin user + role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token khi component mount
    const token = getAuthToken();
    const address = getWalletAddress();
    const storedUser = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      if (address) setWalletAddress(address);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
    
    setLoading(false);
  }, []);

  const login = (address, token, userInfo) => {
    setIsAuthenticated(true);
    setWalletAddress(address || null);
    if (userInfo) {
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setWalletAddress(null);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        walletAddress,
        user,
        role: user?.role || 'ADMIN',
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
