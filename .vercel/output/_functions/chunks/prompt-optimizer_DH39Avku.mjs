import { c as createComponent } from './astro-component_3xMZ7s8g.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, n as Fragment$1 } from './entrypoint_N2AoPI2Q.mjs';
import { u as useBilingualLanguageToggleState, V as VerticalNavSidebar, $ as $$Layout } from './vertical-navigation-sidebar_MqcvzbCi.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo, createContext, useEffect, useCallback, useContext, useRef } from 'react';
import { GitCompare, Sparkles, Check, Copy, MessageSquareText, X, Plus, Clock3, MessageCircleMore, Settings2, Send, PanelLeft, PanelLeftClose, PanelLeftOpen, Info, History } from 'lucide-react';
import { toast } from 'sonner';
import { Prism } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism/index.js';

function parsePromptResult(content) {
  const jsonParsedResult = parseJsonPromptResult(content);
  if (jsonParsedResult) {
    return jsonParsedResult;
  }
  const result = {
    optimizedPrompt: "",
    suggestedCommand: "",
    explanation: "",
    rawContent: content
  };
  if (!content) return result;
  const optimizedMarker = content.indexOf("✅");
  const commandMarker = content.indexOf("💡");
  const explanationMarker = content.indexOf("🎯");
  if (optimizedMarker !== -1 && commandMarker !== -1) {
    const start = optimizedMarker;
    const end = commandMarker;
    let section = content.slice(start, end).trim();
    section = section.replace(/^✅\s*\*?\*?Prompt đã tối ưu:?\*?\*?\s*:?\s*/i, "");
    section = section.replace(/^✅\s*\*?\*?.*\*?\*?\s*/, "");
    result.optimizedPrompt = section.trim();
  } else if (optimizedMarker !== -1) {
    let section = content.slice(optimizedMarker).trim();
    section = section.replace(/^✅\s*\*?\*?.*\*?\*?\s*/, "");
    result.optimizedPrompt = section.trim();
  }
  if (commandMarker !== -1 && explanationMarker !== -1) {
    const start = commandMarker;
    const end = explanationMarker;
    let section = content.slice(start, end).trim();
    section = section.replace(/^💡\s*\*?\*?Command đề xuất:?\*?\*?\s*:?\s*/i, "");
    section = section.replace(/^💡\s*\*?\*?.*\*?\*?\s*/, "");
    result.suggestedCommand = section.trim();
  } else if (commandMarker !== -1 && explanationMarker === -1) {
    let section = content.slice(commandMarker).trim();
    section = section.replace(/^💡\s*\*?\*?.*\*?\*?\s*/, "");
    result.suggestedCommand = section.trim();
  }
  if (explanationMarker !== -1) {
    let section = content.slice(explanationMarker).trim();
    section = section.replace(/^🎯\s*\*?\*?Lý do chọn command:?\*?\*?\s*:?\s*/i, "");
    section = section.replace(/^🎯\s*\*?\*?.*\*?\*?\s*/, "");
    result.explanation = section.trim();
  }
  return result;
}
function parseJsonPromptResult(content) {
  const raw = extractJsonObject(content);
  if (!raw) return null;
  const optimizedPromptEn = String(raw.optimizedPromptEn ?? "").trim();
  const optimizedPromptVi = String(raw.optimizedPromptVi ?? "").trim();
  const fallbackPrompt = String(raw.optimizedPrompt ?? "").trim();
  const suggestedCommand = String(raw.suggestedCommand ?? raw.command ?? "").trim();
  const explanation = String(raw.explanation ?? raw.reason ?? "").trim();
  const detectedInputLanguage = String(raw.detectedInputLanguage ?? "mixed").trim().toLowerCase();
  if (!suggestedCommand || !optimizedPromptEn && !optimizedPromptVi && !fallbackPrompt) {
    return null;
  }
  const normalizedEn = optimizedPromptEn || fallbackPrompt || optimizedPromptVi;
  const normalizedVi = optimizedPromptVi || fallbackPrompt || optimizedPromptEn;
  return {
    optimizedPrompt: normalizedEn,
    optimizedPromptEn: normalizedEn,
    optimizedPromptVi: normalizedVi,
    suggestedCommand,
    explanation,
    rawContent: content,
    detectedInputLanguage: detectedInputLanguage === "vi" || detectedInputLanguage === "en" || detectedInputLanguage === "mixed" ? detectedInputLanguage : "mixed"
  };
}
function extractJsonObject(content) {
  const trimmed = content.trim();
  if (!trimmed) return null;
  const withoutFence = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(withoutFence);
  } catch {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }
    try {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
}
function extractCommand(text) {
  const match = text.match(/(\/ck:[a-zA-Z0-9-]+(?::[a-zA-Z0-9-]+)*(?:\s+--?[\w-]+)*)/);
  return match ? match[1] : text;
}
function formatOptimizedPrompt(prompt) {
  return prompt.replace(/\r\n/g, "\n").trim();
}

