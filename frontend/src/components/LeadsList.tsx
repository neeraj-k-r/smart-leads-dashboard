import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LeadStatus, LeadSource } from '../../../shared/types';
import { PaginationControl } from './PaginationControl';
import { LeadRow } from './LeadRow';
import { Search, Plus, Download, AlertCircle, Loader2 } from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

export const LeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isAdding, setIsAdding] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', status: LeadStatus.NEW, source: LeadSource.WEBSITE });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  
  const limit = 10;
  const { role } = useAuth();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/leads', {
        params: { page, limit, status, source, search: debouncedSearch, sort }
      });
      setLeads(response.data.data);
      setTotal(response.data.meta.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching leads');
    } finally {
      setLoading(false);
    }
  }, [page, status, source, debouncedSearch, sort]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async () => {
    setAddError('');
    if (!newLead.name || !newLead.email) {
      setAddError('Name and Email are required');
      return;
    }
    
    setAddLoading(true);
    try {
      await api.post('/api/leads', newLead);
      setIsAdding(false);
      setNewLead({ name: '', email: '', status: LeadStatus.NEW, source: LeadSource.WEBSITE });
      fetchLeads();
    } catch (err: any) {
      setAddError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Error adding lead');
    } finally {
      setAddLoading(false);
    }
  };

  const exportLeads = async () => {
    try {
      const response = await api.get('/api/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Error exporting leads');
    }
  };

  const deleteLead = async (id: string) => {
    if (role !== 'admin') return alert('Only admins can delete leads');
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/api/leads/${id}`);
      fetchLeads();
    } catch (error) {
      alert('Error deleting lead');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads by name or email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
          />
        </div>
        
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">All Statuses</option>
          {Object.values(LeadStatus).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        
        <select value={source} onChange={(e) => setSource(e.target.value)} className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">All Sources</option>
          {Object.values(LeadSource).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="latest">Sort: Latest First</option>
          <option value="oldest">Sort: Oldest First</option>
        </select>
        
        <div className="flex gap-2 ml-auto">
          <button onClick={exportLeads} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={16} /> {isAdding ? 'Cancel' : 'Add Lead'}
          </button>
        </div>
      </div>

      {/* Add Lead Form */}
      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Add New Lead</h3>
          
          {addError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {addError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input placeholder="Lead Name" value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input placeholder="Email Address" type="email" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <select value={newLead.status} onChange={(e) => setNewLead({...newLead, status: e.target.value as LeadStatus})} className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize">
              {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={newLead.source} onChange={(e) => setNewLead({...newLead, source: e.target.value as LeadSource})} className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize">
              {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={addLead} disabled={addLoading} className="md:col-span-2 lg:col-span-4 bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition flex justify-center items-center">
              {addLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Lead'}
            </button>
          </div>
        </div>
      )}
      
      {/* Leads Table */}
      {error ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-xl border border-red-200 dark:border-red-900/30 text-center flex flex-col items-center">
          <AlertCircle className="text-red-500 mb-2" size={40} />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Error loading leads</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{error}</p>
          <button onClick={fetchLeads} className="mt-4 text-blue-600 hover:underline">Try Again</button>
        </div>
      ) : loading ? (
        <div className="bg-white dark:bg-slate-800 p-20 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading leads data...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Source</th>
                  {role === 'admin' && <th className="px-6 py-4 font-semibold w-24">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                          <Search className="text-slate-400 dark:text-slate-500" size={24} />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No leads found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <LeadRow key={lead._id} lead={lead} role={role} onDelete={deleteLead} />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {total > 0 && (
            <PaginationControl page={page} limit={limit} total={total} setPage={setPage} />
          )}
        </div>
      )}
    </div>
  );
};
