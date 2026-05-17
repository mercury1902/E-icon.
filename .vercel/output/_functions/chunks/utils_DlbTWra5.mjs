import 'clsx';

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
function parseAIJSON(content) {
  const trimmed = content.trim();
  if (!trimmed) return null;
  const withoutCodeFence = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(withoutCodeFence);
  } catch {
    const firstBrace = withoutCodeFence.indexOf("{");
    const lastBrace = withoutCodeFence.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const objectSlice = withoutCodeFence.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(objectSlice);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export { generateId as g, parseAIJSON as p };