function computePromptDiff(originalPrompt, optimizedPrompt) {
  const originalLines = originalPrompt.split("\n").map((line) => line.trim()).filter(Boolean);
  const optimizedLines = optimizedPrompt.split("\n").map((line) => line.trim()).filter(Boolean);
  const originalSet = new Set(originalLines);
  const optimizedSet = new Set(optimizedLines);
  return {
    added: optimizedLines.filter((line) => !originalSet.has(line)),
    removed: originalLines.filter((line) => !optimizedSet.has(line))
  };
}
function HighlightedBlock({ content }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3", children: /* @__PURE__ */ jsx(
    Prism,
    {
      language: "markdown",
      style: oneLight,
      customStyle: {
        margin: 0,
        borderRadius: "0.5rem",
        fontSize: "0.82rem",
        lineHeight: "1.6",
        background: "transparent",
        padding: 0
      },
      codeTagProps: { style: { fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" } },
      children: content
    }
  ) });
}
function buildCopyBothMarkdown(englishPrompt, vietnamesePrompt) {
  return `## English Prompt
${englishPrompt}

## Vietnamese Prompt
${vietnamesePrompt}`;
}
function languageLabel(code) {
  return code === "en" ? "English" : "Tiếng Việt";
}
const OptimizedResultView = ({
  result,
  originalInput,
  compareMode = false,
  outputLanguageMode,
  displayMode,
  previewMode
}) => {
  const { t } = useBilingualLanguageToggleState();
  const [copiedType, setCopiedType] = useState(null);
  const [tabLanguage, setTabLanguage] = useState("en");
  const optimizedPromptEn = useMemo(
    () => formatOptimizedPrompt(result.optimizedPromptEn || result.optimizedPrompt || ""),
    [result.optimizedPrompt, result.optimizedPromptEn]
  );
  const optimizedPromptVi = useMemo(
    () => formatOptimizedPrompt(result.optimizedPromptVi || result.optimizedPrompt || ""),
    [result.optimizedPrompt, result.optimizedPromptVi]
  );
  const hasBilingualResult = optimizedPromptEn.length > 0 && optimizedPromptVi.length > 0;
  const command = useMemo(() => extractCommand(result.suggestedCommand), [result.suggestedCommand]);
  const primaryPrompt = useMemo(() => {
    if (outputLanguageMode === "vi") {
      return optimizedPromptVi || optimizedPromptEn;
    }
    return optimizedPromptEn || optimizedPromptVi;
  }, [optimizedPromptEn, optimizedPromptVi, outputLanguageMode]);
  const comparePrompt = useMemo(() => {
    if (previewMode === "english") {
      return optimizedPromptEn || optimizedPromptVi;
    }
    return primaryPrompt;
  }, [optimizedPromptEn, optimizedPromptVi, previewMode, primaryPrompt]);
  const diff = useMemo(() => computePromptDiff(originalInput, comparePrompt), [originalInput, comparePrompt]);
  const copyText = async (type) => {
    const copyPayload = type === "en" ? optimizedPromptEn : type === "vi" ? optimizedPromptVi : buildCopyBothMarkdown(optimizedPromptEn, optimizedPromptVi);
    if (!copyPayload.trim()) {
      toast.error("Không có nội dung để sao chép");
      return;
    }
    try {
      await navigator.clipboard.writeText(copyPayload);
      setCopiedType(type);
      toast.success(t("optimizer.copy.done", "Đã sao chép!"));
      window.setTimeout(() => setCopiedType(null), 1800);
    } catch {
      toast.error("Không thể sao chép vào clipboard");
    }
  };
  const shouldRenderBilingual = hasBilingualResult && previewMode === "bilingual";
  const singlePromptLanguage = outputLanguageMode === "vi" ? "vi" : "en";
  const singlePrompt = singlePromptLanguage === "vi" ? optimizedPromptVi || optimizedPromptEn : optimizedPromptEn || optimizedPromptVi;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--app-shadow-soft)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]", children: [
        compareMode ? /* @__PURE__ */ jsx(GitCompare, { className: "h-4.5 w-4.5 text-[var(--accent)]" }) : /* @__PURE__ */ jsx(Sparkles, { className: "h-4.5 w-4.5 text-[var(--accent)]" }),
        /* @__PURE__ */ jsx("span", { children: compareMode ? "Compare Mode" : "Prompt đã tối ưu" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => void copyText("en"),
            className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--app-surface))]",
            children: [
              copiedType === "en" ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: copiedType === "en" ? "Copied EN" : "Copy EN" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => void copyText("vi"),
            className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--app-surface))]",
            children: [
              copiedType === "vi" ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: copiedType === "vi" ? "Copied VI" : "Copy VI" })
            ]
          }
        ),
        hasBilingualResult && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => void copyText("both"),
            className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_13%,var(--app-surface))] px-3 py-2 text-xs font-semibold text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--accent)_22%,var(--app-surface))]",
            children: [
              copiedType === "both" ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: copiedType === "both" ? "Copied Both" : "Copy Both" })
            ]
          }
        )
      ] })
    ] }),
    compareMode ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "Original" }),
          /* @__PURE__ */ jsx(HighlightedBlock, { content: originalInput || "(Trống)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: [
            "Optimized (",
            languageLabel(previewMode === "english" ? "en" : singlePromptLanguage),
            ")"
          ] }),
          /* @__PURE__ */ jsx(HighlightedBlock, { content: comparePrompt || "(Trống)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-rose-300/45 bg-rose-50/80 p-3 dark:border-rose-900/55 dark:bg-rose-950/35", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-200", children: "Removed" }),
          diff.removed.length === 0 ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-rose-700/80 dark:text-rose-200/85", children: "Không có dòng bị bỏ." }) : /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-1 text-sm text-rose-700 dark:text-rose-200", children: diff.removed.map((line) => /* @__PURE__ */ jsxs("li", { className: "rounded-md bg-rose-100 px-2 py-1 dark:bg-rose-900/55", children: [
            "- ",
            line
          ] }, `removed-${line}`)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-emerald-300/45 bg-emerald-50/80 p-3 dark:border-emerald-900/55 dark:bg-emerald-950/35", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200", children: "Added" }),
          diff.added.length === 0 ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-emerald-700/80 dark:text-emerald-200/85", children: "Không có dòng mới." }) : /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-1 text-sm text-emerald-700 dark:text-emerald-200", children: diff.added.map((line) => /* @__PURE__ */ jsxs("li", { className: "rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900/55", children: [
            "+ ",
            line
          ] }, `added-${line}`)) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      shouldRenderBilingual ? /* @__PURE__ */ jsxs(Fragment, { children: [
        displayMode === "side-by-side" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "English" }),
            /* @__PURE__ */ jsx(HighlightedBlock, { content: optimizedPromptEn || "(Trống)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "Tiếng Việt" }),
            /* @__PURE__ */ jsx(HighlightedBlock, { content: optimizedPromptVi || "(Trống)" })
          ] })
        ] }),
        displayMode === "tab-toggle" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setTabLanguage("en"),
                className: `min-h-10 rounded-lg px-3 py-2 text-xs font-semibold ${tabLanguage === "en" ? "bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] text-[var(--app-text)]" : "text-[var(--app-text-muted)]"}`,
                children: "English"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setTabLanguage("vi"),
                className: `min-h-10 rounded-lg px-3 py-2 text-xs font-semibold ${tabLanguage === "vi" ? "bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] text-[var(--app-text)]" : "text-[var(--app-text-muted)]"}`,
                children: "Tiếng Việt"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(HighlightedBlock, { content: tabLanguage === "en" ? optimizedPromptEn : optimizedPromptVi })
        ] }),
        displayMode === "inline-translation" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "English" }),
            /* @__PURE__ */ jsx(HighlightedBlock, { content: optimizedPromptEn || "(Trống)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "Tiếng Việt" }),
            /* @__PURE__ */ jsx(HighlightedBlock, { content: optimizedPromptVi || "(Trống)" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: singlePromptLanguage === "vi" ? "Tiếng Việt" : "English" }),
        /* @__PURE__ */ jsx(HighlightedBlock, { content: singlePrompt || "(Không có nội dung)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "Command đề xuất" }),
        /* @__PURE__ */ jsx("code", { className: "mt-1 block text-sm font-semibold text-[var(--accent)]", children: command })
      ] }),
      result.explanation && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "Lý do" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-6 text-[var(--app-text)]", children: result.explanation })
      ] })
    ] })
  ] });
};

