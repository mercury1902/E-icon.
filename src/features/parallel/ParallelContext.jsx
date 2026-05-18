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

  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem('parallelListings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('parallelRequests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('parallelNotifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    localStorage.setItem('parallelThreads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('parallelListings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('parallelRequests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('parallelNotifications', JSON.stringify(notifications));
  }, [notifications]);

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

  const getConnectionCount = useCallback(
    () => threads.length,
    [threads]
  );

  const createThread = useCallback(({ partnerName, partnerAvatar, role, description }) => {
    const thread = {
      id: `t${Date.now()}`,
      partnerName,
      partnerAvatar: partnerAvatar || '🦋',
      prefs: { role },
      description: description || '',
      messages: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
    setThreads((prev) => [...prev, thread]);
    return thread;
  }, []);

  const createListing = useCallback(({ userId, userName, role, description }) => {
    const listing = {
      id: `l${Date.now()}`,
      userId,
      userName,
      role,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [...prev, listing]);
    return listing;
  }, []);

  const requestToJoin = useCallback(({ listingId, userId, userName }) => {
    const request = {
      id: `r${Date.now()}`,
      listingId,
      userId,
      userName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [...prev, request]);
    const listing = listings.find((l) => l.id === listingId);
    if (listing) {
      const notif = {
        id: `n${Date.now()}`,
        type: 'request',
        listingId,
        requestId: request.id,
        fromUserName: userName,
        fromUserId: userId,
        role: listing.role,
        description: listing.description,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [...prev, notif]);
    }
    return request;
  }, [listings]);

  const approveRequest = useCallback((requestId) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;
    const listing = listings.find((l) => l.id === req.listingId);
    if (!listing) return null;

    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: 'approved' } : r)
    );
    setListings((prev) =>
      prev.map((l) => l.id === listing.id ? { ...l, status: 'matched' } : l)
    );

    const thread = createThread({
      partnerName: req.userName,
      partnerAvatar: '🦋',
      role: listing.role,
      description: listing.description,
    });

    const notif = {
      id: `n${Date.now()}`,
      type: 'approved',
      threadId: thread.id,
      fromUserName: listing.userName,
      role: listing.role,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [...prev, notif]);

    return thread;
  }, [requests, listings, createThread]);

  const denyRequest = useCallback((requestId) => {
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: 'denied' } : r)
    );
  }, []);

  const getOpenListings = useCallback(
    (userId) => listings.filter((l) => l.status === 'open' && l.userId !== userId),
    [listings]
  );

  const getMyListings = useCallback(
    (userId) => listings.filter((l) => l.userId === userId),
    [listings]
  );

  const getPendingRequestsForListing = useCallback(
    (listingId) => requests.filter((r) => r.listingId === listingId && r.status === 'pending'),
    [requests]
  );

  const getAllRequests = useCallback(() => requests, [requests]);

  const getNotifications = useCallback(
    (userId) => notifications.filter((n) => {
      if (n.type === 'approved') return true;
      const listing = listings.find((l) => l.id === n.listingId);
      return listing && listing.userId === userId;
    }),
    [notifications, listings]
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadNotificationCount = useCallback(
    (userId) => notifications.filter((n) => {
      if (n.read) return false;
      if (n.type === 'approved') return true;
      const listing = listings.find((l) => l.id === n.listingId);
      return listing && listing.userId === userId;
    }).length,
    [notifications, listings]
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
        getConnectionCount,
        createThread,
        createListing,
        requestToJoin,
        approveRequest,
        denyRequest,
        getOpenListings,
        getMyListings,
        getPendingRequestsForListing,
        getAllRequests,
        getNotifications,
        markNotificationsRead,
        unreadNotificationCount,
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

export { ParallelProvider, useParallel };
