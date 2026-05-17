import { c as createComponent } from './astro-component_3xMZ7s8g.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_N2AoPI2Q.mjs';
import { u as useBilingualLanguageToggleState, $ as $$Layout, V as VerticalNavSidebar } from './vertical-navigation-sidebar_MqcvzbCi.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React, { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
import { User, Check, Copy, Bot, Sparkles, RefreshCw, Search, ChevronRight, Wrench, Megaphone, Command as Command$1, Square, Send, Zap, History, Plus, AlertTriangle, X, ChevronDown, MessageSquare, Clock, Code, BookOpen, Bug } from 'lucide-react';
import { Command } from 'cmdk';
import { e as engineerCommands, m as marketingCommands, c as commands } from './claudekit-full-commands-catalog_DoHT_xSM.mjs';
import { a as appendChunkAndExtractSseEvents, e as extractDataPayloadFromSseEvent } from './sse-event-parser_BCm7lHtR.mjs';

const MessageReactionButton = ({
  emoji,
  count,
  isActive,
  onClick,
  label
}) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: `
        flex items-center gap-1 px-2 py-1 rounded-lg
        transition-all duration-200
        ${isActive ? "bg-brand-400/20 border border-brand-400/50 text-brand-300" : "bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white"}
      `,
      "aria-label": `${label}: ${count}`,
      title: label,
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: emoji }),
        count > 0 && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium min-w-[14px] text-center", children: count })
      ]
    }
  );
};

const REACTIONS = [
  { id: "helpful", emoji: "👍", label: "Hữu ích" },
  { id: "notHelpful", emoji: "👎", label: "Không hữu ích" },
  { id: "save", emoji: "⭐", label: "Lưu lại" }
];
const MessageReactionsContainer = ({
  messageId
}) => {
  const storageKey = `claudekit-reactions-${messageId}`;
  const [reactions, setReactions] = useState(() => {
    if (typeof window === "undefined") {
      return { helpful: 0, notHelpful: 0, save: 0, userReaction: null };
    }
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
    return { helpful: 0, notHelpful: 0, save: 0, userReaction: null };
  });
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reactions));
  }, [reactions, storageKey]);
  const handleReaction = useCallback((type) => {
    setReactions((prev) => {
      const wasActive = prev.userReaction === type;
      if (wasActive) {
        return {
          ...prev,
          [type]: Math.max(0, prev[type] - 1),
          userReaction: null
        };
      }
      const newReactions = { ...prev };
      if (prev.userReaction) {
        newReactions[prev.userReaction] = Math.max(0, prev[prev.userReaction] - 1);
      }
      newReactions[type] = prev[type] + 1;
      newReactions.userReaction = type;
      return newReactions;
    });
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mt-2", children: REACTIONS.map((reaction) => /* @__PURE__ */ jsx(
    MessageReactionButton,
    {
      emoji: reaction.emoji,
      count: reactions[reaction.id],
      isActive: reactions.userReaction === reaction.id,
      onClick: () => handleReaction(reaction.id),
      label: reaction.label
    },
    reaction.id
  )) });
};

const MessageBubbleUser = ({
  content,
  messageId,
  timestampLabel
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Đã sao chép vào clipboard", {
        icon: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-400" })
      });
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      toast.error("Không thể sao chép. Vui lòng thử lại.");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "group/message message-enter px-4 py-3 sm:px-8 md:px-10", children: /* @__PURE__ */ jsxs("div", { className: "ml-auto flex max-w-[768px] flex-row-reverse items-start gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "order-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] shadow-[var(--app-shadow-soft)]", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "order-1 flex min-w-0 flex-1 flex-col items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "max-w-[min(100%,680px)] rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] bg-brand-400/20 px-5 py-4 text-[15px] leading-7 text-[var(--app-text)] shadow-[var(--app-shadow-soft)] transition-colors duration-200 group-hover/message:bg-[color-mix(in_srgb,var(--app-surface-muted)_82%,var(--app-surface))]", children: /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap break-words", children: content }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center justify-end gap-1 opacity-100 transition-opacity duration-200 md:absolute md:-top-2 md:right-0 md:mt-0 md:opacity-0 md:group-hover/message:opacity-100", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCopy,
            className: "flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-text)]",
            title: "Sao chép tin nhắn",
            "aria-label": "Sao chép tin nhắn người dùng",
            children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "mt-2 text-[13px] text-[var(--app-text-muted)]", children: timestampLabel ? `${timestampLabel} • Bạn` : "Bạn" }),
      messageId && /* @__PURE__ */ jsx(MessageReactionsContainer, { messageId })
    ] })
  ] }) });
};

const MessageBubbleAssistant = ({
  content,
  messageId,
  isTyping = false,
  timestampLabel
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Đã sao chép vào clipboard", {
        icon: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-400" })
      });
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      toast.error("Không thể sao chép. Vui lòng thử lại.");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "group/message message-enter px-4 py-3 sm:px-8 md:px-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-[768px] items-start gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--accent)] shadow-[var(--app-shadow-soft)]", children: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-[var(--app-text)]", children: "ClaudeKit" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] text-[var(--app-text-muted)]", children: "Trợ lý AI" }),
        /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-[var(--accent)]" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative max-w-[min(100%,680px)] rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 text-[15px] leading-7 text-[var(--app-text)] shadow-[var(--app-shadow-soft)] transition-colors duration-200 group-hover/message:bg-[color-mix(in_srgb,var(--app-surface)_92%,var(--app-surface-muted))]", children: isTyping ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "optimizer-skeleton-shimmer h-3 w-2/3 rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "optimizer-skeleton-shimmer h-3 w-full rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "optimizer-skeleton-shimmer h-3 w-4/5 rounded-full" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[13px] text-[var(--app-text-muted)]", children: [
          /* @__PURE__ */ jsx("span", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)] [animation-delay:0ms]" }),
          /* @__PURE__ */ jsx("span", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)] [animation-delay:120ms]" }),
          /* @__PURE__ */ jsx("span", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)] [animation-delay:240ms]" }),
          /* @__PURE__ */ jsx("span", { className: "ml-1", children: "Đang trả lời..." })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap break-words", children: content }) }),
      !isTyping && content.trim().length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center gap-1 opacity-100 transition-opacity duration-200 md:mt-0 md:absolute md:-top-2 md:right-0 md:opacity-0 md:group-hover/message:opacity-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-[var(--app-shadow-soft)]", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCopy,
            className: "flex min-h-11 min-w-11 items-center justify-center rounded-md text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]",
            title: "Sao chép tin nhắn",
            "aria-label": "Sao chép phản hồi",
            children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "flex min-h-11 min-w-11 items-center justify-center rounded-md text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]",
            title: "Tạo lại",
            "aria-label": "Tạo lại phản hồi",
            children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
          }
        )
      ] }) }),
      timestampLabel && /* @__PURE__ */ jsx("span", { className: "mt-2 block text-[13px] text-[var(--app-text-muted)]", children: timestampLabel }),
      messageId && /* @__PURE__ */ jsx(MessageReactionsContainer, { messageId })
    ] })
  ] }) });
};

