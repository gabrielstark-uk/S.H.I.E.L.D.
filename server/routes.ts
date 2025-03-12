import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/reports", async (req, res) => {
    try {
      const report = insertReportSchema.parse(req.body);
      const created = await storage.createReport(report);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  app.get("/api/reports", async (_req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  const httpServer = createServer(app);
  return httpServer;
}
