import React from 'react';
import { Cloud, CloudCheck, Loader2, RotateCcw, Trash2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
  lastSavedTime: string | null;
  isSaving: boolean;
  hasDraft?: boolean;
  savedDraftDate?: string | null;
  onRestoreDraft?: () => void;
  onClearDraft?: () => void;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  lastSavedTime,
  isSaving,
  hasDraft,
  savedDraftDate,
  onRestoreDraft,
  onClearDraft,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 text-xs flex-wrap ${className}`}>
      {/* Active Saving or Saved status */}
      {isSaving ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
          <span>Sauvegarde auto en cours...</span>
        </div>
      ) : lastSavedTime ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
          <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Brouillon sécurisé à {lastSavedTime}</span>
        </div>
      ) : hasDraft && savedDraftDate ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium">
          <Cloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Brouillon antérieur ({savedDraftDate})</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-slate-400 dark:text-slate-500 text-[11px]">
          <Cloud className="w-3 h-3" />
          <span>Protection anti-perte active</span>
        </div>
      )}

      {/* Restore Draft Action button if available */}
      {hasDraft && onRestoreDraft && (
        <button
          type="button"
          onClick={onRestoreDraft}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer hover:scale-105"
          title="Restaurer les données saisies lors de la dernière session"
        >
          <RotateCcw className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>Restaurer brouillon</span>
        </button>
      )}

      {/* Clear Draft Action button */}
      {hasDraft && onClearDraft && (
        <button
          type="button"
          onClick={onClearDraft}
          className="inline-flex items-center gap-1 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
          title="Supprimer le brouillon temporaire"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
