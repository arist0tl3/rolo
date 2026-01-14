# Rolo - Personal Contact Manager

A simple, fast PWA for remembering people I meet while traveling and working remotely.

🔗 **Live at [rolo.ninja](https://rolo.ninja)**

## The Problem

I travel 2-3 months/year for work and meet tons of people - at conferences, coworking spaces, coffee shops. My phone's contacts app is too slow and cluttered for quick capture. I needed something lightweight that works offline and focuses on context: *where* I met someone and *what* we talked about.

## The Solution

Built a dead-simple Progressive Web App that prioritizes speed and offline-first functionality. Add a contact in seconds, search instantly, works without internet.

## Features

- **Quick Capture**: Name, location, notes - that's it. No friction.
- **Offline-First**: PWA means it works without service (crucial when traveling)
- **Fast Search**: Find people by name, where you met, or conversation topics
- **Clean UI**: No clutter, just the essentials
- **Syncs Across Devices**: MongoDB backend keeps everything in sync

## Tech Stack

**Frontend:**
- React + TypeScript
- PWA (service workers, offline support)
- GraphQL client (Apollo)

**Backend:**
- Node.js + Express
- GraphQL API (type-safe)
- MongoDB

**DX:**
- Full type safety via GraphQL Code Generator
- Monorepo structure
- Hot reload in development

## Architecture

The app uses GraphQL to maintain type safety end-to-end. When the schema changes, types are automatically generated for both client and server, preventing runtime errors and enabling great autocomplete.

Client queries are defined in `.graphql` files, which generate React hooks for data fetching. It's a nice DX for a simple app.

## Local Development
```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Start MongoDB locally (port 27017)

# Copy .env.sample files and configure
# See repo for details

# Run
cd client && npm start      # localhost:3000
cd server && npm run start-dev  # localhost:4000
```

## Why I Built This

Started as a weekend project to solve my own problem. Kept iterating on it because I actually use it daily. It's taught me that the best tools are often the simplest ones - just solve the core problem well.

Also wanted to experiment with PWA capabilities and GraphQL type generation in a real app I'd actually use long-term.

## Status

✅ Live and actively used  
Built over a few weekends in 2024, ongoing minor improvements as I find rough edges while traveling.

---

Built by [@arist0tl3](https://github.com/arist0tl3)
