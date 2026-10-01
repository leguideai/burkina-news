/**
 * 🇧🇫 BURKINA NEWS — GESTIONNAIRE DE FILE D'ATTENTE HORS-LIGNE (OFFLINE QUEUE)
 * Conforme à la Phase F9.3 : Résilience réseau et persistance locale des brouillons
 * pour les journalistes et administrateurs travaillant dans des conditions réseau instables.
 */

export interface QueuedRequest {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body: any;
  timestamp: number;
  description: string;
}

export interface OfflineDraft<T = any> {
  key: string;
  data: T;
  updatedAt: number;
  title?: string;
}

const STORAGE_QUEUE_KEY = 'bn_offline_request_queue';
const STORAGE_DRAFT_PREFIX = 'bn_draft_';

type OfflineListener = (isOnline: boolean) => void;

class OfflineQueueManager {
  private listeners: Set<OfflineListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.notifyStatus(true);
        this.replayPendingRequests();
      });
      window.addEventListener('offline', () => {
        this.notifyStatus(false);
      });
    }
  }

  public isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  }

  public subscribeStatus(listener: OfflineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyStatus(online: boolean) {
    this.listeners.forEach((fn) => {
      try {
        fn(online);
      } catch (err) {
        console.error('[OfflineQueue] Erreur listener status:', err);
      }
    });
  }

  // ─── GESTION DES BROUILLONS LOCAUX (DRAFTS) ─────────────────────────────

  public saveDraft<T>(key: string, data: T, title?: string): void {
    if (typeof window === 'undefined') return;
    try {
      const draft: OfflineDraft<T> = {
        key,
        data,
        updatedAt: Date.now(),
        title,
      };
      localStorage.setItem(`${STORAGE_DRAFT_PREFIX}${key}`, JSON.stringify(draft));
    } catch (e) {
      console.warn('[OfflineQueue] Impossible de sauvegarder le brouillon local:', e);
    }
  }

  public getDraft<T>(key: string): OfflineDraft<T> | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_DRAFT_PREFIX}${key}`);
      if (!raw) return null;
      return JSON.parse(raw) as OfflineDraft<T>;
    } catch {
      return null;
    }
  }

  public removeDraft(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`${STORAGE_DRAFT_PREFIX}${key}`);
    } catch {}
  }

  public listAllDrafts(): OfflineDraft[] {
    if (typeof window === 'undefined') return [];
    const drafts: OfflineDraft[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_DRAFT_PREFIX)) {
          const val = localStorage.getItem(k);
          if (val) {
            drafts.push(JSON.parse(val));
          }
        }
      }
    } catch {}
    return drafts.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // ─── GESTION DES REQUÊTES EN ATTENTE (MUTATION QUEUE) ─────────────────────

  public getQueue(): QueuedRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public enqueue(
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body: any,
    description: string = 'Requête hors-ligne'
  ): QueuedRequest {
    const queue = this.getQueue();
    const item: QueuedRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      endpoint,
      method,
      body,
      timestamp: Date.now(),
      description,
    };
    queue.push(item);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
      } catch (err) {
        console.warn('[OfflineQueue] Quota de stockage dépassé pour la file:', err);
      }
    }
    return item;
  }

  public dequeue(id: string): void {
    const queue = this.getQueue().filter((item) => item.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
      } catch {}
    }
  }

  public clearQueue(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_QUEUE_KEY);
      } catch {}
    }
  }

  /**
   * Rejoue les requêtes en attente lorsque la connectivité est restaurée
   */
  public async replayPendingRequests(): Promise<number> {
    const queue = this.getQueue();
    if (queue.length === 0) return 0;

    let successfulReplays = 0;
    const remainingQueue: QueuedRequest[] = [];

    // Dynamically import apiClient to prevent circular dependencies
    const { apiClient } = await import('@/lib/api/client');

    for (const item of queue) {
      try {
        await apiClient.request(item.endpoint, {
          method: item.method,
          body: JSON.stringify(item.body),
        });
        successfulReplays++;
      } catch (err: any) {
        // En cas d'erreur de validation (400, 422), on retire quand même pour ne pas bloquer la file indéfiniment
        if (err.status && (err.status === 400 || err.status === 422 || err.status === 403)) {
          console.warn('[OfflineQueue] Requête rejetée définitivement par le serveur:', item.id, err);
        } else {
          // Erreur réseau persistante, conserver dans la file
          remainingQueue.push(item);
        }
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(remainingQueue));
      } catch {}
    }

    return successfulReplays;
  }
}

export const offlineQueue = new OfflineQueueManager();
