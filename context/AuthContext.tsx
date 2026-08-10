import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  updatePassword, 
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (id: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Monitor Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('isAdminAuthenticated', 'true');
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminAuthenticated');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (id: string, pass: string): Promise<boolean> => {
    const normalizedId = id.trim().toLowerCase();
    const isMockAdmin = normalizedId === 'mohan5942';
    
    // Convert to a valid email format for Firebase Auth if not already an email
    const email = id.includes('@') ? id.trim() : `${normalizedId}@brandique.in`;

    try {
      // Try to log in via Firebase Auth
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    } catch (error: any) {
      console.log('Firebase auth login failed:', error.code || error.message);
      
      // If the user does not exist, check if we can auto-provision using default admin credentials
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        const customPass = localStorage.getItem('adminPassword');
        let isValidCredentials = false;

        if (isMockAdmin) {
          if (customPass) {
            isValidCredentials = (pass === customPass);
          } else {
            isValidCredentials = (pass === 'Mohan@5942' || pass === 'Mohan@20452');
          }
        }

        if (isValidCredentials) {
          try {
            // Auto-provision admin user in Firebase Auth
            await createUserWithEmailAndPassword(auth, email, pass);
            localStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
            return true;
          } catch (createError) {
            console.error('Failed to auto-create admin in Firebase Auth:', createError);
          }
        }
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    const user = auth.currentUser;
    if (!user) {
      // Fallback in case user is authenticated locally but Firebase Auth hasn't completed or is not in sync
      const customPass = localStorage.getItem('adminPassword');
      let isOldPassCorrect = false;
      if (customPass) {
        isOldPassCorrect = (oldPass === customPass);
      } else {
        isOldPassCorrect = (oldPass === 'Mohan@5942' || oldPass === 'Mohan@20452');
      }

      if (isOldPassCorrect) {
        if (newPass.trim().length < 6) {
          return { success: false, message: 'New password must be at least 6 characters.' };
        }
        localStorage.setItem('adminPassword', newPass);
        return { success: true, message: 'Password changed successfully (locally).' };
      }
      return { success: false, message: 'No authenticated Firebase user found.' };
    }

    if (newPass.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    try {
      // Re-authenticate first to allow password changes
      const credential = EmailAuthProvider.credential(user.email || '', oldPass);
      await reauthenticateWithCredential(user, credential);
      
      // Update password in Firebase Auth
      await updatePassword(user, newPass);
      
      // Keep local sync
      localStorage.setItem('adminPassword', newPass);
      return { success: true, message: 'Password changed successfully.' };
    } catch (error: any) {
      console.error('Error changing password in Firebase Auth:', error);
      
      // Fallback to local storage for testing/flexibility
      const customPass = localStorage.getItem('adminPassword');
      let isOldPassCorrect = false;
      if (customPass) {
        isOldPassCorrect = (oldPass === customPass);
      } else {
        isOldPassCorrect = (oldPass === 'Mohan@5942' || oldPass === 'Mohan@20452');
      }

      if (isOldPassCorrect) {
        localStorage.setItem('adminPassword', newPass);
        return { success: true, message: 'Password changed successfully (locally fallback).' };
      }

      return { success: false, message: error.message || 'Incorrect old password.' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, changePassword }}>
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
