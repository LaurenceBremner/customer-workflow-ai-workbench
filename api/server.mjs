import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 8787);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function json(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function evaluateReadiness(payload) {
  const integrations = Number(payload.integrationsReady ?? 3);
  const evalPasses = Number(payload.evalPasses ?? 3);
  const reviewItems = Number(payload.reviewItems ?? 3);
  const threshold = Number(payload.threshold ?? 0.74);
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round((integrations / 4) * 25 + (evalPasses / 4) * 35 + (1 - Math.min(reviewItems, 8) / 10) * 20 + threshold * 20),
    ),
  );
  const decision = score >= 84 ? "ship_controlled_pilot" : score >= 70 ? "repair_then_pilot" : "hold";
  return { score, decision, threshold };
}

async function serveFile(req, res) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(dist, safePath);
  if (!filePath.startsWith(dist)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    res.writeHead(200, {
      "content-type": mime[path.extname(filePath)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    try {
      const fallback = await fs.readFile(path.join(dist, "index.html"));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(fallback);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Build not found. Run npm install && npm run build first.");
    }
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    if (url.pathname === "/api/health") {
      json(res, 200, {
        ok: true,
        app: "customer-workflow-ai-workbench",
        mode: "local-node-api",
        generated_at: new Date().toISOString(),
      });
      return;
    }
    if (url.pathname === "/api/evaluate" && req.method === "POST") {
      json(res, 200, evaluateReadiness(await readBody(req)));
      return;
    }
    if (url.pathname === "/api/export-brief" && req.method === "POST") {
      const body = await readBody(req);
      json(res, 200, {
        title: body.title ?? "Customer implementation brief",
        sections: [
          "Customer problem",
          "Prototype scope",
          "Integration gates",
          "Evaluation decision",
          "Human review queue",
          "Product feedback",
        ],
        format: "markdown",
      });
      return;
    }
    await serveFile(req, res);
  } catch (error) {
    json(res, 500, { ok: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Customer Workflow AI Workbench available at http://127.0.0.1:${port}`);
});
