import { supabase, TABLES } from '../lib/supabaseClient';

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

export async function startMatching(prefs) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_THREADS)
      .insert({
        partner_id: '00000000-0000-0000-0000-000000000000', // placeholder
        role: prefs.role,
        description: prefs.description || '',
        status: 'active',
      })
      .select()
      .single();
    if (error) throw error;
    return { success: true, thread: data };
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return { success: false };
  }
}

export async function addMessage(threadId, content) {
  if (!content.trim()) return null;
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_MESSAGES)
      .insert({
        thread_id: threadId,
        content: content.trim(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    return {
      id: Date.now(),
      thread_id: threadId,
      content: content.trim(),
      sender_id: 'local',
      created_at: new Date().toISOString(),
      fromPartner: false,
      read: true,
    };
  }
}

export async function closeThread(threadId) {
  try {
    const { error } = await supabase
      .from(TABLES.PARALLEL_THREADS)
      .update({ status: 'expired', expires_at: new Date().toISOString() })
      .eq('id', threadId);
    if (error) throw error;
  } catch {
    // silently fail, local state handles it
  }
}

export async function getThreads(userId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_THREADS)
      .select('*')
      .or(`creator_id.eq.${userId},partner_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return getLocalStorage('parallelThreads') || [];
  }
}

export async function getMessages(threadId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_MESSAGES)
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch {
    const threads = getLocalStorage('parallelThreads') || [];
    const thread = threads.find((t) => t.id === threadId);
    return thread ? thread.messages || [] : [];
  }
}

export async function createListing({ userName, role, description }) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_LISTINGS)
      .insert({
        creator_name: userName,
        role,
        description: description || '',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    const listing = {
      id: `l${Date.now()}`,
      userName,
      role,
      description: description || '',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const prev = getLocalStorage('parallelListings') || [];
    setLocalStorage('parallelListings', [...prev, listing]);
    return listing;
  }
}

export async function requestToJoin({ listingId, userName }) {
  const request = {
    id: `r${Date.now()}`,
    listingId,
    userName,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_REQUESTS)
      .insert({
        listing_id: listingId,
        requester_name: userName,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    const prev = getLocalStorage('parallelRequests') || [];
    setLocalStorage('parallelRequests', [...prev, request]);
    const listings = getLocalStorage('parallelListings') || [];
    const listing = listings.find((l) => l.id === listingId);
    if (listing) {
      const notif = {
        id: `n${Date.now()}`,
        type: 'request',
        listingId,
        requestId: request.id,
        fromUserName: userName,
        role: listing.role,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const notifs = getLocalStorage('parallelNotifications') || [];
      setLocalStorage('parallelNotifications', [...notifs, notif]);
    }
    return request;
  }
}

export async function approveRequest(requestId, listingCreator) {
  try {
    const { error } = await supabase
      .from(TABLES.PARALLEL_REQUESTS)
      .update({ status: 'approved' })
      .eq('id', requestId);
    if (error) throw error;
    return { success: true };
  } catch {
    const requests = getLocalStorage('parallelRequests') || [];
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;
    const updated = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'approved' } : r
    );
    setLocalStorage('parallelRequests', updated);

    const listings = getLocalStorage('parallelListings') || [];
    const updatedListings = listings.map((l) =>
      l.id === req.listingId ? { ...l, status: 'matched' } : l
    );
    setLocalStorage('parallelListings', updatedListings);

    const thread = {
      id: `t${Date.now()}`,
      partnerName: req.userName,
      partnerAvatar: '🦋',
      prefs: { role: '' },
      description: listingCreator?.description || '',
      messages: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
    const threads = getLocalStorage('parallelThreads') || [];
    setLocalStorage('parallelThreads', [...threads, thread]);

    const notifs = getLocalStorage('parallelNotifications') || [];
    setLocalStorage('parallelNotifications', [
      ...notifs,
      {
        id: `n${Date.now()}`,
        type: 'approved',
        threadId: thread.id,
        fromUserName: listingCreator?.userName || 'Someone',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    return thread;
  }
}

export async function denyRequest(requestId) {
  try {
    const { error } = await supabase
      .from(TABLES.PARALLEL_REQUESTS)
      .update({ status: 'denied' })
      .eq('id', requestId);
    if (error) throw error;
  } catch {
    const requests = getLocalStorage('parallelRequests') || [];
    setLocalStorage(
      'parallelRequests',
      requests.map((r) => (r.id === requestId ? { ...r, status: 'denied' } : r))
    );
  }
}

export async function getListings() {
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_LISTINGS)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return getLocalStorage('parallelListings') || [];
  }
}

export async function getRequests() {
  try {
    const { data, error } = await supabase
      .from(TABLES.PARALLEL_REQUESTS)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return getLocalStorage('parallelRequests') || [];
  }
}

export function getNotifications() {
  return getLocalStorage('parallelNotifications') || [];
}

export function markNotificationsRead() {
  const notifs = getLocalStorage('parallelNotifications') || [];
  setLocalStorage(
    'parallelNotifications',
    notifs.map((n) => ({ ...n, read: true }))
  );
}

export function unreadNotificationCount(userId) {
  const notifs = getLocalStorage('parallelNotifications') || [];
  return notifs.filter((n) => !n.read).length;
}
