import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import StatsGrid from '../features/dashboard/components/StatsGrid';
import ReviewList from '../features/dashboard/components/ReviewList';
import EmptyState from '../features/dashboard/components/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';

const Dashboard = () => {
  const { reviews, setReviews, setLoading, isLoading, searchQuery } = useStore();
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }

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
      <DashboardHeader />

      <StatsGrid reviewsCount={reviews.length} />

      {isLoading && reviews.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-900/50 rounded-2xl" />)}
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
        title="Purge Investigation"
        message={`Are you sure you want to permanently delete ${deleteTarget?.title}? All associated findings and security metrics will be purged.`}
        confirmText="Confirm Purge"
      />
    </DashboardLayout>
  );
};

export default Dashboard;
