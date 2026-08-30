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
              ? 'bg-[#1877F2] text-white'
              : isSyncing
              ? 'bg-[#1877F2] text-white'
              : 'bg-[#1877F2] text-[#65676B]'
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
                  <Layers className="w-4 h-4 shrink-0 text-[#65676B]" />
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
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs border cursor-pointer ${
            !isOnline
              ? 'bg-amber-50  text-amber-700  border-amber-300  hover:bg-amber-100'
              : isSyncing
              ? 'bg-[#E7F3FF]  text-[#1877F2]  border-[#E4E6EB]  hover:bg-[#E7F3FF] animate-pulse'
              : pendingCount > 0
              ? 'bg-blue-50  text-blue-700  border-blue-300  hover:bg-blue-100'
              : 'bg-[#E7F3FF]  text-[#1877F2]  border-[#E4E6EB]  hover:bg-[#E7F3FF]'
          }`}
          title="Cliquez pour gérer la synchronisation hors-ligne"
        >
          {!isOnline ? (
            <>
              <span className="w-2 h-2 rounded-lg bg-amber-500 animate-ping"></span>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hors-Ligne</span>
              {pendingCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-lg font-bold">
                  {pendingCount}
                </span>
              )}
            </>
          ) : isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1877F2] " />
              <span className="hidden sm:inline">Sync...</span>
              <span className="bg-[#1877F2] text-white text-[10px] px-1.5 py-0.2 rounded-lg font-bold">
                {pendingCount}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-lg bg-[#1877F2]"></span>
              <Wifi className="w-3.5 h-3.5 text-[#1877F2] " />
              <span className="hidden sm:inline">En Ligne</span>
              {pendingCount > 0 ? (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-lg font-bold">
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
