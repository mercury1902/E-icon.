const GET = async () => {
  const health = {
    status: "ok",
    version: "2026-04-07-001",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    checks: {
      api: true,
      env: {
        nineRouterKey: true,
        nineRouterModel: true,
        nineRouterUrl: true
      }
    }
  };
  const hasRequiredEnv = health.checks.env.nineRouterKey && health.checks.env.nineRouterModel && health.checks.env.nineRouterUrl;
  if (!hasRequiredEnv) {
    health.status = "error";
    health.checks.api = false;
  }
  return new Response(JSON.stringify(health), {
    status: health.status === "ok" ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
