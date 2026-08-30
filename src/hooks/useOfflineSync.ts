import { useState, useEffect, useCallback } from 'react';
import { syncEngine } from '../services/syncEngine';
import { OfflineSyncQueueItem } from '../db/pwaDatabase';

export function useOfflineSync() {
  const [syncState, setSyncState] = useState(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    pendingCount: 0,
    lastSyncTime: null as number | null,
    recentLogs: [] as Array<{ id: string; text: string; time: string; type: 'success' | 'warning' | 'info' | 'error' }>
  }));

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((state) => {
      setSyncState(state);
    });
    return () => unsubscribe();
  }, []);

  const forceSync = useCallback(async () => {
    return await syncEngine.processSyncQueue();
  }, []);

  const queueAction = useCallback(async (params: {
    actionType: OfflineSyncQueueItem['actionType'];
    payload: any;
    description: string;
    idempotencyKey?: string;
  }) => {
    return await syncEngine.queueAction(params);
  }, []);

  return {
    ...syncState,
    forceSync,
    queueAction
  };
}
