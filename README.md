# S.H.I.E.L.D (Safe Haven of Information & Enterprising Low Deterrency)

S.H.I.E.L.D is an application designed to detect and protect against audio-based harassment, including sound cannons and voice-to-skull technologies.

## Features

- Real-time audio frequency detection
- Automated countermeasures
- Detailed reporting system
- AI chat assistance
- Educational resources
- UK-specific features and compliance with GDPR

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or use Neon serverless PostgreSQL)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shield-protection.git
   cd shield-protection
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your configuration:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Create a sudo user (optional):
   ```bash
   npm run create-sudo
   ```

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start the server at http://localhost:3000.

### Production

To build and run the application in production mode:

1. Build the application:
   ```bash
   npm run build:clean
   ```

2. Start the server:
   ```bash
   npm start
   ```

## Deployment

The application can be deployed to Vercel:

```bash
vercel --prod
```

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared code between client and server
- `/scripts` - Utility scripts

## License

This project is licensed under the MIT License - see the LICENSE file for details.# S.H.I.E.L.D. Application

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