import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";
import { errorHandler } from "./middleware/errorHandler";

const __dirname = path.resolve();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  let mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri || mongoUri.includes('localhost')) {
    console.log("No remote MONGO_URI provided or localhost specified. Starting in-memory MongoDB for local development...");
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`In-memory MongoDB started at ${mongoUri}`);
    } catch (err) {
      console.error("Failed to start in-memory MongoDB", err);
    }
  }

  try {
    await mongoose.connect(mongoUri as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }

  app.use(cors());
  app.use(express.json());

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/leads", leadRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, 'frontend'),
      configFile: path.join(__dirname, 'vite.config.ts'),
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      
      try {
        let template = await fs.readFile(path.join(__dirname, 'frontend', 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
