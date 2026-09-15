/**
 * 🇧🇫 BURKINA NEWS — SERVICE DE DIAGNOSTIC SYSTÈME & SANTÉ
 * Câblé sur les endpoints /health et /api/v1/ping du Backend Go
 */

import { apiClient } from './client';
import { ApiResponse } from './types';

export interface HealthCheckData {
  status: string;
  uptime: string;
  environment: string;
  version: string;
  database?: {
    status: string;
    latency: string;
  };
}

export interface PingData {
  ping: string;
  time: string;
  version: string;
}

export const healthApi = {
  /**
   * Diagnostic complet de l'API et de la connexion PostgreSQL
   */
  async getHealth(): Promise<HealthCheckData | null> {
    const baseURL = (process.env.NEXT_PUBLIC_API_ROOT || 'http://localhost:8080').replace(/\/$/, '');
    try {
      const res = await fetch(`${baseURL}/health`);
      if (!res.ok) return null;
      const json: ApiResponse<HealthCheckData> = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Test de connectivité ping
   */
  async ping(): Promise<PingData | null> {
    try {
      const res = await apiClient.get<PingData>('/ping');
      return res.data || null;
    } catch {
      return null;
    }
  },
};
