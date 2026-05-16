/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const DEV_USER_KEY = 'sns_dev_user';
const ADMIN_EMAILS = ['badsha@gmail.com', 'hb395586@gmail.com'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);
  const isDevModeRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!supabase) {
          const stored = localStorage.getItem(DEV_USER_KEY);
          if (stored) {
            setUser(JSON.parse(stored));
            setIsDevMode(true);
            isDevModeRef.current = true;
          }
          setIsLoading(false);
          return;
        }
        const stored = localStorage.getItem(DEV_USER_KEY);
        const currentUser = await authService.getCurrentUser();

        let resolvedUser = currentUser;
        if (!resolvedUser && stored) {
          resolvedUser = JSON.parse(stored);
          setIsDevMode(true);
          isDevModeRef.current = true;
        }

        if (resolvedUser && isAdminEmail(resolvedUser.email)) {
          resolvedUser = { ...resolvedUser, role: 'admin' };
        }

        if (resolvedUser) {
          setUser(resolvedUser);
        }
      } catch {
        const stored = localStorage.getItem(DEV_USER_KEY);
        if (stored) {
          const devUser = JSON.parse(stored);
          if (isAdminEmail(devUser.email)) {
            devUser.role = 'admin';
          }
          setUser(devUser);
          setIsDevMode(true);
          isDevModeRef.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();

    if (!supabase) return;
    const { data: listener } = authService.onAuthStateChange(async () => {
      if (isDevModeRef.current) return;
      try {
        let currentUser = await Promise.race([
          authService.getCurrentUser(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
        ]);
        if (currentUser && isAdminEmail(currentUser.email)) {
          currentUser = { ...currentUser, role: 'admin' };
        }
        if (currentUser) setUser(currentUser);
      } catch {
        // ignore auth state errors
      }
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const isNetworkError = (err) => {
    const msg = err?.message?.toLowerCase() || '';
    return !msg || msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')
      || msg.includes('could not connect') || msg.includes('timeout') || msg.includes('503')
      || msg.includes('500') || msg.includes('internal');
  };

  const signIn = async ({ email, password }) => {
    if (!supabase) {
      const name = email ? email.split('@')[0] : 'Dev User';
      const devUser = { id: 'dev-user', name, email: email || 'dev@example.com', role: 'admin' };
      localStorage.setItem(DEV_USER_KEY, JSON.stringify(devUser));
      setUser(devUser);
      setIsDevMode(true);
      isDevModeRef.current = true;
      return;
    }
    try {
      await authService.signIn({ email, password });
      let currentUser = await authService.getCurrentUser();
      if (currentUser && isAdminEmail(email)) {
        currentUser = { ...currentUser, role: 'admin' };
      }
      if (!currentUser) throw new Error('No user returned');
      setUser(currentUser);
    } catch (err) {
      if (isNetworkError(err)) {
        const name = email ? email.split('@')[0] : 'Dev User';
        const devUser = { id: 'dev-user', name, email: email || 'dev@example.com', role: 'admin' };
        localStorage.setItem(DEV_USER_KEY, JSON.stringify(devUser));
        setUser(devUser);
        setIsDevMode(true);
        isDevModeRef.current = true;
        return;
      }
      throw err;
    }
  };

  const signUp = async ({ name, email, password }) => {
    if (!supabase) {
      const devUser = { id: 'dev-user', name: name || 'Dev User', email: email || 'dev@example.com', role: 'admin' };
      localStorage.setItem(DEV_USER_KEY, JSON.stringify(devUser));
      setUser(devUser);
      setIsDevMode(true);
      isDevModeRef.current = true;
      return 'dev';
    }
    try {
      await authService.signUp({ name, email, password });
      return 'supabase';
    } catch (err) {
      if (isNetworkError(err)) {
        const devUser = { id: 'dev-user', name: name || 'Dev User', email: email || 'dev@example.com', role: 'admin' };
        localStorage.setItem(DEV_USER_KEY, JSON.stringify(devUser));
        setUser(devUser);
        setIsDevMode(true);
        isDevModeRef.current = true;
        return 'dev';
      }
      throw err;
    }
  };

  const signOut = async () => {
    if (!supabase || isDevMode) {
      localStorage.removeItem(DEV_USER_KEY);
      setUser(null);
      setIsDevMode(false);
      isDevModeRef.current = false;
      return;
    }
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isDevMode, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const isAdminEmail = (email) => ADMIN_EMAILS.includes(email?.toLowerCase());
