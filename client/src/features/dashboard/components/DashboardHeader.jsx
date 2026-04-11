import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          Overview
        </h1>
        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          Performance metrics across your workspace
        </p>
      </div>
      <Button
        onClick={() => navigate('/new')}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 px-8 py-6 rounded-2xl font-black uppercase tracking-wider flex gap-3 group active:scale-95 transition-all text-sm"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        Run New Analysis
      </Button>
    </div>
  );
};

export default DashboardHeader;
