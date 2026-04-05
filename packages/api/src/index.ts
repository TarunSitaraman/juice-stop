import http from "http";
import express from "express";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { rateLimit } from "express-rate-limit";

import { menuRouter } from "./routes/menu";
import { ordersRouter } from "./routes/orders";
import { restaurantRouter } from "./routes/restaurant";
import { authRouter } from "./routes/auth";
import { initSocket } from "./sockets";

const app = express();
const server = http.createServer(app);

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = (process.env.CORS_ORIGINS ?? "").split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ─── Socket.io ────────────────────────────────────────────────────────────────

export const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initSocket(io);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Global rate limit — 100 req/min per IP
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests, slow down." },
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ success: true, service: "juice-stop-api", ts: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/restaurant", restaurantRouter);

// ─── 404 ──────────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3001;
server.listen(PORT, () => {
  console.log(`Juice Stop API running on port ${PORT}`);
});
