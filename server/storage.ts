import {
  reports, type Report, type InsertReport,
  users, type User, type InsertUser, type LoginUser,
  chatMessages, type ChatMessage, type InsertChatMessage,
  educationalResources, type EducationalResource, type InsertEducationalResource,
  type SubscriptionTier
} from "@shared/schema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface IStorage {
  // User management
  createUser(user: InsertUser): Promise<Omit<User, 'passwordHash'>>;
  loginUser(credentials: LoginUser): Promise<{ user: Omit<User, 'passwordHash'>, token: string } | null>;
  getUserById(id: number): Promise<Omit<User, 'passwordHash'> | null>;
  updateUserSubscription(userId: number, tier: SubscriptionTier): Promise<Omit<User, 'passwordHash'> | null>;

  // Reports
  createReport(report: InsertReport, userId?: number): Promise<Report>;
  getReports(limit?: number): Promise<Report[]>;
  getUserReports(userId: number): Promise<Report[]>;

  // Chat
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: number, sessionId: string): Promise<ChatMessage[]>;

  // Educational resources
  createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource>;
  getEducationalResources(category?: string, accessLevel?: SubscriptionTier): Promise<EducationalResource[]>;
  getEducationalResourceById(id: number): Promise<EducationalResource | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reports: Map<number, Report>;
  private chatMessages: Map<number, ChatMessage>;
  private educationalResources: Map<number, EducationalResource>;
  private userIdCounter: number;
  private reportIdCounter: number;
  private chatMessageIdCounter: number;
  private educationalResourceIdCounter: number;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.chatMessages = new Map();
    this.educationalResources = new Map();
    this.userIdCounter = 1;
    this.reportIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.educationalResourceIdCounter = 1;

    // Add some initial educational resources
    this.seedEducationalResources();
  }

  private seedEducationalResources() {
    const resources: InsertEducationalResource[] = [
      {
        title: "Understanding Voice-to-Skull Technology",
        content: "Voice-to-skull (V2K) technology refers to methods that can transmit sounds and voices directly to a person's auditory cortex without using conventional audio. This article explains the science, potential uses, and how to identify if you're experiencing V2K phenomena.",
        category: "technology",
        accessLevel: "free"
      },
      {
        title: "Sound Cannon: What You Need to Know",
        content: "Sound cannons, also known as Long Range Acoustic Devices (LRADs), are powerful directional sound projection systems. This article covers their technical specifications, legitimate uses, potential misuses, and protective measures.",
        category: "technology",
        accessLevel: "free"
      },
      {
        title: "Identifying Audio Harassment: Signs and Symptoms",
        content: "Audio harassment can take many forms, from conventional noise disturbances to more sophisticated technological approaches. Learn about the physical and psychological symptoms that may indicate you're experiencing audio harassment.",
        category: "protection",
        accessLevel: "free"
      },
      {
        title: "Advanced Countermeasures Against Audio Attacks",
        content: "This comprehensive guide covers sophisticated methods to protect yourself from various forms of audio-based harassment or attacks, including technical solutions, legal approaches, and psychological resilience techniques.",
        category: "protection",
        accessLevel: "basic"
      },
      {
        title: "The Science of Frequency-Based Harassment",
        content: "An in-depth exploration of how specific sound frequencies can affect human physiology and psychology, the scientific evidence behind these effects, and current research in the field.",
        category: "science",
        accessLevel: "premium"
      }
    ];

    resources.forEach(resource => {
      const id = this.educationalResourceIdCounter++;
      this.educationalResources.set(id, {
        ...resource,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        accessLevel: resource.accessLevel as "free" | "basic" | "premium" | "enterprise"
      });
    });
  }

  // User management methods
  async createUser(insertUser: InsertUser): Promise<Omit<User, 'passwordHash'>> {
    const { password, confirmPassword, ...userData } = insertUser;

    // Check if email already exists
    const emailExists = Array.from(this.users.values()).some(user =>
      user.email.toLowerCase() === userData.email?.toLowerCase()
    );

    if (emailExists) {
      throw new Error('Email already in use');
    }

    const id = this.userIdCounter++;
    const passwordHash = await bcrypt.hash(password, 10);

    const user: User = {
      ...userData,
      id,
      passwordHash,
      createdAt: new Date(),
      isActive: true,
      subscriptionTier: userData.subscriptionTier || 'free',
      role: userData.role || 'user',
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      lastLogin: null, // Explicitly set to null instead of undefined
      preferences: userData.preferences || {},
    };

    this.users.set(id, user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async loginUser(credentials: LoginUser): Promise<{ user: Omit<User, 'passwordHash'>, token: string } | null> {
    const user = Array.from(this.users.values()).find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!user || !user.isActive) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);

    if (!passwordMatch) {
      return null;
    }

    // Update last login time
    user.lastLogin = new Date();
    this.users.set(user.id, user);

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        tier: user.subscriptionTier,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: number): Promise<Omit<User, 'passwordHash'> | null> {
    const user = this.users.get(id);

    if (!user) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserSubscription(userId: number, tier: SubscriptionTier): Promise<Omit<User, 'passwordHash'> | null> {
    const user = this.users.get(userId);

    if (!user) {
      return null;
    }

    user.subscriptionTier = tier;
    this.users.set(userId, user);

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    return Array.from(this.users.values()).map(user => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<Omit<User, 'passwordHash'> | null> {
    const user = this.users.get(userId);

    if (!user) {
      return null;
    }

    // Update user properties
    Object.assign(user, updates);
    this.users.set(userId, user);

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(userId: number): Promise<boolean> {
    if (!this.users.has(userId)) {
      return false;
    }

    this.users.delete(userId);
    return true;
  }

  // Report methods
  async createReport(insertReport: InsertReport, userId?: number): Promise<Report> {
    const id = this.reportIdCounter++;
    const report: Report = {
      ...insertReport,
      id,
      userId: userId || null,
      timestamp: new Date(),
      status: 'pending',
      description: insertReport.description ?? null,
      location: insertReport.location || null,
      severity: insertReport.severity ?? null,
      countermeasureActivated: insertReport.countermeasureActivated ?? null,
      deviceInfo: insertReport.deviceInfo || null
    };

    this.reports.set(id, report);
    return report;
  }

  async getReports(limit?: number): Promise<Report[]> {
    const sortedReports = Array.from(this.reports.values()).sort((a, b) =>
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    return limit ? sortedReports.slice(0, limit) : sortedReports;
  }

  async getUserReports(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Chat methods
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const chatMessage: ChatMessage = {
      ...message,
      id,
      timestamp: new Date(),
      isUserMessage: message.isUserMessage ?? true // Default to true if not provided
    };

    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(userId: number, sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId && msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Educational resources methods
  async createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource> {
    const id = this.educationalResourceIdCounter++;
    const educationalResource: EducationalResource = {
      ...resource,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessLevel: resource.accessLevel || 'free' // Default to 'free' if not provided
    };

    this.educationalResources.set(id, educationalResource);
    return educationalResource;
  }

  async getEducationalResources(category?: string, accessLevel?: SubscriptionTier): Promise<EducationalResource[]> {
    let resources = Array.from(this.educationalResources.values());

    if (category) {
      resources = resources.filter(resource => resource.category === category);
    }

    if (accessLevel) {
      const tierLevels = { 'free': 0, 'basic': 1, 'premium': 2, 'enterprise': 3 };
      const userTierLevel = tierLevels[accessLevel];

      resources = resources.filter(resource => {
        const resourceTierLevel = tierLevels[resource.accessLevel as SubscriptionTier];
        return resourceTierLevel <= userTierLevel;
      });
    }

    return resources.sort((a, b) => a.title.localeCompare(b.title));
  }

  async getEducationalResourceById(id: number): Promise<EducationalResource | null> {
    return this.educationalResources.get(id) || null;
  }
}

import { DbStorage } from './db-storage';

// Use the database storage implementation in production
// and memory storage for development if needed
const useDbStorage = process.env.NODE_ENV === 'production' || process.env.USE_DB_STORAGE === 'true';

export const storage = useDbStorage ? new DbStorage() : new MemStorage();
