import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LANGUAGES } from '../constants/config';

/**
 * 🛰️ USE-CODE-INPUT HOOK [LOGIC LAYER v11.0]
 * ------------------------------------------
 * Decouples code ingestion, validation, and AI configuration
 * from the presentation layer for high-fidelity testing.
 */
export const useCodeInput = () => {
  const [view, setView] = useState('selection');
  const [code, setCode] = useState('// Paste your code here...\n\nfunction example() {\n  console.log("Hello CodePilot");\n}');
  const [language, setLanguage] = useState('javascript');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    provider: '',
    model: '',
    apiKey: '',
    endpoint: ''
  });
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });
  const { setLoading, isLoading, setCurrentReview, currentReview } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentReview) {
      setCode(currentReview.code);
      setLanguage(currentReview.language || 'javascript');
      setView('editor');
    }
  }, [currentReview]);

  const handleGithubImport = useCallback(async (url) => {
    try {
      setLoading(true);
      const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      const response = await axios.get(rawUrl);
      setCode(response.data);
      const ext = url.split('.').pop().toLowerCase();
      const langFinder = LANGUAGES.find(l => l.value === ext || l.value.includes(ext));
      if (langFinder) setLanguage(langFinder.value);
      setIsGithubModalOpen(false);
      setView('editor');
      setToast({ isOpen: true, message: "Sync Success: Cluster imported correctly", type: 'success' });
    } catch {
      setToast({ isOpen: true, message: "Sync Error: Failed to access GitHub cluster", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const langFinder = LANGUAGES.find(l => l.value === ext || l.value.includes(ext));
    if (langFinder) setLanguage(langFinder.value);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setView('editor');
    };
    reader.readAsText(file);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim() || code.length < 10) {
      setToast({ isOpen: true, message: "Input Error: Code sample too small for analysis", type: 'info' });
      return;
    }

    try {
      setLoading(true);
      const configToPass = (aiConfig.provider && (aiConfig.apiKey || aiConfig.provider === 'local'))
        ? aiConfig
        : null;

      const results = await reviewService.createReview(code, language, configToPass);
      setCurrentReview(results);
      navigate(`/review/${results.reviewId}`);
    } catch (err) {
      setToast({ isOpen: true, message: `System Error: ${err.response?.data?.error || "Analysis failed"}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [code, language, aiConfig, setLoading, setCurrentReview, navigate]);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    view,
    setView,
    code,
    setCode,
    language,
    setLanguage,
    isGithubModalOpen,
    setIsGithubModalOpen,
    isAiSettingsOpen,
    setIsAiSettingsOpen,
    aiConfig,
    setAiConfig,
    toast,
    setToast,
    closeToast,
    isLoading,
    handleGithubImport,
    handleFileUpload,
    handleAnalyze
  };
};
