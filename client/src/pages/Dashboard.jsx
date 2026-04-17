import { useState, useCallback } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import StatsGrid from '../features/dashboard/components/StatsGrid';
import ReviewList from '../features/dashboard/components/ReviewList';
import EmptyState from '../features/dashboard/components/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';

/**
 * 📊 SOVEREIGN DASHBOARD [ROBUSTNESS v9.8]
 * ---------------------------------------
 * - Memoized Filtering: O(n) reduction for search
 * - Race-Condition Shield: Safe async mounting
 * - Atomic Deletion: Functional state updates
 */
const Dashboard = () => {
  const {
    reviews,
    filteredReviews,
    isLoading,
    isDeleting,
    error,
    purgeReview
  } = useDashboard();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteTrigger = useCallback((e, review) => {
    e.stopPropagation();
    setDeleteTarget({ id: review.id, title: `Investigation #${review.id.slice(0, 7)}` });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const success = await purgeReview(deleteTarget.id);
    if (success) setDeleteTarget(null);
  }, [deleteTarget, purgeReview]);

  return (
    <DashboardLayout>
      <DashboardHeader />

      <StatsGrid reviewsCount={reviews?.length || 0} isLoading={isLoading} />

      {/* 📡 SIGNAL QUALITY INDICATORS */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-bold uppercase tracking-widest italic animate-in slide-in-from-top-2 duration-500">
          ⚠️ {error}
        </div>
      )}

      {(!isLoading && (reviews?.length || 0) === 0) ? (
        <EmptyState />
      ) : (
        <ReviewList 
          reviews={filteredReviews} 
          onDelete={handleDeleteTrigger} 
          isLoading={isLoading && (reviews?.length || 0) === 0}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        confirmLoading={isDeleting}
        title="Purge Investigation"
        message={`Are you sure you want to permanently delete ${deleteTarget?.title}? All associated findings and metrics will be purged from memory.`}
        confirmText={isDeleting ? "Purging..." : "Confirm Purge"}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
