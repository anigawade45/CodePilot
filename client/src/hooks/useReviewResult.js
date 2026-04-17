import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/api';

/**
 * 🛰️ INVESTIGATION VIEW HOOK [ORACLE v1.0]
 * ---------------------------------------
 * - Centralized state management for review details and issue analysis.
 * - Handles sharing, deletion, and cross-component communication.
 */
export const useReviewResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentReview, setCurrentReview, setLoading, isLoading } = useStore();

    const [view, setView] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [highlightedLine, setHighlightedLine] = useState(null);

    // 🧠 DERIVED DATA
    const issues = useMemo(() => currentReview?.issues || [], [currentReview]);

    const filteredIssues = useMemo(() => {
        return activeTab === 'all'
            ? issues
            : issues.filter(i => (i.category || '').toLowerCase() === activeTab);
    }, [issues, activeTab]);

    // 🔄 REFRESH CIRCUIT
    const fetchReview = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await reviewService.getReviewById(id);
            setCurrentReview(data);
        } catch (err) {
            console.error("Retrieval Failed:", err);
            setToast({ isOpen: true, message: "Error: Could not retrieve intelligence cluster.", type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [id, setCurrentReview, setLoading]);

    useEffect(() => {
        fetchReview();
    }, [fetchReview]);

    // 📡 ACTIONS
    const handleShare = async () => {
        try {
            const data = await reviewService.shareReview(id);
            const shareUrl = `${window.location.origin}/share/${data.public_token}`;
            await navigator.clipboard.writeText(shareUrl);
            setToast({ isOpen: true, message: "System Link: Copied to clipboard", type: 'success' });
        } catch {
            setToast({ isOpen: true, message: "Error: Failed to sync share link", type: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleteModalOpen(false);
            await reviewService.deleteReview(id);
            setToast({ isOpen: true, message: "System Purge: Investigation deleted", type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch {
            setToast({ isOpen: true, message: "System Error: Failed to purge logs", type: 'error' });
        }
    };

    const scrollToLine = useCallback((line) => {
        if (!view) return;
        setHighlightedLine(line);
        try {
            const pos = view.state.doc.line(line).from;
            view.dispatch({
                selection: { head: pos, anchor: pos },
                scrollIntoView: true
            });
        } catch (e) {
            console.warn("Editor Sync Exception:", e);
        }
    }, [view]);

    return {
        id,
        currentReview,
        issues,
        filteredIssues,
        isLoading,
        activeTab,
        setActiveTab,
        toast,
        setToast,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        highlightedLine,
        scrollToLine,
        setEditorView: setView,
        handleShare,
        handleDelete,
        navigate
    };
};