const rawDiscoveredCommands = [
  {
    "id": "ck:bootstrap",
    "name": "/ck:bootstrap",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡⚡⚡⚡ Bootstrap a new project step by step",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/bootstrap.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:bootstrap:auto",
    "name": "/ck:bootstrap:auto",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡⚡⚡ Bootstrap a new project automatically",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/bootstrap/auto.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:bootstrap:auto:fast",
    "name": "/ck:bootstrap:auto:fast",
    "category": "Engineer",
    "complexity": 3,
    "description": "⚡⚡⚡ Quickly bootstrap a new project automatically",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/bootstrap/auto/fast.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:bootstrap:auto:parallel",
    "name": "/ck:bootstrap:auto:parallel",
    "category": "Engineer",
    "complexity": 3,
    "description": "⚡⚡⚡⚡⚡ Bootstrap project with parallel execution",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/bootstrap/auto/parallel.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:code",
    "name": "/ck:code",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡⚡ Start coding & testing an existing plan",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/code.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:code:auto",
    "name": "/ck:code:auto",
    "category": "Engineer",
    "complexity": 2,
    "description": '⚡⚡⚡ [AUTO] Start coding & testing an existing plan ("trust me bro")',
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/code/auto.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:code:no-test",
    "name": "/ck:code:no-test",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡ Start coding an existing plan (no testing)",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/code/no-test.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:code:parallel",
    "name": "/ck:code:parallel",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡ Execute parallel or sequential phases based on plan structure",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/code/parallel.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:content:cro",
    "name": "/ck:content:cro",
    "category": "Engineer",
    "complexity": 2,
    "description": "Analyze the current content and optimize for conversion",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/content/cro.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:content:enhance",
    "name": "/ck:content:enhance",
    "category": "Engineer",
    "complexity": 2,
    "description": "Analyze the current copy issues and enhance it",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/content/enhance.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:content:fast",
    "name": "/ck:content:fast",
    "category": "Engineer",
    "complexity": 2,
    "description": "Write creative & smart copy [FAST]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/content/fast.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:content:good",
    "name": "/ck:content:good",
    "category": "Engineer",
    "complexity": 2,
    "description": "Write good creative & smart copy [GOOD]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/content/good.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:cook",
    "name": "/ck:cook",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡⚡ Implement a feature [step by step]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/cook.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:cook:auto",
    "name": "/ck:cook:auto",
    "category": "Engineer",
    "complexity": 2,
    "description": '⚡⚡ Implement a feature automatically ("trust me bro")',
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/cook/auto.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:cook:auto:fast",
    "name": "/ck:cook:auto:fast",
    "category": "Engineer",
    "complexity": 3,
    "description": '⚡ No research. Only scout, plan & implement ["trust me bro"]',
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/cook/auto/fast.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:cook:auto:parallel",
    "name": "/ck:cook:auto:parallel",
    "category": "Engineer",
    "complexity": 3,
    "description": "⚡⚡⚡ Plan parallel phases & execute with fullstack-developer agents",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/cook/auto/parallel.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:debug",
    "name": "/ck:debug",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡ Debugging technical issues and providing solutions.",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/debug.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:design:3d",
    "name": "/ck:design:3d",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create immersive interactive 3D designs with Three.js",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/design/3d.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:design:describe",
    "name": "/ck:design:describe",
    "category": "Engineer",
    "complexity": 2,
    "description": "Describe a design based on screenshot/video",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/design/describe.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:design:fast",
    "name": "/ck:design:fast",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create a quick design",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/design/fast.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:design:good",
    "name": "/ck:design:good",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create an immersive design",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/design/good.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:design:screenshot",
    "name": "/ck:design:screenshot",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create a design based on screenshot",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/design/screenshot.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:design:video",
    "name": "/ck:design:video",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create a design based on video",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/design/video.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix",
    "name": "/ck:fix",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡ Analyze and fix issues [INTELLIGENT ROUTING]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:ci",
    "name": "/ck:fix:ci",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡ Analyze Github Actions logs and fix issues",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/ci.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:fast",
    "name": "/ck:fix:fast",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡ Analyze and fix small issues [FAST]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/fast.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:hard",
    "name": "/ck:fix:hard",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡⚡ Use subagents to plan and fix hard issues",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/hard.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:logs",
    "name": "/ck:fix:logs",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡ Analyze logs and fix issues",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/logs.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:parallel",
    "name": "/ck:fix:parallel",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡ Analyze & fix issues with parallel fullstack-developer agents",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/parallel.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:test",
    "name": "/ck:fix:test",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡ Run test suite and fix issues",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/test.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:types",
    "name": "/ck:fix:types",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡ Fix type errors",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/types.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:fix:ui",
    "name": "/ck:fix:ui",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡ Analyze and fix UI issues",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/fix/ui.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan",
    "name": "/ck:plan",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡⚡ Intelligent plan creation with prompt enhancement",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan:ci",
    "name": "/ck:plan:ci",
    "category": "Engineer",
    "complexity": 2,
    "description": "Analyze Github Actions logs and provide a plan to fix the issues",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan/ci.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan:cro",
    "name": "/ck:plan:cro",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create a CRO plan for the given content",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan/cro.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan:fast",
    "name": "/ck:plan:fast",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡ No research. Only analyze and create an implementation plan",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan/fast.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan:hard",
    "name": "/ck:plan:hard",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡⚡ Research, analyze, and create an implementation plan",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan/hard.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan:parallel",
    "name": "/ck:plan:parallel",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡⚡ Create detailed plan with parallel-executable phases",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan/parallel.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:plan:two",
    "name": "/ck:plan:two",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡⚡⚡⚡ Research & create an implementation plan with 2 approaches",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/plan/two.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:scout",
    "name": "/ck:scout",
    "category": "Engineer",
    "complexity": 1,
    "description": "⚡⚡ Scout given directories to respond to the user's requests",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/scout.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:scout:ext",
    "name": "/ck:scout:ext",
    "category": "Engineer",
    "complexity": 2,
    "description": "⚡ Use external agentic tools to scout given directories",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/scout/ext.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:skill:add",
    "name": "/ck:skill:add",
    "category": "Engineer",
    "complexity": 2,
    "description": "Add new reference files or scripts to a skill",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/skill/add.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:skill:create",
    "name": "/ck:skill:create",
    "category": "Engineer",
    "complexity": 2,
    "description": "Create a new agent skill",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/skill/create.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:skill:fix-logs",
    "name": "/ck:skill:fix-logs",
    "category": "Engineer",
    "complexity": 2,
    "description": "Fix the agent skill based on `logs.txt` file.",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/skill/fix-logs.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:skill:optimize",
    "name": "/ck:skill:optimize",
    "category": "Engineer",
    "complexity": 2,
    "description": "Optimize an existing agent skill",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/skill/optimize.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:skill:optimize:auto",
    "name": "/ck:skill:optimize:auto",
    "category": "Engineer",
    "complexity": 3,
    "description": "Optimize an existing agent skill [auto]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/skill/optimize/auto.md",
    "sourceKind": "archived"
  },
  {
    "id": "ck:skill:update",
    "name": "/ck:skill:update",
    "category": "Engineer",
    "complexity": 2,
    "description": "Update an existing agent skill [auto]",
    "sourceRepo": "claudekit-engineer",
    "sourcePath": ".claude-archived/commands/skill/update.md",
    "sourceKind": "archived"
  },
  {
    "id": "ckm:analyze",
    "name": "/ckm:analyze",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Analytics and performance reports",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/analyze.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:analyze:report",
    "name": "/ckm:analyze:report",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Generate periodic reports",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/analyze/report.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:ask",
    "name": "/ckm:ask",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡 Answer technical and architectural questions.",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/ask.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:brand:update",
    "name": "/ckm:brand:update",
    "category": "Marketing",
    "complexity": 3,
    "description": "🎨 Update brand identity and sync to all design systems",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/brand/update.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:campaign",
    "name": "/ckm:campaign",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Create and manage marketing campaigns",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/campaign.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:campaign:analyze",
    "name": "/ckm:campaign:analyze",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Analyze campaign performance",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/campaign/analyze.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:campaign:create",
    "name": "/ckm:campaign:create",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡 Create comprehensive digital marketing campaign",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/campaign/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:campaign:email",
    "name": "/ckm:campaign:email",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Email campaign management",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/campaign/email.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:campaign:status",
    "name": "/ckm:campaign:status",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡 Get campaign status",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/campaign/status.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:competitor",
    "name": "/ckm:competitor",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Competitive analysis",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/competitor.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:dashboard",
    "name": "/ckm:dashboard",
    "category": "Marketing",
    "complexity": 2,
    "description": "Raw command discovered from source repository",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/dashboard.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:dashboard:check",
    "name": "/ckm:dashboard:check",
    "category": "Marketing",
    "complexity": 3,
    "description": "Check Marketing Dashboard server status",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/dashboard/check.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:docs:init",
    "name": "/ckm:docs:init",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡💡 Analyze the codebase and create initial documentation",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/docs/init.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:docs:llms",
    "name": "/ckm:docs:llms",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡 Generate llms.txt based on the current codebase",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/docs/llms.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:docs:summarize",
    "name": "/ckm:docs:summarize",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡 Analyze the codebase and update documentation",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/docs/summarize.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:docs:update",
    "name": "/ckm:docs:update",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡 Analyze the codebase and update documentation",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/docs/update.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:email",
    "name": "/ckm:email",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Generate email content",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/email.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:email:flow",
    "name": "/ckm:email:flow",
    "category": "Marketing",
    "complexity": 3,
    "description": "Generate complete email automation sequence",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/email/flow.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:email:sequence",
    "name": "/ckm:email:sequence",
    "category": "Marketing",
    "complexity": 3,
    "description": "Generate complete email drip sequence with copy",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/email/sequence.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:funnel",
    "name": "/ckm:funnel",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Funnel design and optimization",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/funnel.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:hub",
    "name": "/ckm:hub",
    "category": "Marketing",
    "complexity": 2,
    "description": "Open Content Hub + Marketing Dashboard",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/hub.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:init",
    "name": "/ckm:init",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡💡💡 Initialize marketing project",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/init.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:journal",
    "name": "/ckm:journal",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡 Write some journal entries.",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/journal.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:kanban",
    "name": "/ckm:kanban",
    "category": "Marketing",
    "complexity": 2,
    "description": "AI agent orchestration board (Coming Soon)",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/kanban.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:persona",
    "name": "/ckm:persona",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Customer persona management",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/persona.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan",
    "name": "/ckm:plan",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡💡 Intelligent plan creation with prompt enhancement",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:archive",
    "name": "/ckm:plan:archive",
    "category": "Marketing",
    "complexity": 3,
    "description": "Write journal entries and archive specific plans or all plans",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/archive.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:ci",
    "name": "/ckm:plan:ci",
    "category": "Marketing",
    "complexity": 3,
    "description": "Analyze Github Actions logs and provide a plan to fix the issues",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/ci.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:cro",
    "name": "/ckm:plan:cro",
    "category": "Marketing",
    "complexity": 3,
    "description": "Create a CRO plan for the given content",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/cro.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:fast",
    "name": "/ckm:plan:fast",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 No research. Only analyze and create an implementation plan",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/fast.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:hard",
    "name": "/ckm:plan:hard",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡 Research, analyze, and create an implementation plan",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/hard.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:parallel",
    "name": "/ckm:plan:parallel",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡 Create detailed plan with parallel-executable phases",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/parallel.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:two",
    "name": "/ckm:plan:two",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡💡💡 Research & create an implementation plan with 2 approaches",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/two.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:plan:validate",
    "name": "/ckm:plan:validate",
    "category": "Marketing",
    "complexity": 3,
    "description": "Validate plan with critical questions interview",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/plan/validate.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:play",
    "name": "/ckm:play",
    "category": "Marketing",
    "complexity": 2,
    "description": "Marketing playbook orchestrator — expert strategy, AI execution, goal tracking",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/play.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:play:create",
    "name": "/ckm:play:create",
    "category": "Marketing",
    "complexity": 3,
    "description": "Create a new marketing playbook from expert template",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/play/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:play:goals",
    "name": "/ckm:play:goals",
    "category": "Marketing",
    "complexity": 3,
    "description": "Goal tracker — set targets, pull metrics, view progress",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/play/goals.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:play:next",
    "name": "/ckm:play:next",
    "category": "Marketing",
    "complexity": 3,
    "description": "Show and execute next ready playbook step",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/play/next.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:play:status",
    "name": "/ckm:play:status",
    "category": "Marketing",
    "complexity": 3,
    "description": "Show playbook progress dashboard",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/play/status.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:preview",
    "name": "/ckm:preview",
    "category": "Marketing",
    "complexity": 2,
    "description": "Path to markdown file, plan directory, or plans collection",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/preview.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:seo",
    "name": "/ckm:seo",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 SEO audit and optimization",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/seo.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:seo:audit",
    "name": "/ckm:seo:audit",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Technical SEO audit",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/seo/audit.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:seo:keywords",
    "name": "/ckm:seo:keywords",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Keyword research & planning",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/seo/keywords.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:seo:pseo",
    "name": "/ckm:seo:pseo",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Programmatic SEO template generation",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/seo/pseo.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:add",
    "name": "/ckm:skill:add",
    "category": "Marketing",
    "complexity": 3,
    "description": "Add new reference files or scripts to a skill",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/add.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:create",
    "name": "/ckm:skill:create",
    "category": "Marketing",
    "complexity": 3,
    "description": "Create a new agent skill",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:fix-logs",
    "name": "/ckm:skill:fix-logs",
    "category": "Marketing",
    "complexity": 3,
    "description": "Fix the agent skill based on `logs.txt` file.",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/fix-logs.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:optimize",
    "name": "/ckm:skill:optimize",
    "category": "Marketing",
    "complexity": 3,
    "description": "Optimize an existing agent skill",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/optimize.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:optimize:auto",
    "name": "/ckm:skill:optimize:auto",
    "category": "Marketing",
    "complexity": 4,
    "description": "Optimize an existing agent skill [auto]",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/optimize/auto.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:plan",
    "name": "/ckm:skill:plan",
    "category": "Marketing",
    "complexity": 3,
    "description": "Plan to create a new agent skill",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/plan.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:skill:update",
    "name": "/ckm:skill:update",
    "category": "Marketing",
    "complexity": 3,
    "description": "Update an existing agent skill [auto]",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/skill/update.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:slides:create",
    "name": "/ckm:slides:create",
    "category": "Marketing",
    "complexity": 3,
    "description": "Create strategic presentation slides with Chart.js and design tokens",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/slides/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:social",
    "name": "/ckm:social",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡💡 Social media content generation",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/social.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:social:schedule",
    "name": "/ckm:social:schedule",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡 Schedule social media posts",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/social/schedule.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:storage:list",
    "name": "/ckm:storage:list",
    "category": "Marketing",
    "complexity": 3,
    "description": "Raw command discovered from source repository",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/storage/list.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:storage:sync",
    "name": "/ckm:storage:sync",
    "category": "Marketing",
    "complexity": 3,
    "description": "Raw command discovered from source repository",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/storage/sync.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:storage:upload",
    "name": "/ckm:storage:upload",
    "category": "Marketing",
    "complexity": 3,
    "description": "Raw command discovered from source repository",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/storage/upload.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:storage:url",
    "name": "/ckm:storage:url",
    "category": "Marketing",
    "complexity": 3,
    "description": "Raw command discovered from source repository",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/storage/url.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:test:ui",
    "name": "/ckm:test:ui",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Run UI tests on a website & generate a detailed report.",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/test/ui.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:test:workflow",
    "name": "/ckm:test:workflow",
    "category": "Marketing",
    "complexity": 3,
    "description": "Run workflow tests with step-by-step manual verification",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/test/workflow.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:use-mcp",
    "name": "/ckm:use-mcp",
    "category": "Marketing",
    "complexity": 2,
    "description": "Utilize tools of Model Context Protocol (MCP) servers",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/use-mcp.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:video:create",
    "name": "/ckm:video:create",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Create a video using Veo 3.1",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/video/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:video:script:create",
    "name": "/ckm:video:script:create",
    "category": "Marketing",
    "complexity": 4,
    "description": "💡💡 Create a production-ready video script with creative direction",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/video/script/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:video:storyboard:create",
    "name": "/ckm:video:storyboard:create",
    "category": "Marketing",
    "complexity": 4,
    "description": "💡💡 Create a storyboard for video content",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/video/storyboard/create.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:watzup",
    "name": "/ckm:watzup",
    "category": "Marketing",
    "complexity": 2,
    "description": "💡 Review recent changes and wrap up the work",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/watzup.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:worktree",
    "name": "/ckm:worktree",
    "category": "Marketing",
    "complexity": 2,
    "description": "Create isolated git worktree for parallel development",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/worktree.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:audit",
    "name": "/ckm:write:audit",
    "category": "Marketing",
    "complexity": 3,
    "description": "Audit content quality against copywriting, SEO, and platform standards",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/audit.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:blog",
    "name": "/ckm:write:blog",
    "category": "Marketing",
    "complexity": 3,
    "description": "💡💡 Create SEO-optimized blog content",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/blog.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:blog:youtube",
    "name": "/ckm:write:blog:youtube",
    "category": "Marketing",
    "complexity": 4,
    "description": "💡💡 Generate SEO-optimized blog article from YouTube video",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/blog/youtube.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:cro",
    "name": "/ckm:write:cro",
    "category": "Marketing",
    "complexity": 3,
    "description": "Analyze the current content and optimize for conversion",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/cro.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:enhance",
    "name": "/ckm:write:enhance",
    "category": "Marketing",
    "complexity": 3,
    "description": "Analyze the current copy issues and enhance it",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/enhance.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:fast",
    "name": "/ckm:write:fast",
    "category": "Marketing",
    "complexity": 3,
    "description": "Write creative & smart copy [FAST]",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/fast.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:formula",
    "name": "/ckm:write:formula",
    "category": "Marketing",
    "complexity": 3,
    "description": "Generate copy using proven copywriting formulas (AIDA, PAS, BAB, etc.)",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/formula.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:good",
    "name": "/ckm:write:good",
    "category": "Marketing",
    "complexity": 3,
    "description": "Write good creative & smart copy [GOOD]",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/good.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:write:publish",
    "name": "/ckm:write:publish",
    "category": "Marketing",
    "complexity": 3,
    "description": "Audit content, auto-fix issues, output publish-ready version",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/write/publish.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:youtube:blog",
    "name": "/ckm:youtube:blog",
    "category": "Marketing",
    "complexity": 3,
    "description": "Convert YouTube video to SEO-optimized blog post",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/youtube/blog.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:youtube:infographic",
    "name": "/ckm:youtube:infographic",
    "category": "Marketing",
    "complexity": 3,
    "description": "Convert YouTube video to visual infographic",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/youtube/infographic.md",
    "sourceKind": "live"
  },
  {
    "id": "ckm:youtube:social",
    "name": "/ckm:youtube:social",
    "category": "Marketing",
    "complexity": 3,
    "description": "Convert YouTube video to multi-platform social posts",
    "sourceRepo": "claudekit-marketing",
    "sourcePath": ".claude/commands/ckm/youtube/social.md",
    "sourceKind": "live"
  }
];
const rawDiscoveredCommandCount = rawDiscoveredCommands.length;

