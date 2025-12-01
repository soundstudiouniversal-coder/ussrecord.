
"use client";

import { createContext, useState, useMemo, type ReactNode, useEffect, useCallback } from 'react';
import { useFirebase } from '@/firebase';
import { initiateAnonymousSignIn, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';

export interface AdminContextType {
  isAdmin: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  userId: string;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { auth, user, isUserLoading } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (auth && !user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  useEffect(() => {
    const storedAdminState = sessionStorage.getItem('isAdmin');
    if (storedAdminState === 'true' && user) {
        if (!user.isAnonymous) {
            setIsAdmin(true);
        } else {
            // Log out if we are in an admin state but the user is anonymous
            logout();
        }
    }
  }, [user]);

  const login = useCallback((user: string, pass: string): boolean => {
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'Kumaraguru';
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'Prabavathi';
    const adminEmail = "admin@example.com";

    if (user === adminUser && pass === adminPass && auth) {
      // Try to sign in first
      signInWithEmailAndPassword(auth, adminEmail, adminPass)
        .then(() => {
          // Success, auth state will be handled by onAuthStateChanged
          setIsAdmin(true);
          sessionStorage.setItem('isAdmin', 'true');
        })
        .catch((error) => {
          // If sign-in fails because the user doesn't exist, create it.
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            console.log("Admin user not found, attempting to create...");
            initiateEmailSignUp(auth, adminEmail, adminPass);
            // After sign-up, the onAuthStateChanged listener will handle setting the user.
             setIsAdmin(true);
             sessionStorage.setItem('isAdmin', 'true');
          } else {
            // For other errors (e.g., wrong password, network issues), show a toast.
            console.error("Admin login error:", error);
            toast({
              variant: "destructive",
              title: "Admin Login Failed",
              description: "An unexpected error occurred. Please check credentials or network.",
            });
          }
        });

      return true; // Optimistically return true for UI responsiveness
    }
    
    // If login fails, we ensure the state is correct.
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
    return false;
  }, [auth, toast]);

  const logout = useCallback(() => {
    if (auth) {
      auth.signOut().then(() => {
        initiateAnonymousSignIn(auth);
      }).catch(error => {
        console.error("Sign out error", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "Could not sign out properly. Please try again.",
        });
      });
    }
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  }, [auth, toast]);

  const userId = user?.uid || '';
  const value = useMemo(() => ({ isAdmin, login, logout, userId }), [isAdmin, login, logout, userId]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
