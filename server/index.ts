import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import fs from "node:fs";
import { trackingRoutes } from "./tracking";

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
  trustProxy: true,
});

async function startServer() {
  try {
    // Enable CORS for development
    await server.register(cors, {
      origin: true,
    });

    // Health check route
    server.get("/health", async () => {
      return { status: "ok" };
    });

    // Register tracking routes
    await server.register(trackingRoutes);

    // If dist folder exists (production build or Railway container), serve static assets
    const distPath = path.resolve(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      await server.register(fastifyStatic, {
        root: distPath,
        prefix: "/",
        wildcard: false, // Let setNotFoundHandler serve index.html for SPA routes
      });

      // SPA client routing fallback (for /story, /work, /vision, /privacy)
      server.setNotFoundHandler((req, reply) => {
        // If route is /api or an unknown /admin/ subpath, preserve 404
        if (req.url.startsWith("/api") || req.url.startsWith("/admin/")) {
          return reply.code(404).send({ error: "Not Found" });
        }
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          return reply.sendFile("index.html");
        }
        return reply.code(404).send({ error: "Not Found" });
      });
    }

    const port = parseInt(process.env.PORT || "3000", 10);
    const host = process.env.HOST || "0.0.0.0";

    await server.listen({ port, host });
    console.log(`[Server] Fastify listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
