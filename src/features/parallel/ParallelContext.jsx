import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ParallelContext = createContext();

function ParallelProvider({ children }) {
  const [threads, setThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('parallelThreads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    localStorage.setItem('parallelThreads', JSON.stringify(threads));
  }, [threads]);

  const startMatching = useCallback(async () => {
    setIsMatching(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsMatching(false);
    return { success: false };
  }, []);

  const addMessage = useCallback((threadId, content) => {
    if (!content.trim()) return;
    const userMsg = {
      id: Date.now(),
      fromPartner: false,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, messages: [...t.messages, userMsg] } : t
      )
    );
  }, []);

  const closeThread = useCallback((threadId) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, status: 'expired', expiresAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const getThread = useCallback(
    (threadId) => threads.find((t) => t.id === threadId) || null,
    [threads]
  );

  const getActiveThreads = useCallback(
    () =>
      threads
        .filter((t) => t.status === 'active' && new Date(t.expiresAt).getTime() > Date.now())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [threads]
  );

  const getExpiredThreads = useCallback(
    () =>
      threads
        .filter((t) => t.status !== 'active' || new Date(t.expiresAt).getTime() <= Date.now())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [threads]
  );

  const getAllThreads = useCallback(
    () => [...threads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [threads]
  );

  return (
    <ParallelContext.Provider
      value={{
        threads,
        isMatching,
        startMatching,
        addMessage,
        closeThread,
        getThread,
        getActiveThreads,
        getExpiredThreads,
        getAllThreads,
      }}
    >
      {children}
    </ParallelContext.Provider>
  );
}

function useParallel() {
  const ctx = useContext(ParallelContext);
  if (!ctx) throw new Error('useParallel must be used within ParallelProvider');
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export { ParallelProvider, useParallel };
