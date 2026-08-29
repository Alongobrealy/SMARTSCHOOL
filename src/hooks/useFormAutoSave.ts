import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface AutoSaveOptions<T> {
  storageKey: string;
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>> | ((data: T) => void);
  intervalMs?: number;
  enabled?: boolean;
  onAutoSaved?: (timestamp: string) => void;
}

export interface AutoSaveResult<T> {
  lastSavedTime: string | null;
  isSaving: boolean;
  hasDraft: boolean;
  restoreDraft: () => boolean;
  clearDraft: () => void;
  savedDraftDate: string | null;
}

interface StoredDraft<T> {
  data: T;
  timestamp: number;
  timeFormatted: string;
}

/**
 * Hook for periodic automatic background saving to localStorage
 * to prevent data loss during long form filling sessions.
 */
export function useFormAutoSave<T>({
  storageKey,
  formData,
  setFormData,
  intervalMs = 3000,
  enabled = true,
  onAutoSaved
}: AutoSaveOptions<T>): AutoSaveResult<T> {
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [savedDraftDate, setSavedDraftDate] = useState<string | null>(null);

  const lastSavedJsonRef = useRef<string>('');
  const initialMountRef = useRef<boolean>(true);

  // Check if there is an existing draft on mount
  useEffect(() => {
    if (!enabled || !storageKey) return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: StoredDraft<T> = JSON.parse(raw);
        if (parsed && parsed.data) {
          const jsonForm = JSON.stringify(formData);
          const jsonDraft = JSON.stringify(parsed.data);

          if (jsonDraft !== jsonForm) {
            setHasDraft(true);
            setSavedDraftDate(parsed.timeFormatted || new Date(parsed.timestamp).toLocaleTimeString('fr-FR'));
          }
        }
      }
    } catch (e) {
      console.warn('[AutoSave] Error checking existing draft:', e);
    }
  }, [storageKey, enabled]);

  // Periodic Auto-Save interval
  useEffect(() => {
    if (!enabled || !storageKey) return;

    // Skip the very first render cycle
    if (initialMountRef.current) {
      initialMountRef.current = false;
      lastSavedJsonRef.current = JSON.stringify(formData);
      return;
    }

    const timer = setInterval(() => {
      try {
        const currentJson = JSON.stringify(formData);
        
        // Only save if data has actually changed
        if (currentJson !== lastSavedJsonRef.current) {
          setIsSaving(true);
          
          const now = new Date();
          const timeFormatted = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          const payload: StoredDraft<T> = {
            data: formData,
            timestamp: now.getTime(),
            timeFormatted
          };

          localStorage.setItem(storageKey, JSON.stringify(payload));
          lastSavedJsonRef.current = currentJson;
          setLastSavedTime(timeFormatted);
          setHasDraft(true);
          setSavedDraftDate(timeFormatted);

          if (onAutoSaved) {
            onAutoSaved(timeFormatted);
          }

          setTimeout(() => {
            setIsSaving(false);
          }, 600);
        }
      } catch (err) {
        console.warn('[AutoSave] Failed to save draft to localStorage:', err);
        setIsSaving(false);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [formData, storageKey, intervalMs, enabled, onAutoSaved]);

  // Restore the draft into the form state
  const restoreDraft = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return false;
      
      const parsed: StoredDraft<T> = JSON.parse(raw);
      if (parsed && parsed.data) {
        setFormData(parsed.data);
        lastSavedJsonRef.current = JSON.stringify(parsed.data);
        setLastSavedTime(parsed.timeFormatted);
        return true;
      }
    } catch (e) {
      console.warn('[AutoSave] Error restoring draft:', e);
    }
    return false;
  }, [storageKey, setFormData]);

  // Clear draft once user explicitly saves or cancels
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      lastSavedJsonRef.current = JSON.stringify(formData);
      setLastSavedTime(null);
      setHasDraft(false);
      setSavedDraftDate(null);
    } catch (e) {
      console.warn('[AutoSave] Error clearing draft:', e);
    }
  }, [storageKey, formData]);

  return {
    lastSavedTime,
    isSaving,
    hasDraft,
    restoreDraft,
    clearDraft,
    savedDraftDate
  };
}
