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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50  border border-amber-200  text-amber-700  font-semibold animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 " />
          <span>Sauvegarde auto en cours...</span>
        </div>
      ) : lastSavedTime ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E7F3FF]  border border-[#E4E6EB]  text-[#1877F2]  font-medium">
          <Cloud className="w-3.5 h-3.5 text-[#1877F2] " />
          <span>Brouillon sécurisé à {lastSavedTime}</span>
        </div>
      ) : hasDraft && savedDraftDate ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50  border border-blue-200  text-blue-700  font-medium">
          <Cloud className="w-3.5 h-3.5 text-blue-600 " />
          <span>Brouillon antérieur ({savedDraftDate})</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[#65676B]  text-[11px]">
          <Cloud className="w-3 h-3" />
          <span>Protection anti-perte active</span>
        </div>
      )}

      {/* Restore Draft Action button if available */}
      {hasDraft && onRestoreDraft && (
        <button
          type="button"
          onClick={onRestoreDraft}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E7F3FF] hover:bg-[#E7F3FF][#1877F2] text-[#1877F2]  border border-[#E4E6EB]  text-xs font-bold transition-all cursor-pointer hover:scale-105"
          title="Restaurer les données saisies lors de la dernière session"
        >
          <RotateCcw className="w-3 h-3 text-[#1877F2] " />
          <span>Restaurer brouillon</span>
        </button>
      )}

      {/* Clear Draft Action button */}
      {hasDraft && onClearDraft && (
        <button
          type="button"
          onClick={onClearDraft}
          className="inline-flex items-center gap-1 p-1 rounded-lg hover:bg-[#F0F2F5] text-[#65676B] hover:text-rose-600 transition-colors cursor-pointer"
          title="Supprimer le brouillon temporaire"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
