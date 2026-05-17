import { c as createComponent } from './astro-component_3xMZ7s8g.mjs';
import 'piccolore';
import { r as renderTemplate, l as renderComponent, o as renderSlot, p as renderHead, q as defineScriptVars, h as addAttribute } from './entrypoint_N2AoPI2Q.mjs';
import { Toaster } from 'sonner';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, BookOpen, Sparkles, History, Settings, Languages } from 'lucide-react';

const APP_LANGUAGE_STORAGE_KEY = "claudekit:language";
const APP_LANGUAGE_EVENT_NAME = "claudekit:language-change";
const TRANSLATIONS = {
  vi: {
    "common.language": "Ngôn ngữ",
    "common.vietnamese": "Tiếng Việt",
    "common.english": "English",
    "nav.chat": "Chat",
    "nav.guide": "Hướng dẫn",
    "nav.optimizer": "Tối ưu prompt",
    "nav.history": "Lịch sử",
    "nav.settings": "Cài đặt",
    "nav.assistant": "Trợ lý AI",
    "nav.version": "ClaudeKit Chat v1.0",
    "nav.toggle-language": "Chuyen ngon ngu",
    "chat.title": "ClaudeKit Chat",
    "chat.status.checking": "Đang kết nối...",
    "chat.status.ready": "Trợ lý AI đang hoạt động",
    "chat.status.error": "Lỗi kết nối API",
    "chat.refresh": "Làm mới",
    "chat.history": "Lịch sử",
    "chat.new-chat": "Cuộc trò chuyện mới",
    "chat.input.placeholder": "Nhập / để xem lệnh hoặc hỏi bất cứ điều gì...",
    "chat.input.placeholder-loading": "Đang chờ phản hồi...",
    "chat.input.command": "Lệnh",
    "chat.input.sending": "Đang gửi...",
    "chat.input.hint.commands": "cho lệnh",
    "chat.input.hint.palette": "cho palette",
    "chat.input.hint.send": "để gửi",
    "chat.suggestion.command": "Command gợi ý",
    "chat.suggestion.workflow": "Workflow gợi ý",
    "chat.suggestion.apply-command": "Chèn command",
    "chat.suggestion.open-guide": "Mở guide",
    "chat.empty.title": "Bắt đầu cuộc trò chuyện mới",
    "chat.empty.subtitle": "Chọn gợi ý bên dưới hoặc nhập câu hỏi của bạn",
    "chat.empty.write-code": "Viết code",
    "chat.empty.explain": "Giải thích",
    "chat.empty.debug": "Debug lỗi",
    "chat.empty.quick-command": "Lệnh nhanh",
    "optimizer.greeting": "Chào bạn! Tôi là Prompt Optimizer.",
    "optimizer.greeting.line1": 'Hãy nhập prompt thô của bạn (ví dụ: "làm trang login") hoặc chọn template bên dưới, tôi sẽ:',
    "optimizer.greeting.line2": "Viết lại thành prompt chuyên nghiệp",
    "optimizer.greeting.line3": "Gợi ý command phù hợp (/ck:cook, /ck:plan, etc.)",
    "optimizer.greeting.line4": "Giải thích lý do chọn command đó",
    "optimizer.templates.show": "Chọn template",
    "optimizer.templates.hide": "Ẩn templates",
    "optimizer.input.placeholder": "Nhập prompt thô của bạn... (ví dụ: 'làm trang login')",
    "optimizer.reset": "Bắt đầu lại",
    "optimizer.examples": "Ví dụ:",
    "optimizer.copy.done": "Đã sao chép",
    "optimizer.error": "Lỗi khi tối ưu prompt. Vui lòng thử lại."
  },
  en: {
    "common.language": "Language",
    "common.vietnamese": "Vietnamese",
    "common.english": "English",
    "nav.chat": "Chat",
    "nav.guide": "Guide",
    "nav.optimizer": "Prompt Optimizer",
    "nav.history": "History",
    "nav.settings": "Settings",
    "nav.assistant": "AI Assistant",
    "nav.version": "ClaudeKit Chat v1.0",
    "nav.toggle-language": "Switch language",
    "chat.title": "ClaudeKit Chat",
    "chat.status.checking": "Connecting...",
    "chat.status.ready": "AI assistant is online",
    "chat.status.error": "API connection error",
    "chat.refresh": "Refresh",
    "chat.history": "History",
    "chat.new-chat": "New conversation",
    "chat.input.placeholder": "Type / for commands or ask anything...",
    "chat.input.placeholder-loading": "Waiting for response...",
    "chat.input.command": "Command",
    "chat.input.sending": "Sending...",
    "chat.input.hint.commands": "for commands",
    "chat.input.hint.palette": "for palette",
    "chat.input.hint.send": "to send",
    "chat.suggestion.command": "Suggested command",
    "chat.suggestion.workflow": "Suggested workflow",
    "chat.suggestion.apply-command": "Insert command",
    "chat.suggestion.open-guide": "Open guide",
    "chat.empty.title": "Start a new conversation",
    "chat.empty.subtitle": "Pick a suggestion below or type your own question",
    "chat.empty.write-code": "Write code",
    "chat.empty.explain": "Explain",
    "chat.empty.debug": "Debug issue",
    "chat.empty.quick-command": "Quick command",
    "optimizer.greeting": "Hi! I am Prompt Optimizer.",
    "optimizer.greeting.line1": 'Enter your raw prompt (for example: "build a login page") or pick a template below, I will:',
    "optimizer.greeting.line2": "Rewrite it into a professional prompt",
    "optimizer.greeting.line3": "Recommend a suitable command (/ck:cook, /ck:plan, etc.)",
    "optimizer.greeting.line4": "Explain why that command fits",
    "optimizer.templates.show": "Choose template",
    "optimizer.templates.hide": "Hide templates",
    "optimizer.input.placeholder": "Type your raw prompt... (for example: 'build login page')",
    "optimizer.reset": "Reset",
    "optimizer.examples": "Examples:",
    "optimizer.copy.done": "Copied",
    "optimizer.error": "Prompt optimization failed. Please try again."
  }
};
function normalizeLanguage(language) {
  return language === "en" ? "en" : "vi";
}
function readStoredLanguage() {
  if (typeof window === "undefined") {
    return "vi";
  }
  try {
    return normalizeLanguage(window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY));
  } catch {
    return "vi";
  }
}
function writeStoredLanguage(language) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
  } catch {
  }
}
function updateDocumentLanguage(language) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.lang = language;
}
function translate(language, key, fallback) {
  return TRANSLATIONS[language][key] ?? fallback ?? TRANSLATIONS.vi[key] ?? key;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "ClaudeKit Chat", description = "ClaudeKit Prompt Optimizer and command guide" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="vi"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>', "</title>", "<script>(function(){", `
      (() => {
        try {
          const value = window.localStorage.getItem(storageKey);
          if (value === "en" || value === "vi") {
            document.documentElement.lang = value;
          }
        } catch {
          // Ignore storage failures.
        }
      })();
    })();<\/script><style>
      html[lang='vi'] [data-i18n='en'] {
        display: none !important;
      }

      html[lang='en'] [data-i18n='vi'] {
        display: none !important;
      }
    </style>`, "</head> <body class=\"min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] antialiased\"> <script>\n      (() => {\n        const EXTENSION_ATTRS = ['bis_skin_checked'];\n        const selector = EXTENSION_ATTRS.map((a) => `[${a}]`).join(',');\n        const strip = () => {\n          try {\n            document.querySelectorAll(selector).forEach((el) => {\n              for (const attr of EXTENSION_ATTRS) el.removeAttribute(attr);\n            });\n          } catch { /* ignore */ }\n        };\n        if (document.readyState === 'loading') {\n          document.addEventListener('DOMContentLoaded', strip);\n        } else {\n          strip();\n        }\n        if (typeof MutationObserver !== 'undefined') {\n          const observer = new MutationObserver(strip);\n          observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: EXTENSION_ATTRS });\n        }\n      })();\n    <\/script> ", " ", " </body></html>"], ['<html lang="vi"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>', "</title>", "<script>(function(){", `
      (() => {
        try {
          const value = window.localStorage.getItem(storageKey);
          if (value === "en" || value === "vi") {
            document.documentElement.lang = value;
          }
        } catch {
          // Ignore storage failures.
        }
      })();
    })();<\/script><style>
      html[lang='vi'] [data-i18n='en'] {
        display: none !important;
      }

      html[lang='en'] [data-i18n='vi'] {
        display: none !important;
      }
    </style>`, "</head> <body class=\"min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] antialiased\"> <script>\n      (() => {\n        const EXTENSION_ATTRS = ['bis_skin_checked'];\n        const selector = EXTENSION_ATTRS.map((a) => \\`[\\${a}]\\`).join(',');\n        const strip = () => {\n          try {\n            document.querySelectorAll(selector).forEach((el) => {\n              for (const attr of EXTENSION_ATTRS) el.removeAttribute(attr);\n            });\n          } catch { /* ignore */ }\n        };\n        if (document.readyState === 'loading') {\n          document.addEventListener('DOMContentLoaded', strip);\n        } else {\n          strip();\n        }\n        if (typeof MutationObserver !== 'undefined') {\n          const observer = new MutationObserver(strip);\n          observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: EXTENSION_ATTRS });\n        }\n      })();\n    <\/script> ", " ", " </body></html>"])), addAttribute(description, "content"), title, renderSlot($$result, $$slots["head"]), defineScriptVars({ storageKey: APP_LANGUAGE_STORAGE_KEY }), renderHead(), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Toaster", Toaster, { "position": "top-right", "richColors": true, "toastOptions": {
    style: {
      background: "rgba(31, 41, 55, 0.95)",
      border: "1px solid rgba(75, 85, 99, 0.5)",
      backdropFilter: "blur(8px)"
    }
  }, "client:load": true, "client:component-hydration": "load", "client:component-path": "sonner", "client:component-export": "Toaster" }));
}, "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/layouts/Layout.astro", void 0);

function notifyLanguageChange(language) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent(APP_LANGUAGE_EVENT_NAME, {
      detail: { language }
    })
  );
}
function setAppLanguage(language) {
  writeStoredLanguage(language);
  updateDocumentLanguage(language);
  notifyLanguageChange(language);
}
function useBilingualLanguageToggleState() {
  const [language, setLanguageState] = useState(() => readStoredLanguage());
  useEffect(() => {
    updateDocumentLanguage(language);
  }, [language]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleLanguageChange = (event) => {
      const customEvent = event;
      const nextLanguage = normalizeLanguage(customEvent.detail?.language);
      setLanguageState(nextLanguage);
    };
    const handleStorage = (event) => {
      if (event.key !== APP_LANGUAGE_STORAGE_KEY) {
        return;
      }
      setLanguageState(normalizeLanguage(event.newValue));
    };
    window.addEventListener(APP_LANGUAGE_EVENT_NAME, handleLanguageChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(APP_LANGUAGE_EVENT_NAME, handleLanguageChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(nextLanguage);
    setAppLanguage(nextLanguage);
  }, []);
  const toggleLanguage = useCallback(() => {
    setLanguage(language === "vi" ? "en" : "vi");
  }, [language, setLanguage]);
  const t = useCallback(
    (key, fallback) => translate(language, key, fallback),
    [language]
  );
  return {
    language,
    isEnglish: language === "en",
    isVietnamese: language === "vi",
    setLanguage,
    toggleLanguage,
    t
  };
}

const navItems = [
  { id: "chat", labelKey: "nav.chat", icon: MessageSquare, href: "/chat" },
  { id: "guide", labelKey: "nav.guide", icon: BookOpen, href: "/guide/" },
  { id: "optimizer", labelKey: "nav.optimizer", icon: Sparkles, href: "/guide/prompt-optimizer" },
  { id: "history", labelKey: "nav.history", icon: History, href: "#", disabled: true },
  { id: "settings", labelKey: "nav.settings", icon: Settings, href: "#", disabled: true }
];
const VerticalNavSidebar = ({
  currentPage = "chat",
  onNavigate,
  className = "",
  collapsed,
  mobileVisible = false,
  sticky = true,
  onItemClick
}) => {
  const { language, toggleLanguage, t } = useBilingualLanguageToggleState();
  const hasControlledCollapse = typeof collapsed === "boolean";
  const isCollapsed = hasControlledCollapse ? Boolean(collapsed) : false;
  const textVisibilityClass = hasControlledCollapse ? isCollapsed ? "hidden" : "" : "max-lg:hidden";
  const itemCompactClass = hasControlledCollapse ? isCollapsed ? "justify-center px-2" : "" : "max-lg:justify-center max-lg:px-2";
  const sidebarWidthClass = hasControlledCollapse ? isCollapsed ? "w-20" : "w-[300px]" : "w-[300px] max-lg:w-20";
  const sidebarVisibilityClass = mobileVisible ? "flex" : "hidden md:flex";
  const stickyClass = sticky ? "sticky top-0" : "relative";
  const handleNavClick = (event, item) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (onNavigate && item.href === "#") {
      event.preventDefault();
      onNavigate(item.id);
      return;
    }
    if (item.href.startsWith("#")) {
      event.preventDefault();
      if (item.href.length === 1) {
        return;
      }
      const target = document.querySelector(item.href);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", item.href);
      }
    }
    if (!item.disabled) {
      onItemClick?.();
    }
  };
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `${stickyClass} z-30 h-[100dvh] max-h-[100dvh] shrink-0 flex-col border-r border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_92%,transparent)] backdrop-blur-xl ${sidebarVisibilityClass} ${sidebarWidthClass} ${className}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: `border-b border-[var(--app-border)] p-5 ${hasControlledCollapse && isCollapsed ? "px-3" : "max-lg:px-3"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--app-border-strong)] bg-[var(--app-surface-muted)] shadow-[var(--app-shadow-soft)]", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-[var(--accent)]", children: "CK" }) }),
          /* @__PURE__ */ jsxs("div", { className: textVisibilityClass, children: [
            /* @__PURE__ */ jsx("h1", { className: "text-[15px] font-semibold text-[var(--app-text)]", children: "ClaudeKit" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--app-text-muted)]", children: t("nav.assistant", "Tro ly AI") })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("nav", { className: `flex-1 space-y-2 overflow-y-auto p-4 ${hasControlledCollapse && isCollapsed ? "px-2" : "max-lg:px-2"}`, children: navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: item.href,
              onClick: (event) => handleNavClick(event, item),
              "aria-current": isActive ? "page" : void 0,
              "aria-disabled": item.disabled ? "true" : void 0,
              className: `
                flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium
                transition-colors duration-200
                ${itemCompactClass}
                ${item.disabled ? "cursor-not-allowed opacity-45" : ""}
                ${isActive ? "border-[color-mix(in_srgb,var(--accent)_30%,var(--app-border))] bg-[color-mix(in_srgb,var(--accent)_14%,var(--app-surface))] text-[var(--app-text)]" : "border-transparent text-[var(--app-text-muted)] hover:border-[var(--app-border)] hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]"}
              `,
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }),
                /* @__PURE__ */ jsx("span", { className: textVisibilityClass, children: t(item.labelKey, item.id) })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: `space-y-2 border-t border-[var(--app-border)] p-4 ${hasControlledCollapse && isCollapsed ? "px-2" : "max-lg:px-2"}`, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: toggleLanguage,
              className: "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-2 text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-text)]",
              "aria-label": t("nav.toggle-language", "Switch language"),
              title: t("nav.toggle-language", "Switch language"),
              children: [
                /* @__PURE__ */ jsx(Languages, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold ${textVisibilityClass}`, children: language.toUpperCase() })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `text-center text-xs text-[var(--app-text-muted)] ${textVisibilityClass}`, children: t("nav.version", "ClaudeKit Chat v1.0") })
        ] })
      ]
    }
  );
};

export { $$Layout as $, VerticalNavSidebar as V, useBilingualLanguageToggleState as u };