const TELEMETRY_STORAGE_KEY = "claudekit:command-telemetry:v1";
const FALLBACK_STORE = { version: 1, commands: {} };
function normalizeCommandToken$3(commandToken) {
  const token = commandToken.trim();
  if (!token) return "";
  const normalized = token.startsWith("/") ? token.slice(1) : token;
  return normalized.toLowerCase();
}
function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function safeReadStore() {
  if (!canUseStorage()) {
    return FALLBACK_STORE;
  }
  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    if (!raw) return FALLBACK_STORE;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || typeof parsed.commands !== "object" || !parsed.commands) {
      return FALLBACK_STORE;
    }
    return {
      version: 1,
      commands: parsed.commands
    };
  } catch {
    return FALLBACK_STORE;
  }
}
function safeWriteStore(store) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(store));
  } catch {
  }
}
function ensureCounter(existing, now) {
  if (!existing) {
    return { shown: 0, clicked: 0, run: 0, success: 0, lastUpdatedAt: now };
  }
  return {
    shown: Math.max(0, Number(existing.shown) || 0),
    clicked: Math.max(0, Number(existing.clicked) || 0),
    run: Math.max(0, Number(existing.run) || 0),
    success: Math.max(0, Number(existing.success) || 0),
    lastUpdatedAt: Number(existing.lastUpdatedAt) || now
  };
}
function incrementEvent(counter, event) {
  counter[event] += 1;
  counter.lastUpdatedAt = Date.now();
}
function trackCommandTelemetryEvent(event, commandToken) {
  const normalized = normalizeCommandToken$3(commandToken);
  if (!normalized) return;
  const now = Date.now();
  const store = safeReadStore();
  const counter = ensureCounter(store.commands[normalized], now);
  incrementEvent(counter, event);
  store.commands[normalized] = counter;
  safeWriteStore(store);
}
function trackCommandShownEvents(commandTokens) {
  if (commandTokens.length === 0) return;
  const now = Date.now();
  const store = safeReadStore();
  for (const commandToken of commandTokens) {
    const normalized = normalizeCommandToken$3(commandToken);
    if (!normalized) continue;
    const counter = ensureCounter(store.commands[normalized], now);
    incrementEvent(counter, "shown");
    store.commands[normalized] = counter;
  }
  safeWriteStore(store);
}
function toRatio(numerator, denominator) {
  if (denominator <= 0) return 0;
  return Math.min(Math.max(numerator / denominator, 0), 1);
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function getCommandUsageScoreBoost(commandToken) {
  const normalized = normalizeCommandToken$3(commandToken);
  if (!normalized) return 0;
  const store = safeReadStore();
  const counter = store.commands[normalized];
  if (!counter) return 0;
  const shown = Math.max(counter.shown, counter.clicked);
  const clicked = Math.max(counter.clicked, counter.run);
  const run = Math.max(counter.run, counter.success);
  const success = counter.success;
  if (shown === 0 && run === 0) return 0;
  const ctr = toRatio(clicked, shown);
  const runRate = toRatio(run, clicked || shown);
  const successRate = toRatio(success, run);
  const usageSignal = 0.2 * ctr + 0.3 * runRate + 0.5 * successRate;
  const confidence = clamp(Math.log2(run + 1) / 4, 0, 1);
  const trend = (usageSignal - 0.45) * 1.8;
  const frequency = clamp(Math.log1p(run) * 0.12, 0, 0.35);
  const failurePenalty = (1 - successRate) * toRatio(run, shown || run) * 0.9;
  return clamp(trend * confidence + frequency - failurePenalty * confidence, -0.8, 1.2);
}

const INTENT_MAPPINGS = {
  // Engineer Core commands
  "/ck:cook": ["implement", "feature", "tạo", "build", "code", "làm", "thêm", "cook"],
  "/ck:fix": ["sửa", "lỗi", "bug", "error", "broken", "issue", "problem", "fix"],
  "/ck:plan": ["kế hoạch", "thiết kế", "architecture", "plan", "lập kế hoạch", "lập"],
  "/ck:bootstrap": ["bootstrap", "new project", "khởi tạo", "init", "dự án mới", "start"],
  "/ck:scout": ["scout", "explore", "tìm", "search", "find", "locate"],
  "/ck:debug": ["debug", "gỡ lỗi", "trace", "investigate", "deep debug", "analyze bug"],
  "/ck:ask": ["hỏi", "ask", "question", "explain", "giải thích"],
  "/ck:test": ["test", "kiểm thử", "run test", "testing"],
  "/ck:research": ["research", "nghiên cứu", "study", "learn", "investigate"],
  "/ck:ship": ["ship", "release", "deploy", "publish", "launch"],
  "/clear": ["clear", "wipe", "reset", "clean", "fresh start"],
  "/plan": ["quick plan", "simple plan", "fast plan"],
  // Fix variants
  "/ck:fix:types": ["typescript", "type error", "tsc", "type check"],
  "/ck:fix:ui": ["ui", "css", "layout", "style", "responsive"],
  "/ck:fix:ci": ["github actions", "pipeline", "ci/cd", "deployment"],
  "/ck:fix:test": ["jest", "vitest", "failing test", "test fail"],
  "/ck:fix:logs": ["logs", "log file", "stack trace"],
  "/ck:fix:parallel": ["multiple issues", "parallel fix", "many bugs", "fix parallel"],
  "/ck:fix:hard": ["complex", "architecture", "refactor", "system-wide"],
  "/ck:fix:fast": ["quick fix", "simple", "small bug"],
  "/ck:docs:init": ["docs init", "init docs", "documentation init"],
  "/ck:git:cm": ["commit", "git commit", "save", "stage", "cm"],
  "/git:cm": ["git cm", "commit shorthand", "quick commit"],
  // Marketing commands
  "/content/good": ["content", "write", "blog", "article", "good"],
  "/content/fast": ["content", "fast", "quick", "rapid"],
  "/content/cro": ["cro", "conversion", "optimize"],
  "/content/blog": ["content blog", "blog content", "content creation blog"],
  "/write/blog": ["blog", "write", "seo"],
  "/write/good": ["write", "copy", "creative"],
  "/seo/keywords": ["seo", "keywords", "research"],
  "/design/good": ["design", "ui", "creative"],
  "/social": ["social", "twitter", "linkedin", "post"],
  "/campaign/create": ["campaign", "launch", "marketing"],
  "/brainstorm": ["brainstorm", "ideas", "creative"]
};
function detectIntent(input) {
  const inputLower = input.toLowerCase();
  for (const [command, keywords] of Object.entries(INTENT_MAPPINGS)) {
    for (const keyword of keywords) {
      if (inputLower.includes(keyword.toLowerCase())) {
        return { command, confidence: 0.9 };
      }
    }
  }
  return null;
}
function extractKeywords(input) {
  const normalized = input.toLowerCase().replace(/[^\w\s\u00C0-\u1FFF\u2C00-\uD7FF]/g, " ").split(/\s+/).filter((w) => w.length > 1);
  return [...new Set(normalized)];
}
function matchPatterns(input, patterns) {
  let score = 0;
  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, "i");
      const matches = input.match(regex);
      if (matches) {
        score += matches.length * 2;
      }
    } catch (e) {
    }
  }
  return score;
}
function scoreCommandAgainstInput(input, inputLower, command) {
  let score = 0;
  const matchedKeywords = [];
  for (const keyword of command.keywords) {
    if (inputLower.includes(keyword.toLowerCase())) {
      score += 1;
      matchedKeywords.push(keyword);
    }
  }
  score += matchPatterns(input, command.patterns);
  for (const useCase of command.useCases) {
    if (inputLower.includes(useCase.toLowerCase())) {
      score += 1.5;
    }
  }
  const searchable = `${command.id} ${command.name} ${command.description}`.toLowerCase();
  const inputTokens = extractKeywords(inputLower);
  const searchableTokens = extractKeywords(searchable);
  const hasFuzzyTokenMatch = inputTokens.some(
    (token) => token.length >= 3 && searchableTokens.some((searchToken) => searchToken === token || searchToken.startsWith(token))
  );
  if (hasFuzzyTokenMatch) {
    score += 0.5;
  }
  if (score > 0 && command.complexity <= 2) {
    score += 0.5;
  }
  if (score <= 0) {
    return null;
  }
  const reason = matchedKeywords.length > 0 ? `Phát hiện: ${matchedKeywords.join(", ")}` : `Pattern match cho ${command.category}`;
  return {
    command,
    score,
    matchedKeywords,
    reason
  };
}
function rankCommandsByIntent(input, commands, limit = 12) {
  const normalizedInput = input.trim();
  if (!normalizedInput) {
    return [];
  }
  const inputLower = normalizedInput.toLowerCase();
  const matches = [];
  for (const command of commands) {
    const scored = scoreCommandAgainstInput(normalizedInput, inputLower, command);
    if (scored) {
      matches.push(scored);
    }
  }
  const directIntent = detectIntent(normalizedInput);
  if (directIntent) {
    const normalizedIntent = directIntent.command.replace(/^\//, "");
    const intentIndex = matches.findIndex(
      (m) => m.command.id === normalizedIntent || m.command.name === directIntent.command
    );
    if (intentIndex >= 0) {
      matches[intentIndex] = {
        ...matches[intentIndex],
        score: matches[intentIndex].score + directIntent.confidence * 3,
        reason: `Khớp intent trực tiếp`
      };
    } else {
      const fallback = commands.find(
        (command) => command.id === normalizedIntent || command.name === directIntent.command
      );
      if (fallback) {
        matches.push({
          command: fallback,
          score: directIntent.confidence * 5,
          matchedKeywords: [],
          reason: "Khớp intent trực tiếp"
        });
      }
    }
  }
  const adjustedMatches = matches.map((match) => {
    const usageBoost = getCommandUsageScoreBoost(match.command.name || match.command.id);
    if (usageBoost === 0) {
      return match;
    }
    const usageHint = usageBoost > 0 ? "Ưu tiên theo usage thực tế" : "Giảm nhẹ do tỷ lệ thành công thấp";
    return {
      ...match,
      score: Math.max(0.1, match.score + usageBoost),
      reason: `${match.reason} • ${usageHint}`
    };
  });
  adjustedMatches.sort((a, b) => b.score - a.score);
  return adjustedMatches.slice(0, Math.max(1, limit));
}
function recommendCommands(input, commands) {
  const matches = rankCommandsByIntent(input, commands, 4);
  const primary = matches[0] || null;
  const alternatives = matches.slice(1, 4);
  const confidence = primary ? Math.min(primary.score / 5, 1) : 0;
  return {
    primary,
    alternatives,
    confidence
  };
}

const DEFAULT_PROGRESSIVE_REVEAL_CONFIG = {
  topLimit: 8,
  rawLimit: 3,
  minimumIntentConfidence: 0.72,
  curatedOnlyInteractions: 3
};
const derivedRawPool = rawDiscoveredCommands.map((item) => {
  const keywordTokens = Array.from(
    new Set(
      item.id.replace(/[:/]/g, " ").toLowerCase().split(/\s+/).concat(item.category.toLowerCase()).filter((token) => token.length > 1)
    )
  );
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    complexity: Math.max(1, Math.min(item.complexity, 5)),
    description: item.description,
    keywords: keywordTokens,
    patterns: [],
    useCases: [item.description]
  };
});
const rawById = new Map(rawDiscoveredCommands.map((item) => [item.id, item]));
function toIntentConfidence(matches) {
  if (matches.length === 0) {
    return 0;
  }
  return Math.min(matches[0].score / 5, 1);
}
function normalizeCommandToken$2(value) {
  return value.trim().replace(/^\//, "").toLowerCase();
}
function getProgressiveRevealMatches({
  input,
  curatedCommands,
  interactionCount,
  config = DEFAULT_PROGRESSIVE_REVEAL_CONFIG
}) {
  const curatedMatches = rankCommandsByIntent(input, curatedCommands, config.topLimit);
  const confidence = toIntentConfidence(curatedMatches);
  const shouldRevealRaw = interactionCount >= config.curatedOnlyInteractions && confidence >= config.minimumIntentConfidence;
  if (!shouldRevealRaw) {
    return {
      curatedMatches,
      rawMatches: [],
      confidence,
      shouldRevealRaw: false
    };
  }
  const curatedTokens = new Set(
    curatedCommands.flatMap((command) => [
      normalizeCommandToken$2(command.id),
      normalizeCommandToken$2(command.name)
    ])
  );
  const eligibleRaw = derivedRawPool.filter((command) => {
    const tokenFromId = normalizeCommandToken$2(command.id);
    const tokenFromName = normalizeCommandToken$2(command.name);
    return !curatedTokens.has(tokenFromId) && !curatedTokens.has(tokenFromName);
  });
  const rankedRaw = rankCommandsByIntent(input, eligibleRaw, config.rawLimit);
  const revealedRaw = rankedRaw.map((match) => {
    const provenance = rawById.get(match.command.id);
    if (!provenance) {
      return null;
    }
    return {
      ...match,
      sourceRepo: provenance.sourceRepo,
      sourcePath: provenance.sourcePath,
      sourceKind: provenance.sourceKind
    };
  }).filter((match) => Boolean(match));
  return {
    curatedMatches,
    rawMatches: revealedRaw,
    confidence,
    shouldRevealRaw: true
  };
}

function normalizeCommandToken$1(value) {
  return value.trim().replace(/^\//, "").toLowerCase();
}
function toCompactSourcePath(sourcePath) {
  const normalized = sourcePath.replace(/\\/g, "/");
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length <= 4) {
    return normalized;
  }
  return segments.slice(-4).join("/");
}
const IconBolt = ({ className = "w-4 h-4" }) => /* @__PURE__ */ jsx("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) });
const IconTool = ({ className = "w-4 h-4" }) => /* @__PURE__ */ jsx("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) });
const IconSpeaker = ({ className = "w-4 h-4" }) => /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
  /* @__PURE__ */ jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
  /* @__PURE__ */ jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })
] });
const CommandPalette = ({
  open,
  onOpenChange,
  onSelect,
  contextInput = "",
  interactionCount = 0
}) => {
  const [search, setSearch] = useState("");
  const shownCommandTokensRef = useRef(/* @__PURE__ */ new Set());
  const allCommands = useMemo(() => [...engineerCommands, ...marketingCommands], []);
  const totalCommands = allCommands.length;
  const sourceByCommandToken = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const item of rawDiscoveredCommands) {
      map.set(normalizeCommandToken$1(item.id), item);
    }
    return map;
  }, []);
  useEffect(() => {
    if (!open) {
      setSearch("");
      shownCommandTokensRef.current.clear();
      return;
    }
    const seeded = contextInput.trim();
    if (seeded) {
      const normalizedSeed = seeded.startsWith("/") ? seeded.slice(1).trimStart() : seeded;
      setSearch(normalizedSeed);
    }
  }, [open, contextInput]);
  const normalizedSearch = search.trim().toLowerCase();
  const contextSeed = open ? contextInput.trim() : "";
  const activeQuery = search.trim() || contextSeed;
  const isSlashMode = contextSeed.startsWith("/");
  const intentQuery = isSlashMode ? search.trim() : activeQuery;
  const isIntentQuery = intentQuery.length > 0 && !isSlashMode;
  const progressiveReveal = useMemo(
    () => isIntentQuery ? getProgressiveRevealMatches({
      input: intentQuery,
      curatedCommands: allCommands,
      interactionCount
    }) : null,
    [allCommands, intentQuery, isIntentQuery, interactionCount]
  );
  const rankedCommands = progressiveReveal?.curatedMatches ?? [];
  const revealedRawCommands = progressiveReveal?.rawMatches ?? [];
  const shouldRevealRaw = progressiveReveal?.shouldRevealRaw ?? false;
  const showRankedGroup = rankedCommands.length > 0 || revealedRawCommands.length > 0;
  const showCatalogSections = !isIntentQuery || !showRankedGroup;
  const matchesSearch = (cmd) => {
    if (!normalizedSearch) return true;
    const searchable = `${cmd.name} ${cmd.category} ${cmd.description}`.toLowerCase();
    return normalizedSearch.split(/\s+/).every((token) => searchable.includes(token));
  };
  const engineerCmds = engineerCommands.filter(matchesSearch).slice(0, 8);
  const marketingCmds = marketingCommands.filter(matchesSearch).slice(0, 8);
  const hasCatalogMatches = showCatalogSections && engineerCmds.length + marketingCmds.length > 0;
  const visibleCommandNames = useMemo(() => {
    const names = [];
    if (showRankedGroup) {
      names.push(...rankedCommands.map((match) => match.command.name));
      names.push(...revealedRawCommands.map((match) => match.command.name));
    }
    if (showCatalogSections) {
      names.push(...engineerCmds.map((command) => command.name));
      names.push(...marketingCmds.map((command) => command.name));
    }
    return names;
  }, [
    engineerCmds,
    marketingCmds,
    rankedCommands,
    revealedRawCommands,
    showCatalogSections,
    showRankedGroup
  ]);
  useEffect(() => {
    if (!open || visibleCommandNames.length === 0) {
      return;
    }
    const newlyShownCommands = [];
    for (const commandName of visibleCommandNames) {
      const commandToken = normalizeCommandToken$1(commandName);
      if (!commandToken || shownCommandTokensRef.current.has(commandToken)) {
        continue;
      }
      shownCommandTokensRef.current.add(commandToken);
      newlyShownCommands.push(commandName);
    }
    if (newlyShownCommands.length > 0) {
      trackCommandShownEvents(newlyShownCommands);
    }
  }, [open, visibleCommandNames]);
  const handleTrackedSelect = (commandName) => {
    trackCommandTelemetryEvent("clicked", commandName);
    onSelect(commandName);
  };
  return /* @__PURE__ */ jsx(
    Command.Dialog,
    {
      open,
      onOpenChange,
      shouldFilter: false,
      className: "fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b border-white/10 px-4", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-white/50" }),
          /* @__PURE__ */ jsx(
            Command.Input,
            {
              "aria-label": "Tìm kiếm command",
              placeholder: "Tìm kiếm lệnh...",
              value: search,
              onValueChange: setSearch,
              className: "flex-1 bg-transparent border-0 px-4 py-4 text-white placeholder:text-white/50 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsx("kbd", { className: "px-2 py-1 bg-white/10 rounded text-xs text-white/50", children: "ESC" })
        ] }),
        /* @__PURE__ */ jsxs(Command.List, { className: "max-h-[400px] overflow-y-auto p-2", children: [
          !showRankedGroup && !hasCatalogMatches && /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-white/50", children: "Không tìm thấy lệnh nào. Thử tìm kiếm khác." }),
          showRankedGroup && /* @__PURE__ */ jsxs(Command.Group, { heading: "Gợi ý theo intent (curated)", className: "px-2 py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IconBolt, { className: "w-3 h-3" }),
              " ƯU TIÊN THEO NGỮ CẢNH"
            ] }),
            rankedCommands.map((match, idx) => {
              const confidence = `${Math.round(Math.min(match.score / 5, 1) * 100)}%`;
              const isEngineer = match.command.category.toLowerCase().includes("engineer");
              const source = sourceByCommandToken.get(normalizeCommandToken$1(match.command.id)) ?? sourceByCommandToken.get(normalizeCommandToken$1(match.command.name));
              const accentClass = isEngineer ? "data-[selected=true]:bg-blue-500/20 data-[selected=true]:border-blue-500/30" : "data-[selected=true]:bg-purple-500/20 data-[selected=true]:border-purple-500/30";
              return /* @__PURE__ */ jsxs(
                Command.Item,
                {
                  value: `${match.command.name} ${match.reason}`,
                  onSelect: () => handleTrackedSelect(match.command.name),
                  className: `flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 data-[selected=true]:border ${accentClass}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: match.command.complexity }).map((_, i) => /* @__PURE__ */ jsx(IconBolt, { className: "w-3 h-3 text-yellow-500" }, i)) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("code", { className: isEngineer ? "text-blue-400 font-mono text-sm" : "text-purple-400 font-mono text-sm", children: match.command.name }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide text-white/50", children: match.command.category }),
                        idx === 0 && /* @__PURE__ */ jsx("span", { className: "text-[10px] rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300", children: "Top" })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/50 mt-0.5 truncate", children: [
                        match.reason,
                        " (",
                        confidence,
                        ")"
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/45 mt-0.5 truncate", children: [
                        "Tác dụng: ",
                        match.command.description
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/45 mt-0.5 truncate", children: [
                        "Nguồn: ",
                        source ? `${source.sourceRepo} • ${toCompactSourcePath(source.sourcePath)}` : "curated local catalog"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-white/40" })
                  ]
                },
                `ranked-${match.command.id}`
              );
            })
          ] }),
          revealedRawCommands.length > 0 && /* @__PURE__ */ jsxs(Command.Group, { heading: "Mở rộng từ full catalog", className: "px-2 py-2 mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-amber-300 font-medium mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IconBolt, { className: "w-3 h-3" }),
              " RAW REVEAL (KIỂM SOÁT)"
            ] }),
            revealedRawCommands.map((match) => /* @__PURE__ */ jsxs(
              Command.Item,
              {
                value: `${match.command.name} ${match.reason} ${match.sourceRepo}`,
                onSelect: () => handleTrackedSelect(match.command.name),
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 data-[selected=true]:bg-amber-500/20 data-[selected=true]:border data-[selected=true]:border-amber-500/30",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: match.command.complexity }).map((_, i) => /* @__PURE__ */ jsx(IconBolt, { className: "w-3 h-3 text-amber-400" }, i)) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("code", { className: "text-amber-300 font-mono text-sm", children: match.command.name }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide text-white/50", children: match.command.category }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-white/70", children: match.sourceKind })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-white/50 mt-0.5 truncate", children: [
                      match.reason,
                      " • ",
                      match.sourceRepo
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/45 mt-0.5 truncate", children: [
                      "Tác dụng: ",
                      match.command.description
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/45 mt-0.5 truncate", children: [
                      "Nguồn: ",
                      toCompactSourcePath(match.sourcePath)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-white/40" })
                ]
              },
              `raw-${match.command.id}`
            ))
          ] }),
          isIntentQuery && !shouldRevealRaw && interactionCount < 3 && /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-[11px] text-white/45", children: "3 lượt chat đầu chỉ hiển thị curated để tránh ngợp command." }),
          isIntentQuery && !showRankedGroup && /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-[11px] text-white/45", children: 'Chưa nhận diện rõ intent. Mô tả theo mẫu: "mục tiêu + ngữ cảnh + ràng buộc".' }),
          showCatalogSections && /* @__PURE__ */ jsxs(Command.Group, { heading: "Engineer Kit", className: "px-2 py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-blue-400 font-medium mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Wrench, { className: "w-3 h-3" }),
              " KỸ SƯ"
            ] }),
            engineerCmds.map((cmd) => /* @__PURE__ */ jsxs(
              Command.Item,
              {
                value: cmd.name,
                onSelect: () => handleTrackedSelect(cmd.name),
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 data-[selected=true]:bg-blue-500/20 data-[selected=true]:border data-[selected=true]:border-blue-500/30",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: cmd.complexity }).map((_, i) => /* @__PURE__ */ jsx(IconBolt, { className: "w-3 h-3 text-yellow-500" }, i)) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("code", { className: "text-blue-400 font-mono text-sm", children: cmd.name }),
                      /* @__PURE__ */ jsx(IconTool, { className: "w-3 h-3 text-blue-400" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-white/50 mt-0.5 truncate", children: cmd.description })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-white/40" })
                ]
              },
              cmd.id
            ))
          ] }),
          showCatalogSections && /* @__PURE__ */ jsxs(Command.Group, { heading: "Marketing Kit", className: "px-2 py-2 mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-purple-400 font-medium mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Megaphone, { className: "w-3 h-3" }),
              " MARKETING"
            ] }),
            marketingCmds.map((cmd) => /* @__PURE__ */ jsxs(
              Command.Item,
              {
                value: cmd.name,
                onSelect: () => handleTrackedSelect(cmd.name),
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 data-[selected=true]:bg-purple-500/20 data-[selected=true]:border data-[selected=true]:border-purple-500/30",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: cmd.complexity }).map((_, i) => /* @__PURE__ */ jsx(IconBolt, { className: "w-3 h-3 text-yellow-500" }, i)) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("code", { className: "text-purple-400 font-mono text-sm", children: cmd.name }),
                      /* @__PURE__ */ jsx(IconSpeaker, { className: "w-3 h-3 text-purple-400" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-white/50 mt-0.5 truncate", children: cmd.description })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-white/40" })
                ]
              },
              cmd.id
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-white/5 border-t border-white/10 text-xs text-white/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("kbd", { className: "px-1 bg-white/10 rounded", children: "↑↓" }),
              " để di chuyển"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("kbd", { className: "px-1 bg-white/10 rounded", children: "↵" }),
              " để chọn"
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { children: showRankedGroup ? `${rankedCommands.length} curated + ${revealedRawCommands.length} raw (${rawDiscoveredCommandCount} raw total)` : `${totalCommands} lệnh curated có sẵn` })
        ] })
      ] })
    }
  );
};

const ChatInput = ({
  value = "",
  onChange = () => {
  },
  onSend = () => {
  },
  onCommandPaletteOpen = () => {
  },
  commandSuggestion = null,
  onApplyCommandSuggestion = () => {
  },
  onOpenGuide = () => {
  },
  onEscape = () => {
  },
  isStreaming = false,
  placeholder
}) => {
  const { t } = useBilingualLanguageToggleState();
  const textareaRef = useRef(null);
  const onCommandPaletteOpenRef = useRef(onCommandPaletteOpen);
  const effectivePlaceholder = placeholder ?? t("chat.input.placeholder", "Type / for commands or ask anything...");
  useEffect(() => {
    onCommandPaletteOpenRef.current = onCommandPaletteOpen;
  }, [onCommandPaletteOpen]);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);
  useEffect(() => {
    if (value === "/") {
      onCommandPaletteOpenRef.current();
    }
  }, [value]);
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onEscape();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      onCommandPaletteOpen();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isStreaming) {
        onSend();
      }
    }
  };
  const handleSend = (e) => {
    e.preventDefault();
    if (value.trim() && !isStreaming) {
      onSend();
    }
  };
  const shouldShowSuggestion = !!commandSuggestion && value.trim().length > 0 && !value.trim().startsWith("/") && !isStreaming;
  const confidenceLabel = commandSuggestion ? `${Math.round(Math.max(0, Math.min(1, commandSuggestion.confidence)) * 100)}%` : "";
  return /* @__PURE__ */ jsx(
    "form",
    {
      onSubmit: handleSend,
      "data-testid": "chat-form",
      className: "safe-bottom-pad sticky bottom-0 z-40 border-t border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_88%,transparent)] px-4 py-4 backdrop-blur-xl sm:px-8 md:px-10",
      role: "form",
      "aria-label": t("chat.input.form", "Chat input"),
      children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-[768px]", children: [
        shouldShowSuggestion && commandSuggestion && /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--app-surface))] px-4 py-3 shadow-[var(--app-shadow-soft)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--app-text)]", children: [
              commandSuggestion.recommendationType === "workflow" ? t("chat.suggestion.workflow", "Suggested workflow") : t("chat.suggestion.command", "Suggested command"),
              ":",
              " ",
              /* @__PURE__ */ jsx("code", { className: "font-semibold text-[var(--accent)]", children: commandSuggestion.command }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-[var(--app-text-muted)]", children: [
                "(",
                confidenceLabel,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "truncate text-[11px] text-[var(--app-text-muted)]", children: [
              commandSuggestion.reason,
              commandSuggestion.workflowName ? ` • ${commandSuggestion.workflowName}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onApplyCommandSuggestion(commandSuggestion.command),
                className: "min-h-11 rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] px-2 py-1 text-[11px] text-[var(--app-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_24%,var(--app-surface))]",
                children: t("chat.suggestion.apply-command", "Insert command")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onOpenGuide,
                className: "min-h-11 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-[11px] text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]",
                children: t("chat.suggestion.open-guide", "Open guide")
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onCommandPaletteOpen,
              disabled: isStreaming,
              "aria-label": t("chat.input.palette-button", "Open command palette"),
              className: "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)] disabled:cursor-not-allowed disabled:opacity-50",
              title: "Lệnh (⌘K)",
              children: /* @__PURE__ */ jsx(Command$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                ref: textareaRef,
                "data-testid": "chat-input-textarea",
                value,
                onChange: (e) => onChange(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: isStreaming ? t("chat.input.placeholder-loading", "Waiting for response...") : effectivePlaceholder,
                disabled: isStreaming,
                "aria-label": t("chat.input.textarea-label", "Message input"),
                className: "w-full min-h-[52px] max-h-[200px] resize-none rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 pr-12 text-[15px] leading-6 text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] transition-[height,border-color,box-shadow] duration-200 focus:border-[color-mix(in_srgb,var(--accent)_50%,var(--app-border))] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50",
                rows: 1
              }
            ),
            value.startsWith("/") && !isStreaming && /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3.5", children: /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--app-surface))] px-2 py-0.5 text-xs text-[var(--accent)]", children: t("chat.input.command", "Command") }) }),
            isStreaming && /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3.5", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-xs text-[var(--app-text-muted)]", children: [
              /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" }),
              t("chat.input.sending", "Sending...")
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              "data-testid": "chat-submit-button",
              "aria-label": isStreaming ? t("chat.input.stop", "Stop response") : t("chat.input.send", "Send message"),
              disabled: !value.trim() || isStreaming,
              className: "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] text-[var(--app-text)] shadow-[var(--app-shadow-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_25%,var(--app-surface))] disabled:cursor-not-allowed disabled:opacity-45",
              children: isStreaming ? /* @__PURE__ */ jsx(Square, { className: "w-5 h-5 fill-current" }) : /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-center gap-4 text-xs text-[var(--app-text-muted)]", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("kbd", { className: "rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-1.5 py-0.5", children: "/" }),
            /* @__PURE__ */ jsx("span", { children: t("chat.input.hint.commands", "for commands") })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("kbd", { className: "rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-1.5 py-0.5", children: "⌘K" }),
            /* @__PURE__ */ jsx("span", { children: t("chat.input.hint.palette", "for palette") })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("kbd", { className: "rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-1.5 py-0.5", children: "↵" }),
            /* @__PURE__ */ jsx("span", { children: t("chat.input.hint.send", "to send") })
          ] })
        ] })
      ] })
    }
  );
};

