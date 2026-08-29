import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'icon' | 'badge';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'pill',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <button
        id="theme-toggle-btn"
        onClick={toggleTheme}
        type="button"
        className={`p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95 ${className}`}
        title={isDark ? 'Basculer en mode Clair (Jour)' : 'Basculer en mode Sombre (Nuit)'}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 animate-in spin-in-90 duration-200" />
        )}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        id="theme-toggle-badge"
        onClick={toggleTheme}
        type="button"
        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs active:scale-95 ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-slate-900/40'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
        } ${className}`}
        title={isDark ? 'Basculer en mode Clair (Jour)' : 'Basculer en mode Sombre (Nuit)'}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Nuit</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-700" />
            <span>Mode Jour</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      id="theme-toggle-default"
      onClick={toggleTheme}
      type="button"
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-2xs active:scale-95 ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
      } ${className}`}
      title={isDark ? 'Basculer en mode Clair' : 'Basculer en mode Sombre'}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-indigo-600" />
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {isDark ? 'Mode Nuit' : 'Mode Jour'}
        </span>
      )}
    </button>
  );
};
