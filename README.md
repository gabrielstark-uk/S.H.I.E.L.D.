# S.H.I.E.L.D. Application

A full-stack application for detecting and protecting against audio-based harassment.

## Deployment to Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional for local testing)
3. A database (e.g., [Neon](https://neon.tech) for PostgreSQL)

### Environment Variables

Set up the following environment variables in your Vercel project:

- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `OPENAI_API_KEY`: API key for OpenAI integration
- `NODE_ENV`: Set to "production" for production deployment

### Deployment Steps

1. Fork or clone this repository
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the application

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Run the development server:
   ```
   npm run dev
   ```

## Features

- Audio analysis for detecting harassment
- User authentication and profile management
- Subscription tiers with different feature sets
- Educational resources
- AI-powered chat assistance
- Report generation and management

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- Authentication: JWT
- AI Integration: OpenAI API