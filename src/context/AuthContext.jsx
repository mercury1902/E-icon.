import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getSession, getCurrentProfile, signOut as authSignOut, checkIsAdmin } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
        const prof = await getCurrentProfile();
        setProfile(prof);
        if (prof) {
          const admin = await checkIsAdmin();
          setIsAdmin(admin);
        }
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      }
    } catch {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => subscription?.unsubscribe();
  }, [refresh]);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