const ChatHeader = ({
  apiStatus,
  onRefresh,
  onToggleHistory,
  onNewChat,
  showHistory
}) => {
  const { t } = useBilingualLanguageToggleState();
  return /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_92%,transparent)] px-4 py-4 backdrop-blur-xl sm:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] shadow-[var(--app-shadow-soft)]", children: /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5 text-[var(--accent)]" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-[15px] font-semibold text-[var(--app-text)]", children: t("chat.title", "ClaudeKit Chat") }),
        /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[13px] text-[var(--app-text-muted)]", children: [
          apiStatus === "checking" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" }),
            t("chat.status.checking", "Connecting...")
          ] }),
          apiStatus === "ready" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            t("chat.status.ready", "AI assistant is online")
          ] }),
          apiStatus === "error" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-red-500" }),
            t("chat.status.error", "API connection error")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      apiStatus === "error" && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onRefresh,
          className: "flex min-h-11 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
          title: t("chat.refresh", "Refresh"),
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: t("chat.refresh", "Refresh") })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onToggleHistory,
          className: "flex min-h-11 items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]",
          children: [
            /* @__PURE__ */ jsx(History, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("chat.history", "History") })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onNewChat,
          className: "flex min-h-11 items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] px-3 py-2 text-sm font-medium text-[var(--app-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_22%,var(--app-surface))]",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("chat.new-chat", "New conversation") })
          ]
        }
      )
    ] })
  ] });
};

