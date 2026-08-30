import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Database, 
  X, 
  ArrowUpRight, 
  Layers, 
  HardDrive, 
  Trash2,
  Smartphone,
  Check,
  ShieldCheck
} from 'lucide-react';
import { db, OfflineSyncQueueItem, getOfflineStorageMetrics } from '../../db/pwaDatabase';
import { useOfflineSync } from '../../hooks/useOfflineSync';

interface SyncQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncQueueModal: React.FC<SyncQueueModalProps> = ({ isOpen, onClose }) => {
  const { isOnline, isSyncing, pendingCount, lastSyncTime, recentLogs, forceSync } = useOfflineSync();
  const [queueItems, setQueueItems] = useState<OfflineSyncQueueItem[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'storage' | 'logs'>('queue');
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const loadData = async () => {
    try {
      const items = await db.syncQueue.orderBy('timestamp').reverse().limit(50).toArray();
      setQueueItems(items);
      const m = await getOfflineStorageMetrics();
      setMetrics(m);
    } catch (e) {
      console.warn('Error loading sync queue items:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      const interval = setInterval(loadData, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isSyncing]);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await forceSync();
    await loadData();
    setIsManualSyncing(false);
  };

  const handleClearCompleted = async () => {
    try {
      const syncedItems = await db.syncQueue.where('status').equals('synced').toArray();
      const ids = syncedItems.map(i => i.id!).filter(Boolean);
      if (ids.length > 0) {
        await db.syncQueue.bulkDelete(ids);
        await loadData();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isOnline 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Centre de Synchronisation Offline-First
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isOnline 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                }`}>
                  {isOnline ? 'En Ligne' : 'Hors Ligne'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Moteur IndexedDB & File d'attente intelligente EDU-CONGO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick summary banner */}
        <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <strong>{pendingCount}</strong> action(s) en attente
            </span>
            {lastSyncTime && (
              <span className="text-slate-400 hidden sm:inline">
                Dernière sync : {new Date(lastSyncTime).toLocaleTimeString('fr-FR')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isOnline && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing || isManualSyncing}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing || isManualSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing || isManualSyncing ? 'Synchronisation...' : 'Synchroniser maintenant'}</span>
              </button>
            )}
            <button
              onClick={handleClearCompleted}
              className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Purger les actions terminées de la liste"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Purger validées</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            File d'Attente ({queueItems.length})
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Stockage Local IndexedDB
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            Journal Réseau ({recentLogs.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'queue' && (
            <div className="space-y-3">
              {queueItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Toutes les actions sont synchronisées</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Aucune modification en attente. Vos élèves, paiements et notes sont parfaitement à jour localement et distants.
                  </p>
                </div>
              ) : (
                queueItems.map((item) => (
                  <div 
                    key={item.id || item.actionId}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/70 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.description}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.actionType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <span>{new Date(item.timestamp).toLocaleString('fr-FR')}</span>
                        {item.idempotencyKey && (
                          <span className="font-mono text-[9px] bg-slate-200 dark:bg-slate-700 px-1 rounded truncate max-w-[120px]">
                            {item.idempotencyKey}
                          </span>
                        )}
                        {item.retries > 0 && (
                          <span className="text-amber-500">Essais: {item.retries}</span>
                        )}
                      </div>
                      {item.error && (
                        <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{item.error}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {item.status === 'pending' && (
                        <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                      {item.status === 'syncing' && (
                        <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" /> En cours
                        </span>
                      )}
                      {item.status === 'synced' && (
                        <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Synchronisé
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="px-2 py-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Échec
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Élèves enregistrés</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{metrics?.studentsCount ?? 0}</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Classes & Niveaux</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{metrics?.classesCount ?? 0}</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Paiements & Reçus</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{metrics?.paymentsCount ?? 0}</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Notes & Évaluations</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{metrics?.gradesCount ?? 0}</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Présences & Appels</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{metrics?.attendanceCount ?? 0}</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Espace Estimé</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {metrics?.estimatedBytes ? `${(metrics.estimatedBytes / 1024 / 1024).toFixed(2)} MB` : '1.4 MB'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Architecture 100% Hors-Ligne Sécurisée (Dexie.js / IndexedDB)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Toutes vos saisies (frais de scolarité, inscriptions, bulletins de notes, journal de caisse) s'exécutent instantanément dans la mémoire locale de votre navigateur ou smartphone. Aucun ralentissement ni blocage d'écran en cas de coupure de réseau MTN/Airtel ou d'électricité.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2 font-mono text-xs">
              {recentLogs.length === 0 ? (
                <p className="text-slate-400 text-center py-6">Aucun événement réseau récent.</p>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
                      log.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                        : log.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300'
                        : log.type === 'error'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-slate-400 shrink-0 font-sans">{log.time}</span>
                    <span className="flex-1 font-sans">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Smartphone className="w-4 h-4 text-indigo-500" />
            <span>PWA Compatible Mobile, Tablette & Ordinateur</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
