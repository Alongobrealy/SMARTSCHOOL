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
        className={`p-2 rounded-xl text-[#65676B] hover:text-[#050505] bg-[#F0F2F5] hover:bg-[#F0F2F5]/80 border border-[#E4E6EB]  transition-all cursor-pointer shadow-2xs active:scale-95 ${className}`}
        title={isDark ? 'Basculer en mode Clair (Jour)' : 'Basculer en mode Sombre (Nuit)'}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-[#050505]  animate-in spin-in-90 duration-200" />
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
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs active:scale-95 ${
          isDark
            ? 'bg-white hover:bg-[#F0F2F5] text-amber-300 border-[#E4E6EB] shadow-sm'
            : 'bg-[#F0F2F5] hover:bg-[#F0F2F5] text-[#050505] border-[#E4E6EB]'
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
            <Moon className="w-3.5 h-3.5 text-[#050505]" />
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
          ? 'bg-white hover:bg-[#F0F2F5] text-amber-300 border-[#E4E6EB]'
          : 'bg-[#F0F2F5] hover:bg-[#F0F2F5] text-[#050505] border-[#E4E6EB]'
      } ${className}`}
      title={isDark ? 'Basculer en mode Clair' : 'Basculer en mode Sombre'}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#1877F2]" />
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {isDark ? 'Mode Nuit' : 'Mode Jour'}
        </span>
      )}
    </button>
  );
};
