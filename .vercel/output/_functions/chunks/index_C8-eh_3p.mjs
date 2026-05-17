import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DB_PATH = process.env.DATABASE_URL?.replace("sqlite://", "") || "./data/chat.db";
const dbDir = dirname(DB_PATH);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}
let db$1 = null;
try {
  db$1 = new DatabaseSync(DB_PATH);
  console.log("[DB] Connected to SQLite:", DB_PATH);
  initializeSchema();
} catch (error) {
  console.error("[DB] Failed to connect:", error);
  db$1 = null;
}
function initializeSchema() {
  if (!db$1) return;
  db$1.exec(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      model TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON chat_sessions(updated_at DESC);
  `);
  db$1.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      tool_calls TEXT,
      tool_results TEXT,
      is_complete INTEGER DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
  `);
  console.log("[DB] Schema initialized");
}
function query(sql, params) {
  if (!db$1) throw new Error("Database not available");
  return db$1.prepare(sql).all(...params || []);
}
function queryOne(sql, params) {
  if (!db$1) throw new Error("Database not available");
  return db$1.prepare(sql).get(...params || []);
}
function run(sql, params) {
  if (!db$1) throw new Error("Database not available");
  return db$1.prepare(sql).run(...params || []);
}
function createSession(session) {
  const now = Date.now();
  run(
    "INSERT INTO chat_sessions (id, title, created_at, updated_at, model) VALUES (?, ?, ?, ?, ?)",
    [session.id, session.title, now, now, session.model || null]
  );
  return session.id;
}
function updateSessionTimestamp(id) {
  run("UPDATE chat_sessions SET updated_at = ? WHERE id = ?", [Date.now(), id]);
}
function deleteSession(id) {
  run("DELETE FROM chat_sessions WHERE id = ?", [id]);
}
function getSessions(limit = 20, offset = 0) {
  return query(
    "SELECT * FROM chat_sessions ORDER BY updated_at DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );
}
function createMessage(message) {
  run(
    `INSERT INTO messages (id, session_id, role, content, created_at, tool_calls, tool_results, is_complete)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      message.id,
      message.sessionId,
      message.role,
      message.content,
      Date.now(),
      message.toolCalls ? JSON.stringify(message.toolCalls) : null,
      message.toolResults ? JSON.stringify(message.toolResults) : null,
      message.isComplete !== false ? 1 : 0
    ]
  );
  return message.id;
}
function getMessagesBySession(sessionId, limit = 50) {
  const rows = query(
    `SELECT id, session_id as sessionId, role, content, created_at as createdAt,
            tool_calls as toolCalls, tool_results as toolResults, is_complete as isComplete
     FROM messages
     WHERE session_id = ?
     ORDER BY created_at ASC
     LIMIT ?`,
    [sessionId, limit]
  );
  return rows.map((row) => ({
    ...row,
    toolCalls: row.toolCalls ? JSON.parse(row.toolCalls) : void 0,
    toolResults: row.toolResults ? JSON.parse(row.toolResults) : void 0,
    isComplete: row.isComplete === 1
  }));
}
function updateMessageContent(id, content) {
  run("UPDATE messages SET content = ?, is_complete = 1 WHERE id = ?", [content, id]);
}
function deleteMessage(id) {
  run("DELETE FROM messages WHERE id = ?", [id]);
}
function isDatabaseAvailable() {
  return db$1 !== null;
}

const chatSessions = {
  id: { name: "id" },
  title: { name: "title" },
  createdAt: { name: "createdAt" },
  updatedAt: { name: "updatedAt" },
  model: { name: "model" },
  _name: "chatSessions",
  $inferSelect: {},
  $inferInsert: {}
};
const messages = {
  id: { name: "id" },
  sessionId: { name: "sessionId" },
  role: { name: "role" },
  content: { name: "content" },
  createdAt: { name: "createdAt" },
  toolCalls: { name: "toolCalls" },
  toolResults: { name: "toolResults" },
  isComplete: { name: "isComplete" },
  _name: "messages",
  $inferSelect: {},
  $inferInsert: {}
};

const getTableName = (table) => {
  if (typeof table === "string") return table;
  return table?._name || "unknown";
};
const parseWhere = (where) => {
  if (!where) return {};
  if (where.left && where.right) {
    const key = where.left.name || "id";
    return { [key]: where.right };
  }
  return where;
};
const dbQueryInterface = {
  chatSessions: {
    findFirst: async ({ where }) => {
      const condition = parseWhere(where);
      const result = queryOne("SELECT * FROM chat_sessions WHERE id = ?", [condition.id]);
      if (!result) return null;
      return {
        ...result,
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at)
      };
    },
    findMany: async ({ orderBy, limit, offset }) => {
      const results = getSessions(limit || 50, offset || 0);
      return results.map((row) => ({
        ...row,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    }
  },
  messages: {
    findFirst: async ({ where }) => {
      const condition = parseWhere(where);
      const result = queryOne("SELECT * FROM messages WHERE id = ?", [condition.id]);
      if (!result) return null;
      return {
        ...result,
        createdAt: new Date(result.created_at),
        toolCalls: result.tool_calls ? JSON.parse(result.tool_calls) : void 0,
        toolResults: result.tool_results ? JSON.parse(result.tool_results) : void 0
      };
    },
    findMany: async ({ where, orderBy, limit }) => {
      const condition = parseWhere(where);
      if (condition?.sessionId) {
        return getMessagesBySession(condition.sessionId, limit || 50);
      }
      const results = query("SELECT * FROM messages LIMIT ?", [limit || 50]);
      return results;
    }
  }
};
const dbOperations = {
  insert: (table) => ({
    values: async (data) => {
      const tableName = getTableName(table);
      if (tableName === "chatSessions") {
        createSession({
          id: data.id,
          title: data.title,
          model: data.model
        });
      } else if (tableName === "messages") {
        createMessage({
          id: data.id,
          sessionId: data.sessionId,
          role: data.role,
          content: data.content,
          toolCalls: data.toolCalls,
          toolResults: data.toolResults,
          isComplete: data.isComplete
        });
      }
      return { id: data.id };
    }
  }),
  delete: (table) => ({
    where: async (where) => {
      const tableName = getTableName(table);
      const condition = parseWhere(where);
      if (tableName === "chatSessions" && condition?.id) {
        deleteSession(condition.id);
      } else if (tableName === "messages" && condition?.id) {
        deleteMessage(condition.id);
      } else if (tableName === "messages" && condition?.sessionId) {
        run("DELETE FROM messages WHERE session_id = ?", [condition.sessionId]);
      }
    }
  }),
  update: (table) => ({
    set: (data) => ({
      where: async (where) => {
        const tableName = getTableName(table);
        const condition = parseWhere(where);
        if (tableName === "chatSessions" && condition?.id) {
          if (data.updatedAt) {
            updateSessionTimestamp(condition.id);
          }
        } else if (tableName === "messages" && condition?.id) {
          if (data.content !== void 0) {
            updateMessageContent(condition.id, data.content);
          }
        }
      }
    })
  })
};
const db = isDatabaseAvailable() ? {
  query: dbQueryInterface,
  insert: dbOperations.insert,
  delete: dbOperations.delete,
  update: dbOperations.update,
  // Raw SQL access
  rawQuery: query,
  rawQueryOne: queryOne,
  rawRun: run
} : null;

export { chatSessions as c, db as d, isDatabaseAvailable as i, messages as m };
