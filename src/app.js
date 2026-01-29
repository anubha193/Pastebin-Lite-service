import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import healthRoute from "./routes/health.route.js";
import pasteRoutes from "./routes/pastes.route.js";
import viewRoutes from "./routes/view.route.js";

const app = express();

// --- ES module dirname fix ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(express.json());

// Serve static files (Vercel-safe)
app.use(express.static(path.join(__dirname, "../public")));

// Root route (explicit)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// --- Routes ---
app.use("/api/healthz", healthRoute);
app.use("/api/pastes", pasteRoutes);
app.use("/p", viewRoutes);

export default app;
