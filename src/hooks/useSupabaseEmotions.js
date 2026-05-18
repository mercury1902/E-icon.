import { useState, useCallback } from 'react';
import { saveMoodCheckin, fetchMoodHistory } from '../services/emotionService';

export function useSupabaseEmotions(sessionId) {
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    const history = await fetchMoodHistory(sessionId);
    setEmotionHistory(history);
    setLoading(false);
  }, [sessionId]);

  const handleEmotion = useCallback(
    async (emotion) => {
      if (!sessionId) return;

      if (emotion) {
        await saveMoodCheckin(sessionId, emotion);
        setEmotionHistory((prev) =>
          [{ emotion, timestamp: Date.now() }, ...prev].slice(0, 14)
        );
      }

      return emotion;
    },
    [sessionId]
  );

  return {
    emotionHistory,
    loading,
    handleEmotion,
    loadHistory,
  };
}
