import { i as isDatabaseAvailable, d as db, m as messages, c as chatSessions } from './index_C8-eh_3p.mjs';
import { desc, eq } from 'drizzle-orm';
import { g as generateId } from './utils_DlbTWra5.mjs';
import { a as appendChunkAndExtractSseEvents, e as extractDataPayloadFromSseEvent } from './sse-event-parser_BCm7lHtR.mjs';

const TavilySearchParameters = {
  query: {
    name: "query",
    type: "string",
    description: "The search query to execute",
    required: true
  },
  max_results: {
    name: "max_results",
    type: "number",
    description: "Maximum number of search results to return (1-10)",
    required: false
  },
  include_answer: {
    name: "include_answer",
    type: "boolean",
    description: "Include an AI-generated answer summarizing the search results",
    required: false
  },
  search_depth: {
    name: "search_depth",
    type: "string",
    description: "Search depth: 'basic' or 'advanced'",
    required: false,
    enum: ["basic", "advanced"]
  }
};
const TavilyToolDefinition = {
  name: "web_search",
  description: "Search the web for current information. Use this when you need up-to-date facts, news, or information not in your training data.",
  parameters: {
    type: "object",
    properties: TavilySearchParameters,
    required: ["query"]
  }
};
async function executeTavilySearch(args) {
  {
    throw new Error("TAVILY_API_KEY not configured");
  }
}
const tavilySearchTool = {
  definition: TavilyToolDefinition,
  execute: executeTavilySearch
};

const CodeExecutionParameters = {
  code: {
    name: "code",
    type: "string",
    description: "The code to execute",
    required: true
  },
  language: {
    name: "language",
    type: "string",
    description: "Programming language (python, javascript, typescript, etc.)",
    required: true,
    enum: [
      "python",
      "javascript",
      "typescript",
      "bash",
      "sh",
      "go",
      "rust",
      "java",
      "cpp",
      "c"
    ]
  },
  timeout: {
    name: "timeout",
    type: "number",
    description: "Execution timeout in seconds (max 60)",
    required: false
  }
};
const CodeExecutionToolDefinition = {
  name: "execute_code",
  description: "Execute code in a secure sandbox environment. Use this for calculations, data processing, or running scripts. Supports Python, JavaScript, TypeScript, Bash, and other languages.",
  parameters: {
    type: "object",
    properties: CodeExecutionParameters,
    required: ["code", "language"]
  }
};
async function executeCodeInSandbox(args) {
  {
    throw new Error("E2B_API_KEY not configured");
  }
}
const codeExecutionTool = {
  definition: CodeExecutionToolDefinition,
  execute: executeCodeInSandbox
};

const registry = /* @__PURE__ */ new Map();
function registerTool(tool) {
  registry.set(tool.definition.name, tool);
}
function getTool(name) {
  return registry.get(name);
}
function getAllTools() {
  return Array.from(registry.values());
}
function getToolDefinitions() {
  return getAllTools().map((tool) => ({
    type: "function",
    function: tool.definition
  }));
}
async function executeTool(toolCall) {
  const tool = getTool(toolCall.name);
  if (!tool) {
    return {
      toolCallId: toolCall.id,
      name: toolCall.name,
      result: null,
      error: `Tool "${toolCall.name}" not found`
    };
  }
  const startTime = Date.now();
  try {
    const result = await tool.execute(toolCall.arguments);
    const duration = Date.now() - startTime;
    return {
      toolCallId: toolCall.id,
      name: toolCall.name,
      result,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      toolCallId: toolCall.id,
      name: toolCall.name,
      result: null,
      error: errorMessage,
      duration
    };
  }
}
registerTool(tavilySearchTool);
registerTool(codeExecutionTool);

