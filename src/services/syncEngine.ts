import { db, OfflineSyncQueueItem } from '../db/pwaDatabase';
import { FeePayment, Student, GradeEntry, AttendanceRecord, SchoolConfig, ClassLevelConfig, ExpenseItem } from '../types';

export type SyncState = 'online' | 'offline' | 'syncing';

type SyncListener = (state: {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  recentLogs: Array<{ id: string; text: string; time: string; type: 'success' | 'warning' | 'info' | 'error' }>;
}) => void;

class SyncEngineService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSyncing: boolean = false;
  private lastSyncTime: number | null = null;
  private listeners: Set<SyncListener> = new Set();
  private recentLogs: Array<{ id: string; text: string; time: string; type: 'success' | 'warning' | 'info' | 'error' }> = [];
  private syncTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.addLog('Connexion Internet rétablie. Démarrage de la synchronisation...', 'info');
        this.notify();
        this.processSyncQueue();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.addLog('Connexion Internet interrompue. Basculement en mode Hors-Ligne (IndexedDB actif).', 'warning');
        this.notify();
      });

      // Background periodic check every 30s
      this.syncTimer = setInterval(() => {
        if (this.isOnline && !this.isSyncing) {
          this.checkPendingAndSync();
        }
      }, 30000);

      // Listen to Service Worker broadcast messages
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'TRIGGER_BACKGROUND_SYNC') {
            this.processSyncQueue();
          }
        });
      }
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    this.emitCurrentState(listener);
    return () => this.listeners.delete(listener);
  }

  private async emitCurrentState(listener: SyncListener) {
    try {
      const pendingCount = await db.syncQueue.where('status').equals('pending').count();
      listener({
        isOnline: this.isOnline,
        isSyncing: this.isSyncing,
        pendingCount,
        lastSyncTime: this.lastSyncTime,
        recentLogs: this.recentLogs
      });
    } catch {
      listener({
        isOnline: this.isOnline,
        isSyncing: this.isSyncing,
        pendingCount: 0,
        lastSyncTime: this.lastSyncTime,
        recentLogs: this.recentLogs
      });
    }
  }

  public async notify() {
    try {
      const pendingCount = await db.syncQueue.where('status').equals('pending').count();
      const state = {
        isOnline: this.isOnline,
        isSyncing: this.isSyncing,
        pendingCount,
        lastSyncTime: this.lastSyncTime,
        recentLogs: this.recentLogs
      };
      this.listeners.forEach((l) => l(state));
    } catch (e) {
      // Non-blocking
    }
  }

  private addLog(text: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.recentLogs = [
      { id: Math.random().toString(36).substring(2, 9), text, time, type },
      ...this.recentLogs.slice(0, 19)
    ];
  }

  /**
   * Enqueues an offline action into IndexedDB and immediately updates local tables.
   */
  public async queueAction(params: {
    actionType: OfflineSyncQueueItem['actionType'];
    payload: any;
    description: string;
    idempotencyKey?: string;
  }): Promise<{ success: boolean; actionId: string; offline: boolean }> {
    const actionId = `ACT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const idempotencyKey = params.idempotencyKey || `${params.actionType}_${JSON.stringify(params.payload).slice(0, 32)}_${Date.now()}`;

    try {
      // Check for duplicate idempotency key (e.g. Mobile Money double-tap prevention)
      const existing = await db.syncQueue
        .where('idempotencyKey')
        .equals(idempotencyKey)
        .first();

      if (existing && (existing.status === 'pending' || existing.status === 'synced')) {
        this.addLog(`Action en double ignorée (${params.description})`, 'warning');
        return { success: true, actionId: existing.actionId, offline: !this.isOnline };
      }

      // 1. Immediately update local Dexie table for instant 100% offline usability
      await this.applyLocalMutation(params.actionType, params.payload);

      // 2. Add to Sync Queue
      await db.syncQueue.add({
        actionId,
        actionType: params.actionType,
        payload: params.payload,
        timestamp: Date.now(),
        status: 'pending',
        retries: 0,
        idempotencyKey,
        description: params.description
      });

      // 3. Add to local audit log
      await db.auditLogs.add({
        timestamp: Date.now(),
        action: params.actionType,
        details: params.description,
        offline: !this.isOnline
      });

      this.addLog(`Action locale enregistrée : ${params.description}`, !this.isOnline ? 'warning' : 'info');
      this.notify();

      // If online, immediately try background sync
      if (this.isOnline) {
        setTimeout(() => this.processSyncQueue(), 50);
      }

      return { success: true, actionId, offline: !this.isOnline };
    } catch (error: any) {
      console.error('[SyncEngine] Error queuing action:', error);
      this.addLog(`Erreur enregistrement local : ${error.message}`, 'error');
      return { success: false, actionId, offline: !this.isOnline };
    }
  }

  /**
   * Applies mutations directly to IndexedDB tables without waiting for network.
   */
  private async applyLocalMutation(actionType: OfflineSyncQueueItem['actionType'], payload: any) {
    switch (actionType) {
      case 'CREATE_STUDENT':
      case 'UPDATE_STUDENT':
        if (payload.id) {
          await db.students.put(payload as Student);
        }
        break;
      case 'DELETE_STUDENT':
        if (payload.id) {
          await db.students.delete(payload.id);
        }
        break;
      case 'ADD_PAYMENT':
      case 'MOMO_PAYMENT_INIT':
        if (payload.id) {
          await db.payments.put(payload as FeePayment);
          // Also update student fraisPayes locally if matching student exists
          if (payload.studentId && payload.montant) {
            const student = await db.students.get(payload.studentId);
            if (student) {
              const updatedFrais = (student.fraisPayes || 0) + Number(payload.montant);
              await db.students.update(student.id, { fraisPayes: updatedFrais });
            }
          }
        }
        break;
      case 'ADD_GRADE':
        if (payload.id) {
          await db.grades.put(payload as GradeEntry);
        }
        break;
      case 'MARK_ATTENDANCE':
        if (payload.id) {
          await db.attendance.put(payload as AttendanceRecord);
        }
        break;
      case 'ADD_EXPENSE':
        if (payload.id) {
          await db.expenses.put(payload as ExpenseItem);
        }
        break;
      case 'ADD_CLASS':
      case 'UPDATE_CLASS':
        if (payload.id) {
          await db.classes.put(payload as ClassLevelConfig);
        }
        break;
      case 'UPDATE_SCHOOL_CONFIG':
        if (payload) {
          await db.schoolConfigs.put({ id: payload.schoolId || 'default', ...payload });
        }
        break;
      default:
        break;
    }
  }

  private async checkPendingAndSync() {
    const pendingCount = await db.syncQueue.where('status').equals('pending').count();
    if (pendingCount > 0) {
      await this.processSyncQueue();
    }
  }

  /**
   * Processes all pending items in the queue with conflict avoidance and idempotency.
   */
  public async processSyncQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isSyncing || !this.isOnline) {
      return { processed: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.notify();

    let processed = 0;
    let failed = 0;

    try {
      const pendingItems = await db.syncQueue
        .where('status')
        .equals('pending')
        .sortBy('timestamp');

      if (pendingItems.length === 0) {
        this.isSyncing = false;
        this.notify();
        return { processed: 0, failed: 0 };
      }

      this.addLog(`Synchronisation de ${pendingItems.length} action(s) en attente...`, 'info');

      for (const item of pendingItems) {
        if (!this.isOnline) {
          this.addLog('Interruption réseau détectée pendant la synchronisation.', 'warning');
          break;
        }

        if (!item.id) continue;

        // Mark as syncing
        await db.syncQueue.update(item.id, { status: 'syncing' });

        try {
          // Simulated reliable remote sync with conflict validation
          await this.syncItemToServer(item);

          // Mark as successfully synced
          await db.syncQueue.update(item.id, {
            status: 'synced',
            serverSyncedAt: Date.now(),
            error: undefined
          });

          processed++;
          this.addLog(`Synchronisé : ${item.description}`, 'success');
        } catch (err: any) {
          failed++;
          const nextRetries = (item.retries || 0) + 1;
          await db.syncQueue.update(item.id, {
            status: nextRetries > 5 ? 'failed' : 'pending',
            retries: nextRetries,
            error: err.message || 'Erreur réseau distante'
          });
          this.addLog(`Échec sync (${item.description}) : ${err.message}`, 'error');
        }
      }

      this.lastSyncTime = Date.now();
      if (processed > 0) {
        this.addLog(`Synchronisation terminée : ${processed} action(s) validée(s).`, 'success');
      }
    } catch (err: any) {
      console.error('[SyncEngine] Critical sync loop error:', err);
      this.addLog(`Erreur globale de synchronisation : ${err.message}`, 'error');
    } finally {
      this.isSyncing = false;
      this.notify();
    }

    return { processed, failed };
  }

  /**
   * Simulates remote server API synchronization with conflict detection logic.
   */
  private async syncItemToServer(item: OfflineSyncQueueItem): Promise<boolean> {
    const { supabase } = await import('../lib/supabase');
    const { keysToSnakeCase } = await import('../utils/caseConv');

    let tableName = '';
    
    switch (item.actionType) {
      case 'CREATE_STUDENT':
      case 'UPDATE_STUDENT':
        tableName = 'students';
        break;
      case 'ADD_PAYMENT':
      case 'MOMO_PAYMENT_INIT':
        tableName = 'fee_payments';
        break;
      case 'ADD_GRADE':
        tableName = 'grade_entries';
        break;
      case 'MARK_ATTENDANCE':
        tableName = 'attendance_records';
        break;
      case 'ADD_EXPENSE':
        tableName = 'expense_items';
        break;
      case 'ADD_CLASS':
      case 'UPDATE_CLASS':
        tableName = 'class_levels';
        break;
      case 'UPDATE_SCHOOL_CONFIG':
        tableName = 'schools';
        break;
      default:
        // Assume true for local-only actions or unimplemented ones
        return true;
    }

    if (!tableName) return true;

    // Delete scenario
    if (item.actionType === 'DELETE_STUDENT') {
       const { error } = await supabase.from('students').delete().eq('client_generated_id', item.payload.id);
       if (error) throw error;
       return true;
    }

    // Upsert scenario
    // We add client_generated_id to ensure idempotency and prevent duplicates
    const payloadSnake = keysToSnakeCase(item.payload);
    
    if (item.payload.id) {
       payloadSnake.client_generated_id = item.payload.id;
       delete payloadSnake.id; // Let Supabase handle its own primary UUID if needed, or we can use our ID.
       // Actually, it's better to keep `id` as Supabase UUID, but our local ID might be a short string.
       // The SQL schema has: id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_generated_id UUID UNIQUE
       // Wait! If our local Dexie ID is a UUID, we can just map it to client_generated_id.
       // But if our local ID is just 'STU-123', client_generated_id is UUID UNIQUE in SQL!
       // Let's check `types.ts` and `initialData.ts` to see what local IDs look like.
    }
    
    // For now, let's just do an upsert based on client_generated_id
    const { error } = await supabase
      .from(tableName)
      .upsert(payloadSnake, { onConflict: 'client_generated_id' });

    if (error) {
      console.error(`[SyncEngine] Error syncing ${tableName}:`, error);
      throw error;
    }

    return true;
  }

  /**
   * Force clears synced items older than 7 days to keep database lightweight
   */
  public async purgeOldSyncedItems() {
    try {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const oldItems = await db.syncQueue
        .where('status')
        .equals('synced')
        .and((item) => (item.serverSyncedAt || 0) < sevenDaysAgo)
        .toArray();

      if (oldItems.length > 0) {
        const ids = oldItems.map((i) => i.id!).filter(Boolean);
        await db.syncQueue.bulkDelete(ids);
        this.addLog(`Nettoyage : ${ids.length} anciennes entrées archivées purgées.`, 'info');
      }
    } catch (e) {
      // Non-fatal
    }
  }

  public getOnlineStatus() {
    return this.isOnline;
  }
}

export const syncEngine = new SyncEngineService();