const STORAGE_KEY = "claudekit:prompt-optimizer:sessions:v2";
const DEFAULT_SESSION_TITLE = "Phiên mới";
const PromptOptimizerConversationContext = createContext(null);
function createSession() {
  const now = Date.now();
  return {
    id: `optimizer-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    title: DEFAULT_SESSION_TITLE,
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}
function deriveSessionTitleFromMessage(message) {
  const normalized = message.replace(/\s+/g, " ").trim();
  if (!normalized) return DEFAULT_SESSION_TITLE;
  return normalized.length > 48 ? `${normalized.slice(0, 45)}...` : normalized;
}
function isModelEligibleMessage(message) {
  return (message.role === "user" || message.role === "assistant") && Boolean(message.content.trim());
}
const PromptOptimizerConversationProvider = ({
  children
}) => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.sessions) && parsed.sessions.length > 0) {
          setSessions(parsed.sessions);
          setActiveSessionId(parsed.activeSessionId && parsed.sessions.some((s) => s.id === parsed.activeSessionId) ? parsed.activeSessionId : parsed.sessions[0].id);
          return;
        }
      }
    } catch {
    }
    const session = createSession();
    setSessions([session]);
    setActiveSessionId(session.id);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || sessions.length === 0 || !activeSessionId) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, activeSessionId }));
    } catch {
    }
  }, [sessions, activeSessionId]);
  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );
  const selectSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);
  const startNewSession = useCallback(() => {
    const nextSession = createSession();
    setSessions((previousSessions) => [nextSession, ...previousSessions]);
    setActiveSessionId(nextSession.id);
  }, []);
  const addUserTurnWithOptimisticAssistant = useCallback(
    (userInput) => {
      if (!activeSession) return null;
      const now = Date.now();
      const userMessageId = `user-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const assistantMessageId = `assistant-${(now + 1).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const modelMessages = activeSession.messages.filter((message) => !message.isStreaming && !message.isError).filter(isModelEligibleMessage).map((message) => ({ role: message.role, content: message.content })).concat({ role: "user", content: userInput });
      setSessions(
        (previousSessions) => previousSessions.map((session) => {
          if (session.id !== activeSession.id) return session;
          const userMessage = {
            id: userMessageId,
            role: "user",
            content: userInput,
            createdAt: now
          };
          const assistantMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            createdAt: now,
            originalInput: userInput,
            isStreaming: true
          };
          return {
            ...session,
            title: session.title === DEFAULT_SESSION_TITLE ? deriveSessionTitleFromMessage(userInput) : session.title,
            updatedAt: now,
            messages: [...session.messages, userMessage, assistantMessage]
          };
        })
      );
      return {
        sessionId: activeSession.id,
        assistantMessageId,
        modelMessages
      };
    },
    [activeSession]
  );
  const updateAssistantMessage = useCallback(
    (sessionId, assistantMessageId, nextMessage) => {
      const now = Date.now();
      setSessions(
        (previousSessions) => previousSessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            updatedAt: now,
            messages: session.messages.map(
              (message) => message.id === assistantMessageId ? { ...message, ...nextMessage } : message
            )
          };
        })
      );
    },
    []
  );
  const contextValue = useMemo(
    () => ({
      sessions,
      activeSessionId,
      activeSession,
      compareMode,
      setCompareMode,
      startNewSession,
      selectSession,
      addUserTurnWithOptimisticAssistant,
      updateAssistantMessage
    }),
    [
      sessions,
      activeSessionId,
      activeSession,
      compareMode,
      startNewSession,
      selectSession,
      addUserTurnWithOptimisticAssistant,
      updateAssistantMessage
    ]
  );
  return /* @__PURE__ */ jsx(PromptOptimizerConversationContext.Provider, { value: contextValue, children });
};
function usePromptOptimizerConversation() {
  const context = useContext(PromptOptimizerConversationContext);
  if (!context) {
    throw new Error("usePromptOptimizerConversation must be used inside PromptOptimizerConversationProvider");
  }
  return context;
}

function formatSessionTime(timestamp) {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - date.getTime();
  if (diffMs < 6e4) return "Vừa xong";
  if (diffMs < 36e5) return `${Math.max(1, Math.floor(diffMs / 6e4))} phút`;
  if (diffMs < 864e5) return `${Math.max(1, Math.floor(diffMs / 36e5))} giờ`;
  return date.toLocaleDateString("vi-VN");
}
function SessionList({
  sessions,
  activeSessionId,
  onSelectSession
}) {
  return /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-2 overflow-y-auto px-3 pb-3", children: sessions.map((session) => {
    const lastMessage = [...session.messages].reverse().find((message) => message.role === "assistant");
    const preview = lastMessage?.content?.replace(/\s+/g, " ").trim() || "Chưa có kết quả tối ưu";
    const isActive = session.id === activeSessionId;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => onSelectSession(session.id),
        className: `w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${isActive ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_13%,var(--app-surface))]" : "border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-muted)]"}`,
        children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[var(--app-text)]", children: session.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs leading-5 text-[var(--app-text-muted)]", children: preview }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-[11px] text-[var(--app-text-muted)]", children: [
            /* @__PURE__ */ jsx(Clock3, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: formatSessionTime(session.updatedAt) }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxs("span", { children: [
              session.messages.length,
              " mục"
            ] })
          ] })
        ]
      },
      session.id
    );
  }) });
}
const PromptOptimizerHistoryPanel = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  isMobile = false,
  onCloseMobile
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col overflow-hidden border-r border-[var(--app-border)] bg-[var(--app-surface)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-[var(--app-border)] px-3 py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]", children: [
        /* @__PURE__ */ jsx(MessageSquareText, { className: "h-4.5 w-4.5 text-[var(--accent)]" }),
        /* @__PURE__ */ jsx("span", { children: "Lịch sử" })
      ] }),
      isMobile && onCloseMobile && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCloseMobile,
          className: "flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]",
          "aria-label": "Đóng lịch sử",
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-3 py-3", children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onNewSession,
        className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_14%,var(--app-surface))] px-3 py-2 text-sm font-medium text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--accent)_20%,var(--app-surface))]",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "New Session" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      SessionList,
      {
        sessions,
        activeSessionId,
        onSelectSession
      }
    )
  ] });
};

