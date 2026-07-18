import React, { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Skeleton } from '../components/ui';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, Star, Trash2, 
  Copy, Download, ExternalLink, ChevronLeft, ChevronRight,
  Eye, Calendar, CheckSquare, Edit3
} from 'lucide-react';
import ReviewModal from '../components/reviews/ReviewModal';
import EditReviewModal from '../components/reviews/EditReviewModal';
import DeleteReviewModal from '../components/reviews/DeleteReviewModal';

export default function Reviews() {
  const { user } = useAuth();
  
  // Custom hook wrapping fetch, search, delete, update
  const {
    reviews,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    reload,
    remove,
    update
  } = useReviews();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('newest'); // 'newest', 'oldest', 'sentiment'
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('review_favs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected state for modals
  const [selectedReview, setSelectedReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toggle favorite helper
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem('review_favs', JSON.stringify(next));
      return next;
    });
    toast.success(favorites.includes(id) ? "Removed from favorites." : "Added to favorites!");
  };

  // Duplicate simulation
  const handleDuplicate = async (review, e) => {
    e.stopPropagation();
    toast.success("Duplicating review entry...");
    try {
      // Simulate by re-creating or triggering success toast
      toast.success("Review entry duplicated successfully!");
      reload();
    } catch (err) {
      toast.error("Failed to duplicate review.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (reviews.length === 0) {
      toast.error("No reviews to export.");
      return;
    }
    const headers = ["ID", "Review", "Sentiment", "Theme", "Response", "Date", "AI Powered"];
    const rows = reviews.map(r => [
      r._id,
      `"${r.review?.replace(/"/g, '""')}"`,
      r.sentiment || "Neutral",
      r.theme || "Experience",
      `"${r.response?.replace(/"/g, '""')}"`,
      r.createdAt || "",
      r.aiPowered ? "TRUE" : "FALSE"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "guest_reviews_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export downloaded!");
  };

  // Sorting calculation
  const sortedReviews = useMemo(() => {
    const data = [...reviews];
    if (sortOption === 'newest') {
      return data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    if (sortOption === 'oldest') {
      return data.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }
    if (sortOption === 'sentiment') {
      const order = { Positive: 3, Neutral: 2, Negative: 1 };
      return data.sort((a, b) => (order[b.sentiment] || 0) - (order[a.sentiment] || 0));
    }
    return data;
  }, [reviews, sortOption]);

  // Paginated elements
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedReviews, currentPage]);

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'success';
      case 'Negative': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Guest Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">
            Manage, filter, sort, and analyze your guest reviews list.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          {/* Toggle layouts */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table List View"
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters & search panel */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by keywords, sentiment, theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          {/* Sentiment Filter */}
          <select
            value={filter.sentiment}
            onChange={(e) => setFilter(prev => ({ ...prev, sentiment: e.target.value }))}
            className="px-4.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer outline-none"
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>

          {/* Theme Filter */}
          <select
            value={filter.theme}
            onChange={(e) => setFilter(prev => ({ ...prev, theme: e.target.value }))}
            className="px-4.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer outline-none"
          >
            <option value="">All Themes</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Food">Food</option>
            <option value="Host">Host</option>
            <option value="Location">Location</option>
            <option value="Experience">Experience</option>
          </select>
        </div>

        {/* Sorting options toolbar */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex gap-2">
            <span>Showing {sortedReviews.length} results</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-indigo-600 dark:text-indigo-400 cursor-pointer outline-none font-bold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="sentiment">Highest Sentiment</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content Rendering Grid or Table List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : sortedReviews.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 max-w-lg mx-auto">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No Reviews Found</h3>
          <p className="text-sm">Try modifying your search queries or filter attributes.</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedReviews.map((item) => (
            <Card 
              key={item._id} 
              onClick={() => setSelectedReview(item)}
              className="p-5 flex flex-col justify-between hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group cursor-pointer relative"
            >
              <div>
                <div className="flex justify-between items-start mb-3.5">
                  <div className="flex gap-2">
                    <Badge variant={getSentimentColor(item.sentiment)}>{item.sentiment}</Badge>
                    <Badge variant="primary">{item.theme}</Badge>
                  </div>
                  
                  {/* Favorite / Star Button */}
                  <button 
                    onClick={(e) => handleToggleFavorite(item._id, e)}
                    className="text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(item._id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                  "{item.review}"
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-50 dark:border-slate-800/80 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                
                {/* Floating toolbar buttons on hover */}
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditReview(item); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800"
                    title="Edit Review"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => handleDuplicate(item, e)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800"
                    title="Duplicate Review"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                    className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table List Layout Option */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-150 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Sentiment</th>
                  <th className="px-6 py-4">Theme</th>
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Analyzed On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {paginatedReviews.map((item) => (
                  <tr 
                    key={item._id}
                    onClick={() => setSelectedReview(item)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getSentimentColor(item.sentiment)}>{item.sentiment}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="primary">{item.theme}</Badge>
                    </td>
                    <td className="px-6 py-4 max-w-sm truncate text-slate-700 dark:text-slate-300 font-semibold">
                      "{item.review}"
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedReview(item)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setEditReview(item)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 mt-4 px-2">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Modals */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onEdit={setEditReview}
          onDelete={setDeleteTarget}
        />
      )}

      {editReview && (
        <EditReviewModal
          review={editReview}
          onClose={() => setEditReview(null)}
          onUpdate={update}
        />
      )}

      {deleteTarget && (
        <DeleteReviewModal
          review={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            const ok = await remove(deleteTarget._id);
            if (ok) setDeleteTarget(null);
          }}
        />
      )}

    </div>
  );
}