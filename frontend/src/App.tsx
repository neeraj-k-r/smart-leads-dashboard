import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LayoutDashboard, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { token, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!token) {
    return <AuthPage />;
  }

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-900 flex text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-700">
           <span className="font-bold text-lg tracking-tight">SmartLeads <span className="text-[10px] uppercase bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full ml-1">{role?.replace('_', ' ')}</span></span>
           <button className="md:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(false)}>
             <X size={20} />
           </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <div className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
            <LayoutDashboard size={18} /> Dashboard
          </div>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button 
            onClick={toggleTheme} 
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />} 
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <DashboardPage />
        </div>
      </main>
    </div>
  );
}
