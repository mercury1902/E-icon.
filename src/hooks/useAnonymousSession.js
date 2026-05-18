import { useState, useEffect, useCallback } from 'react';
import { getOrCreateSession, refreshSessionActivity, clearSession } from '../services/sessionService';

export function useAnonymousSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    getOrCreateSession()
      .then((s) => {
        if (mounted) {
          setSession(s);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const refreshActivity = useCallback(() => {
    if (session?.id) {
      refreshSessionActivity(session.id);
    }
  }, [session]);

  const resetSession = useCallback(() => {
    clearSession();
    setSession(null);
    setLoading(true);
    getOrCreateSession().then(setSession).finally(() => setLoading(false));
  }, []);

  return {
    session,
    loading,
    error,
    refreshActivity,
    resetSession,
  };
}
