# AI Tutor

AI Tutor is a full-stack, AI-powered learning platform that lets users generate and study personalized courses on any topic. It uses Google's Gemini AI to produce structured course content, interactive knowledge tests, and a per-lesson Teaching Assistant, while Razorpay handles premium subscription billing.

## Features

### Core Learning
- **AI Course Generation** — Instantly generate structured courses (modules + lessons with HTML-rich content) on any topic using Google Gemini AI
- **Difficulty Levels** — Choose Beginner, Intermediate, or Advanced when creating a course
- **Lesson Content** — Rich HTML-formatted lessons with headings, code blocks, lists, and more
- **Knowledge Tests** — AI-generated quizzes at the end of each lesson to test understanding
- **Teaching Assistant** — Per-lesson AI chatbot (powered by Gemini) that answers questions in context
- **Progress Tracking** — Track lesson completion and overall course progress per user

### Productivity
- **Bookmarks** — Bookmark any lesson for quick reference
- **Notes** — Write and save personal notes per lesson
- **Course Statistics** — Visual stats (module count, lesson count, progress) with Recharts charts
- **User Activity Feed** — Recent activity timeline on the dashboard

### Auth & Access
- **Google OAuth** — Sign in with Google via NextAuth.js
- **Email/Password Auth** — Register and sign in with email + Argon2-hashed passwords
- **Subscription Gate** — Free users get limited course access; premium users get unlimited access
- **Razorpay Payments** — Monthly (₹499/mo) and Yearly (₹4,999/yr) premium plans with in-app checkout

### UI/UX
- **Dark / Light Mode** — System-aware theme toggle via `next-themes`
- **Animated UI** — Framer Motion page transitions and floating hero elements
- **Responsive Design** — Mobile-first layout with Tailwind CSS and Shadcn UI components

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Runtime | Bun |
| UI | React 19, Tailwind CSS, Shadcn UI, Radix UI |
| Animations | Framer Motion |
| AI | Google Gemini AI (`@google/generative-ai`) |
| Auth | NextAuth.js v4 (Google OAuth + Credentials) |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon DB recommended) |
| Payments | Razorpay |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Markdown | `react-markdown`, `remark-gfm`, `rehype-highlight` |
| Email | Nodemailer |
| Password Hashing | Argon2 |

## Project Structure

```
app/
├── api/               # Next.js API routes
│   ├── auth/          # NextAuth endpoints
│   ├── bookmarks/     # Bookmark CRUD
│   ├── course-statistics/
│   ├── courses/       # Course generation, listing, access checks
│   ├── health/        # Health check endpoint
│   ├── knowledge-test/
│   ├── notes/         # Notes CRUD
│   ├── subscriptions/ # Razorpay subscription management
│   ├── teaching-assistant/
│   ├── user-activity/
│   └── user-progress/
├── auth/              # Sign in / Sign up pages
├── bookmarks/
├── course-form/       # New course creation page
├── courses/[id]/      # Course detail + lesson viewer
├── dashboard/
├── notes/
├── profile/
└── subscription/      # Pricing + checkout page
components/            # Reusable React components
lib/                   # Auth, Prisma client, Gemini, Razorpay, utils
prisma/
└── schema.prisma      # Database schema
```

## Database Schema

Key models:

- **User** — Auth fields + subscription status (`free` / `premium` / `cancelled`), Razorpay IDs, free course quota
- **Course** — Topic, difficulty, public/private flag, belongs to User
- **Module / Lesson** — Hierarchical course structure; lessons store HTML content and JSON exercises
- **UserProgress** — Per-user per-course progress percentage
- **Note / Bookmark** — Per-user per-lesson
- **SubscriptionTransaction** — Payment history

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime (used exclusively — do not use npm/pnpm)
- PostgreSQL database (local or [Neon](https://neon.tech))
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))
- Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))
- Razorpay account (for subscription payments)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-tutor.git
cd ai-tutor
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the project root and populate it:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_SECRET_ID="your-razorpay-secret"

# Optional: Email (Nodemailer)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="user@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@example.com"
```

4. Run database migrations and generate the Prisma client:

```bash
bunx prisma migrate dev
```

5. Start the development server:

```bash
bun run dev
```

The application will be available at **http://localhost:3000**.

### Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Generate Prisma client and build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:studio` | Open Prisma Studio (database GUI) |

## API Endpoints

All API routes are served from the Next.js backend at `/api/*`.

| Route | Description |
|---|---|
| `POST /api/courses/generate` | Generate a new AI course |
| `GET /api/courses` | List user's courses |
| `GET /api/courses/access` | Check module access for subscription gate |
| `GET/POST /api/notes` | Manage lesson notes |
| `GET/POST /api/bookmarks` | Manage lesson bookmarks |
| `POST /api/knowledge-test` | Generate a knowledge test for a lesson |
| `POST /api/teaching-assistant` | Chat with the lesson Teaching Assistant |
| `GET /api/user-progress` | Get course progress |
| `POST /api/user-progress` | Update lesson completion |
| `GET /api/course-statistics` | Get course/lesson statistics |
| `GET /api/user-activity` | Get recent user activity |
| `GET /api/subscriptions` | Get subscription info and plans |
| `POST /api/subscriptions` | Create a Razorpay order and verify payment |
| `GET /api/health` | Health check (app + database) |

## Subscription Plans

| Plan | Price | Details |
|---|---|---|
| Free | ₹0 | Limited course access (module 1 only) |
| Premium Monthly | ₹499/month | Unlimited course + module access, AI instructor, priority support |
| Premium Yearly | ₹4,999/year | All monthly features + 2 months free |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel automatically runs `bun run build`

### VPS / Self-hosted

```bash
git clone https://github.com/yourusername/ai-tutor.git
cd ai-tutor
bun install
bunx prisma migrate deploy
bun run build
bun run start
```

Use a process manager like [PM2](https://pm2.keymetrics.io) or tmux to keep the process alive:

```bash
# Using tmux
tmux new-session -d -s ai-tutor 'bun run start'
```

### Docker

```bash
docker build -t ai-tutor .
docker run -p 3000:3000 --env-file .env ai-tutor
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Google Gemini AI](https://ai.google.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
