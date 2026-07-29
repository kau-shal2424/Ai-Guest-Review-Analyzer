import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useReviews } from '../hooks/useReviews';
import { createUserReview } from '../services/reviews';
import { useAuth } from '../../../shared/context/AuthContext';
import { Card, Badge, Skeleton } from '../../../shared/ui';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, Star, Trash2, 
  Copy, Download, ChevronLeft, ChevronRight,
  Eye, Calendar, Edit3, User
} from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import EditReviewModal from '../components/EditReviewModal';
import DeleteReviewModal from '../components/DeleteReviewModal';

export default function Reviews() {
  const { user } = useAuth();
  
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

  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('newest');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('review_favs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedReview, setSelectedReview] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem('review_favs', JSON.stringify(next));
      return next;
    });
    toast.success(favorites.includes(id) ? "Removed from wishlist." : "Saved to wishlist!");
  };

  const handleDuplicate = async (review, e) => {
    e.stopPropagation();
    if (!review || !review.review) return;
    try {
      toast.loading("Duplicating review entry...", { id: "duplicate-toast" });
      await createUserReview({ review: review.review });
      toast.success("Review duplicated successfully!", { id: "duplicate-toast" });
      reload();
    } catch (err) {
      console.error("Duplicate review error:", err);
      toast.error(err.response?.data?.detail || "Failed to duplicate review.", { id: "duplicate-toast" });
    }
  };

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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#222222] dark:text-white">Guest Reviews & Feedback</h1>
          <p className="text-[#717171] text-xs sm:text-sm font-normal mt-1">
            Manage, search, filter, and audit processed guest sentiment intelligence.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-semibold text-[#222222] dark:text-white bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FF385C]" />
            Export CSV
          </button>

          {/* Toggle layouts */}
          <div className="flex bg-white dark:bg-[#222222] p-1 rounded-full border border-[#EBEBEB] dark:border-[#333333] shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#222222] text-white' : 'text-[#717171] hover:text-[#222222]'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#222222] text-white' : 'text-[#717171] hover:text-[#222222]'}`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search Panel */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
            <input
              type="text"
              placeholder="Search by keywords, sentiment, theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F7F7] dark:bg-[#1a1a1a] border border-[#EBEBEB] dark:border-[#333333] rounded-lg text-xs placeholder:text-[#717171] font-medium outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all text-[#222222] dark:text-white"
            />
          </div>

          {/* Sentiment Filter */}
          <select
            value={filter.sentiment}
            onChange={(e) => setFilter(prev => ({ ...prev, sentiment: e.target.value }))}
            className="px-3 py-2 bg-[#F7F7F7] dark:bg-[#1a1a1a] border border-[#EBEBEB] dark:border-[#333333] rounded-lg text-xs font-semibold text-[#222222] dark:text-white cursor-pointer outline-none"
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
            className="px-3 py-2 bg-[#F7F7F7] dark:bg-[#1a1a1a] border border-[#EBEBEB] dark:border-[#333333] rounded-lg text-xs font-semibold text-[#222222] dark:text-white cursor-pointer outline-none"
          >
            <option value="">All Themes</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Food">Food</option>
            <option value="Host">Host</option>
            <option value="Location">Location</option>
            <option value="Experience">Experience</option>
          </select>
        </div>

        {/* Toolbar Info */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#EBEBEB] dark:border-[#333333] text-xs text-[#717171]">
          <span>Showing {sortedReviews.length} reviews</span>

          <div className="flex items-center gap-2">
            <span>Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-[#222222] dark:text-white font-bold cursor-pointer outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="sentiment">Highest Sentiment</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content Rendering — Airbnb Listing Card Grid or Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : sortedReviews.length === 0 ? (
        <Card className="p-12 text-center text-[#717171] max-w-md mx-auto">
          <SlidersHorizontal className="w-10 h-10 mx-auto mb-3 text-[#717171]" />
          <h3 className="text-base font-bold text-[#222222] dark:text-white mb-1">No Reviews Found</h3>
          <p className="text-xs">Try modifying your search queries or filter attributes.</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedReviews.map((item) => (
            <Card 
              key={item._id} 
              onClick={() => setSelectedReview(item)}
              className="p-5 flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative"
            >
              <div>
                {/* Header: Guest Avatar + Sentiment Badge + Wishlist Heart */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#717171] text-white flex items-center justify-center text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#222222] dark:text-white">Guest Feedback</p>
                      <p className="text-[10px] text-[#717171]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Heart Wishlist Button */}
                  <button 
                    onClick={(e) => handleToggleFavorite(item._id, e)}
                    className="text-[#717171] hover:text-[#FF385C] transition-colors p-1"
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(item._id) ? 'fill-[#FFB400] text-[#FFB400]' : ''}`} />
                  </button>
                </div>

                {/* Sentiment & Theme Badges */}
                <div className="flex gap-2 mb-3">
                  <Badge variant={getSentimentColor(item.sentiment)}>{item.sentiment}</Badge>
                  <Badge variant="secondary">{item.theme || 'General'}</Badge>
                </div>

                {/* Review Text */}
                <p className="text-xs font-normal text-[#222222] dark:text-gray-200 leading-relaxed line-clamp-4 italic">
                  "{item.review}"
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-[#EBEBEB] dark:border-[#333333] flex justify-between items-center text-xs text-[#717171]">
                <span className="text-[11px] font-semibold text-[#00A699]">
                  {item.aiPowered ? '✓ AI Analyzed' : 'Standard'}
                </span>
                
                {/* Hover Action Buttons */}
                <div className="flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditReview(item); }}
                    className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
                    title="Edit Review"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => handleDuplicate(item, e)}
                    className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
                    title="Duplicate Review"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                    className="p-1 rounded-full hover:bg-[#FFF0F3] text-[#D93025]"
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
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F7] dark:bg-[#1a1a1a] border-b border-[#EBEBEB] dark:border-[#333333] text-[#717171] font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Sentiment</th>
                  <th className="px-5 py-3">Theme</th>
                  <th className="px-5 py-3">Guest Feedback</th>
                  <th className="px-5 py-3">Analyzed On</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] dark:divide-[#333333] font-medium">
                {paginatedReviews.map((item) => (
                  <tr 
                    key={item._id}
                    onClick={() => setSelectedReview(item)}
                    className="hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge variant={getSentimentColor(item.sentiment)}>{item.sentiment}</Badge>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge variant="secondary">{item.theme || 'General'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 max-w-sm truncate text-[#222222] dark:text-gray-200 font-normal">
                      "{item.review}"
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[#717171]">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => setSelectedReview(item)} className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setEditReview(item)} className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(item)} className="p-1 rounded-full hover:bg-[#FFF0F3] text-[#D93025]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#717171] mt-4 px-1">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-full bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] hover:bg-[#F7F7F7] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-full bg-white dark:bg-[#222222] border border-[#EBEBEB] dark:border-[#333333] hover:bg-[#F7F7F7] disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
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
