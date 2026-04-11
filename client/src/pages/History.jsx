import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import ReviewList from '../features/dashboard/components/ReviewList';
import EmptyState from '../features/dashboard/components/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
  const { reviews, setReviews, setLoading, isLoading, searchQuery } = useStore();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredReviews = Array.isArray(reviews) ? reviews.filter(r => 
    r.language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.code?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getReviews();
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDeleteTrigger = (e, review) => {
    e.stopPropagation();
    setDeleteTarget({ id: review.id, title: `Investigation #${review.id.slice(0, 7)}` });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await reviewService.deleteReview(deleteTarget.id);
      setReviews(reviews.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-blue-500" />
          Analysis History
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Review your past code explorations and AI findings.
        </p>
      </div>

      {isLoading && reviews.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-slate-900/50 rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <ReviewList reviews={filteredReviews} onDelete={handleDeleteTrigger} />
      )}

      <ConfirmModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Purge History Log"
        message={`Are you sure you want to permanently delete the logs for ${deleteTarget?.title}? All findings will be wiped from the archive.`}
        confirmText="Confirm Purge"
      />
    </DashboardLayout>
  );
};

export default History;
