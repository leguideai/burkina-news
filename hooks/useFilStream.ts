"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { BriefDTO, BriefFactDTO } from '@/lib/api/types';
import { filApi } from '@/lib/api/fil';

export interface FilStreamEvent<T = any> {
  type: 'connected' | 'heartbeat' | 'new_fact' | 'update_fact' | 'delete_fact' | 'new_brief' | 'update_brief' | 'delete_brief';
  data: T;
  receivedAt: string;
}

export interface UseFilStreamOptions {
  enabled?: boolean;
  onConnected?: (data: { status: string; clients: number }) => void;
  onNewFact?: (fact: BriefFactDTO) => void;
  onUpdateFact?: (fact: BriefFactDTO) => void;
  onDeleteFact?: (data: { id: string }) => void;
  onNewBrief?: (brief: BriefDTO) => void;
  onUpdateBrief?: (brief: BriefDTO) => void;
  onDeleteBrief?: (data: { id: string }) => void;
  onHeartbeat?: (data: { timestamp: string }) => void;
  onError?: (err: Event) => void;
}

/**
 * Hook React pour écouter en direct le flux temps réel Server-Sent Events (SSE) du Fil d'actualité.
 * Déploie les dépêches instantanées 60 secondes et synchronise les éditions hebdomadaires.
 */
export function useFilStream(options: UseFilStreamOptions = {}) {
  const {
    enabled = true,
    onConnected,
    onNewFact,
    onUpdateFact,
    onDeleteFact,
    onNewBrief,
    onUpdateBrief,
    onDeleteBrief,
    onHeartbeat,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<FilStreamEvent | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Mémoriser les callbacks dans des refs pour éviter de recréer l'EventSource à chaque re-render
  const callbacksRef = useRef({
    onConnected,
    onNewFact,
    onUpdateFact,
    onDeleteFact,
    onNewBrief,
    onUpdateBrief,
    onDeleteBrief,
    onHeartbeat,
    onError,
  });

  useEffect(() => {
    callbacksRef.current = {
      onConnected,
      onNewFact,
      onUpdateFact,
      onDeleteFact,
      onNewBrief,
      onUpdateBrief,
      onDeleteBrief,
      onHeartbeat,
      onError,
    };
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    let isSubscribed = true;
    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connect = () => {
      if (!isSubscribed) return;

      try {
        const streamUrl = filApi.getStreamUrl();
        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          if (!isSubscribed) return;
          setIsConnected(true);
          setErrorCount(0);
        };

        eventSource.onerror = (err) => {
          if (!isSubscribed) return;
          setIsConnected(false);
          setErrorCount((prev) => prev + 1);
          if (callbacksRef.current.onError) {
            callbacksRef.current.onError(err);
          }
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnexion automatique exponentielle plafonnée à 15s
          if (isSubscribed) {
            const delay = Math.min(1000 * Math.pow(1.5, Math.min(errorCount, 6)), 15000);
            reconnectTimer = setTimeout(connect, delay);
          }
        };

        // Événement d'établissement de flux
        eventSource.addEventListener('connected', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed = JSON.parse(e.data);
            const evt: FilStreamEvent = {
              type: 'connected',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onConnected?.(parsed);
          } catch {
            // Ignorer JSON invalide
          }
        });

        // Heartbeat keep-alive (30s)
        eventSource.addEventListener('heartbeat', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed = JSON.parse(e.data);
            const evt: FilStreamEvent = {
              type: 'heartbeat',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onHeartbeat?.(parsed);
          } catch {
            // Ignorer JSON invalide
          }
        });

        // Nouvelle dépêche 60s
        eventSource.addEventListener('new_fact', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed: BriefFactDTO = JSON.parse(e.data);
            const evt: FilStreamEvent<BriefFactDTO> = {
              type: 'new_fact',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onNewFact?.(parsed);
          } catch {
            // Ignorer
          }
        });

        // Mise à jour de dépêche
        eventSource.addEventListener('update_fact', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed: BriefFactDTO = JSON.parse(e.data);
            const evt: FilStreamEvent<BriefFactDTO> = {
              type: 'update_fact',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onUpdateFact?.(parsed);
          } catch {
            // Ignorer
          }
        });

        // Suppression de dépêche
        eventSource.addEventListener('delete_fact', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed: { id: string } = JSON.parse(e.data);
            const evt: FilStreamEvent<{ id: string }> = {
              type: 'delete_fact',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onDeleteFact?.(parsed);
          } catch {
            // Ignorer
          }
        });

        // Nouvelle édition hebdomadaire
        eventSource.addEventListener('new_brief', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed: BriefDTO = JSON.parse(e.data);
            const evt: FilStreamEvent<BriefDTO> = {
              type: 'new_brief',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onNewBrief?.(parsed);
          } catch {
            // Ignorer
          }
        });

        // Mise à jour d'édition
        eventSource.addEventListener('update_brief', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed: BriefDTO = JSON.parse(e.data);
            const evt: FilStreamEvent<BriefDTO> = {
              type: 'update_brief',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onUpdateBrief?.(parsed);
          } catch {
            // Ignorer
          }
        });

        // Suppression d'édition
        eventSource.addEventListener('delete_brief', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const parsed: { id: string } = JSON.parse(e.data);
            const evt: FilStreamEvent<{ id: string }> = {
              type: 'delete_brief',
              data: parsed,
              receivedAt: new Date().toISOString(),
            };
            setLastEvent(evt);
            callbacksRef.current.onDeleteBrief?.(parsed);
          } catch {
            // Ignorer
          }
        });

      } catch (err) {
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      isSubscribed = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [enabled]);

  return {
    isConnected,
    lastEvent,
    errorCount,
  };
}
