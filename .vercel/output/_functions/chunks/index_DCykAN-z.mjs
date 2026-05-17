import { c as createComponent } from './astro-component_3xMZ7s8g.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_N2AoPI2Q.mjs';
import { $ as $$Layout, V as VerticalNavSidebar } from './vertical-navigation-sidebar_MqcvzbCi.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React, { useState } from 'react';
import { CheckCircle, Terminal, RotateCcw, HelpCircle, ArrowRight, Sparkles, Lightbulb, BookOpen } from 'lucide-react';
import { c as commands } from './claudekit-full-commands-catalog_DoHT_xSM.mjs';

const decisionTree = [
  {
    id: "start",
    question: "Bạn muốn làm gì?",
    options: [
      { label: "Triển khai tính năng mới", value: "implement", nextNode: "implement-type" },
      { label: "Sửa lỗi / Debug", value: "fix", nextNode: "fix-type" },
      { label: "Tìm hiểu / Hỏi đáp", value: "learn", nextNode: "learn-type" },
      { label: "Review / Kiểm tra", value: "review", nextNode: "review-type" },
      { label: "Triển khai / Deploy", value: "deploy", nextNode: "deploy-type" }
    ]
  },
  {
    id: "implement-type",
    question: "Bạn cần triển khai như thế nào?",
    options: [
      { label: "Triển khai đầy đủ từ A-Z", value: "full", commandId: "ck:cook", description: "/ck:cook - End-to-end implementation" },
      { label: "Cần lập kế hoạch trước", value: "plan", commandId: "ck:plan", description: "/ck:plan - Intelligent planning" },
      { label: "Project mới hoàn toàn", value: "new", commandId: "ck:bootstrap", description: "/ck:bootstrap - Bootstrap new project" },
      { label: "Theo plan đã có sẵn", value: "from-plan", commandId: "ck:code", description: "/ck:code - Execute existing plan" }
    ]
  },
  {
    id: "fix-type",
    question: "Lỗi bạn gặp thuộc loại nào?",
    options: [
      { label: "TypeScript / Type errors", value: "types", commandId: "ck:fix:types", description: "/ck:fix:types - Fix TypeScript errors" },
      { label: "UI / Layout / CSS", value: "ui", commandId: "ck:fix:ui", description: "/ck:fix:ui - Fix UI/UX issues" },
      { label: "CI/CD / GitHub Actions", value: "ci", commandId: "ck:fix:ci", description: "/ck:fix:ci - Fix CI/CD pipeline" },
      { label: "Tests failing", value: "test", commandId: "ck:fix:test", description: "/ck:fix:test - Fix failing tests" },
      { label: "Lỗi phức tạp / Khó debug", value: "complex", commandId: "ck:debug", description: "/ck:debug - Deep debug analysis" },
      { label: "Không rõ nguyên nhân", value: "unknown", commandId: "ck:fix", description: "/ck:fix - Intelligent routing" }
    ]
  },
  {
    id: "learn-type",
    question: "Bạn muốn tìm hiểu điều gì?",
    options: [
      { label: "Câu hỏi nhanh về code", value: "ask-code", commandId: "ck:ask", description: "/ck:ask - Quick technical answers" },
      { label: "Research công nghệ mới", value: "research", commandId: "ck:research", description: "/ck:research - Deep research" },
      { label: "Giải thích code phức tạp", value: "explain", commandId: "ck:explain", description: "/ck:explain - Visual explanations" },
      { label: "Tìm trong docs", value: "docs", commandId: "ck:docs", description: "/ck:docs - Documentation search" }
    ]
  },
  {
    id: "review-type",
    question: "Bạn muốn review gì?",
    options: [
      { label: "Code review PR", value: "pr", commandId: "ck:code-review", description: "/ck:code-review - Adversarial code review" },
      { label: "Review trước khi ship", value: "ship", commandId: "ck:ship", description: "/ck:ship - Shipping pipeline" },
      { label: "So sánh / Preview", value: "preview", commandId: "ck:preview", description: "/ck:preview - Visual comparison" }
    ]
  },
  {
    id: "deploy-type",
    question: "Bạn muốn triển khai ra đâu?",
    options: [
      { label: "Triển khai production", value: "prod", commandId: "ck:deploy", description: "/ck:deploy - Deploy to platforms" },
      { label: "Chuẩn bị ship / PR", value: "ship", commandId: "ck:ship", description: "/ck:ship - Shipping pipeline" }
    ]
  }
];
const DecisionTreeWithRecommendations = () => {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState([]);
  const [recommendedCommand, setRecommendedCommand] = useState(null);
  const currentNode = decisionTree.find((n) => n.id === currentNodeId);
  const handleOptionClick = (option) => {
    if (option.commandId) {
      const command = commands.find((c) => c.id === option.commandId);
      setRecommendedCommand(command || null);
    } else if (option.nextNode) {
      setHistory([...history, { nodeId: currentNodeId, answer: option.label }]);
      setCurrentNodeId(option.nextNode);
    }
  };
  const handleReset = () => {
    setCurrentNodeId("start");
    setHistory([]);
    setRecommendedCommand(null);
  };
  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prev = newHistory.pop();
      setHistory(newHistory);
      setCurrentNodeId(prev?.nodeId || "start");
      setRecommendedCommand(null);
    }
  };
  if (recommendedCommand) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-400/20 to-brand-500/10 backdrop-blur-xl p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-400/20 mb-4", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-brand-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: "Command phù hợp!" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/60", children: "Dựa trên câu trả lời của bạn" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white/10 rounded-xl p-6 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx(Terminal, { className: "w-6 h-6 text-brand-400" }),
          /* @__PURE__ */ jsx("code", { className: "text-xl font-mono text-brand-300 font-bold", children: recommendedCommand.name })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-white/80 mb-4", children: recommendedCommand.description }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: recommendedCommand.keywords.slice(0, 5).map((kw) => /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded-full bg-white/10 text-xs text-white/60", children: kw }, kw)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3 justify-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleReset,
          className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all",
          children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" }),
            "Bắt đầu lại"
          ]
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white mb-6 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(HelpCircle, { className: "w-6 h-6 text-brand-400" }),
      "Tìm Command phù hợp"
    ] }),
    history.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 text-sm flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleBack,
          className: "text-brand-400 hover:text-brand-300 transition-colors",
          children: "← Quay lại"
        }
      ),
      history.map((h, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-white/30", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-white/50", children: h.answer })
      ] }, i))
    ] }),
    currentNode && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-white mb-4", children: currentNode.question }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: currentNode.options.map((option) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleOptionClick(option),
          className: "w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-400/30 transition-all group text-left",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-white font-medium", children: option.label }),
              option.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-white/50 mt-1", children: option.description })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 text-white/30 group-hover:text-brand-400 transition-colors" })
          ]
        },
        option.value
      )) })
    ] })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Command Guide", "description": "Hướng dẫn sử dụng Claude Code commands" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="app-shell">  ${renderComponent($$result2, "VerticalNavSidebar", VerticalNavSidebar, { "currentPage": "guide", "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/chat/vertical-navigation-sidebar", "client:component-export": "VerticalNavSidebar" })}  <main class="app-shell-main app-shell-main-scroll relative z-10"> <div class="py-16 px-4 sm:px-6 lg:px-8"> <div class="max-w-6xl mx-auto"> <div class="text-center mb-12"> <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-400/10 border border-brand-400/30 mb-6"> ${renderComponent($$result2, "Sparkles", Sparkles, { "className": "w-5 h-5 text-brand-400" })} <span class="text-brand-200 font-medium"> <span data-i18n="vi">Hướng dẫn Command ClaudeKit</span> <span data-i18n="en">ClaudeKit Command Guide</span> </span> </div> <h1 class="text-4xl md:text-5xl font-bold text-white mb-4"> <span data-i18n="vi">Chọn đúng command cho</span> <span data-i18n="en">Pick the right command for</span><br> <span class="text-brand-400"> <span data-i18n="vi">mọi tình huống</span> <span data-i18n="en">every situation</span> </span> </h1> <p class="text-xl text-white/60 max-w-2xl mx-auto"> <span data-i18n="vi">
