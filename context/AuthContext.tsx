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
  adminId: string;
  login: (id: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  changeAdminId: (currentPass: string, newAdminId: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [adminId, setAdminId] = useState<string>(() => {
    return localStorage.getItem('adminUsername') || 'mohan';
  });

  // Monitor Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('isAdminAuthenticated', 'true');
      } else {
        const wasAuthenticatedLocally = localStorage.getItem('isAdminAuthenticated') === 'true';
        if (!wasAuthenticatedLocally) {
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (id: string, pass: string): Promise<boolean> => {
    const normalizedId = id.trim().toLowerCase();
    const storedAdminId = (localStorage.getItem('adminUsername') || 'mohan').toLowerCase();
    const isMockAdmin = normalizedId === storedAdminId || normalizedId === 'mohan' || normalizedId === 'mohan@brandique.in';
    
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
      
      // Fallback: Check if credentials are valid locally
      const customPass = localStorage.getItem('adminPassword');
      let isValidCredentials = false;

      if (isMockAdmin) {
        if (pass === '***REMOVED***' || pass === '***REMOVED***') {
          isValidCredentials = true;
          // Sync/Reset password locally in case it was changed/corrupted
          localStorage.setItem('adminPassword', pass);
        } else if (customPass && pass === customPass) {
          isValidCredentials = true;
        }
      }

      if (isValidCredentials) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);

        // Try to auto-provision user in Firebase Auth silently in the background
        try {
          await createUserWithEmailAndPassword(auth, email, pass);
        } catch (createError: any) {
          console.log('Silent auto-provision info:', createError.code || createError.message);
        }
        
        return true;
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
        isOldPassCorrect = (oldPass === '***REMOVED***' || oldPass === '***REMOVED***');
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
        isOldPassCorrect = (oldPass === '***REMOVED***' || oldPass === '***REMOVED***');
      }

      if (isOldPassCorrect) {
        localStorage.setItem('adminPassword', newPass);
        return { success: true, message: 'Password changed successfully (locally fallback).' };
      }

      return { success: false, message: error.message || 'Incorrect old password.' };
    }
  };

  const changeAdminId = async (currentPass: string, newAdminId: string) => {
    const trimmedId = newAdminId.trim();
    if (!trimmedId) {
      return { success: false, message: 'Admin ID cannot be empty.' };
    }
    if (trimmedId.length < 3) {
      return { success: false, message: 'Admin ID must be at least 3 characters.' };
    }

    // Verify current password
    const customPass = localStorage.getItem('adminPassword');
    let isPassCorrect = false;
    if (customPass) {
      isPassCorrect = (currentPass === customPass);
    } else {
      isPassCorrect = (currentPass === '***REMOVED***' || currentPass === '***REMOVED***');
    }

    if (!isPassCorrect && auth.currentUser) {
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email || '', currentPass);
        await reauthenticateWithCredential(auth.currentUser, credential);
        isPassCorrect = true;
      } catch (e) {
        // Failed reauth
      }
    }

    if (!isPassCorrect) {
      return { success: false, message: 'Incorrect current password.' };
    }

    localStorage.setItem('adminUsername', trimmedId);
    setAdminId(trimmedId);
    return { success: true, message: `Admin ID successfully updated to: ${trimmedId}` };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, adminId, login, logout, changePassword, changeAdminId }}>
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
