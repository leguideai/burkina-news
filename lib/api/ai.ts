/**
 * 🇧🇫 BURKINA NEWS — SERVICE API ASSISTANT MICUM
 * Copilote éditorial, veille documentaire et traduction (Go Backend).
 */

import { apiClient } from './client';
import {
  AIStatusDTO,
  AIChatInput,
  AIChatOutput,
  AIExtractInput,
  AIExtractOutput,
  AITranslateInput,
  AITranslateOutput,
} from './types';

export const aiApi = {
  /**
   * ADMIN : Récupérer l'état du moteur IA actif
   */
  async getStatus(): Promise<AIStatusDTO> {
    const res = await apiClient.get<AIStatusDTO>('/admin/ai/status');
    return res.data;
  },

  /**
   * ADMIN : Dialoguer avec Micum (Conseil éditorial, vérification, synthèse)
   */
  async chat(data: AIChatInput): Promise<AIChatOutput> {
    const res = await apiClient.post<AIChatOutput>('/admin/ai/chat', data);
    return res.data;
  },

  /**
   * ADMIN : Structurer un document brut en données exploitables
   */
  async extract(data: AIExtractInput): Promise<AIExtractOutput> {
    const res = await apiClient.post<AIExtractOutput>('/admin/ai/extract', data);
    return res.data;
  },

  /**
   * ADMIN : Traduction journalistique FR <-> EN avec respect des sigles burkinabè
   */
  async translate(data: AITranslateInput): Promise<AITranslateOutput> {
    const res = await apiClient.post<AITranslateOutput>('/admin/ai/translate', data);
    return res.data;
  },
};