Không còn bối rối khi dùng Claude Code. Decision tree giúp bạn tìm command phù hợp,
                và prompt optimizer giúp viết prompt chuyên nghiệp.
</span> <span data-i18n="en">
Stop guessing with Claude Code. The decision tree helps choose the right command,
                and the prompt optimizer helps craft professional prompts.
</span> </p> </div>  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"> <a href="/guide/" class="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand-400/30 transition-all group"> <div class="p-3 rounded-xl bg-brand-400/20 text-brand-300 group-hover:bg-brand-400/30"> ${renderComponent($$result2, "Lightbulb", Lightbulb, { "className": "w-6 h-6" })} </div> <div> <h3 class="font-semibold text-white"> <span data-i18n="vi">Decision Tree</span> <span data-i18n="en">Decision Tree</span> </h3> <p class="text-sm text-white/50"> <span data-i18n="vi">Tìm command phù hợp</span> <span data-i18n="en">Find the best command</span> </p> </div> </a> <a href="/guide/commands" class="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand-400/30 transition-all group"> <div class="p-3 rounded-xl bg-brand-400/20 text-brand-300 group-hover:bg-brand-400/30"> ${renderComponent($$result2, "BookOpen", BookOpen, { "className": "w-6 h-6" })} </div> <div> <h3 class="font-semibold text-white"> <span data-i18n="vi">Command Browser</span> <span data-i18n="en">Command Browser</span> </h3> <p class="text-sm text-white/50"> <span data-i18n="vi">Xem tất cả commands</span> <span data-i18n="en">Browse all commands</span> </p> </div> </a> <a href="/guide/prompt-optimizer" class="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand-400/30 transition-all group"> <div class="p-3 rounded-xl bg-brand-400/20 text-brand-300 group-hover:bg-brand-400/30"> ${renderComponent($$result2, "Sparkles", Sparkles, { "className": "w-6 h-6" })} </div> <div> <h3 class="font-semibold text-white"> <span data-i18n="vi">Prompt Optimizer</span> <span data-i18n="en">Prompt Optimizer</span> </h3> <p class="text-sm text-white/50"> <span data-i18n="vi">Tối ưu prompt với AI</span> <span data-i18n="en">Optimize prompts with AI</span> </p> </div> </a> </div>  <div class="mb-8"> ${renderComponent($$result2, "DecisionTreeWithRecommendations", DecisionTreeWithRecommendations, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/command-guide/decision-tree-with-recommendations", "client:component-export": "DecisionTreeWithRecommendations" })} </div> </div> </div> </main> </div> ` })}`;
}, "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/guide/index.astro", void 0);

const $$file = "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/guide/index.astro";
const $$url = "/guide";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
