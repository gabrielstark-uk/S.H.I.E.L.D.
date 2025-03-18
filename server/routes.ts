import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
    insertReportSchema,
    insertUserSchema,
    loginUserSchema,
    insertChatMessageSchema,
    insertEducationalResourceSchema,
    subscriptionFeatures,
    SubscriptionTier
} from "@shared/schema";
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';
import './types';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize OpenAI client for AI chatbot
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key', // Replace with your actual API key
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = decoded;
        next();
    });
};

// Middleware to check subscription tier access
const checkSubscriptionAccess = (requiredTier: 'free' | 'basic' | 'premium' | 'enterprise') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const tierLevels = { 'free': 0, 'basic': 1, 'premium': 2, 'enterprise': 3 };
        const userTier: keyof typeof tierLevels = req.user?.tier || 'free';

        if (tierLevels[userTier] >= tierLevels[requiredTier]) {
            next();
        } else {
            res.status(403).json({
                error: 'Subscription tier upgrade required',
                requiredTier
            });
        }
    };
};

// Middleware to check for admin role
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || 'user';

    if (userRole === 'admin' || userRole === 'sudo') {
        next();
    } else {
        res.status(403).json({
            error: 'Admin access required'
        });
    }
};

// Middleware to check for sudo role
const requireSudo = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || 'user';

    if (userRole === 'sudo') {
        next();
    } else {
        res.status(403).json({
            error: 'Sudo access required'
        });
    }
};

