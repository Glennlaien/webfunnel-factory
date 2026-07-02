const defaultProvider = process.env.LLM_PROVIDER || "deepseek";

export function getLlmConfig() {
  if (defaultProvider !== "deepseek") {
    throw new Error(`Unsupported LLM_PROVIDER '${defaultProvider}'. Currently supported: deepseek.`);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY. Set it in your shell or .env.local before running LLM-backed workflow steps.");
  }

  return {
    provider: "deepseek",
    apiKey,
    baseUrl: trimTrailingSlash(process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"),
    model: process.env.DEEPSEEK_MODEL || process.env.LLM_MODEL || "deepseek-chat",
    timeoutMs: Number(process.env.LLM_TIMEOUT_MS || 120000),
  };
}

export async function chatJson({ system, user, temperature = 0.4, maxTokens = 6000 }) {
  const config = getLlmConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    const text = await response.text();
    const payload = parseJson(text);
    if (!response.ok) {
      const message = payload?.error?.message || payload?.message || text.slice(0, 500);
      throw new Error(`LLM API returned ${response.status}: ${message}`);
    }

    const content = payload?.choices?.[0]?.message?.content;
    if (!content) throw new Error("LLM response did not include choices[0].message.content");

    return {
      provider: config.provider,
      model: config.model,
      content,
      json: parseJson(extractJsonObject(content)),
      usage: payload?.usage || null,
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`LLM API timed out after ${config.timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function extractJsonObject(value) {
  const text = String(value || "").trim();
  if (text.startsWith("{") && text.endsWith("}")) return text;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) return text.slice(first, last + 1);
  throw new Error("Could not extract a JSON object from LLM response.");
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}
