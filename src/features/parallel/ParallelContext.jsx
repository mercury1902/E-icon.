import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parallelPartners } from '../../data/parallelMockData';
import * as parallelService from '../../services/parallel';

const ParallelContext = createContext();

function getLocalStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full
  }
}

function ParallelProvider({ children }) {
  const [threads, setThreads] = useState(() => {
    return getLocalStorage('parallelThreads') || [];
  });

  const [listings, setListings] = useState(() => {
    return getLocalStorage('parallelListings') || [];
  });

  const [requests, setRequests] = useState(() => {
    return getLocalStorage('parallelRequests') || [];
  });

  const [notifications, setNotifications] = useState(() => {
    return getLocalStorage('parallelNotifications') || [];
  });

  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    setLocalStorage('parallelThreads', threads);
  }, [threads]);

  useEffect(() => {
    setLocalStorage('parallelListings', listings);
  }, [listings]);

  useEffect(() => {
    setLocalStorage('parallelRequests', requests);
  }, [requests]);

  useEffect(() => {
    setLocalStorage('parallelNotifications', notifications);
  }, [notifications]);

  const startMatching = useCallback(async (prefs) => {
    setIsMatching(true);
    const result = await parallelService.startMatching(prefs);
    setIsMatching(false);

    if (result.success && result.thread) {
      setThreads((prev) => [...prev, result.thread]);
      return { success: true, thread: result.thread };
    }

    // Fallback: simulate realistic matching with mock partners
    await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000));

    const candidates = parallelPartners.filter(
      (p) => prefs.genderPref === 'any' || p.gender === prefs.genderPref
    );

    if (candidates.length > 0) {
      const partner = candidates[Math.floor(Math.random() * candidates.length)];
      const thread = {
        id: `t${Date.now()}`,
        partnerName: partner.name,
        partnerAvatar: partner.avatar,
        prefs: { role: prefs.role },
        description: prefs.description || '',
        messages: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
      setThreads((prev) => [...prev, thread]);
      return { success: true, thread };
    }

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

    // Simulate partner reply after a short delay
    const partnerMsg = {
      id: Date.now() + 1,
      fromPartner: true,
      content: '',
      timestamp: new Date().toISOString(),
      read: false,
    };

    const replyDelay = 1000 + Math.random() * 3000;
    setTimeout(() => {
      const replies = [
        'I hear you. Tell me more.',
        'That takes a lot of courage to share.',
        'I understand how you feel.',
        'Thank you for trusting me with this.',
        'You are not alone in this.',
        'How does that make you feel?',
        'I appreciate you opening up.',
        'That is really powerful.',
      ];
      partnerMsg.content = replies[Math.floor(Math.random() * replies.length)];
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId ? { ...t, messages: [...t.messages, { ...partnerMsg }] } : t
        )
      );
    }, replyDelay);

    parallelService.addMessage(threadId, content);
  }, []);

  const closeThread = useCallback((threadId) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, status: 'expired', expiresAt: new Date().toISOString() }
          : t
      )
    );
    parallelService.closeThread(threadId);
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

  const createListing = useCallback(async ({ userId, userName, role, description }) => {
    const result = await parallelService.createListing({ userName, role, description });
    const listing = result.id
      ? {
          id: result.id,
          userId,
          userName,
          role,
          description,
          status: 'open',
          createdAt: new Date().toISOString(),
        }
      : {
          id: `l${Date.now()}`,
          userId,
          userName,
          role,
          description: description || '',
          status: 'open',
          createdAt: new Date().toISOString(),
        };
    setListings((prev) => [...prev, listing]);
    return listing;
  }, []);

  const requestToJoin = useCallback(async ({ listingId, userId, userName }) => {
    const result = await parallelService.requestToJoin({ listingId, userName });
    const request = {
      id: result.id || `r${Date.now()}`,
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

  const approveRequest = useCallback(async (requestId) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;
    const listing = listings.find((l) => l.id === req.listingId);
    if (!listing) return null;

    const result = await parallelService.approveRequest(requestId, listing);

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: 'matched' } : l))
    );

    let thread;
    if (result && result.id) {
      thread = result;
    } else {
      thread = createThread({
        partnerName: req.userName,
        partnerAvatar: '🦋',
        role: listing.role,
        description: listing.description,
      });
    }

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

  const denyRequest = useCallback(async (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'denied' } : r))
    );
    await parallelService.denyRequest(requestId);
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
    parallelService.markNotificationsRead();
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