const MAX_MESSAGE_CHARS = 4e3;
const MAX_TOTAL_CHARS = 24e3;
const INPUT_LANGUAGE_OPTIONS = [
  { value: "auto", label: "Auto-detect" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" }
];
const OUTPUT_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "both", label: "Both" }
];
const DISPLAY_MODE_OPTIONS = [
  { value: "side-by-side", label: "Side-by-side" },
  { value: "tab-toggle", label: "Tab toggle" },
  { value: "inline-translation", label: "Inline translation" }
];
const PREVIEW_MODE_OPTIONS = [
  { value: "english", label: "View as English prompt" },
  { value: "bilingual", label: "View as Bilingual" }
];
function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQueryList = window.matchMedia("(max-width: 767px)");
    setIsMobileViewport(mediaQueryList.matches);
    const onChange = (event) => {
      setIsMobileViewport(event.matches);
    };
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, []);
  return isMobileViewport;
}
function PromptOptimizerTypingDots() {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-4 py-3 text-[var(--app-text-muted)]", children: [
    /* @__PURE__ */ jsx("span", { className: "typing-dot h-2 w-2 rounded-full bg-[var(--accent)] [animation-delay:0ms]" }),
    /* @__PURE__ */ jsx("span", { className: "typing-dot h-2 w-2 rounded-full bg-[var(--accent)] [animation-delay:120ms]" }),
    /* @__PURE__ */ jsx("span", { className: "typing-dot h-2 w-2 rounded-full bg-[var(--accent)] [animation-delay:240ms]" })
  ] });
}
function ThreadHeader({
  activeThreadTitle,
  threadId,
  compareMode,
  onToggleCompare,
  onNewSession,
  onToggleInfo,
  onToggleHistoryPanel,
  isHistoryPanelOpen,
  onToggleNavigation,
  onToggleDesktopNavigationMode,
  isDesktopNavigationDocked,
  isNavigationCollapsed
}) {
  const navigationToggleLabel = isDesktopNavigationDocked ? isNavigationCollapsed ? "Mở rộng sidebar điều hướng" : "Thu gọn sidebar điều hướng" : "Mở điều hướng";
  const layoutModeToggleLabel = isDesktopNavigationDocked ? "Chuyển sang overlay navigation" : "Ghim sidebar trên desktop";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-[var(--app-border)] px-4 py-3 sm:px-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-[var(--app-text-muted)]", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-base font-semibold text-[var(--app-text)]", children: "Prompt Optimizer" }),
      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-[var(--app-text)]", children: [
        "Ngữ cảnh: ",
        activeThreadTitle
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "ml-2", children: [
        "#",
        threadId
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      onToggleNavigation && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleNavigation,
          className: "flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]",
          "aria-label": navigationToggleLabel,
          title: navigationToggleLabel,
          children: /* @__PURE__ */ jsx(PanelLeft, { className: "h-4.5 w-4.5" })
        }
      ),
      onToggleDesktopNavigationMode && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onToggleDesktopNavigationMode,
          className: "hidden h-11 items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-xs font-semibold text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)] xl:flex",
          "aria-label": layoutModeToggleLabel,
          title: layoutModeToggleLabel,
          children: [
            isDesktopNavigationDocked ? /* @__PURE__ */ jsx(PanelLeftClose, { className: "h-4.5 w-4.5" }) : /* @__PURE__ */ jsx(PanelLeftOpen, { className: "h-4.5 w-4.5" }),
            /* @__PURE__ */ jsx("span", { children: isDesktopNavigationDocked ? "Overlay Nav" : "Pinned Nav" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleCompare,
          className: `min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${compareMode ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] text-[var(--app-text)]" : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]"}`,
          children: "Compare Mode"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleInfo,
          className: "flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]",
          "aria-label": "Giới thiệu",
          children: /* @__PURE__ */ jsx(Info, { className: "h-4.5 w-4.5" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleHistoryPanel,
          className: `flex h-11 w-11 items-center justify-center rounded-xl border text-[var(--app-text-muted)] transition-colors ${isHistoryPanelOpen ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_14%,var(--app-surface))] text-[var(--app-text)]" : "border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-muted)]"}`,
          "aria-label": "Mở lịch sử",
          children: /* @__PURE__ */ jsx(History, { className: "h-4.5 w-4.5" })
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          "data-testid": "prompt-optimizer-reset",
          onClick: onNewSession,
          className: "flex min-h-11 items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-xs font-semibold text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "New Session" })
          ]
        }
      )
    ] })
  ] });
}
function PreferenceButtonGroup({
  title,
  options,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: title }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: options.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(option.value),
        className: `min-h-10 rounded-lg border px-3 py-2 text-xs font-semibold ${value === option.value ? "border-[color-mix(in_srgb,var(--accent)_40%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_18%,var(--app-surface))] text-[var(--app-text)]" : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]"}`,
        children: option.label
      },
      option.value
    )) })
  ] });
}
function buildHumanReadableResultContent(result) {
  return [
    "✅ **Optimized Prompt (EN):**",
    result.optimizedPromptEn,
    "",
    "✅ **Prompt tối ưu (VI):**",
    result.optimizedPromptVi,
    "",
    "💡 **Command đề xuất:**",
    result.suggestedCommand,
    "",
    "🎯 **Lý do:**",
    result.explanation
  ].join("\n");
}
function PromptOptimizerContent({
  onToggleNavigation,
  onToggleDesktopNavigationMode,
  isDesktopNavigationDocked = false,
  isNavigationCollapsed = false
}) {
  const {
    sessions,
    activeSessionId,
    activeSession,
    compareMode,
    setCompareMode,
    startNewSession,
    selectSession,
    addUserTurnWithOptimisticAssistant,
    updateAssistantMessage
  } = usePromptOptimizerConversation();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showOutputPreferences, setShowOutputPreferences] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [retryAfterSec, setRetryAfterSec] = useState(0);
  const [inputLanguagePreference, setInputLanguagePreference] = useState("auto");
  const [outputLanguageMode, setOutputLanguageMode] = useState("both");
  const [displayMode, setDisplayMode] = useState("side-by-side");
  const [previewMode, setPreviewMode] = useState("bilingual");
  const isMobileViewport = useIsMobileViewport();
  const historyPanelContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messages = activeSession?.messages ?? [];
  const activeThreadTitle = activeSession?.title ?? "Phiên mới";
  const threadId = activeSession?.id.slice(-6) ?? "------";
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);
  useEffect(() => {
    scrollToBottom("auto");
  }, [messages.length, scrollToBottom]);
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setShowInfo(false);
      setShowHistoryPanel(false);
      setShowOutputPreferences(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => {
    if (retryAfterSec <= 0) return;
    const interval = window.setInterval(() => {
      setRetryAfterSec((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1e3);
    return () => window.clearInterval(interval);
  }, [retryAfterSec]);
  useEffect(() => {
    const touchState = {
      startX: 0,
      startY: 0,
      openedFromEdge: false,
      startedInMobileSheet: false
    };
    const onTouchStart = (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      touchState.startX = touch.clientX;
      touchState.startY = touch.clientY;
      touchState.openedFromEdge = !showHistoryPanel && touch.clientX >= window.innerWidth - 24;
      touchState.startedInMobileSheet = Boolean(
        showHistoryPanel && isMobileViewport && historyPanelContainerRef.current && historyPanelContainerRef.current.contains(event.target)
      );
    };
    const onTouchEnd = (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchState.startX;
      const deltaY = touch.clientY - touchState.startY;
      if (touchState.openedFromEdge && deltaX <= -72 && Math.abs(deltaY) <= 80) {
        setShowHistoryPanel(true);
      }
      if (touchState.startedInMobileSheet && deltaY >= 72 && Math.abs(deltaX) <= 80) {
        setShowHistoryPanel(false);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobileViewport, showHistoryPanel]);
  const submitPrompt = useCallback(async () => {
    const normalizedInput = input.trim();
    if (!normalizedInput || isLoading || retryAfterSec > 0) return;
    const optimisticTurn = addUserTurnWithOptimisticAssistant(normalizedInput);
    setInput("");
    setShowHistoryPanel(false);
    if (!optimisticTurn) return;
    setIsLoading(true);
    const modelMessages = optimisticTurn.modelMessages.slice(-20);
    const tooLargeMessage = modelMessages.find((m) => m.content.length > MAX_MESSAGE_CHARS);
    if (tooLargeMessage) {
      throw new Error(`Mỗi tin nhắn tối đa ${MAX_MESSAGE_CHARS} ký tự. Vui lòng chia nhỏ prompt.`);
    }
    const totalChars = modelMessages.reduce((sum, m) => sum + m.content.length, 0);
    if (totalChars > MAX_TOTAL_CHARS) {
      throw new Error(`Tổng nội dung tối đa ${MAX_TOTAL_CHARS} ký tự. Vui lòng giảm độ dài hoặc bắt đầu phiên mới.`);
    }
    const requestPayload = JSON.stringify({
      modelMessages,
      inputLanguagePreference,
      outputLanguageMode
    });
    try {
      const response = await fetch("/api/prompt-optimizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: requestPayload
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 429) {
          const retryFromHeader = Number(response.headers.get("Retry-After") ?? "");
          const retryFromPayload = Number(payload?.retryAfterSec ?? "");
          const retryValue = Number.isFinite(retryFromHeader) && retryFromHeader > 0 ? retryFromHeader : Number.isFinite(retryFromPayload) && retryFromPayload > 0 ? retryFromPayload : 30;
          throw new Error(`RATE_LIMIT:${retryValue}`);
        }
        throw new Error(String(payload?.error ?? `API ${response.status}`));
      }
      const apiResult = payload.result;
      const assistantContentFromApi = buildHumanReadableResultContent(apiResult);
      const parsedResult = parsePromptResult(
        apiResult.rawContent?.trim() ? apiResult.rawContent : JSON.stringify(apiResult)
      );
      parsedResult.optimizedPromptEn = apiResult.optimizedPromptEn;
      parsedResult.optimizedPromptVi = apiResult.optimizedPromptVi;
      parsedResult.optimizedPrompt = apiResult.optimizedPromptEn;
      parsedResult.suggestedCommand = apiResult.suggestedCommand;
      parsedResult.explanation = apiResult.explanation;
      parsedResult.detectedInputLanguage = apiResult.detectedInputLanguage;
      parsedResult.rawContent = apiResult.rawContent || assistantContentFromApi;
      updateAssistantMessage(optimisticTurn.sessionId, optimisticTurn.assistantMessageId, {
        content: assistantContentFromApi,
        parsedResult,
        isStreaming: false,
        isError: false
      });
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : "Không thể tối ưu prompt";
      if (fallbackMessage.startsWith("RATE_LIMIT:")) {
        const retryValue = Number(fallbackMessage.replace("RATE_LIMIT:", "")) || 30;
        setRetryAfterSec(retryValue);
        updateAssistantMessage(optimisticTurn.sessionId, optimisticTurn.assistantMessageId, {
          content: `Bạn gửi quá nhanh. Vui lòng thử lại sau ${retryValue} giây.`,
          isStreaming: false,
          isError: true
        });
        toast.error(`Rate limit: thử lại sau ${retryValue}s`);
        return;
      }
      updateAssistantMessage(optimisticTurn.sessionId, optimisticTurn.assistantMessageId, {
        content: `Lỗi khi tối ưu prompt: ${fallbackMessage}`,
        isStreaming: false,
        isError: true
      });
      toast.error("Tối ưu prompt thất bại");
    } finally {
      setIsLoading(false);
    }
  }, [
    addUserTurnWithOptimisticAssistant,
    input,
    inputLanguagePreference,
    isLoading,
    outputLanguageMode,
    retryAfterSec,
    updateAssistantMessage
  ]);
  const handleCopyMessage = useCallback(async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      toast.success("Đã sao chép!");
      window.setTimeout(() => setCopiedMessageId(null), 1800);
    } catch {
      toast.error("Không thể sao chép vào clipboard");
    }
  }, []);
  const emptyState = useMemo(
    () => /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center px-6 py-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--accent)]", children: /* @__PURE__ */ jsx(MessageCircleMore, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-[var(--app-text)]", children: "Bắt đầu tối ưu prompt" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xl text-sm leading-6 text-[var(--app-text-muted)]", children: "Nhập prompt thô ở bên dưới, AI sẽ tối ưu và giữ ngữ cảnh theo phiên hiện tại." })
    ] }),
    []
  );
  if (!activeSession) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6", children: "Đang tải..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--app-shadow)]", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-[calc(100dvh-8.5rem)] min-h-[560px]", children: /* @__PURE__ */ jsxs("section", { className: "relative flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        ThreadHeader,
        {
          activeThreadTitle,
          threadId,
          compareMode,
          onToggleCompare: () => setCompareMode(!compareMode),
          onNewSession: startNewSession,
          onToggleInfo: () => setShowInfo((value) => !value),
          onToggleHistoryPanel: () => setShowHistoryPanel((value) => !value),
          isHistoryPanelOpen: showHistoryPanel,
          onToggleNavigation,
          onToggleDesktopNavigationMode,
          isDesktopNavigationDocked,
          isNavigationCollapsed
        }
      ),
      showInfo && /* @__PURE__ */ jsxs("div", { className: "border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--app-text-muted)] sm:px-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[var(--app-text)]", children: "Prompt Optimizer" }),
        /* @__PURE__ */ jsx("p", { children: "Công cụ tối ưu prompt theo ngữ cảnh hội thoại. Bạn có thể nhập bằng VI/EN, xuất EN/VI/Both, xem preview song ngữ trước khi copy, và copy riêng EN, VI hoặc Both." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 sm:px-5", children: [
        messages.length === 0 && emptyState,
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: messages.map((message) => /* @__PURE__ */ jsx("div", { className: message.role === "user" ? "flex justify-end" : "flex justify-start", children: /* @__PURE__ */ jsx("div", { className: message.role === "user" ? "w-full max-w-2xl" : "w-full max-w-4xl", children: message.role === "user" ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--accent)_9%,var(--app-surface))] px-4 py-3 text-sm leading-6 text-[var(--app-text)]", children: /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap", children: message.content }) }) : message.isStreaming ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)]", children: /* @__PURE__ */ jsx(PromptOptimizerTypingDots, {}) }) : message.parsedResult ? /* @__PURE__ */ jsx(
          OptimizedResultView,
          {
            result: message.parsedResult,
            originalInput: message.originalInput || "",
            compareMode,
            outputLanguageMode,
            displayMode,
            previewMode
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3", children: [
          /* @__PURE__ */ jsx("p", { className: `whitespace-pre-wrap text-sm leading-6 ${message.isError ? "text-rose-500 dark:text-rose-300" : "text-[var(--app-text)]"}`, children: message.content }),
          !message.isError && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleCopyMessage(message),
              className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-xs font-semibold text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)]",
              children: [
                copiedMessageId === message.id ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: copiedMessageId === message.id ? "Đã sao chép!" : "Copy" })
              ]
            }
          ) })
        ] }) }) }, message.id)) }),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-4 sm:px-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "input-language-selector", className: "text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]", children: "Input language" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              id: "input-language-selector",
              value: inputLanguagePreference,
              onChange: (event) => setInputLanguagePreference(event.target.value),
              className: "min-h-10 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-2 text-sm text-[var(--app-text)] focus:border-[color-mix(in_srgb,var(--accent)_40%,var(--app-border))] focus:outline-none",
              children: INPUT_LANGUAGE_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowOutputPreferences((value) => !value),
              className: "inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--accent)_9%,var(--app-surface))]",
              children: [
                /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: "Output Preferences" })
              ]
            }
          )
        ] }),
        showOutputPreferences && /* @__PURE__ */ jsxs("div", { className: "mb-3 space-y-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3", children: [
          /* @__PURE__ */ jsx(
            PreferenceButtonGroup,
            {
              title: "Prompt output language",
              options: OUTPUT_LANGUAGE_OPTIONS,
              value: outputLanguageMode,
              onChange: setOutputLanguageMode
            }
          ),
          /* @__PURE__ */ jsx(
            PreferenceButtonGroup,
            {
              title: "Display mode",
              options: DISPLAY_MODE_OPTIONS,
              value: displayMode,
              onChange: setDisplayMode
            }
          ),
          /* @__PURE__ */ jsx(
            PreferenceButtonGroup,
            {
              title: "Preview mode",
              options: PREVIEW_MODE_OPTIONS,
              value: previewMode,
              onChange: setPreviewMode
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ref: textareaRef,
              "data-testid": "prompt-optimizer-input",
              value: input,
              onChange: (event) => setInput(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Escape") {
                  setShowInfo(false);
                  setShowHistoryPanel(false);
                  setShowOutputPreferences(false);
                  return;
                }
                if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  void submitPrompt();
                }
              },
              rows: 1,
              disabled: isLoading,
              placeholder: "Nhập prompt... (Ctrl+Enter để gửi)",
              className: "min-h-12 max-h-56 w-full resize-none rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,var(--app-border))] focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "data-testid": "prompt-optimizer-submit",
              "aria-label": "Gửi prompt",
              onClick: () => void submitPrompt(),
              disabled: isLoading || !input.trim() || retryAfterSec > 0,
              className: "flex h-12 w-12 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--accent)_22%,var(--app-surface))] disabled:cursor-not-allowed disabled:opacity-50",
              children: /* @__PURE__ */ jsx(Send, { className: "h-4.5 w-4.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-[var(--app-text-muted)]", children: "Mẹo: Esc để đóng panel, Ctrl+Enter để gửi prompt. Bilingual mặc định luôn tạo EN + VI." }),
        retryAfterSec > 0 && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs font-semibold text-amber-600 dark:text-amber-300", children: [
          "Rate limit đang bật. Bạn có thể gửi lại sau ",
          retryAfterSec,
          "s."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute inset-0 z-30 transition-[opacity,visibility] duration-300 ${showHistoryPanel ? "visible opacity-100" : "invisible opacity-0"}`,
        children: /* @__PURE__ */ jsxs("div", { className: showHistoryPanel ? "pointer-events-auto" : "pointer-events-none", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "absolute inset-0 bg-black/45",
              "aria-label": "Đóng drawer lịch sử",
              onClick: () => setShowHistoryPanel(false)
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: historyPanelContainerRef,
              className: `absolute overflow-hidden border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--app-shadow)] transition-transform duration-300 ${isMobileViewport ? `${showHistoryPanel ? "translate-y-0" : "translate-y-full"} inset-x-0 bottom-0 h-[min(78%,560px)] rounded-t-2xl border-t` : `${showHistoryPanel ? "translate-x-0" : "translate-x-full"} right-0 top-0 h-full w-[88%] max-w-sm border-l`}`,
              children: [
                isMobileViewport && /* @__PURE__ */ jsx("div", { className: "flex justify-center py-2", children: /* @__PURE__ */ jsx("span", { className: "h-1.5 w-12 rounded-full bg-[var(--app-border-strong)]" }) }),
                /* @__PURE__ */ jsx(
                  PromptOptimizerHistoryPanel,
                  {
                    sessions,
                    activeSessionId,
                    onSelectSession: (sessionId) => {
                      selectSession(sessionId);
                      setShowHistoryPanel(false);
                    },
                    onNewSession: () => {
                      startNewSession();
                      setShowHistoryPanel(false);
                    },
                    isMobile: isMobileViewport,
                    onCloseMobile: () => setShowHistoryPanel(false)
                  }
                )
              ]
            }
          )
        ] })
      }
    )
  ] });
}
const PromptOptimizerChat = (props) => {
  return /* @__PURE__ */ jsx(PromptOptimizerConversationProvider, { children: /* @__PURE__ */ jsx(PromptOptimizerContent, { ...props }) });
};

const PROMPT_OPTIMIZER_LAYOUT_PREFERENCE_STORAGE_KEY = "claudekit:prompt-optimizer:layout:v1";
const DEFAULT_LAYOUT_PREFERENCE = {
  desktopNavigationMode: "docked",
  navigationCollapsed: false
};
function normalizeLayoutPreference(value) {
  if (!value) {
    return DEFAULT_LAYOUT_PREFERENCE;
  }
  const desktopNavigationMode = value.desktopNavigationMode === "overlay" ? "overlay" : "docked";
  return {
    desktopNavigationMode,
    navigationCollapsed: Boolean(value.navigationCollapsed)
  };
}
function usePromptOptimizerLayoutPreferenceWithLocalStorage() {
  const [layoutPreference, setLayoutPreference] = useState(
    DEFAULT_LAYOUT_PREFERENCE
  );
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const rawValue = window.localStorage.getItem(PROMPT_OPTIMIZER_LAYOUT_PREFERENCE_STORAGE_KEY);
      if (!rawValue) {
        setLayoutPreference(DEFAULT_LAYOUT_PREFERENCE);
        return;
      }
      const parsedValue = JSON.parse(rawValue);
      setLayoutPreference(normalizeLayoutPreference(parsedValue));
    } catch {
      setLayoutPreference(DEFAULT_LAYOUT_PREFERENCE);
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(
        PROMPT_OPTIMIZER_LAYOUT_PREFERENCE_STORAGE_KEY,
        JSON.stringify(layoutPreference)
      );
    } catch {
    }
  }, [layoutPreference]);
  const setDesktopNavigationMode = useCallback((nextMode) => {
    setLayoutPreference((previous) => ({
      ...previous,
      desktopNavigationMode: nextMode
    }));
  }, []);
  const setNavigationCollapsed = useCallback((nextCollapsed) => {
    setLayoutPreference((previous) => ({
      ...previous,
      navigationCollapsed: nextCollapsed
    }));
  }, []);
  const value = useMemo(
    () => ({
      layoutPreference,
      setDesktopNavigationMode,
      setNavigationCollapsed
    }),
    [layoutPreference, setDesktopNavigationMode, setNavigationCollapsed]
  );
  return value;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    const updateMatch = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", updateMatch);
    return () => mediaQueryList.removeEventListener("change", updateMatch);
  }, [query]);
  return matches;
}
function PromptOptimizerResponsiveWorkspaceWithAdaptiveNavigation() {
  const isDesktopViewport = useMediaQuery("(min-width: 1280px)");
  const { layoutPreference, setDesktopNavigationMode, setNavigationCollapsed } = usePromptOptimizerLayoutPreferenceWithLocalStorage();
  const [overlayNavigationOpen, setOverlayNavigationOpen] = useState(false);
  const isDesktopDockedSidebar = isDesktopViewport && layoutPreference.desktopNavigationMode === "docked";
  useEffect(() => {
    if (isDesktopDockedSidebar) {
      setOverlayNavigationOpen(false);
    }
  }, [isDesktopDockedSidebar]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOverlayNavigationOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const closeOverlayNavigation = useCallback(() => {
    setOverlayNavigationOpen(false);
  }, []);
  const toggleNavigation = useCallback(() => {
    if (isDesktopDockedSidebar) {
      setNavigationCollapsed(!layoutPreference.navigationCollapsed);
      return;
    }
    setOverlayNavigationOpen((current) => !current);
  }, [isDesktopDockedSidebar, layoutPreference.navigationCollapsed, setNavigationCollapsed]);
  const toggleDesktopNavigationMode = useCallback(() => {
    setDesktopNavigationMode(
      layoutPreference.desktopNavigationMode === "docked" ? "overlay" : "docked"
    );
  }, [layoutPreference.desktopNavigationMode, setDesktopNavigationMode]);
  return /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-[100dvh] bg-[var(--app-bg)]", suppressHydrationWarning: true, children: [
    isDesktopDockedSidebar && /* @__PURE__ */ jsx(
      "div",
      {
        className: `hidden transition-[width] duration-300 xl:block ${layoutPreference.navigationCollapsed ? "w-20" : "w-[300px]"}`,
        children: /* @__PURE__ */ jsx(
          VerticalNavSidebar,
          {
            currentPage: "optimizer",
            collapsed: layoutPreference.navigationCollapsed,
            sticky: false,
            className: "h-full max-h-none"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "app-shell-main app-shell-main-scroll relative z-10 min-w-0 flex-1", children: /* @__PURE__ */ jsx("div", { className: "mx-auto w-full px-3 py-4 sm:px-5 sm:py-5 lg:max-w-[1120px] xl:max-w-[1360px] 2xl:max-w-[1500px]", suppressHydrationWarning: true, children: /* @__PURE__ */ jsx(
      PromptOptimizerChat,
      {
        onToggleNavigation: toggleNavigation,
        onToggleDesktopNavigationMode: isDesktopViewport ? toggleDesktopNavigationMode : void 0,
        isDesktopNavigationDocked: isDesktopDockedSidebar,
        isNavigationCollapsed: layoutPreference.navigationCollapsed
      }
    ) }) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `fixed inset-0 z-40 transition-opacity duration-300 ${overlayNavigationOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`,
        suppressHydrationWarning: true,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Đóng điều hướng",
              className: "absolute inset-0 bg-black/45",
              onClick: closeOverlayNavigation
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute left-0 top-0 h-full w-[88vw] max-w-[320px] transform transition-transform duration-300 ${overlayNavigationOpen ? "translate-x-0" : "-translate-x-full"}`,
              suppressHydrationWarning: true,
              children: /* @__PURE__ */ jsx(
                VerticalNavSidebar,
                {
                  currentPage: "optimizer",
                  mobileVisible: true,
                  sticky: false,
                  collapsed: false,
                  onItemClick: closeOverlayNavigation,
                  className: "h-full max-h-none shadow-[var(--app-shadow)]"
                }
              )
            }
          )
        ]
      }
    )
  ] });
}

const $$PromptOptimizer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Prompt Optimizer | ClaudeKit", "description": "Prompt Optimizer chính thức của ClaudeKit với lịch sử ngữ cảnh và compare mode." }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "PromptOptimizerResponsiveWorkspaceWithAdaptiveNavigation", PromptOptimizerResponsiveWorkspaceWithAdaptiveNavigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/command-guide/prompt-optimizer-responsive-workspace-with-adaptive-navigation", "client:component-export": "PromptOptimizerResponsiveWorkspaceWithAdaptiveNavigation" })} `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": ($$result3) => renderTemplate` <link rel="canonical" href="/guide/prompt-optimizer"> ` })}` })}`;
}, "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/guide/prompt-optimizer.astro", void 0);

const $$file = "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/guide/prompt-optimizer.astro";
const $$url = "/guide/prompt-optimizer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PromptOptimizer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
