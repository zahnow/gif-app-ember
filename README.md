# GIF App

A full-stack application for browsing, sharing, commenting on, and rating GIFs. This application features a modern React frontend built with Next.js and Chakra UI, and a Node.js backend with Express.

![image](./docs/screenshots/Screenshot%202025-07-20%20at%2019-59-03%20Gif%20Finder.png)
![image](./docs/screenshots/Screenshot%202025-07-20%20at%2019-59-25%20Gif%20Finder.png)
![image](./docs/screenshots/Screenshot%202025-07-20%20at%2019-59-49%20Gif%20Finder.png)

## Features

- User authentication (login/register)
- Browse trending GIFs
- Search for GIFs
- View GIF details
- Comment on GIFs
- Rate GIFs

## Tech Stack

### Frontend (Client)

- **Next.js 15** - React framework
- **Chakra UI** - Component library
- **TypeScript** - Type safety
- **better-auth** - Authentication library

### Backend (Server)

- **Express** - Web server framework
- **Drizzle ORM** - Database ORM
- **LibSQL/Turso** - Database
- **TypeScript** - Type safety
- **better-auth** - Authentication library

## Project Structure

The project is organized as a monorepo with two main workspaces:

- `client/` - Next.js frontend application
- `server/` - Express backend API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/zahnow/gif-app.git
   cd gif-app
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables
   - Create a `.env` file in the `server` directory based on `.env.example`
   - Create a `.env.local` file in the `client` directory based on `.env.example`

### Development

Start both client and server in development mode:

```bash
pnpm dev
```

This will start:

- Frontend on [http://localhost:3000](http://localhost:3000)
- Backend on [http://localhost:3001](http://localhost:3001)

### Building for Production

Build both client and server:

```bash
pnpm --filter client build
pnpm --filter server build
```

## API Endpoints

The backend API provides the following endpoints (unless otherwise noted, they require user authentication):

- **GIFs**
  - `GET /api/gifs/` - Get trending GIFs (Bearer token protected)
  - `GET /api/gifs/search` - Search for GIFs
  - `GET /api/gifs/:id` - Get a specific GIF (Bearer token protected)

- **Comments**
  - `GET /api/comments/:gifId` - Get comments for a GIF
  - `POST /api/comments` - Add a comment
  - `PUT /api/comments/:id` - Update a comment
  - `DELETE /api/comments/:id` - Delete a comment

- **Ratings**
  - `GET /api/ratings/:gifId` - Get the rating for a GIF for a specific user
  - `POST /api/ratings` - Add a rating
  - `PUT /api/ratings/:id` - Update a user's rating

## Author

Nick Zahnow
