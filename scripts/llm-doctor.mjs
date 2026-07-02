import { loadLocalEnv } from "./lib/load-env.mjs";
import { chatJson, getLlmConfig } from "./lib/llm-client.mjs";

loadLocalEnv();

const config = getLlmConfig();
console.log(`LLM provider: ${config.provider}`);
console.log(`LLM base URL: ${config.baseUrl}`);
console.log(`LLM model: ${config.model}`);

const result = await chatJson({
  system: "You are a JSON healthcheck endpoint. Return only JSON.",
  user: 'Return {"ok":true,"provider":"deepseek"}',
  temperature: 0,
  maxTokens: 100,
});

console.log(JSON.stringify({ ok: Boolean(result.json?.ok), model: result.model, usage: result.usage }, null, 2));
