// Multi-Provider AI Engine for Micum
// Supports: Google Gemini, Anthropic Claude, and OpenAI ChatGPT.
// Automatic provider detection based on available API keys in environment variables:
// - GEMINI_API_KEY (or GOOGLE_API_KEY)
// - ANTHROPIC_API_KEY (or CLAUDE_API_KEY)
// - OPENAI_API_KEY
// - MICUM_AI_PROVIDER ('auto' | 'gemini' | 'claude' | 'openai')

export interface ProviderInfo {
  provider: 'gemini' | 'claude' | 'openai' | 'simulation';
  modelName: string;
  isLive: boolean;
  apiKey?: string;
}

export function getActiveProviderInfo(): ProviderInfo {
  const forceProvider = process.env.MICUM_AI_PROVIDER?.toLowerCase()?.trim();
  
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();
  const anthropicKey = (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY)?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  // 1. Explicit override if requested
  if (forceProvider === 'gemini' && geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey, modelName: 'Gemini 2.5 Flash', isLive: true };
  }
  if ((forceProvider === 'claude' || forceProvider === 'anthropic') && anthropicKey) {
    return { provider: 'claude', apiKey: anthropicKey, modelName: 'Claude 3.5 Sonnet', isLive: true };
  }
  if ((forceProvider === 'openai' || forceProvider === 'chatgpt') && openAiKey) {
    return { provider: 'openai', apiKey: openAiKey, modelName: 'GPT-4o', isLive: true };
  }

  // 2. Automatic detection by availability
  // Priority: Gemini -> Claude -> OpenAI
  if (geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey, modelName: 'Gemini 2.5 Flash', isLive: true };
  }
  if (anthropicKey) {
    return { provider: 'claude', apiKey: anthropicKey, modelName: 'Claude 3.5 Sonnet', isLive: true };
  }
  if (openAiKey) {
    return { provider: 'openai', apiKey: openAiKey, modelName: 'GPT-4o', isLive: true };
  }

  // 3. Fallback: Internal deterministic engine
  return { provider: 'simulation', modelName: 'Micum Desk IA (Moteur local)', isLive: false };
}

// -------------------------------------------------------------
// Provider Callers
// -------------------------------------------------------------

async function callGemini(apiKey: string, systemPrompt: string, userPrompt: string): Promise<any | null> {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!res.ok) {
        console.warn(`Gemini API returned ${res.status} for model ${model}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return parseCleanJson(rawText);
      }
    } catch (e) {
      console.warn(`Gemini error with model ${model}:`, e);
    }
  }

  return null;
}

async function callClaude(apiKey: string, systemPrompt: string, userPrompt: string): Promise<any | null> {
  const models = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-haiku-20240307'];

  for (const model of models) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: `${systemPrompt}\nTu dois répondre EXCLUSIVEMENT sous forme d'objet JSON valide, sans balises de code ni texte introductif.`,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      if (!res.ok) {
        console.warn(`Claude API returned ${res.status} for model ${model}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.content?.[0]?.text;
      if (rawText) {
        return parseCleanJson(rawText);
      }
    } catch (e) {
      console.warn(`Claude error with model ${model}:`, e);
    }
  }

  return null;
}

async function callOpenAI(apiKey: string, systemPrompt: string, userPrompt: string): Promise<any | null> {
  const models = ['gpt-4o-mini', 'gpt-4o'];

  for (const model of models) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: `${systemPrompt}\nTu dois répondre EXCLUSIVEMENT sous forme d'objet JSON valide.` },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        })
      });

      if (!res.ok) {
        console.warn(`OpenAI API returned ${res.status} for model ${model}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (rawText) {
        return parseCleanJson(rawText);
      }
    } catch (e) {
      console.warn(`OpenAI error with model ${model}:`, e);
    }
  }

  return null;
}

function parseCleanJson(text: string): any | null {
  try {
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse AI JSON response:', e, text);
    return null;
  }
}

// -------------------------------------------------------------
// Unified Call Interface
// -------------------------------------------------------------

export async function generateAIJson({
  systemPrompt,
  userPrompt
}: {
  systemPrompt: string;
  userPrompt: string;
}): Promise<{ data: any; model: string; provider: string } | null> {
  const info = getActiveProviderInfo();
  if (!info.isLive || !info.apiKey) {
    return null;
  }

  try {
    let result: any = null;

    if (info.provider === 'gemini') {
      result = await callGemini(info.apiKey, systemPrompt, userPrompt);
    } else if (info.provider === 'claude') {
      result = await callClaude(info.apiKey, systemPrompt, userPrompt);
    } else if (info.provider === 'openai') {
      result = await callOpenAI(info.apiKey, systemPrompt, userPrompt);
    }

    if (result && typeof result === 'object') {
      return {
        data: result,
        model: `${info.modelName} (Micum AI)`,
        provider: info.provider
      };
    }
  } catch (err) {
    console.error(`Error calling ${info.provider} API:`, err);
  }

  return null;
}
