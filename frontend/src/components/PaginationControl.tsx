import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlProps {
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({ page, total, limit, setPage }) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium">
      <button 
        disabled={page === 1} 
        onClick={() => setPage(page - 1)} 
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button 
        disabled={page >= totalPages} 
        onClick={() => setPage(page + 1)} 
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};
