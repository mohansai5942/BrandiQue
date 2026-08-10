import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (id: string, pass: string) => boolean;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  const login = (id: string, pass: string) => {
    const customPass = localStorage.getItem('adminPassword');
    if (id === 'Mohan5942') {
      if (customPass) {
        if (pass === customPass) {
          localStorage.setItem('isAdminAuthenticated', 'true');
          setIsAuthenticated(true);
          return true;
        }
      } else {
        if (pass === '***REMOVED***' || pass === '***REMOVED***') {
          localStorage.setItem('isAdminAuthenticated', 'true');
          setIsAuthenticated(true);
          return true;
        }
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };

  const changePassword = (oldPass: string, newPass: string) => {
    const customPass = localStorage.getItem('adminPassword');
    
    // Validate old password
    let isOldPassCorrect = false;
    if (customPass) {
      isOldPassCorrect = (oldPass === customPass);
    } else {
      isOldPassCorrect = (oldPass === '***REMOVED***' || oldPass === '***REMOVED***');
    }

    if (!isOldPassCorrect) {
      return { success: false, message: 'Incorrect old password.' };
    }
    if (newPass.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    localStorage.setItem('adminPassword', newPass);
    return { success: true, message: 'Password changed successfully.' };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
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