export async function registerRoutes(app: Express): Promise<Server> {
    // Extend Express Request type to include user property
    app.use((req: Request, _res: Response, next: NextFunction) => {
        req.user = null;
        next();
    });

    // User authentication routes
    app.post("/api/auth/register", async (req, res) => {
        try {
            const userData = insertUserSchema.parse(req.body);
            const user = await storage.createUser(userData);
            res.status(201).json(user);
        } catch (error: any) {
            if (error.message === 'Email already in use') {
                return res.status(409).json({ error: error.message });
            }
            res.status(400).json({ error: "Invalid user data" });
        }
    });

    app.post("/api/auth/login", async (req, res) => {
        try {
            const credentials = loginUserSchema.parse(req.body);
            const result = await storage.loginUser(credentials);

            if (!result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            res.json(result);
        } catch (error) {
            res.status(400).json({ error: "Invalid login data" });
        }
    });

    app.get("/api/user/profile", authenticateToken, async (req, res) => {
        try {
            const userId = req.user.userId;
            const user = await storage.getUserById(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user profile" });
        }
    });

    // Subscription management
    app.get("/api/subscriptions", async (_req, res) => {
        res.json({
            tiers: {
                free: {
                    name: "Free",
                    price: 0,
                    features: subscriptionFeatures.free
                },
                basic: {
                    name: "Basic",
                    price: 9.99,
                    features: subscriptionFeatures.basic
                },
                premium: {
                    name: "Premium",
                    price: 19.99,
                    features: subscriptionFeatures.premium
                },
                enterprise: {
                    name: "Enterprise",
                    price: 49.99,
                    features: subscriptionFeatures.enterprise
                }
            }
        });
    });

    app.post("/api/subscriptions/upgrade", authenticateToken, async (req, res) => {
        try {
            const { tier } = req.body;

            if (!['free', 'basic', 'premium', 'enterprise'].includes(tier)) {
                return res.status(400).json({ error: "Invalid subscription tier" });
            }

            const userId = req.user.userId;
            const updatedUser = await storage.updateUserSubscription(userId, tier);

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            // Generate a new token with updated tier
            const token = jwt.sign(
                {
                    userId: updatedUser.id,
                    email: updatedUser.email,
                    tier: updatedUser.subscriptionTier,
                    role: updatedUser.role
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ user: updatedUser, token });
        } catch (error) {
            res.status(500).json({ error: "Failed to update subscription" });
        }
    });

    // Enhanced reports API
    app.post("/api/reports", async (req, res) => {
        const { frequency, type, timestamp } = req.body;
        console.log(`Reported frequency: ${frequency}, Type: ${type}, Timestamp: ${timestamp}`);

        try {
            const report = insertReportSchema.parse(req.body);

            // Extract user ID from token if available
            let userId = null;
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                try {
                    const decoded: any = jwt.verify(token, JWT_SECRET);
                    userId = decoded.userId;
                } catch (err) {
                    // Invalid token, but we'll still create the report without user ID
                }
            }

            const created = await storage.createReport(report, userId);
            res.json(created);
        } catch (error) {
            res.status(400).json({ error: "Invalid report data" });
        }
    });

    app.get("/api/reports", async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const reports = await storage.getReports(limit);
            res.json(reports);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch reports" });
        }
    });

    app.get("/api/user/reports", authenticateToken, async (req, res) => {
        try {
            const userId = req.user.userId;
            const reports = await storage.getUserReports(userId);
            res.json(reports);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user reports" });
        }
    });

    // AI Chatbot API
    app.post("/api/chat", authenticateToken, checkSubscriptionAccess('basic'), async (req, res) => {
        try {
            const { message, sessionId } = req.body;
            const userId = req.user.userId;

            if (!message || !sessionId) {
                return res.status(400).json({ error: "Message and session ID are required" });
            }

            // Save user message
            const userMessage = insertChatMessageSchema.parse({
                userId,
                message,
                isUserMessage: true,
                sessionId
            });

            await storage.saveChatMessage(userMessage);

            // Get chat history for context
            const chatHistory = await storage.getChatHistory(userId, sessionId);

            // Format chat history for OpenAI
            const messages = chatHistory.map(msg => ({
                role: msg.isUserMessage ? 'user' : 'assistant',
                content: msg.message
            }));

            // Add system message for context
            messages.unshift({
                role: 'system',
                content: 'You are an AI assistant specialized in helping users understand and deal with audio-based harassment, voice-to-skull technology, and sound cannons. Provide factual, helpful information while being sensitive to the user\'s concerns. If they describe symptoms or experiences, offer practical advice and resources. Avoid speculative or alarmist responses.'
            });

            // Get AI response
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages as ChatCompletionMessageParam[],
                max_tokens: 500
            });

            const aiResponse = completion.choices[0].message.content;

            // Save AI response
            const assistantMessage = insertChatMessageSchema.parse({
                userId,
                message: aiResponse,
                isUserMessage: false,
                sessionId
            });

            await storage.saveChatMessage(assistantMessage);

            res.json({ message: aiResponse });
        } catch (error) {
            console.error("Chat error:", error);
            res.status(500).json({ error: "Failed to process chat message" });
        }
    });

    app.get("/api/chat/history/:sessionId", authenticateToken, async (req, res) => {
        try {
            const { sessionId } = req.params;
            const userId = req.user.userId;

            const chatHistory = await storage.getChatHistory(userId, sessionId);
            res.json(chatHistory);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch chat history" });
        }
    });

    // Educational resources API
    app.get("/api/education", async (req, res) => {
        try {
            const category = req.query.category as string | undefined;

            // Extract user tier from token if available
            let accessLevel = 'free';
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                try {
                    const decoded: any = jwt.verify(token, JWT_SECRET);
                    accessLevel = decoded.tier || 'free';
                } catch (err) {
                    // Invalid token, default to free tier
                }
            }

            const resources = await storage.getEducationalResources(category, accessLevel as SubscriptionTier);
            res.json(resources);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch educational resources" });
        }
    });

    app.get("/api/education/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid resource ID" });
            }

            const resource = await storage.getEducationalResourceById(id);

            if (!resource) {
                return res.status(404).json({ error: "Resource not found" });
            }

            // Check access level if token is provided
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                try {
                    const decoded: any = jwt.verify(token, JWT_SECRET);
                    const userTier = decoded.tier || 'free';
                    const tierLevels: Record<SubscriptionTier, number> = {
                        'free': 0,
                        'basic': 1,
                        'premium': 2,
                        'enterprise': 3
                    };

                    if (tierLevels[userTier as SubscriptionTier] < tierLevels[resource.accessLevel as SubscriptionTier]) {
                        return res.status(403).json({
                            error: 'Subscription upgrade required to access this content',
                            requiredTier: resource.accessLevel
                        });
                    }
                } catch (err) {
                    // Invalid token, check if resource is free
                    if (resource.accessLevel !== 'free') {
                        return res.status(403).json({
                            error: 'Authentication required to access this content'
                        });
                    }
                }
            } else if (resource.accessLevel !== 'free') {
                return res.status(403).json({
                    error: 'Authentication required to access this content'
                });
            }

            res.json(resource);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch resource" });
        }
    });

    app.post("/api/education", authenticateToken, async (req, res) => {
        // Only admins can create educational resources
        // In a real app, you'd have admin role checks
        try {
            const resourceData = insertEducationalResourceSchema.parse(req.body);
            const resource = await storage.createEducationalResource(resourceData);
            res.status(201).json(resource);
        } catch (error) {
            res.status(400).json({ error: "Invalid resource data" });
        }
    });

    // Admin routes
    app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
        try {
            const users = await storage.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    });

    app.get("/api/admin/reports", authenticateToken, requireAdmin, async (req, res) => {
        try {
            const reports = await storage.getReports();
            res.json(reports);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch reports" });
        }
    });

    app.put("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const { role, isActive, subscriptionTier } = req.body;

            // Sudo users can only be managed by other sudo users
            if (role === 'sudo' && req.user.role !== 'sudo') {
                return res.status(403).json({ error: "Only sudo users can create or manage sudo users" });
            }

            const updatedUser = await storage.updateUser(userId, { role, isActive, subscriptionTier });

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to update user" });
        }
    });

    // Sudo-only routes
    app.post("/api/admin/users", authenticateToken, requireSudo, async (req, res) => {
        try {
            const userData = insertUserSchema.parse(req.body);

            // Force role to be 'user' if not specified by sudo
            if (!userData.role) {
                userData.role = 'user';
            }

            const user = await storage.createUser(userData);
            res.status(201).json(user);
        } catch (error: any) {
            if (error.message === 'Email already in use') {
                return res.status(409).json({ error: error.message });
            }
            res.status(400).json({ error: "Invalid user data" });
        }
    });

    app.delete("/api/admin/users/:id", authenticateToken, requireSudo, async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Prevent sudo users from deleting themselves
            if (userId === req.user.userId) {
                return res.status(400).json({ error: "Cannot delete your own account" });
            }

            const success = await storage.deleteUser(userId);

            if (!success) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete user" });
        }
    });

    const httpServer = createServer(app);
    return httpServer;
}
