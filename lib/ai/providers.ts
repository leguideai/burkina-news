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

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function getActiveProviderInfo(): ProviderInfo {
  const forceProvider = process.env.MICUM_AI_PROVIDER?.toLowerCase()?.trim();
  
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();
  const anthropicKey = (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY)?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  // 1. Explicit override if requested
  if (forceProvider === 'gemini' && geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey, modelName: 'Gemini 3.6 Flash', isLive: true };
  }
  if ((forceProvider === 'claude' || forceProvider === 'anthropic') && anthropicKey) {
    return { provider: 'claude', apiKey: anthropicKey, modelName: 'Claude 3.5 Sonnet', isLive: true };
  }
  if ((forceProvider === 'openai' || forceProvider === 'chatgpt') && openAiKey) {
    return { provider: 'openai', apiKey: openAiKey, modelName: 'GPT-4o', isLive: true };
  }

  // 2. Automatic detection by availability (Priority: Gemini -> Claude -> OpenAI)
  if (geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey, modelName: 'Gemini 3.6 Flash', isLive: true };
  }
  if (anthropicKey) {
    return { provider: 'claude', apiKey: anthropicKey, modelName: 'Claude 3.5 Sonnet', isLive: true };
  }
  if (openAiKey) {
    return { provider: 'openai', apiKey: openAiKey, modelName: 'GPT-4o', isLive: true };
  }

  // 3. Fallback: Simulation engine when no API keys are present
  return { provider: 'simulation', modelName: 'Micum Desk IA (Offline)', isLive: false };
}

// -------------------------------------------------------------
// Gemini Chat & Generation
// -------------------------------------------------------------

async function callGeminiChat(
  apiKey: string,
  systemPrompt: string,
  messages: ChatTurn[],
  temperature = 0.3
): Promise<{ text: string; model: string }> {
  const models = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  
  // Format contents for Gemini: strictly alternating user/model
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const text = m.content?.trim();
    if (!text) continue;

    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts.push({ text });
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  if (contents.length === 0 || contents[0].role !== 'user') {
    contents.unshift({ role: 'user', parts: [{ text: 'Bonjour' }] });
  }

  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature,
            maxOutputTokens: 4096
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`Gemini ${model} HTTP ${res.status}: ${errText}`);
        console.warn(`Gemini chat error with ${model}:`, errText);
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return { text: rawText, model: `${model}` };
      }
    } catch (e: any) {
      lastError = e;
      console.warn(`Gemini error with model ${model}:`, e);
    }
  }

  throw lastError || new Error("Échec de communication avec les modèles Gemini.");
}

async function callClaudeChat(
  apiKey: string,
  systemPrompt: string,
  messages: ChatTurn[],
  temperature = 0.3
): Promise<{ text: string; model: string }> {
  const models = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'];

  let lastError: Error | null = null;

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
          system: systemPrompt,
          temperature,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`Claude ${model} HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.content?.[0]?.text;
      if (rawText) {
        return { text: rawText, model };
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error("Échec de communication avec Claude.");
}

async function callOpenAIChat(
  apiKey: string,
  systemPrompt: string,
  messages: ChatTurn[],
  temperature = 0.3
): Promise<{ text: string; model: string }> {
  const models = ['gpt-4o-mini', 'gpt-4o'];

  let lastError: Error | null = null;

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
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`OpenAI ${model} HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (rawText) {
        return { text: rawText, model };
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error("Échec de communication avec OpenAI.");
}

// -------------------------------------------------------------
// JSON Clean Extractor
// -------------------------------------------------------------

export function extractEmbeddedJson(text: string): any | null {
  if (!text) return null;
  try {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      const parsed = JSON.parse(match[1].trim());
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}

  try {
    const trimmed = text.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}

  return null;
}

export function parseCleanJson(text: string): any | null {
  return extractEmbeddedJson(text);
}

// -------------------------------------------------------------
// Public High-Level AI Functions
// -------------------------------------------------------------

/**
 * Freeform multi-turn conversational AI with screen awareness and rich Markdown response
 */
export async function generateAIChat({
  systemPrompt,
  messages,
  temperature = 0.3
}: {
  systemPrompt: string;
  messages: ChatTurn[];
  temperature?: number;
}): Promise<{ text: string; rawData?: any; model: string; provider: string }> {
  const info = getActiveProviderInfo();
  if (!info.isLive || !info.apiKey) {
    throw new Error("Aucun fournisseur d'IA en direct actif (clé GEMINI_API_KEY requise).");
  }

  let res: { text: string; model: string };

  if (info.provider === 'gemini') {
    res = await callGeminiChat(info.apiKey, systemPrompt, messages, temperature);
  } else if (info.provider === 'claude') {
    res = await callClaudeChat(info.apiKey, systemPrompt, messages, temperature);
  } else if (info.provider === 'openai') {
    res = await callOpenAIChat(info.apiKey, systemPrompt, messages, temperature);
  } else {
    throw new Error("Fournisseur inconnu");
  }

  const rawData = extractEmbeddedJson(res.text);

  return {
    text: res.text,
    rawData,
    model: `${res.model}`,
    provider: info.provider
  };
}

/**
 * Strict JSON generation for automated extraction actions
 */
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

  const jsonSystemPrompt = `${systemPrompt}\nTu DOIS impérativement répondre sous forme d'un objet JSON valide encapsulé dans un bloc \`\`\`json { ... } \`\`\`. Ne rajoute aucun commentaire en dehors du JSON.`;

  const chatRes = await generateAIChat({
    systemPrompt: jsonSystemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.1
  });

  if (chatRes.rawData && typeof chatRes.rawData === 'object') {
    return {
      data: chatRes.rawData,
      model: chatRes.model,
      provider: chatRes.provider
    };
  }

  return null;
}
