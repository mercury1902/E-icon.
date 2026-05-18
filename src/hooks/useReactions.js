import { useState, useCallback } from 'react';
import { toggleReaction, getUserReactions } from '../services/reactionService';

export function useReactions(sessionId) {
  const [reactedPosts, setReactedPosts] = useState({});

  const loadUserReactions = useCallback(
    async (postIds) => {
      if (!sessionId || !postIds.length) return;
      const reactions = await getUserReactions(sessionId, postIds);
      setReactedPosts((prev) => ({ ...prev, ...reactions }));
    },
    [sessionId]
  );

  const handleReact = useCallback(
    async (postId, emoji) => {
      if (!sessionId) return;

      const result = await toggleReaction(sessionId, postId, emoji);
      if (!result) return;

      setReactedPosts((prev) => {
        const postReactions = { ...(prev[postId] || {}) };
        if (result.action === 'added') {
          postReactions[emoji] = true;
        } else {
          delete postReactions[emoji];
        }
        return { ...prev, [postId]: postReactions };
      });

      return result;
    },
    [sessionId]
  );

  const isReacted = useCallback(
    (postId, emoji) => {
      return !!reactedPosts[postId]?.[emoji];
    },
    [reactedPosts]
  );

  return {
    handleReact,
    isReacted,
    loadUserReactions,
    reactedPosts,
  };
}
