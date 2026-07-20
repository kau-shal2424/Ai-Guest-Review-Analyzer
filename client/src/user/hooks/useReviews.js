import { useState, useEffect, useCallback } from 'react';
import { fetchUserReviews, searchUserReviews, deleteUserReview, updateUserReview } from '../api/reviews';
import { useDebounce } from '../../shared/hooks/useDebounce';
import toast from 'react-hot-toast';

export function useReviews({ initialSearch = '', autoFetch = true } = {}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filter, setFilter] = useState({ sentiment: '', theme: '' });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (debouncedSearch.trim()) {
        data = await searchUserReviews(debouncedSearch.trim());
      } else {
        data = await fetchUserReviews();
      }
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('useReviews load error:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (autoFetch) load();
  }, [load, autoFetch]);

  const remove = useCallback(async (id) => {
    try {
      await deleteUserReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success('Review deleted successfully');
      return true;
    } catch {
      toast.error('Failed to delete review');
      return false;
    }
  }, []);

  const update = useCallback(async (id, data) => {
    try {
      const updated = await updateUserReview(id, data);
      setReviews(prev => prev.map(r => r._id === id ? updated : r));
      toast.success('Review updated successfully');
      return updated;
    } catch {
      toast.error('Failed to update review');
      return null;
    }
  }, []);

  const filteredReviews = reviews.filter(r => {
    if (filter.sentiment && r.sentiment !== filter.sentiment) return false;
    if (filter.theme && r.theme !== filter.theme) return false;
    return true;
  });

  const stats = {
    total: reviews.length,
    positive: reviews.filter(r => r.sentiment === 'Positive').length,
    negative: reviews.filter(r => r.sentiment === 'Negative').length,
    neutral: reviews.filter(r => r.sentiment === 'Neutral').length,
    aiPowered: reviews.filter(r => r.aiPowered).length,
  };

  return { reviews: filteredReviews, allReviews: reviews, loading, error, stats, searchQuery, setSearchQuery, filter, setFilter, reload: load, remove, update };
}
