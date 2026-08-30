import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Layers, Sparkles, CloudCheck, AlertTriangle } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { SyncQueueModal } from './SyncQueueModal';

interface NetworkStatusBannerProps {
  variant?: 'pill' | 'banner' | 'both';
  className?: string;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({ 
  variant = 'both',
  className = '' 
}) => {
  const { isOnline, isSyncing, pendingCount } = useOfflineSync();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* 1. Offline Top Notification Banner (Shown only when offline or has pending actions) */}
      {(variant === 'banner' || variant === 'both') && (!isOnline || pendingCount > 0) && (
        <div 
          onClick={() => setShowModal(true)}
          className={`w-full text-xs font-medium cursor-pointer transition-all ${
            !isOnline
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
              : isSyncing
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
              : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200'
          } ${className}`}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isOnline ? (
                <>
                  <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
                  <span>
                    <strong>Mode Hors-Ligne Actif</strong> : Vous pouvez continuer à inscrire des élèves, saisir des paiements et des notes.
                  </span>
                </>
              ) : isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-blue-200" />
                  <span>
                    Synchronisation automatique en cours avec le serveur ({pendingCount} action(s))...
                  </span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 shrink-0 text-slate-300" />
                  <span>
                    {pendingCount} modification(s) enregistrée(s) localement prêtes pour la synchronisation.
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="underline font-bold hover:text-white transition-colors">
                Voir la file d'attente →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Compact Header Pill Button */}
      {(variant === 'pill' || variant === 'both') && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs border cursor-pointer ${
            !isOnline
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
              : isSyncing
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 animate-pulse'
              : pendingCount > 0
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 hover:bg-blue-100'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
          }`}
          title="Cliquez pour gérer la synchronisation hors-ligne"
        >
          {!isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hors-Ligne</span>
              {pendingCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </>
          ) : isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Sync...</span>
              <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingCount}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">En Ligne</span>
              {pendingCount > 0 ? (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingCount}
                </span>
              ) : null}
            </>
          )}
        </button>
      )}

      {/* Sync Queue Modal */}
      <SyncQueueModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
