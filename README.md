# 🟢 WhatsApp Automation Chatbot & Admin Dashboard

> **Production-grade WhatsApp Bot + Team Inbox Dashboard** built with NestJS, Prisma, Neon PostgreSQL, Next.js, and Meta WhatsApp Cloud API.

---

## 📁 Monorepo Structure

```
gloaro/
├── apps/
│   ├── backend/          # NestJS API + Bot Engine
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── prisma/          # PrismaService (global)
│   │       ├── whatsapp/        # Sender + Bot Engine services
│   │       ├── webhook/         # Meta webhook handler
│   │       └── conversations/   # Admin REST API
│   └── frontend/         # Next.js 15 Admin Dashboard
│       └── src/
│           ├── app/
│           │   ├── layout.tsx
│           │   ├── globals.css
│           │   └── inbox/page.tsx   # Team Inbox UI
│           ├── components/
│           │   ├── ConversationList.tsx
│           │   ├── ChatPanel.tsx
│           │   └── MessageBubble.tsx
│           ├── lib/
│           │   ├── api.ts           # Type-safe API client
│           │   └── utils.ts
│           └── types/
│               └── api.ts           # Shared TypeScript types
├── package.json          # Monorepo root
└── README.md
```

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | NestJS 10 (TypeScript, strict mode) |
| ORM | Prisma 5 |
| Database | Neon PostgreSQL (serverless, pooled) |
| HTTP Client | Axios |
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Icons | Lucide React |
| WhatsApp API | Meta Graph API v20.0 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- A [Neon](https://neon.tech) account (free tier works)
- A [Meta Developer](https://developers.facebook.com) account with a WhatsApp Business App

---

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

#### Backend (`apps/backend/.env`)

```bash
cp apps/backend/.env.example apps/backend/.env
```

Fill in your values:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1"
META_VERIFY_TOKEN="your_random_verify_token"
META_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxxx"
META_PHONE_NUMBER_ID="123456789012345"
META_WABA_ID="987654321098765"
PORT=3001
```

> **Neon Connection String**: Use the **pooled** connection string (with `pgbouncer=true`) for optimal serverless performance. Find it in Neon Console → Your Project → Connection Details → Pooled connection.

#### Frontend (`apps/frontend/.env.local`)

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

### 3. Set Up the Database (Prisma Migrations)

```bash
cd apps/backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables in Neon)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

> **Production deployments**: Use `npx prisma migrate deploy` instead of `migrate dev`.

---

### 4. Start the Development Servers

Open two terminal windows:

```bash
# Terminal 1 — Backend (NestJS)
cd apps/backend
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend (Next.js)
cd apps/frontend
npm run dev
# → http://localhost:3000
```

---

### 5. Connect Local Backend to Meta Webhook (ngrok)

Meta requires a **publicly accessible HTTPS URL** to deliver webhook events. Use [ngrok](https://ngrok.com) to expose your local backend:

```bash
# Install ngrok (if not already)
npm install -g ngrok

# Expose port 3001
ngrok http 3001
```

Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`).

#### Configure Meta Developer Console

1. Go to [Meta for Developers](https://developers.facebook.com) → Your App → WhatsApp → Configuration
2. Set **Callback URL**: `https://abc123.ngrok.io/webhook`
3. Set **Verify Token**: same value as `META_VERIFY_TOKEN` in your `.env`
4. Click **Verify and Save**
5. Subscribe to **messages** field under Webhook Fields

---

## 🤖 Bot Engine Flow

```
User sends "Hi" / "Hello" / "Menu"
    → Bot replies with Interactive Quick Reply buttons:
        [🛠 1. Services]  [💬 2. Support]  [🧑 3. Talk to Human]

User clicks "Talk to Human"
    → Conversation status → HUMAN_TAKEOVER
    → Bot sends handoff message
    → Bot stops responding (agent can now reply manually)

Agent replies via Dashboard
    → Message sent via WhatsApp Cloud API
    → Saved as senderType = AGENT

Agent toggles back to BOT mode
    → Conversation status → BOT
    → Bot resumes responding
```

---

## 📡 API Endpoints

### Webhook

| Method | Path | Description |
|---|---|---|
| `GET` | `/webhook` | Meta webhook verification |
| `POST` | `/webhook` | Receive WhatsApp events |

### Conversations (Admin API)

| Method | Path | Description |
|---|---|---|
| `GET` | `/conversations` | List all conversations |
| `GET` | `/conversations/:id/messages` | Get message history |
| `POST` | `/conversations/:id/reply` | Agent sends reply |
| `PATCH` | `/conversations/:id/status` | Toggle BOT / HUMAN_TAKEOVER |

---

## 🗄️ Database Schema

```prisma
model Contact {
  id        String
  waId      String   @unique    // WhatsApp phone number
  name      String
}

model Conversation {
  id          String
  contactId   String
  status      BOT | HUMAN_TAKEOVER
  unreadCount Int
}

model Message {
  id             String
  conversationId String
  metaMessageId  String?         // Meta's message ID for status updates
  senderType     USER | BOT | AGENT
  type           TEXT | INTERACTIVE | TEMPLATE
  body           String
  status         SENT | DELIVERED | READ
  timestamp      DateTime
}
```

---

## 🖥️ Frontend Dashboard Features

- **Left Pane**: Conversation list with real-time unread badges, search, and status filters (All / Bot / Human)
- **Right Pane**: Full chat history with colored message bubbles per sender type
- **Status Badges**: Sent ✓ / Delivered ✓✓ (blue) / Read ✓✓ (green)
- **Action Bar**: One-click toggle between Bot Mode and Human Agent Takeover
- **Auto-refresh**: Polls every 5-8 seconds for new messages/conversations
- **Dark Theme**: Premium glassmorphism dark UI

---

## 🔒 Security Notes

- Never commit your `.env` file — it's in `.gitignore`
- Use a **Permanent System User Token** (`META_ACCESS_TOKEN`) — not a temporary user token
- For production, implement proper authentication (JWT/API keys) on the admin API
- Use Neon's IP allowlist feature for database access control

---

## 🚢 Production Deployment

### Backend (Railway / Render / Fly.io)

```bash
cd apps/backend
npm run build
npm run start:prod
```

Set environment variables in your cloud provider's dashboard.

### Frontend (Vercel)

```bash
cd apps/frontend
npm run build
```

Or connect your repo to Vercel and it auto-deploys on push.

### Run DB migrations in production

```bash
npx prisma migrate deploy
```

---

## 📞 WhatsApp Message Templates

For initiating conversations (outside 24-hour window), you'll need approved [Message Templates](https://business.whatsapp.com/products/platform/capabilities/message-templates). Add a `sendTemplateMessage` method to `WhatsappSenderService` following the same Axios pattern.

---

*Built with ❤️ using NestJS + Next.js + Meta WhatsApp Cloud API*
