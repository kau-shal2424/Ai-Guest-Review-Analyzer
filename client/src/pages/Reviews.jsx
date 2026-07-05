import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchReviews, searchReviews, deleteReview } from '../api/reviews';
import ReviewItemCard from '../components/ReviewItemCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ReviewModal from '../components/reviews/ReviewModal';
import EditReviewModal from '../components/reviews/EditReviewModal';
import DeleteReviewModal from '../components/reviews/DeleteReviewModal';


export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleCardClick = (review) => {
    setSelectedReview(review);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch or search reviews
  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (debouncedQuery.trim()) {
        data = await searchReviews(debouncedQuery.trim());
      } else {
        data = await fetchReviews();
      }
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Handlers
  const handleDelete = (review) => {
    // Open confirmation modal
    setDeleteTarget(review);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReview(deleteTarget._id);
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleEdit = (review) => {
    // Open edit modal with the selected review
    setEditReview(review);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Guest Reviews
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Manage and analyze what your guests are saying about their experience.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search reviews by keyword, theme, or sentiment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Content Section */}
        {error ? (
          <ErrorState message={error} onRetry={loadReviews} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState searchQuery={debouncedQuery} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewItemCard
                key={review._id}
                review={review}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}

        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {editReview && (
          <EditReviewModal
            review={editReview}
            onClose={() => setEditReview(null)}
            onUpdate={(updated) => {
              setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
            }}
          />
        )}
        {deleteTarget && (
          <DeleteReviewModal
            review={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />
        )}
        {editReview && (
          <EditReviewModal
            review={editReview}
            onClose={() => setEditReview(null)}
            onUpdate={(updated) => {
              setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
            }}
          />
        )}
      </main>
    </div>
  );
}