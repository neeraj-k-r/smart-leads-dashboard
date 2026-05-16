import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors">
      <button 
        onClick={toggleTheme} 
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">SmartLeads</h1>
        <p className="text-slate-500 dark:text-slate-400">The intuitive lead management dashboard</p>
      </div>

      {isRegistering ? (
        <RegisterForm onSwitch={() => setIsRegistering(false)} />
      ) : (
        <LoginForm onSwitch={() => setIsRegistering(true)} />
      )}
    </div>
  );
};
