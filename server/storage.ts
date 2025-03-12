import { reports, type Report, type InsertReport } from "@shared/schema";

export interface IStorage {
  createReport(report: InsertReport): Promise<Report>;
  getReports(): Promise<Report[]>;
}

export class MemStorage implements IStorage {
  private reports: Map<number, Report>;
  currentId: number;

  constructor() {
    this.reports = new Map();
    this.currentId = 1;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentId++;
    const report: Report = {
      ...insertReport,
      id,
      timestamp: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }
}

export const storage = new MemStorage();
