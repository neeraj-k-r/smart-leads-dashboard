import React, { useState } from 'react';
import { LeadsList } from '../components/LeadsList';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
    const { role } = useAuth();
    const [view, setView] = useState<'leads' | 'addUser'>('leads');

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-slate-900">
                {view === 'leads' ? 'Leads Overview' : 'Add New User'}
            </h1>
            {view === 'leads' ? (
                <LeadsList />
            ) : (
                <RegisterForm onSwitch={() => setView('leads')} />
            )}
            
            {role === 'admin' && (
                <button
                    onClick={() => setView(view === 'leads' ? 'addUser' : 'leads')}
                    className="mt-4 text-sm text-slate-500 hover:text-slate-900"
                >
                    {view === 'leads' ? 'Manage Users' : 'Leads Overview'}
                </button>
            )}
        </div>
    );
};
