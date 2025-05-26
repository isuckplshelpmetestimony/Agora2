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

## Database Seeding

To seed the database with sample data (users, boards, sprints, tasks):

```
npx prisma db seed
```

Or, if you want to run the seed script directly:

```
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

## API Endpoints

### Sprints
- `GET /api/sprints` — List all sprints with computed metrics
- `POST /api/sprints` — Create a new sprint
- `GET /api/sprints/:id` — Get a single sprint with metrics
- `PATCH /api/sprints/:id` — Update a sprint
- `DELETE /api/sprints/:id` — Delete a sprint
- `GET /api/sprints/:id/burndown` — Get burndown data for a sprint
- `GET /api/sprints/:id/performance` — Get team performance for a sprint

### Tasks
- `GET /api/tasks` — List all tasks
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Update a task
- `DELETE /api/tasks/:id` — Delete a task

### Users
- `GET /api/users` — List all users
- `POST /api/users` — Create a new user (signup)

### Boards
- `GET /api/boards` — List all boards

### Events
- `GET /api/events` — List all events (optionally filter by date or range)
- `POST /api/events` — Create a new event

## Starting the Backend and Frontend

To start the local development server (backend + frontend):

```
npm run dev
```

This will start the app at [http://localhost:3000](http://localhost:3000).

---

For more details, see the code and API route files in the `app/api/` directory.

## Running Automated Tests

To run the automated Jest tests:

```
npm test
```

Or, for watch mode (runs tests on file changes):

```
npm run test -- --watch
```