const ErrorBannerWithRetry = ({
  message,
  onRetry,
  onDismiss,
  type = "unknown",
  isRetrying = false
}) => {
  const typeConfig = {
    network: { color: "orange", label: "Lỗi kết nối" },
    server: { color: "red", label: "Lỗi máy chủ" },
    unknown: { color: "red", label: "Đã xảy ra lỗi" }
  };
  const config = typeConfig[type];
  return /* @__PURE__ */ jsx("div", { className: "border-b border-rose-300/60 bg-rose-50/90 p-4 dark:border-rose-900/60 dark:bg-rose-950/30", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 flex-shrink-0 text-rose-500 dark:text-rose-300" }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-rose-700 dark:text-rose-200", children: config.label }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-rose-600/90 dark:text-rose-300/90", children: message }),
      onRetry && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onRetry,
          disabled: isRetrying,
          className: "mt-3 flex min-h-11 items-center gap-2 rounded-lg border border-rose-300/70 bg-rose-100 px-3 py-1.5 text-sm text-rose-700 transition-colors hover:bg-rose-200 disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/60",
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isRetrying ? "animate-spin" : ""}` }),
            isRetrying ? "Đang thử lại..." : "Thử lại"
          ]
        }
      )
    ] }),
    onDismiss && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onDismiss,
        className: "flex min-h-11 min-w-11 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/60",
        "aria-label": "Đóng",
        children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
      }
    )
  ] }) });
};

const ScrollToBottomButton = ({
  onClick,
  unreadCount,
  isVisible
}) => {
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: "absolute bottom-5 right-5 z-30 flex min-h-11 items-center gap-2 rounded-full border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_90%,transparent)] px-4 py-2 text-[var(--app-text)] shadow-[var(--app-shadow-soft)] backdrop-blur-xl transition-colors hover:bg-[var(--app-surface-muted)]",
      "aria-label": "Cuộn xuống dưới",
      children: [
        /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Xuống dưới" }),
        unreadCount && unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-xs font-medium text-white", children: unreadCount })
      ]
    }
  );
};

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Không rõ thời gian";
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Không rõ thời gian";
  const now = Date.now();
  const diffMs = now - date.getTime();
  const minute = 60 * 1e3;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < minute) return "Vừa xong";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}
const HistoryPanelWireframe = ({
  isOpen,
  onClose,
  onNewChat,
  sessions,
  activeSessionId,
  onSelectSession,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredSessions = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sessions;
    return sessions.filter((session) => session.title.toLowerCase().includes(query));
  }, [sessions, searchTerm]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden",
        onClick: onClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs("aside", { className: "absolute right-0 top-0 z-50 flex h-full w-full max-w-[360px] flex-col border-l border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_92%,transparent)] shadow-[var(--app-shadow)] backdrop-blur-xl transition-transform duration-300 ease-out", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[var(--app-border)] p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[var(--app-text)]", children: "Lịch sử trò chuyện" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]",
            "aria-label": "Đóng",
            children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onNewChat,
          className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))] px-4 py-3 font-medium text-[var(--app-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_24%,var(--app-surface))]",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Cuộc trò chuyện mới" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-text-muted)]" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Tìm kiếm cuộc trò chuyện...",
            value: searchTerm,
            onChange: (event) => setSearchTerm(event.target.value),
            className: "min-h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] py-2 pl-10 pr-4 text-sm text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,var(--app-border))] focus:outline-none"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-4 pb-4", children: [
        isLoading && /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-sm text-[var(--app-text-muted)]", children: "Đang tải lịch sử..." }),
        !isLoading && filteredSessions.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-sm text-[var(--app-text-muted)]", children: sessions.length === 0 ? "Chưa có cuộc trò chuyện nào" : "Không tìm thấy cuộc trò chuyện" }),
        !isLoading && filteredSessions.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredSessions.map((conversation) => {
          const isActive = activeSessionId === conversation.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => onSelectSession(conversation.id),
              className: `group flex min-h-11 w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${isActive ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_16%,var(--app-surface))]" : "border-transparent bg-[var(--app-surface)] hover:border-[var(--app-border)] hover:bg-[var(--app-surface-muted)]"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: `rounded-lg border p-2 ${isActive ? "border-[color-mix(in_srgb,var(--accent)_30%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--app-surface))]" : "border-[var(--app-border)] bg-[var(--app-surface-muted)]"}`, children: /* @__PURE__ */ jsx(MessageSquare, { className: `h-4 w-4 ${isActive ? "text-[var(--accent)]" : "text-[var(--app-text-muted)]"}` }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("h3", { className: `truncate text-sm font-medium ${isActive ? "text-[var(--app-text)]" : "text-[var(--app-text)]"}`, children: conversation.title || "Cuộc trò chuyện chưa có tiêu đề" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2 text-[13px] text-[var(--app-text-muted)]", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                    /* @__PURE__ */ jsx("span", { children: formatRelativeTime(conversation.updatedAt ?? conversation.createdAt) }),
                    typeof conversation.messageCount === "number" && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        conversation.messageCount,
                        " tin nhắn"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { className: `h-4 w-4 flex-shrink-0 ${isActive ? "text-[var(--accent)]" : "text-[var(--app-text-muted)] group-hover:text-[var(--app-text)]"}` })
              ]
            },
            conversation.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--app-border)] bg-[var(--app-surface)] p-4", children: /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-[var(--app-text-muted)]", children: "Dữ liệu lịch sử được tải từ phiên chat đã lưu" }) })
    ] })
  ] });
};

