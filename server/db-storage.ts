import {
  reports, type Report, type InsertReport,
  users, type User, type InsertUser, type LoginUser,
  chatMessages, type ChatMessage, type InsertChatMessage,
  educationalResources, type EducationalResource, type InsertEducationalResource,
  type SubscriptionTier, type UserRole
} from "@shared/schema";
import { IStorage } from './storage';
import { db } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq, desc, and } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Use a stronger salt round for production
const SALT_ROUNDS = process.env.NODE_ENV === 'production' ? 12 : 10;

export class DbStorage implements IStorage {
  // User management
  async createUser(insertUser: InsertUser): Promise<Omit<User, 'passwordHash'>> {
    const { password, confirmPassword, ...userData } = insertUser;

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email?.toLowerCase() || ''));
    
    if (existingUser.length > 0) {
      throw new Error('Email already in use');
    }

    // Hash password with stronger encryption
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user into database
    const [user] = await db.insert(users).values({
      ...userData,
      email: userData.email?.toLowerCase() || '',
      passwordHash,
      role: (userData.role as UserRole) || 'user',
      subscriptionTier: userData.subscriptionTier || 'free',
      isActive: true,
      createdAt: new Date(),
      preferences: userData.preferences || {}
    }).returning();

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async loginUser(credentials: LoginUser): Promise<{ user: Omit<User, 'passwordHash'>, token: string } | null> {
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, credentials.email.toLowerCase()));

    if (!user || !user.isActive) {
      return null;
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);

    if (!passwordMatch) {
      return null;
    }

    // Update last login time
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Create JWT token with enhanced security
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        tier: user.subscriptionTier,
        role: user.role
      },
      JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256' // Specify the algorithm explicitly
      }
    );

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: number): Promise<Omit<User, 'passwordHash'> | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserSubscription(userId: number, tier: SubscriptionTier): Promise<Omit<User, 'passwordHash'> | null> {
    const [updatedUser] = await db.update(users)
      .set({ subscriptionTier: tier })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    const allUsers = await db.select().from(users);
    
    // Return users without password hashes
    return allUsers.map(user => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<Omit<User, 'passwordHash'> | null> {
    const [updatedUser] = await db.update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Reports
  async createReport(insertReport: InsertReport, userId?: number): Promise<Report> {
    const [report] = await db.insert(reports).values({
      ...insertReport,
      userId: userId || null,
      timestamp: new Date(),
      status: 'pending'
    }).returning();

    return report;
  }

  async getReports(limit?: number): Promise<Report[]> {
    let query = db.select().from(reports).orderBy(desc(reports.timestamp));
    
    if (limit) {
      query = (query as any).limit(limit);
    }
    
    return await query;
  }

  async getUserReports(userId: number): Promise<Report[]> {
    return await db.select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.timestamp));
  }

  // Chat
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db.insert(chatMessages).values({
      ...message,
      timestamp: new Date()
    }).returning();

    return chatMessage;
  }

  async getChatHistory(userId: number, sessionId: string): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, userId),
          eq(chatMessages.sessionId, sessionId)
        )
      )
      .orderBy(chatMessages.timestamp);
  }

  // Educational resources
  async createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource> {
    const now = new Date();
    const [educationalResource] = await db.insert(educationalResources).values({
      ...resource,
      createdAt: now,
      updatedAt: now
    }).returning();

    return educationalResource;
  }

  async getEducationalResources(category?: string, accessLevel?: SubscriptionTier): Promise<EducationalResource[]> {
    let query = db.select().from(educationalResources);
    
    if (category) {
      query = (query as any).where(eq(educationalResources.category, category));
    }
    
    if (accessLevel) {
      const tierLevels = { 'free': 0, 'basic': 1, 'premium': 2, 'enterprise': 3 };
      const userTierLevel = tierLevels[accessLevel];
      
      // Filter resources based on access level
      const resources = await query;
      return resources.filter(resource => {
        const resourceTierLevel = tierLevels[resource.accessLevel as SubscriptionTier];
        return resourceTierLevel <= userTierLevel;
      });
    }
    
    return await query;
  }

  async getEducationalResourceById(id: number): Promise<EducationalResource | null> {
    const [resource] = await db.select()
      .from(educationalResources)
      .where(eq(educationalResources.id, id));
      
    return resource || null;
  }
}