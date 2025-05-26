# Agora Collaboration App

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/seans-projects-d3026d8d/v0-agora-collaboration-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/5Q77MbKpMgN)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/seans-projects-d3026d8d/v0-agora-collaboration-app](https://vercel.com/seans-projects-d3026d8d/v0-agora-collaboration-app)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/5Q77MbKpMgN](https://v0.dev/chat/projects/5Q77MbKpMgN)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Database Setup

This project uses Prisma for database management. The database connection string is set via the `DATABASE_URL` environment variable in your `.env` file.

To run database migrations:

```
npx prisma migrate dev
```

Or, to generate the Prisma client after changing the schema:

```
npx prisma generate
```

## Running Automated Tests

To run the automated Jest tests:

```
npm test
```

Or, for watch mode (runs tests on file changes):

```
npm run test -- --watch
```

## Running the Local Development Server

To start the local development server:

```
npm run dev
```

This will start the server at [http://localhost:3000](http://localhost:3000).