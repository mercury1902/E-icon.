import { i as isDatabaseAvailable, d as db, m as messages, c as chatSessions } from './index_C8-eh_3p.mjs';
import { eq, desc } from 'drizzle-orm';
import { g as generateId } from './utils_DlbTWra5.mjs';

const GET = async () => {
  try {
    const dbAvailable = isDatabaseAvailable();
    if (!dbAvailable || !db) {
      return new Response(
        JSON.stringify({ sessions: [], note: "Database not available" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    const sessions = await db.query.chatSessions.findMany({
      orderBy: desc(chatSessions.updatedAt),
      limit: 50
    });
    return new Response(JSON.stringify({ sessions }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sessions" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const title = body.title || "New Chat";
    const sessionId = generateId();
    const now = /* @__PURE__ */ new Date();
    const dbAvailable = isDatabaseAvailable();
    if (dbAvailable && db) {
      await db.insert(chatSessions).values({
        id: sessionId,
        title,
        createdAt: now,
        updatedAt: now
      });
    }
    return new Response(
      JSON.stringify({
        session: {
          id: sessionId,
          title,
          createdAt: now,
          updatedAt: now
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const DELETE = async ({ url }) => {
  try {
    const sessionId = url.searchParams.get("id");
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const dbAvailable = isDatabaseAvailable();
    if (dbAvailable && db) {
      await db.delete(messages).where(eq(messages.sessionId, sessionId));
      await db.delete(chatSessions).where(eq(chatSessions.id, sessionId));
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