function sseEncode(data) {
  return `data: ${JSON.stringify(data)}

`;
}
const POST = async ({ request }) => {
  console.log("[API /chat] ========== REQUEST START ==========");
  try {
    console.log("[API /chat] Parsing request body...");
    const body = await request.json();
    const { message, sessionId } = body;
    console.log("[API /chat] Message:", typeof message === "string" ? message?.slice(0, 50) : `(type: ${typeof message})`);
    console.log("[API /chat] SessionId:", sessionId || "(new session)");
    if (!message || typeof message !== "string") {
      console.error("[API /chat] ERROR: Message is required");
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const dbAvailable = isDatabaseAvailable();
    console.log("[API /chat] Database available:", dbAvailable);
    let session = null;
    if (dbAvailable && db) {
      session = sessionId ? await db.query.chatSessions.findFirst({
        where: eq(chatSessions.id, sessionId)
      }) : null;
      if (!session) {
        const newSessionId = generateId();
        await db.insert(chatSessions).values({
          id: newSessionId,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        session = { id: newSessionId, title: message.slice(0, 50) };
      }
      const userMessageId = generateId();
      await db.insert(messages).values({
        id: userMessageId,
        sessionId: session.id,
        role: "user",
        content: message,
        createdAt: /* @__PURE__ */ new Date()
      });
      await db.update(chatSessions).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq(chatSessions.id, session.id));
    } else {
      session = { id: sessionId || generateId(), title: message.slice(0, 50) };
    }
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const assistantMessageId = generateId();
        let fullContent = "";
        const toolCalls = [];
        const toolResults = [];
        try {
          let conversationContext = [];
          if (dbAvailable && db && sessionId) {
            const history = await db.query.messages.findMany({
              where: eq(messages.sessionId, session.id),
              orderBy: desc(messages.createdAt),
              limit: 20
            });
            conversationContext = history.reverse().flatMap((m) => {
              const msg = {
                role: m.role,
                content: m.content
              };
              if (m.toolCalls && m.toolCalls.length > 0) {
                msg.tool_calls = m.toolCalls.map((tc) => ({
                  id: tc.id,
                  name: tc.name,
                  arguments: tc.arguments
                }));
              }
              const msgs = [msg];
              if (m.toolResults && m.toolResults.length > 0) {
                for (const tr of m.toolResults) {
                  msgs.push({
                    role: "tool",
                    tool_call_id: tr.toolCallId,
                    content: JSON.stringify(tr.error ? { error: tr.error } : tr.result)
                  });
                }
              }
              return msgs;
            });
          }
          const apiKey = "sk-896a870c30b97962-xqcsal-99bd8090";
          const model = "kr/claude-sonnet-4.5";
          const baseUrl = "http://localhost:20128/v1";
          console.log("[API /chat] 9Router config:");
          console.log("[API /chat]   - Base URL:", baseUrl);
          console.log("[API /chat]   - Model:", model);
          console.log("[API /chat]   - API Key present:", !!apiKey);
          if (!apiKey || !baseUrl) ;
          const tools = getToolDefinitions();
          console.log("[API /chat] Available tools:", tools.length);
          console.log("[API /chat] Calling 9Router API...");
          const requestBody = {
            model,
            messages: [
              ...conversationContext,
              { role: "user", content: message }
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 4096
          };
          const toolsEnabled = true;
          if (tools.length > 0 && toolsEnabled) {
            requestBody.tools = tools;
            console.log("[API /chat] Tools enabled:", tools.length);
          } else {
            console.log("[API /chat] Tools disabled or none available");
          }
          console.log("[API /chat] Request body summary: model=", model, "messages=", requestBody.messages.length, "tools=", !!requestBody.tools);
          const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
          });
          console.log("[API /chat] 9Router response status:", response.status);
          console.log("[API /chat] 9Router response ok:", response.ok);
          console.log("[API /chat] 9Router response headers:", Object.fromEntries(response.headers.entries()));
          if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error("[API /chat] 9Router error response:", errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }
          controller.enqueue(
            encoder.encode(sseEncode({ type: "session", sessionId: session.id }))
          );
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body");
          }
          console.log("[API /chat] Starting SSE stream...");
          let chunkCount = 0;
          const decoder = new TextDecoder();
          let buffer = "";
          const accumulatingToolCalls = /* @__PURE__ */ new Map();
          while (true) {
            const { done, value } = await reader.read();
            const decodedChunk = value ? decoder.decode(value, { stream: !done }) : decoder.decode();
            const parsedChunk = appendChunkAndExtractSseEvents(buffer, decodedChunk);
            const eventsToProcess = done && parsedChunk.remainder.trim().length > 0 ? [...parsedChunk.events, parsedChunk.remainder] : parsedChunk.events;
            buffer = done ? "" : parsedChunk.remainder;
            for (const eventBlock of eventsToProcess) {
              const data = extractDataPayloadFromSseEvent(eventBlock);
              if (!data) continue;
              if (data === "[DONE]") {
                console.log("[API /chat] Received [DONE] signal");
                for (const atc of accumulatingToolCalls.values()) {
                  try {
                    const args = atc.argumentsBuffer ? JSON.parse(atc.argumentsBuffer) : {};
                    toolCalls.push({
                      id: atc.id,
                      name: atc.name,
                      arguments: args
                    });
                  } catch {
                    toolCalls.push({
                      id: atc.id,
                      name: atc.name,
                      arguments: { _raw: atc.argumentsBuffer }
                    });
                  }
                }
                accumulatingToolCalls.clear();
                if (toolCalls.length > 0) {
                  controller.enqueue(
                    encoder.encode(sseEncode({ type: "tool_calls", toolCalls }))
                  );
                  for (const toolCall of toolCalls) {
                    const result = await executeTool(toolCall);
                    toolResults.push(result);
                    controller.enqueue(
                      encoder.encode(sseEncode({
                        type: "tool_result",
                        toolCallId: toolCall.id,
                        name: toolCall.name,
                        result: result.result,
                        error: result.error,
                        duration: result.duration
                      }))
                    );
                  }
                  const finalResponse = await fetch(`${baseUrl}/chat/completions`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                      model,
                      messages: [
                        ...conversationContext,
                        { role: "user", content: message },
                        {
                          role: "assistant",
                          content: fullContent,
                          tool_calls: toolCalls.map((tc) => ({
                            id: tc.id,
                            type: "function",
                            function: {
                              name: tc.name,
                              arguments: JSON.stringify(tc.arguments)
                            }
                          }))
                        },
                        ...toolResults.map((tr) => ({
                          role: "tool",
                          tool_call_id: tr.toolCallId,
                          name: tr.name,
                          content: JSON.stringify(tr.error ? { error: tr.error } : tr.result)
                        }))
                      ],
                      stream: true,
                      temperature: 0.7,
                      max_tokens: 4096
                    })
                  });
                  if (finalResponse.ok && finalResponse.body) {
                    const finalReader = finalResponse.body.getReader();
                    let finalBuffer = "";
                    while (true) {
                      const { done: finalDone, value: finalValue } = await finalReader.read();
                      const decodedFinalChunk = finalValue ? decoder.decode(finalValue, { stream: !finalDone }) : decoder.decode();
                      const parsedFinalChunk = appendChunkAndExtractSseEvents(finalBuffer, decodedFinalChunk);
                      const finalEventsToProcess = finalDone && parsedFinalChunk.remainder.trim().length > 0 ? [...parsedFinalChunk.events, parsedFinalChunk.remainder] : parsedFinalChunk.events;
                      finalBuffer = finalDone ? "" : parsedFinalChunk.remainder;
                      for (const finalEventBlock of finalEventsToProcess) {
                        const finalData = extractDataPayloadFromSseEvent(finalEventBlock);
                        if (!finalData) continue;
                        if (finalData === "[DONE]") continue;
                        try {
                          const finalParsed = JSON.parse(finalData);
                          const finalContentDelta = finalParsed.choices?.[0]?.delta?.content || "";
                          if (finalContentDelta) {
                            fullContent += finalContentDelta;
                            controller.enqueue(
                              encoder.encode(sseEncode({ type: "chunk", content: finalContentDelta }))
                            );
                          }
                        } catch {
                        }
                      }
                      if (finalDone) break;
                    }
                  }
                }
                if (dbAvailable && db) {
                  const toolCallData = toolCalls.length > 0 ? toolCalls.map((tc) => ({
                    id: tc.id,
                    name: tc.name,
                    arguments: tc.arguments
                  })) : void 0;
                  const toolResultData = toolResults.length > 0 ? toolResults.map((tr) => ({
                    toolCallId: tr.toolCallId,
                    name: tr.name,
                    result: tr.result,
                    error: tr.error,
                    duration: tr.duration
                  })) : void 0;
                  await db.insert(messages).values({
                    id: assistantMessageId,
                    sessionId: session.id,
                    role: "assistant",
                    content: fullContent,
                    toolCalls: toolCallData,
                    toolResults: toolResultData,
                    createdAt: /* @__PURE__ */ new Date()
                  });
                }
                controller.enqueue(
                  encoder.encode(sseEncode({
                    type: "done",
                    messageId: assistantMessageId,
                    hasToolCalls: toolCalls.length > 0
                  }))
                );
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const toolCallsDelta = parsed.choices?.[0]?.delta?.tool_calls;
                if (toolCallsDelta && Array.isArray(toolCallsDelta)) {
                  for (const tc of toolCallsDelta) {
                    const index = tc.index ?? 0;
                    if (!accumulatingToolCalls.has(index)) {
                      accumulatingToolCalls.set(index, {
                        id: tc.id || `call_${generateId()}`,
                        name: tc.function?.name || "",
                        argumentsBuffer: ""
                      });
                    }
                    const atc = accumulatingToolCalls.get(index);
                    if (tc.id) {
                      atc.id = tc.id;
                    }
                    if (tc.function?.name) {
                      atc.name = tc.function.name;
                    }
                    if (tc.function?.arguments) {
                      atc.argumentsBuffer += tc.function.arguments;
                    }
                  }
                }
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  fullContent += content;
                  chunkCount++;
                  if (chunkCount <= 5 || chunkCount % 50 === 0) {
                    console.log(`[API /chat] Sending chunk #${chunkCount}:`, content.slice(0, 50));
                  }
                  controller.enqueue(
                    encoder.encode(sseEncode({ type: "chunk", content }))
                  );
                }
              } catch (e) {
                console.log("[API /chat] JSON parse error:", e, "for data:", data.slice(0, 100));
              }
            }
            if (done) {
              console.log("[API /chat] Stream complete, chunks received:", chunkCount);
              break;
            }
          }
        } catch (error) {
          console.error("[API /chat] STREAMING ERROR:", error);
          controller.enqueue(
            encoder.encode(
              sseEncode({
                type: "error",
                error: error instanceof Error ? error.message : "Unknown error"
              })
            )
          );
          controller.close();
        }
      }
    });
    console.log("[API /chat] Returning SSE stream response");
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    console.error("[API /chat] FATAL ERROR:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = async ({ url }) => {
  try {
    const sessionId = url.searchParams.get("sessionId");
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const dbAvailable = isDatabaseAvailable();
    if (!dbAvailable || !db) {
      return new Response(
        JSON.stringify({ messages: [], note: "Database not available" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    const sessionMessages = await db.query.messages.findMany({
      where: eq(messages.sessionId, sessionId),
      orderBy: desc(messages.createdAt),
      limit: 50
    });
    return new Response(JSON.stringify({ messages: sessionMessages.reverse() }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch messages" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
