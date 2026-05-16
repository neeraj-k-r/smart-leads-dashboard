import React from 'react';
import { Trash2 } from 'lucide-react';
import { LeadStatus } from '../../../shared/types';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface LeadRowProps {
  lead: Lead;
  role: string | null;
  onDelete: (id: string) => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({ lead, role, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case LeadStatus.CONTACTED: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case LeadStatus.QUALIFIED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case LeadStatus.LOST: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{lead.name}</td>
      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{lead.email}</td>
      <td className="px-6 py-4 capitalize">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-4 capitalize text-slate-600 dark:text-slate-400">{lead.source}</td>
      {role === 'admin' && (
        <td className="px-6 py-4">
          <button 
            onClick={() => onDelete(lead._id)} 
            className="text-rose-600 dark:text-rose-500 hover:text-rose-800 dark:hover:text-rose-400 p-1 rounded transition-colors flex items-center justify-center"
            title="Delete Lead"
          >
            <Trash2 size={18} />
          </button>
        </td>
      )}
    </tr>
  );
};