const DEFAULT_GAP = 28;
const DEFAULT_OVERSCAN = 5;
const DEFAULT_ESTIMATE_ROW_HEIGHT = 132;
const NEAR_BOTTOM_THRESHOLD = 180;
const VirtualizedChatMessageList = forwardRef(function VirtualizedChatMessageList2({
  messages,
  renderMessage,
  className,
  gap = DEFAULT_GAP,
  overscan = DEFAULT_OVERSCAN,
  estimateRowHeight = DEFAULT_ESTIMATE_ROW_HEIGHT,
  onNearBottomChange
}, ref) {
  const containerRef = useRef(null);
  const nearBottomRef = useRef(true);
  const previousMessageCountRef = useRef(messages.length);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);
  const [rowHeights, setRowHeights] = useState({});
  const rows = useMemo(() => {
    const positions = [];
    let currentTop = 0;
    for (let index = 0; index < messages.length; index += 1) {
      const message = messages[index];
      positions[index] = currentTop;
      const rowHeight = rowHeights[message.id] ?? estimateRowHeight;
      currentTop += rowHeight + gap;
    }
    const totalHeight = messages.length > 0 ? Math.max(0, currentTop - gap) : 0;
    return { positions, totalHeight };
  }, [messages, rowHeights, estimateRowHeight, gap]);
  const updateViewportHeight = useCallback(() => {
    if (!containerRef.current) return;
    setViewportHeight(containerRef.current.clientHeight || 1);
  }, []);
  const scrollToBottom = useCallback((behavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      scrollToBottom
    }),
    [scrollToBottom]
  );
  useEffect(() => {
    updateViewportHeight();
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => updateViewportHeight());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [updateViewportHeight]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    const isNearBottom = distanceToBottom <= NEAR_BOTTOM_THRESHOLD;
    if (nearBottomRef.current !== isNearBottom) {
      nearBottomRef.current = isNearBottom;
      onNearBottomChange?.(isNearBottom);
    }
  }, [messages.length, rows.totalHeight, onNearBottomChange]);
  useEffect(() => {
    const currentCount = messages.length;
    if (currentCount > previousMessageCountRef.current && nearBottomRef.current) {
      scrollToBottom("smooth");
    }
    previousMessageCountRef.current = currentCount;
  }, [messages.length, scrollToBottom]);
  const startIndex = useMemo(() => {
    const target = Math.max(0, scrollTop - gap * 2);
    let index = 0;
    while (index < rows.positions.length && rows.positions[index] < target) {
      index += 1;
    }
    return Math.max(0, index - overscan);
  }, [scrollTop, rows.positions, overscan, gap]);
  const endIndex = useMemo(() => {
    const target = scrollTop + viewportHeight + gap * 2;
    let index = startIndex;
    while (index < rows.positions.length && rows.positions[index] < target) {
      index += 1;
    }
    return Math.min(messages.length - 1, index + overscan);
  }, [scrollTop, viewportHeight, rows.positions, startIndex, overscan, messages.length, gap]);
  const handleScroll = (event) => {
    const container = event.currentTarget;
    setScrollTop(container.scrollTop);
    const distanceToBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    const isNearBottom = distanceToBottom <= NEAR_BOTTOM_THRESHOLD;
    if (nearBottomRef.current !== isNearBottom) {
      nearBottomRef.current = isNearBottom;
      onNearBottomChange?.(isNearBottom);
    }
  };
  const handleRowHeightChange = useCallback((messageId, nextHeight) => {
    if (nextHeight <= 0) return;
    setRowHeights((previous) => {
      if (previous[messageId] === nextHeight) {
        return previous;
      }
      return { ...previous, [messageId]: nextHeight };
    });
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, onScroll: handleScroll, className, children: /* @__PURE__ */ jsx("div", { style: { height: `${rows.totalHeight}px`, position: "relative" }, children: messages.slice(startIndex, endIndex + 1).map((message, relativeIndex) => {
    const absoluteIndex = startIndex + relativeIndex;
    return /* @__PURE__ */ jsx(
      MeasuredRow,
      {
        top: rows.positions[absoluteIndex],
        onHeightChange: (height) => handleRowHeightChange(message.id, height),
        children: renderMessage(message)
      },
      message.id
    );
  }) }) });
});
function MeasuredRow({ top, onHeightChange, children }) {
  const rowRef = useRef(null);
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => onHeightChange(Math.ceil(row.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [onHeightChange]);
  return /* @__PURE__ */ jsx("div", { ref: rowRef, style: { position: "absolute", top: `${top}px`, left: 0, right: 0 }, children });
}

const EmptyStateWithSuggestions = ({
  onSuggestionClick,
  onCommandPaletteOpen
}) => {
  const { t, isEnglish } = useBilingualLanguageToggleState();
  const quickSuggestions = [
    {
      icon: Code,
      label: t("chat.empty.write-code", "Write code"),
      text: isEnglish ? "Write a JavaScript function to..." : "Viết một hàm JavaScript để..."
    },
    {
      icon: BookOpen,
      label: t("chat.empty.explain", "Explain"),
      text: isEnglish ? "Explain this concept..." : "Giải thích khái niệm..."
    },
    {
      icon: Bug,
      label: t("chat.empty.debug", "Debug issue"),
      text: isEnglish ? "Help me fix this issue..." : "Giúp tôi sửa lỗi này..."
    },
    {
      icon: Zap,
      label: t("chat.empty.quick-command", "Quick command"),
      text: "/"
    }
  ];
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.text === "/") {
      onCommandPaletteOpen();
    } else {
      onSuggestionClick(suggestion.text);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center px-4 py-8 sm:px-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[768px] rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow-soft)] md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-7 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--accent)]", children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-2 text-xl font-semibold text-[var(--app-text)]", children: t("chat.empty.title", "Start a new conversation") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-6 text-[var(--app-text-muted)]", children: t("chat.empty.subtitle", "Pick a suggestion below or type your own question") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4", children: quickSuggestions.map((suggestion) => {
      const Icon = suggestion.icon;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSuggestionClick(suggestion),
          className: `
                  group flex min-h-11 flex-col items-center gap-2 rounded-xl border border-[var(--app-border)]
                  bg-[var(--app-surface-muted)] p-4 text-center
                  transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--app-border))]
                  hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--app-surface-muted))]
                  group
                `,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[var(--accent)]" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[var(--app-text-muted)] group-hover:text-[var(--app-text)]", children: suggestion.label })
          ]
        },
        suggestion.label
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 text-xs text-[var(--app-text-muted)]", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("kbd", { className: "rounded border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-1.5 py-0.5 text-[var(--app-text-muted)]", children: "/" }),
        /* @__PURE__ */ jsx("span", { children: t("chat.input.hint.commands", "for commands") })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("kbd", { className: "rounded border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-1.5 py-0.5 text-[var(--app-text-muted)]", children: "⌘K" }),
        /* @__PURE__ */ jsx("span", { children: t("chat.input.hint.palette", "for palette") })
      ] })
    ] })
  ] }) });
};

