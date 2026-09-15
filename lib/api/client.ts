/**
 * 🇧🇫 BURKINA NEWS — CLIENT HTTP CENTRALISÉ
 * Conforme à la Règle 2 de la charte frontend.
 * Gère l'URL de base, les en-têtes Bearer JWT, l'interception 401 et les erreurs bilingues.
 */

import { ApiResponse, ApiErrorResponse, ApiValidationErrorDetail } from './types';

export class ApiClientError extends Error {
  public status: number;
  public errorCode: string;
  public messageFr: string;
  public messageEn: string;
  public details?: ApiValidationErrorDetail[];

  constructor(
    status: number,
    messageFr: string,
    messageEn: string,
    errorCode: string = 'API_ERROR',
    details?: ApiValidationErrorDetail[]
  ) {
    super(messageFr);
    this.name = 'ApiClientError';
    this.status = status;
    this.errorCode = errorCode;
    this.messageFr = messageFr;
    this.messageEn = messageEn;
    this.details = details;
  }

  /**
   * Retourne le message selon la langue active
   */
  public getLocalizedMessage(lang: 'fr' | 'en' = 'fr'): string {
    return lang === 'en' ? this.messageEn : this.messageFr;
  }
}

// ─── Gestionnaires de cookies côté client ────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// ─── Clés de stockage des Tokens ──────────────────────────────────────────

const ACCESS_TOKEN_KEY = 'bn_access_token';
const REFRESH_TOKEN_KEY = 'bn_refresh_token';

export const tokenStorage = {
  getAccessToken(): string | null {
    return getCookie(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return getCookie(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken: string): void {
    setCookie(ACCESS_TOKEN_KEY, accessToken, 1); // 1 jour max (expirera côté backend en 1h)
    setCookie(REFRESH_TOKEN_KEY, refreshToken, 7); // 7 jours
  },
  clearTokens(): void {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
    removeCookie('bn_admin_token'); // Nettoyage de l'ancien cookie mock
  },
};

// ─── Client HTTP Principal ────────────────────────────────────────────────

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Tente de renouveler l'Access Token avec le Refresh Token
   */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        tokenStorage.clearTokens();
        return null;
      }

      const json: ApiResponse<{ access_token: string; refresh_token: string }> = await res.json();
      if (json.success && json.data?.access_token) {
        tokenStorage.setTokens(json.data.access_token, json.data.refresh_token || refreshToken);
        return json.data.access_token;
      }
      tokenStorage.clearTokens();
      return null;
    } catch {
      tokenStorage.clearTokens();
      return null;
    }
  }

  /**
   * Requête HTTP générique typée
   */
  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${cleanEndpoint}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Injection automatique du token Bearer
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Gestion du code HTTP 401 (Token expiré)
      if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            return this.request<T>(endpoint, options, true);
          } else {
            // Échec de refresh -> déconnexion
            tokenStorage.clearTokens();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
              window.location.href = '/admin/login?reason=session_expired';
            }
          }
        } else {
          // Attente du refresh en cours
          return new Promise<ApiResponse<T>>((resolve) => {
            this.addRefreshSubscriber(() => {
              resolve(this.request<T>(endpoint, options, true));
            });
          });
        }
      }

      const rawText = await response.text();
      let data: any;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = { message_fr: rawText, message_en: rawText };
      }

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new ApiClientError(
          response.status,
          errorData.message_fr || 'Une erreur est survenue lors de la communication avec le serveur.',
          errorData.message_en || 'An error occurred while communicating with the server.',
          errorData.error_code || `HTTP_${response.status}`,
          errorData.details
        );
      }

      return data as ApiResponse<T>;
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      // Erreur réseau (ex: serveur éteint ou inaccessible)
      throw new ApiClientError(
        0,
        'Impossible de joindre le serveur backend. Vérifiez que le service Go est actif.',
        'Unable to reach backend server. Please verify Go service is running.',
        'NETWORK_ERROR'
      );
    }
  }

  // Méthodes utilitaires raccourcies
  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
