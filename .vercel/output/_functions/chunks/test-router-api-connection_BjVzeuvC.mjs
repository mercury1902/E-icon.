const POST = async () => {
  console.log("[API Test] Starting 9Router API test...");
  const apiKey = "sk-896a870c30b97962-xqcsal-99bd8090";
  const model = "kr/claude-sonnet-4.5";
  const baseUrl = "http://localhost:20128/v1";
  console.log("[API Test] Config:", { baseUrl, model, hasKey: true });
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say 'API test successful' and nothing else." }
        ],
        temperature: 0.1,
        max_tokens: 50,
        stream: false
        // Non-streaming for testing
      })
    });
    console.log("[API Test] Response status:", response.status);
    console.log("[API Test] Response headers:", Object.fromEntries(response.headers.entries()));
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API Test] Error response:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `HTTP ${response.status}`,
          details: errorText,
          config: {
            baseUrl,
            model,
            hasKey: !!apiKey
          }
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await response.json();
    console.log("[API Test] Success response:", data);
    return new Response(
      JSON.stringify({
        success: true,
        message: data.choices?.[0]?.message?.content || "No content",
        fullResponse: data,
        config: {
          baseUrl,
          model,
          hasKey: !!apiKey
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[API Test] Exception:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : void 0
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = async () => {
  return new Response(
    JSON.stringify({ message: "Use POST to test API" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