const workflows = [
  // Engineer Workflows
  {
    id: "new-feature",
    name: "New Feature Development",
    description: "Complete workflow for implementing a new feature from planning to shipping",
    kit: "engineer",
    difficulty: "Intermediate",
    timeEstimate: "2-4 hours",
    useCases: ["Add authentication", "Build dashboard", "Implement API"],
    keywords: ["feature", "implement", "add", "build", "tạo", "phát triển"],
    steps: [
      {
        step: 1,
        command: "/ck:plan",
        description: "Tạo implementation plan với research",
        flags: ["--auto"],
        note: "Có thể dùng --fast cho plan nhanh"
      },
      {
        step: 2,
        command: "/clear",
        description: "Xóa context trước khi cook",
        required: true,
        gateway: true,
        note: "BẮT BUỘC - Tiết kiệm token"
      },
      {
        step: 3,
        command: "/ck:cook",
        description: "Implement theo plan đã tạo",
        flags: ["--auto"],
        note: "Luôn dùng /cook sau /plan"
      },
      {
        step: 4,
        command: "/ck:test",
        description: "Chạy tests và kiểm tra",
        note: "Tự động detect test framework"
      },
      {
        step: 5,
        command: "/ck:code-review",
        description: "Review code với reviewer agent",
        flags: ["--pending"],
        note: "Hoặc dùng /ck:ship để auto"
      },
      {
        step: 6,
        command: "/ck:git:cp",
        description: "Commit và push changes",
        note: "Stage + commit + push"
      }
    ]
  },
  {
    id: "bootstrap-project",
    name: "New Project Bootstrap",
    description: "Khởi tạo project mới từ zero với CI/CD",
    kit: "engineer",
    difficulty: "Beginner",
    timeEstimate: "30-60 phút",
    useCases: ["New SaaS", "New web app", "Khởi tạo dự án"],
    keywords: ["bootstrap", "new project", "khởi tạo", "init", "scaffold"],
    steps: [
      {
        step: 1,
        command: "/ck:bootstrap",
        description: "Bootstrap project với tất cả config",
        flags: ["--auto"],
        note: "Tự động setup CI/CD, linting"
      },
      {
        step: 2,
        command: "/ck:docs:init",
        description: "Khởi tạo documentation",
        note: "Tạo docs/ structure"
      },
      {
        step: 3,
        command: "/ck:git:cm",
        description: "Initial commit",
        note: "Commit setup files"
      }
    ]
  },
  {
    id: "bug-fix",
    name: "Bug Fix & Debug",
    description: "Workflow xử lý lỗi từ detect đến fix",
    kit: "engineer",
    difficulty: "Beginner",
    timeEstimate: "15-45 phút",
    useCases: ["Fix TypeScript errors", "Debug UI", "Fix tests"],
    keywords: ["fix", "debug", "sửa lỗi", "bug", "error"],
    steps: [
      {
        step: 1,
        command: "/ck:scout",
        description: "Scout codebase tìm vấn đề",
        note: "Tìm files liên quan"
      },
      {
        step: 2,
        command: "/ck:fix",
        description: "Auto-detect và fix issues",
        flags: ["--auto"],
        note: "Routing thông minh đến fix phù hợp"
      },
      {
        step: 3,
        command: "/ck:test",
        description: "Verify fixes",
        note: "Chạy tests để confirm"
      },
      {
        step: 4,
        command: "/ck:git:cp",
        description: "Commit fixes",
        note: "Nhanh gọn"
      }
    ]
  },
  {
    id: "ship-release",
    name: "Ship to Production",
    description: "Complete shipping pipeline từ PR đến deploy",
    kit: "engineer",
    difficulty: "Advanced",
    timeEstimate: "1-2 hours",
    useCases: ["Release feature", "Deploy to prod", "Launch"],
    keywords: ["ship", "deploy", "release", "launch", "production"],
    steps: [
      {
        step: 1,
        command: "/ck:test",
        description: "Final test run",
        flags: ["ui"],
        note: "Test cả UI nếu có"
      },
      {
        step: 2,
        command: "/ck:code-review",
        description: "Final code review",
        flags: ["codebase"],
        note: "Review toàn bộ codebase"
      },
      {
        step: 3,
        command: "/ck:ship",
        description: "Run shipping pipeline",
        flags: ["official"],
        gateway: true,
        note: "Yêu cầu approval"
      },
      {
        step: 4,
        command: "/ck:deploy",
        description: "Deploy đến production",
        note: "Vercel/Railway/Fly.io"
      }
    ]
  },
  {
    id: "refactor-code",
    name: "Code Refactoring",
    description: "Refactor codebase với safety checks",
    kit: "engineer",
    difficulty: "Advanced",
    timeEstimate: "2-6 hours",
    useCases: ["Refactor legacy", "Improve architecture", "Clean code"],
    keywords: ["refactor", "clean code", "improve", "optimize"],
    steps: [
      {
        step: 1,
        command: "/ck:scout",
        description: "Analyze codebase structure",
        note: "Tìm files cần refactor"
      },
      {
        step: 2,
        command: "/ck:plan",
        description: "Lập kế hoạch refactor",
        flags: ["--hard"],
        note: "Deep planning cho complex changes"
      },
      {
        step: 3,
        command: "/clear",
        description: "Clear context",
        required: true,
        gateway: true
      },
      {
        step: 4,
        command: "/ck:cook",
        description: "Execute refactor plan",
        flags: ["--auto"]
      },
      {
        step: 5,
        command: "/ck:test",
        description: "Verify all tests pass",
        note: "CRITICAL - Không skip"
      },
      {
        step: 6,
        command: "/ck:git:cp",
        description: "Commit refactoring"
      }
    ]
  },
  // Marketing Workflows
  {
    id: "content-creation",
    name: "Content Creation Pipeline",
    description: "Tạo content chất lượng cao từ brainstorm đến publish",
    kit: "marketing",
    difficulty: "Intermediate",
    timeEstimate: "1-2 hours",
    useCases: ["Blog post", "Landing page", "Email sequence"],
    keywords: ["content", "write", "blog", "viết", "content marketing"],
    steps: [
      {
        step: 1,
        command: "/seo/keywords",
        description: "Nghiên cứu keywords",
        note: "Tìm keywords phù hợp"
      },
      {
        step: 2,
        command: "/plan",
        description: "Lập outline content",
        flags: ["--fast"]
      },
      {
        step: 3,
        command: "/content/good",
        description: "Viết content chất lượng cao",
        note: "Full checks và optimization"
      },
      {
        step: 4,
        command: "/content/cro",
        description: "Optimize cho conversion",
        note: "CRO best practices"
      },
      {
        step: 5,
        command: "/write/audit",
        description: "Audit content quality",
        note: "Auto-trigger sau write"
      },
      {
        step: 6,
        command: "/git:cm",
        description: "Save content"
      }
    ]
  },
  {
    id: "campaign-launch",
    name: "Marketing Campaign Launch",
    description: "Orchestrate full marketing campaign từ A-Z",
    kit: "marketing",
    difficulty: "Advanced",
    timeEstimate: "4-8 hours",
    useCases: ["Product launch", "Black Friday", "Q1 campaign"],
    keywords: ["campaign", "launch", "marketing", "chiến dịch", "ra mắt"],
    steps: [
      {
        step: 1,
        command: "/brainstorm",
        description: "Brainstorm campaign ideas",
        note: "Creative ideation"
      },
      {
        step: 2,
        command: "/campaign/create",
        description: "Tạo campaign structure",
        note: "Setup campaign folder"
      },
      {
        step: 3,
        command: "/funnel",
        description: "Design conversion funnel",
        note: "Landing → Email → Sale"
      },
      {
        step: 4,
        command: "/design/good",
        description: "Create campaign visuals",
        note: "Hero images, banners"
      },
      {
        step: 5,
        command: "/email/sequence",
        description: "Tạo email sequence",
        note: "Nurture + sales emails"
      },
      {
        step: 6,
        command: "/social",
        description: "Generate social content",
        flags: ["twitter", "linkedin", "instagram"],
        note: "Multi-platform content"
      },
      {
        step: 7,
        command: "/social/schedule",
        description: "Schedule posts",
        flags: ["week"],
        note: "Tự động publish"
      },
      {
        step: 8,
        command: "/campaign/analyze",
        description: "Track performance",
        note: "Ongoing monitoring"
      }
    ]
  },
  {
    id: "seo-content",
    name: "SEO Content Workflow",
    description: "Tạo SEO-optimized content ranking cao",
    kit: "marketing",
    difficulty: "Intermediate",
    timeEstimate: "2-3 hours",
    useCases: ["SEO blog post", "PSEO pages", "Content marketing"],
    keywords: ["seo", "content", "blog", "ranking", "keywords"],
    steps: [
      {
        step: 1,
        command: "/seo/keywords",
        description: "Keyword research",
        note: "Tìm long-tail keywords"
      },
      {
        step: 2,
        command: "/content/blog",
        description: "Viết SEO blog post",
        note: "Optimized for keywords"
      },
      {
        step: 3,
        command: "/seo/optimize",
        description: "On-page SEO optimization",
        note: "Meta, headers, internal links"
      },
      {
        step: 4,
        command: "/seo/schema",
        description: "Add JSON+LD schema",
        note: "Rich snippets"
      },
      {
        step: 5,
        command: "/content/cro",
        description: "Optimize conversion",
        note: "CTAs, readability"
      }
    ]
  },
  {
    id: "video-production",
    name: "Video Production Pipeline",
    description: "Tạo video chuyên nghiệp từ script đến publish",
    kit: "marketing",
    difficulty: "Advanced",
    timeEstimate: "4-6 hours",
    useCases: ["Product demo", "Tutorial video", "YouTube content"],
    keywords: ["video", "youtube", "script", "demo", "production"],
    steps: [
      {
        step: 1,
        command: "/video/script/create",
        description: "Viết video script",
        note: "Hook → Problem → Solution → CTA"
      },
      {
        step: 2,
        command: "/video/storyboard/create",
        description: "Create storyboard",
        note: "Visual planning"
      },
      {
        step: 3,
        command: "/design/generate",
        description: "Generate thumbnail",
        note: "High CTR thumbnail"
      },
      {
        step: 4,
        command: "/video/create",
        description: "Produce video",
        note: "Edit với script"
      },
      {
        step: 5,
        command: "/social",
        description: "Repurpose for social",
        flags: ["youtube shorts", "tiktok"],
        note: "Multi-platform clips"
      }
    ]
  },
  {
    id: "design-creation",
    name: "Design Creation Workflow",
    description: "Tạo designs chất lượng cao với AI assistance",
    kit: "marketing",
    difficulty: "Intermediate",
    timeEstimate: "1-2 hours",
    useCases: ["Landing page design", "Marketing assets", "UI mockups"],
    keywords: ["design", "ui", "mockup", "figma", "creative"],
    steps: [
      {
        step: 1,
        command: "/design/good",
        description: "Create immersive design",
        note: "Detailed design specs"
      },
      {
        step: 2,
        command: "/design/generate",
        description: "Generate AI images",
        note: "Images for design"
      },
      {
        step: 3,
        command: "/design/screenshot",
        description: "Verify design implementation",
        note: "So sánh với mockup"
      },
      {
        step: 4,
        command: "/content/cro",
        description: "Optimize for conversion",
        note: "Design audit"
      }
    ]
  },
  // Hybrid Workflows
  {
    id: "fullstack-feature",
    name: "Full-Stack Feature (Engineer + Marketing)",
    description: "Implement feature với cả code và marketing materials",
    kit: "both",
    difficulty: "Advanced",
    timeEstimate: "4-8 hours",
    useCases: ["New feature launch", "Product update", "Major release"],
    keywords: ["fullstack", "feature", "launch", "complete"],
    steps: [
      {
        step: 1,
        command: "/ck:plan",
        description: "Plan technical implementation",
        flags: ["--hard"]
      },
      {
        step: 2,
        command: "/plan",
        description: "Plan marketing strategy",
        note: "Song song với tech plan"
      },
      {
        step: 3,
        command: "/clear",
        description: "Clear context",
        required: true,
        gateway: true
      },
      {
        step: 4,
        command: "/ck:cook",
        description: "Implement feature",
        flags: ["--auto"]
      },
      {
        step: 5,
        command: "/design/good",
        description: "Create feature UI/marketing",
        note: "Screenshots, mockups"
      },
      {
        step: 6,
        command: "/content/good",
        description: "Write announcement content",
        note: "Blog post, changelog"
      },
      {
        step: 7,
        command: "/ck:test",
        description: "Test implementation"
      },
      {
        step: 8,
        command: "/social",
        description: "Create social announcement",
        note: "Multi-platform"
      },
      {
        step: 9,
        command: "/ck:ship",
        description: "Ship feature",
        flags: ["official"]
      }
    ]
  },
  {
    id: "quick-fix",
    name: "Quick Fix & Patch",
    description: "Fast workflow cho small fixes",
    kit: "engineer",
    difficulty: "Beginner",
    timeEstimate: "5-15 phút",
    useCases: ["Typo fix", "Small bug", "Quick update"],
    keywords: ["quick", "fast", "small", "typo", "minor"],
    steps: [
      {
        step: 1,
        command: "/ck:fix/fast",
        description: "Quick fix",
        note: "Không cần research"
      },
      {
        step: 2,
        command: "/ck:git:cp",
        description: "Commit và push",
        note: "Done!"
      }
    ]
  }
];
function findMatchingWorkflows(input) {
  const inputLower = input.toLowerCase();
  const matches = [];
  for (const workflow of workflows) {
    let score = 0;
    for (const keyword of workflow.keywords) {
      if (inputLower.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    for (const useCase of workflow.useCases) {
      if (inputLower.includes(useCase.toLowerCase())) {
        score += 3;
      }
    }
    if (inputLower.includes(workflow.id.replace(/-/g, " "))) {
      score += 5;
    }
    if (score > 0) {
      matches.push({ workflow, score });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.map((m) => m.workflow);
}
function needsWorkflow(input) {
  const complexIndicators = [
    "và",
    "then",
    "sau đó",
    "tiếp theo",
    "workflow",
    "quy trình",
    "sequence",
    "chuỗi",
    "multiple",
    "nhiều bước",
    "full",
    "complete",
    "từ đầu đến cuối",
    "end-to-end",
    "implement",
    "tạo mới",
    "launch",
    "release",
    "campaign"
  ];
  const inputLower = input.toLowerCase();
  return complexIndicators.some((indicator) => inputLower.includes(indicator));
}
function getPrimaryWorkflow(input) {
  const matches = findMatchingWorkflows(input);
  return matches[0] || null;
}

function analyzeTaskComplexity(input) {
  const inputLower = input.toLowerCase();
  const complexSignals = [
    "từ đầu",
    "end-to-end",
    "hoàn chỉnh",
    "complete",
    "full",
    "bootstrap",
    "khởi tạo",
    "launch",
    "ra mắt",
    "campaign",
    "chiến dịch",
    "workflow",
    "quy trình",
    "sequence",
    "nhiều bước"
  ];
  const mediumSignals = [
    "implement",
    "phát triển",
    "tạo",
    "build",
    "feature",
    "tính năng",
    "design",
    "thiết kế",
    "content",
    "nội dung"
  ];
  const hasComplex = complexSignals.some((s) => inputLower.includes(s));
  const hasMedium = mediumSignals.some((s) => inputLower.includes(s));
  if (hasComplex) {
    return {
      complexity: "complex",
      needsWorkflow: true,
      suggestedApproach: "Sử dụng workflow định nghĩa sẵn với nhiều bước"
    };
  }
  if (hasMedium) {
    return {
      complexity: "medium",
      needsWorkflow: false,
      suggestedApproach: "Sử dụng 1-2 lệnh chính có thể đủ"
    };
  }
  return {
    complexity: "simple",
    needsWorkflow: false,
    suggestedApproach: "Lệnh đơn giản như /fix hoặc /ask"
  };
}
function getSmartRecommendation(input, commands) {
  const analysis = analyzeTaskComplexity(input);
  if (analysis.needsWorkflow || needsWorkflow(input)) {
    const workflow = getPrimaryWorkflow(input);
    if (workflow) {
      return {
        type: "workflow",
        workflow,
        confidence: 0.85,
        reason: `Task phức tạp phù hợp với workflow "${workflow.name}" có ${workflow.steps.length} bước`
      };
    }
  }
  return null;
}

const BUILD_VERSION = "2026-04-14-001";
console.log("[Chat] Build version:", BUILD_VERSION);
function normalizeCommandToken(commandToken) {
  const trimmed = commandToken.trim();
  return trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
}
function resolveCommandName(commandToken) {
  const trimmed = commandToken.trim();
  const normalizedToken = normalizeCommandToken(trimmed);
  const matched = commands.find(
    (command) => command.id === normalizedToken || command.name === trimmed || command.name === `/${normalizedToken}`
  );
  if (matched) {
    return matched.name;
  }
  return trimmed.startsWith("/") ? trimmed : `/${normalizedToken}`;
}
function extractLeadingCommandToken(inputText) {
  const trimmed = inputText.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  const firstToken = trimmed.split(/\s+/)[0];
  return firstToken || null;
}
function formatMessageTimestamp(createdAt) {
  if (!createdAt) return void 0;
  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) return void 0;
  return parsedDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ChatFrameWithGlassmorphismAndVietnamese() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [commandOpen, setCommandOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorType, setErrorType] = useState("unknown");
  const [isRetrying, setIsRetrying] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const activeSessionIdRef = useRef(null);
  const messageListRef = useRef(null);
  const commandSuggestion = useMemo(() => {
    const trimmedInput = input.trim();
    if (!trimmedInput || trimmedInput.startsWith("/")) {
      return null;
    }
    const smartRecommendation = getSmartRecommendation(trimmedInput);
    if (smartRecommendation?.type === "workflow") {
      const firstAction = smartRecommendation.workflow.steps.find((step) => step.command !== "/clear") || smartRecommendation.workflow.steps[0];
      const suggestedCommand = resolveCommandName(firstAction?.command || "/ck:plan");
      return {
        command: suggestedCommand,
        confidence: smartRecommendation.confidence,
        reason: smartRecommendation.reason,
        workflowName: smartRecommendation.workflow.name,
        recommendationType: "workflow"
      };
    }
    const intentMatch = detectIntent(trimmedInput);
    if (intentMatch) {
      return {
        command: resolveCommandName(intentMatch.command),
        confidence: intentMatch.confidence,
        reason: "Khớp intent trực tiếp từ mô tả hiện tại",
        recommendationType: "command"
      };
    }
    const rankedRecommendation = recommendCommands(trimmedInput, commands);
    if (!rankedRecommendation.primary) {
      return null;
    }
    return {
      command: rankedRecommendation.primary.command.name,
      confidence: rankedRecommendation.confidence,
      reason: rankedRecommendation.primary.reason,
      recommendationType: "command"
    };
  }, [input]);
  const renderedMessages = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    const shouldShowTyping = isStreaming && (!lastMessage || lastMessage.role === "user");
    if (!shouldShowTyping) {
      return messages;
    }
    return [
      ...messages,
      {
        id: "typing-indicator",
        role: "assistant",
        content: "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        isTyping: true
      }
    ];
  }, [messages, isStreaming]);
  useEffect(() => {
    console.log("[Chat] Build version:", BUILD_VERSION);
    void checkApiHealth();
  }, []);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      if (commandOpen) setCommandOpen(false);
      if (showHistory) setShowHistory(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [commandOpen, showHistory]);
  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const response = await fetch("/api/sessions");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const body = await response.json().catch(() => ({}));
      const loadedSessions = Array.isArray(body.sessions) ? body.sessions : [];
      setSessions(
        [...loadedSessions].sort((a, b) => {
          const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
          const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
          return bTime - aTime;
        })
      );
    } catch (error) {
      console.error("[Chat] Failed to fetch sessions:", error);
      setSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);
  const checkApiHealth = async () => {
    try {
      const response = await fetch("/api/health");
      setApiStatus(response.ok ? "ready" : "error");
    } catch {
      setApiStatus("error");
    }
  };
  const handleSelectSession = async (sessionId) => {
    if (isStreaming) {
      toast.info("Đang nhận phản hồi, vui lòng chờ xong rồi đổi lịch sử");
      return;
    }
    setIsLoadingHistory(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/chat?sessionId=${encodeURIComponent(sessionId)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const body = await response.json().catch(() => ({}));
      const loadedMessages = Array.isArray(body.messages) ? body.messages : [];
      const normalizedMessages = loadedMessages.filter((message) => message.role === "user" || message.role === "assistant").map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
      }));
      setMessages(normalizedMessages);
      setActiveSessionId(sessionId);
      setShowHistory(false);
      setIsNearBottom(true);
    } catch (error) {
      console.error("[Chat] Failed to load session history:", error);
      toast.error("Không thể tải lịch sử cuộc trò chuyện");
    } finally {
      setIsLoadingHistory(false);
    }
  };
  const handleToggleHistory = () => {
    const willOpen = !showHistory;
    setShowHistory(willOpen);
    if (willOpen) {
      void fetchSessions();
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    setErrorMessage(null);
    setErrorType("unknown");
    const nextInput = input.trim();
    const executedCommand = extractLeadingCommandToken(nextInput);
    if (executedCommand) {
      trackCommandTelemetryEvent("run", executedCommand);
    }
    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: nextInput,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsStreaming(true);
    try {
      const requestedSessionId = activeSessionIdRef.current;
      const sessionIdAtSendStart = activeSessionIdRef.current;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: nextInput, sessionId: requestedSessionId })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let assistantId = null;
      let assistantCreatedAt;
      let sseBuffer = "";
      let resolvedSessionId = requestedSessionId;
      let streamCompletedWithoutError = false;
      if (!reader) throw new Error("No response body");
      while (true) {
        const { done, value } = await reader.read();
        const decodedChunk = value ? decoder.decode(value, { stream: !done }) : decoder.decode();
        const parsedChunk = appendChunkAndExtractSseEvents(sseBuffer, decodedChunk);
        const eventsToProcess = done && parsedChunk.remainder.trim().length > 0 ? [...parsedChunk.events, parsedChunk.remainder] : parsedChunk.events;
        sseBuffer = done ? "" : parsedChunk.remainder;
        for (const eventBlock of eventsToProcess) {
          const data = extractDataPayloadFromSseEvent(eventBlock);
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "session" && parsed.sessionId) {
              resolvedSessionId = parsed.sessionId;
              continue;
            }
            if (parsed.type === "chunk" && parsed.content) {
              assistantContent += parsed.content;
              if (!assistantCreatedAt) {
                assistantCreatedAt = (/* @__PURE__ */ new Date()).toISOString();
              }
              setMessages((prev) => {
                if (assistantId && prev.find((message) => message.id === assistantId)) {
                  return prev.map(
                    (message) => message.id === assistantId ? { ...message, content: assistantContent } : message
                  );
                }
                assistantId = (Date.now() + 1).toString();
                return [
                  ...prev,
                  {
                    id: assistantId,
                    role: "assistant",
                    content: assistantContent,
                    createdAt: assistantCreatedAt
                  }
                ];
              });
            }
          } catch {
          }
        }
        if (done) {
          streamCompletedWithoutError = true;
          break;
        }
      }
      if (resolvedSessionId && activeSessionIdRef.current === sessionIdAtSendStart && resolvedSessionId !== activeSessionIdRef.current) {
        setActiveSessionId(resolvedSessionId);
      }
      if (executedCommand && streamCompletedWithoutError) {
        trackCommandTelemetryEvent("success", executedCommand);
      }
    } catch (error) {
      console.error("[Chat] Error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const isNetworkError = errorMsg.includes("fetch") || errorMsg.includes("network");
      setErrorType(isNetworkError ? "network" : "server");
      setErrorMessage(`Lỗi kết nối: ${errorMsg}`);
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setIsStreaming(false);
    }
  };
  const handleRetry = async () => {
    if (!errorMessage || isRetrying) return;
    setIsRetrying(true);
    await checkApiHealth();
    const lastUserMessage = messages.findLast((m) => m.role === "user");
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === "assistant" && lastMsg.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setTimeout(() => {
        void handleSend();
      }, 100);
    }
    setIsRetrying(false);
  };
  const handleDismissError = () => {
    setErrorMessage(null);
    setErrorType("unknown");
  };
  const handleCommandSelect = (command) => {
    setInput(`${command} `);
    setCommandOpen(false);
  };
  const handleInputChange = (value) => {
    setInput(value);
    if (errorMessage) setErrorMessage(null);
  };
  const handleApplyCommandSuggestion = (command) => {
    const normalizedCommand = command.trim();
    if (!normalizedCommand) return;
    setInput((previousInput) => {
      const trimmed = previousInput.trim();
      if (!trimmed || trimmed.startsWith("/")) {
        return `${normalizedCommand} `;
      }
      return `${normalizedCommand} ${trimmed}`;
    });
  };
  const handleClear = () => {
    setMessages([]);
    setInput("");
    setActiveSessionId(null);
    setErrorMessage(null);
    setIsNearBottom(true);
    toast.info("Đã xóa cuộc trò chuyện");
  };
  const scrollToBottom = () => {
    messageListRef.current?.scrollToBottom("smooth");
  };
  return /* @__PURE__ */ jsx("div", { className: "relative h-screen w-full overflow-hidden bg-[var(--app-bg)]", children: /* @__PURE__ */ jsx("div", { className: "relative flex h-full w-full justify-center px-0 md:px-6 lg:px-10", children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-full w-full max-w-[1140px] flex-col overflow-hidden border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_90%,transparent)] shadow-[var(--app-shadow)] md:rounded-2xl", children: [
    /* @__PURE__ */ jsx(
      ChatHeader,
      {
        apiStatus,
        onRefresh: () => {
          localStorage.clear();
          window.location.reload();
        },
        onToggleHistory: handleToggleHistory,
        onNewChat: handleClear,
        showHistory
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-0 flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        errorMessage && /* @__PURE__ */ jsx(
          ErrorBannerWithRetry,
          {
            message: errorMessage,
            type: errorType,
            onRetry: handleRetry,
            onDismiss: handleDismissError,
            isRetrying
          }
        ),
        messages.length === 0 ? /* @__PURE__ */ jsx(
          EmptyStateWithSuggestions,
          {
            onSuggestionClick: (text) => {
              setInput(text);
              if (text === "/") setCommandOpen(true);
            },
            onCommandPaletteOpen: () => setCommandOpen(true)
          }
        ) : /* @__PURE__ */ jsx(
          VirtualizedChatMessageList,
          {
            ref: messageListRef,
            messages: renderedMessages,
            className: "h-full overflow-y-auto pb-6 pt-3",
            onNearBottomChange: setIsNearBottom,
            renderMessage: (message) => message.role === "user" ? /* @__PURE__ */ jsx(
              MessageBubbleUser,
              {
                content: message.content,
                messageId: message.id
              }
            ) : /* @__PURE__ */ jsx(
              MessageBubbleAssistant,
              {
                content: message.content,
                messageId: message.id === "typing-indicator" ? void 0 : message.id,
                isTyping: Boolean(message.isTyping),
                timestampLabel: formatMessageTimestamp(message.createdAt)
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(ScrollToBottomButton, { onClick: scrollToBottom, isVisible: !isNearBottom && messages.length > 0 })
      ] }),
      /* @__PURE__ */ jsx(
        HistoryPanelWireframe,
        {
          isOpen: showHistory,
          onClose: () => setShowHistory(false),
          onNewChat: () => {
            handleClear();
            setShowHistory(false);
          },
          sessions,
          activeSessionId,
          isLoading: isLoadingSessions || isLoadingHistory,
          onSelectSession: handleSelectSession
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ChatInput,
      {
        value: input,
        onChange: handleInputChange,
        onSend: handleSend,
        onCommandPaletteOpen: () => setCommandOpen(true),
        commandSuggestion,
        onApplyCommandSuggestion: handleApplyCommandSuggestion,
        onEscape: () => {
          setShowHistory(false);
          setCommandOpen(false);
        },
        onOpenGuide: () => {
          const basePath = "/";
          const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
          window.location.href = `${normalizedBase}guide/`;
        },
        isStreaming
      }
    ),
    /* @__PURE__ */ jsx(
      CommandPalette,
      {
        open: commandOpen,
        onOpenChange: setCommandOpen,
        onSelect: handleCommandSelect,
        contextInput: input,
        interactionCount: messages.filter((message) => message.role === "user").length
      }
    )
  ] }) }) });
}

const $$Chat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "ClaudeKit Chat" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="app-shell bg-[var(--app-bg)]"> ${renderComponent($$result2, "VerticalNavSidebar", VerticalNavSidebar, { "currentPage": "chat", "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/chat/vertical-navigation-sidebar", "client:component-export": "VerticalNavSidebar" })} <main class="app-shell-main app-shell-main-clip relative z-10 flex flex-col"> ${renderComponent($$result2, "ChatFrameWithGlassmorphismAndVietnamese", ChatFrameWithGlassmorphismAndVietnamese, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/chat/chat-frame-with-glassmorphism-and-vietnamese", "client:component-export": "default" })} </main> </div> ` })}`;
}, "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/chat.astro", void 0);

const $$file = "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/chat.astro";
const $$url = "/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Chat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
