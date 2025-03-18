import { pgTable, text, serial, timestamp, integer, varchar, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Subscription tier enum
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'basic', 'premium', 'enterprise']);

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default('free').notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  preferences: jsonb("preferences").default({}).notNull(),
});

// Enhanced reports table with user relationship
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  frequency: text("frequency").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  location: jsonb("location"),
  severity: text("severity"),
  countermeasureActivated: boolean("countermeasure_activated").default(false),
  deviceInfo: jsonb("device_info"),
  status: text("status").default("pending"),
});

// AI Chat history
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isUserMessage: boolean("is_user_message").default(true).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
});

// Educational resources
export const educationalResources = pgTable("educational_resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  accessLevel: subscriptionTierEnum("access_level").default('free').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  isActive: true,
}).extend({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  timestamp: true,
  userId: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertEducationalResourceSchema = createInsertSchema(educationalResources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertEducationalResource = z.infer<typeof insertEducationalResourceSchema>;
export type EducationalResource = typeof educationalResources.$inferSelect;

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

// Subscription features by tier
export const subscriptionFeatures = {
  free: {
    maxReports: 5,
    advancedDetection: false,
    aiChatAccess: false,
    educationalAccess: 'basic',
    realTimeAlerts: false,
    supportLevel: 'community',
  },
  basic: {
    maxReports: 20,
    advancedDetection: true,
    aiChatAccess: true,
    educationalAccess: 'standard',
    realTimeAlerts: false,
    supportLevel: 'email',
  },
  premium: {
    maxReports: 100,
    advancedDetection: true,
    aiChatAccess: true,
    educationalAccess: 'premium',
    realTimeAlerts: true,
    supportLevel: 'priority',
  },
  enterprise: {
    maxReports: -1, // unlimited
    advancedDetection: true,
    aiChatAccess: true,
    educationalAccess: 'all',
    realTimeAlerts: true,
    supportLevel: 'dedicated',
  }
};
