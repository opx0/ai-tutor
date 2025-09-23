# AI Tutor

AI Tutor is an AI-powered learning platform that helps users create personalized courses on any topic using Google's Gemini AI.

## Tech Stack

- Next.js 15
- React 19
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Google Gemini AI
- Tailwind CSS
- Shadcn UI

## Getting Started

This guide will walk you through setting up the AI Tutor project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Bun](https://bun.sh/) (v1.0 or newer)
- A [PostgreSQL](https://www.postgresql.org/) database
- Google OAuth Credentials
- A Google Gemini API Key

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/ai-tutor.git
cd ai-tutor
```

### 2. Install Dependencies

Install all the project dependencies using Bun:

```bash
bun install
```

### 3. Set Up Environment Variables

Copy the example environment file to a new `.env` file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required values for your database, Google credentials, and Gemini API key.

### 4. Set Up the Database

Run the Prisma migration to set up your database schema:

```bash
npx prisma migrate dev
```

### 5. Run the Application

Start the development server:

```bash
bun run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).
