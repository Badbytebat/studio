
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  Auth,
  User,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendSignInLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    const handleEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setLoading(true);
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        if (email) {
          try {
            await firebaseSignInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            toast({ title: 'Success', description: 'Signed in successfully.' });
          } catch (error) {
            console.error('Sign in with email link error', error);
            toast({ title: 'Error', description: 'Failed to sign in. The link may be invalid or expired.', variant: 'destructive' });
          } finally {
            // Clean the URL
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
            toast({ title: 'Error', description: 'Email not found for sign in.', variant: 'destructive' });
        }
        setLoading(false);
      }
    };
    
    handleEmailLinkSignIn();

    return () => unsubscribe();
  }, [toast]);

  const sendSignInLink = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast({ title: 'Check your email', description: `A sign-in link has been sent to ${email}.` });
    } catch (error: any) {
      console.error('Send sign in link error', error);
      if (error.code === 'auth/invalid-api-key' || (error.message && error.message.includes('api-key-not-valid'))) {
        toast({
          variant: 'destructive',
          title: 'Firebase Configuration Error',
          description: 'The Firebase API key is not valid. Please check your .env.local file and restart the development server.',
          duration: 10000,
        });
      } else {
        toast({ title: 'Error', description: 'Could not send sign-in link. Please try again.', variant: 'destructive' });
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({ title: 'Signed out', description: 'You have been successfully signed out.' });
    } catch (error) {
      console.error('Sign out error', error);
      toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    }
  };

  const value = { user, loading, sendSignInLink, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
