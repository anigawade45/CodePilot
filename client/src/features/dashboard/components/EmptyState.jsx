import React from 'react';
import { Activity } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-20 bg-slate-950/50 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
         <Activity className="w-10 h-10 text-slate-700" />
      </div>
      <p className="text-slate-500 text-lg mb-8 max-w-sm">No analysis history found. Start by feeding the AI your code clusters.</p>
      <Button onClick={() => navigate('/new')} className="bg-slate-100 text-black hover:bg-slate-200 rounded-xl px-10 py-6 font-black uppercase tracking-wider text-xs">
        Initiate First Review
      </Button>
    </div>
  );
};

export default EmptyState;
