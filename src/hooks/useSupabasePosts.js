import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPosts, createPost } from '../services/postService';

export function useSupabasePosts(sessionId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const mountedRef = useRef(true);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPosts({ searchQuery, tagFilter });
      if (mountedRef.current) {
        setPosts(data);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [searchQuery, tagFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const addPost = useCallback(
    async (postData) => {
      if (!sessionId) return;

      const emotionTag = postData.emotion;

      const newPost = await createPost({
        sessionId,
        content: postData.content,
        tags: postData.tags || [],
        emotionTag,
      });

      if (newPost) {
        setPosts((prev) => [newPost, ...prev]);
      }

      return newPost;
    },
    [sessionId]
  );

  return {
    posts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    tagFilter,
    setTagFilter,
    addPost,
    refresh: loadPosts,
  };
}
