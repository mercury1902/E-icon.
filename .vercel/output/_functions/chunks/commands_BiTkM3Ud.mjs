import { c as createComponent } from './astro-component_3xMZ7s8g.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_N2AoPI2Q.mjs';
import { $ as $$Layout, V as VerticalNavSidebar } from './vertical-navigation-sidebar_MqcvzbCi.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { BookOpen, Search, Sparkles, Terminal, Star, ArrowRight } from 'lucide-react';
import { c as commands, a as categories } from './claudekit-full-commands-catalog_DoHT_xSM.mjs';

const CommandCard = ({ command, onClick, isFeatured }) => {
  const complexityDots = "⚡".repeat(command.complexity);
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick,
      className: `
        group relative rounded-xl border border-white/10
        backdrop-blur-md transition-all duration-300 ease-out cursor-pointer
        ${isFeatured ? "bg-gradient-to-br from-brand-400/20 to-brand-500/10 hover:from-brand-400/30 hover:to-brand-500/20 border-brand-400/30" : "bg-white/5 hover:bg-white/10 hover:border-white/20"}
        hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-400/10
        p-4
      `,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `
          p-2 rounded-lg shrink-0
          ${isFeatured ? "bg-brand-400/20 text-brand-200" : "bg-white/10 text-white/70"}
        `, children: /* @__PURE__ */ jsx(Terminal, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("code", { className: "text-sm font-mono text-brand-300 font-semibold", children: command.name }),
            isFeatured && /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-brand-300 fill-brand-300" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 line-clamp-2", children: command.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-white/50", children: command.category }),
            /* @__PURE__ */ jsx("span", { className: "text-brand-300/80", title: `Complexity: ${command.complexity}/5`, children: complexityDots })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors shrink-0" })
      ] })
    }
  );
};
const CommandBrowserWithSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredCommands = useMemo(() => {
    let filtered = commands;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cmd) => cmd.name.toLowerCase().includes(query) || cmd.description.toLowerCase().includes(query) || cmd.keywords.some((k) => k.toLowerCase().includes(query)) || cmd.useCases.some((u) => u.toLowerCase().includes(query))
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((cmd) => cmd.category === selectedCategory);
    }
    return filtered;
  }, [searchQuery, selectedCategory]);
  const featuredCommands = useMemo(() => {
    return commands.filter((cmd) => ["ck:cook", "ck:plan", "ck:fix", "ck:ask"].includes(cmd.id));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "w-6 h-6 text-brand-400" }),
        "Command Browser"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Tìm kiếm commands...",
            className: "w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-400/50 focus:bg-white/10 transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedCategory("all"),
            className: `
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${selectedCategory === "all" ? "bg-brand-400/20 text-brand-200 border border-brand-400/40" : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"}
            `,
            children: [
              "Tất cả (",
              commands.length,
              ")"
            ]
          }
        ),
        categories.map((cat) => {
          const count = commands.filter((c) => c.category === cat).length;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedCategory(cat),
              className: `
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedCategory === cat ? "bg-brand-400/20 text-brand-200 border border-brand-400/40" : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"}
                `,
              children: [
                cat,
                " (",
                count,
                ")"
              ]
            },
            cat
          );
        })
      ] })
    ] }),
    !searchQuery && selectedCategory === "all" && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-400/10 to-transparent backdrop-blur-xl p-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-brand-400" }),
        "Commands Phổ Biến"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: featuredCommands.map((cmd) => /* @__PURE__ */ jsx(CommandCard, { command: cmd, isFeatured: true }, cmd.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: searchQuery ? `Kết quả tìm kiếm (${filteredCommands.length})` : "Tất cả Commands" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredCommands.map((cmd) => /* @__PURE__ */ jsx(CommandCard, { command: cmd }, cmd.id)) }),
      filteredCommands.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-white/50", children: [
        /* @__PURE__ */ jsx(Terminal, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
        /* @__PURE__ */ jsx("p", { children: "Không tìm thấy command nào" })
      ] })
    ] })
  ] });
};

const $$Commands = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Command Browser", "description": "Danh sách tất cả Claude Code commands" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="app-shell">  ${renderComponent($$result2, "VerticalNavSidebar", VerticalNavSidebar, { "currentPage": "guide", "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/chat/vertical-navigation-sidebar", "client:component-export": "VerticalNavSidebar" })}  <main class="app-shell-main app-shell-main-scroll relative z-10"> <div class="py-12 px-4 sm:px-6 lg:px-8"> <div class="max-w-6xl mx-auto">  <div class="flex items-center gap-4 mb-8"> <div class="p-3 rounded-xl bg-brand-400/20 text-brand-300"> ${renderComponent($$result2, "Terminal", Terminal, { "className": "w-8 h-8" })} </div> <div> <h1 class="text-3xl font-bold text-white"> <span data-i18n="vi">Command Browser</span> <span data-i18n="en">Command Browser</span> </h1> <p class="text-white/60"> <span data-i18n="vi">Danh sách đầy đủ tất cả Claude Code commands</span> <span data-i18n="en">Complete list of Claude Code commands</span> </p> </div> </div>  ${renderComponent($$result2, "CommandBrowserWithSearch", CommandBrowserWithSearch, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/components/command-guide/command-browser-with-search", "client:component-export": "CommandBrowserWithSearch" })} </div> </div> </main> </div> ` })}`;
}, "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/guide/commands.astro", void 0);

const $$file = "E:/A/Code/Project/Promt engineering/prompt-engineering-/src/pages/guide/commands.astro";
const $$url = "/guide/commands";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Commands,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
