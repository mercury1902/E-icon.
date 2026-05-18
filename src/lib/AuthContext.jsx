import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await loadProfile(s.user.id);
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await loadProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    setProfile(data);
  };

  const signUp = useCallback(async ({ username, password, nickname, email, age }) => {
    const signUpEmail = email && email.trim()
      ? email.trim()
      : `${username.trim().toLowerCase()}@murmur.local`;

    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password,
      options: {
        data: {
          username: username.trim(),
          nickname: nickname?.trim() || null,
          age: age ? parseInt(age, 10) : null,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'Tên người dùng hoặc email đã được đăng ký' };
      }
      if (error.message.includes('password')) {
        return { error: 'Mật khẩu phải có ít nhất 6 ký tự' };
      }
      return { error: error.message };
    }

    return { data, error: null };
  }, []);

  const signIn = useCallback(async ({ username, password }) => {
    const trimmedUsername = username.trim().toLowerCase();

    const { data: profileData, error: lookupError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', trimmedUsername)
      .maybeSingle();

    if (lookupError) {
      return { error: 'Không thể kết nối đến máy chủ' };
    }

    let loginEmail = profileData?.email;

    if (!loginEmail) {
      loginEmail = `${trimmedUsername}@murmur.local`;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Tên người dùng hoặc mật khẩu không đúng' };
      }
      return { error: error.message };
    }

    return { data, error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: 'Chưa đăng nhập' };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
