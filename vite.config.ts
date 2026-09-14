import { Buffer } from "node:buffer";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function photoProxyMiddleware(): Connect.NextHandleFunction {
  return async (req: IncomingMessage, res: ServerResponse, next) => {
    if (!req.url?.startsWith("/__photo")) return next();

    const requestUrl = new URL(req.url, "http://localhost");
    const target = requestUrl.searchParams.get("url");
    if (!target) {
      res.statusCode = 400;
      res.end("Missing url");
      return;
    }

    try {
      const parsed = new URL(target);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        res.statusCode = 400;
        res.end("Invalid url");
        return;
      }

      const response = await fetch(target);
      if (!response.ok) {
        res.statusCode = response.status;
        res.end("Upstream error");
        return;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      res.setHeader("Content-Type", response.headers.get("content-type") ?? "application/octet-stream");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(buffer);
    } catch {
      res.statusCode = 502;
      res.end("Proxy error");
    }
  };
}

function photoProxyPlugin(): Plugin {
  return {
    name: "photo-proxy",
    configureServer(server) {
      server.middlewares.use(photoProxyMiddleware());
    },
    configurePreviewServer(server) {
      // Register before Vite's SPA fallback so /__photo returns image bytes.
      const stack = server.middlewares.stack as Array<{ route: string; handle: Connect.NextHandleFunction }>;
      stack.unshift({ route: "", handle: photoProxyMiddleware() });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), photoProxyPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
