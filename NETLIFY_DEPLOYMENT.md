# Deploying S.H.I.E.L.D to Netlify

This guide will help you deploy the S.H.I.E.L.D application to Netlify.

## Prerequisites

- A [Netlify](https://netlify.com) account
- Git repository with your S.H.I.E.L.D code
- Node.js installed locally (v16 or higher)

## Deployment Steps

### 1. Install Dependencies

First, make sure all dependencies are installed:

```bash
npm install
```

### 2. Local Testing

Test the application locally with Netlify CLI:

```bash
npm run netlify:dev
```

This will start the application with Netlify Functions support.

### 3. Deploy to Netlify

You can deploy to Netlify in two ways:

#### Option 1: Deploy via Netlify CLI

```bash
# Login to Netlify
npx netlify login

# Deploy to production
npm run netlify:deploy
```

#### Option 2: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select your repository
5. Configure the build settings:
   - Build command: `npm run netlify:build`
   - Publish directory: `dist/public`
6. Click "Deploy site"

### 4. Environment Variables

Set the following environment variables in the Netlify UI:

- `JWT_SECRET`: Secret key for JWT token generation
- `OPENAI_API_KEY`: API key for OpenAI integration (if using AI features)

### 5. Troubleshooting

If you encounter any issues with SCSS compilation:

1. Check that all dependencies are installed:
   ```bash
   npm install sass sass-loader mini-css-extract-plugin --save-dev
   ```

2. Verify that the Vite configuration is correct:
   ```javascript
   // vite.config.ts
   css: {
     preprocessorOptions: {
       scss: {
         additionalData: `@import "@/styles/_variables.scss";`,
       },
     },
   },
   ```

3. Make sure the SCSS files are properly imported in your application.

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vite Documentation](https://vitejs.dev/guide/)