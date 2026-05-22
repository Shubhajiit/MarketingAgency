# AI Scale — Workshop Platform

A scalable workshop-booking and paid video-learning platform built with a separated frontend and backend architecture.

## Overview

AI Scale lets users:

- browse public workshop listings
- pick a workshop slot and pay for booking
- receive instant booking confirmation by email
- browse a public video library
- purchase access to individual videos
- watch purchased videos from their dashboard using signed, time-limited stream URLs

The project is designed for **10,000+ concurrent users** and uses a clean split between the frontend and backend.

## Architecture at a Glance

- **Frontend repo:** Next.js 14 + React
- **Backend repo:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Cache / queue storage:** Redis (Upstash)
- **Email:** AWS SES through BullMQ worker jobs
- **Payments:** Razorpay for India, Stripe for international payments
- **Video delivery:** Cloudflare Stream / Mux with signed URLs
- **Hosting:** Vercel for frontend, Railway / Render for backend

Frontend and backend communicate only through a versioned REST API at:

`https://api.aiscale.in/api/v1`

## Core User Flows

### Workshop booking

1. User opens the public workshop listing
2. User selects a workshop and a date/slot
3. If not logged in, user is prompted to register or sign in
4. User pays through Razorpay or Stripe
5. Payment webhook confirms the payment
6. Booking is saved
7. Confirmation email is sent
8. User lands on a booking confirmation page

### Video library

1. User opens the public video listing
2. User selects a video
3. A paywall modal shows the price
4. After payment, access is granted immediately
5. User watches the video from the dashboard anytime
6. Stream URLs are never exposed publicly; access is delivered through signed URLs

## Repository Structure

### Backend

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── env.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Workshop.js
│   │   ├── Booking.js
│   │   ├── Video.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── workshop.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── video.routes.js
│   │   ├── user.routes.js
│   │   ├── webhook.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── queues/
│   ├── utils/
│   └── app.js
├── worker.js
├── server.js
├── .env
└── package.json
```

### Frontend

```text
frontend/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (protected)/
│   └── admin/
├── components/
│   ├── ui/
│   ├── workshop/
│   ├── video/
│   ├── payment/
│   └── layout/
├── lib/
│   ├── api/
│   └── hooks/
├── store/
├── middleware.ts
└── next.config.ts
```

## Backend Stack

| Package | Purpose |
|---|---|
| express | HTTP server and routing |
| mongoose | MongoDB ODM |
| ioredis | Redis client for caching and rate limiting |
| bullmq | Async job queue |
| jsonwebtoken | JWT signing |
| bcryptjs | Password hashing |
| nodemailer | Email sending |
| razorpay | Razorpay SDK |
| stripe | Stripe SDK |
| zod | Validation |
| helmet | Security headers |
| cors | CORS configuration |
| express-rate-limit | Fallback rate limiting |
| morgan | Request logging |
| dotenv | Env loading |
| @aws-sdk/client-ses | AWS SES integration |
| multer | File uploads |
| cloudflare | Cloudflare video / storage support |
| winston | Structured logging |
| sentry/node | Error monitoring |

## Frontend Stack

| Package | Purpose |
|---|---|
| next@14 | App Router, SSR, SSG, ISR |
| react / react-dom | UI rendering |
| tailwindcss | Styling |
| shadcn/ui | UI components |
| @tanstack/react-query | Server-state caching |
| zustand | Global client state |
| axios | API client |
| react-hook-form + zod | Form validation |
| razorpay | Checkout trigger |
| @stripe/react-stripe-js | Stripe Elements |
| lucide-react | Icons |
| date-fns | Date formatting |
| clsx + tailwind-merge | Class name utilities |
| next-themes | Dark/light mode |

## Database Design

### User

Stores authentication, profile, and purchase data.

Important fields:

- `name`
- `email`
- `passwordHash`
- `avatar`
- `role`
- `isEmailVerified`
- `oauthProvider`
- `oauthId`
- `stripeCustomerId`
- `purchasedVideos`
- `refreshTokens`
- password reset and email verification tokens

Indexes:

- `email`
- `stripeCustomerId`
- `oauthId + oauthProvider`

### Workshop

A workshop contains one or more time slots.

Slot fields:

- `date`
- `startTime`
- `endTime`
- `totalSeats`
- `bookedSeats`
- `isAvailable`
- `meetingLink`

Workshop fields:

- `title`
- `description`
- `instructor`
- `price`
- `currency`
- `thumbnail`
- `tags`
- `isActive`
- `slots`

Indexes:

- `isActive`
- `slots.date`
- `tags`

### Booking

Tracks seat reservation and payment status.

Important fields:

- `user`
- `workshop`
- `slotId`
- `slotDate`
- `slotTime`
- `amount`
- `currency`
- `paymentStatus`
- `paymentId`
- `orderId`
- `confirmationSent`
- `idempotencyKey`

Indexes:

- `user + paymentStatus`
- `workshop + slotId`
- `paymentId`
- `orderId`

### Video

Stores paid video metadata.

Important fields:

- `title`
- `description`
- `thumbnail`
- `duration`
- `price`
- `currency`
- `cloudflareId`
- `isPublished`
- `tags`
- `workshop`

Indexes:

- `isPublished`
- `workshop`

### Payment

Tracks payment gateway transactions for both workshops and videos.

Important fields:

- `user`
- `type` (`booking` or `video`)
- `referenceId`
- `gateway`
- `gatewayPaymentId`
- `gatewayOrderId`
- `amount`
- `currency`
- `status`
- `idempotencyKey`
- `webhookPayload`

Indexes:

- `user + status`
- `gatewayPaymentId`
- `gatewayOrderId`

## API Design

All responses follow a standardized shape:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "errors": null
}
```

## Main REST Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

### Workshops

- `GET /api/v1/workshops`
- `GET /api/v1/workshops/:id`
- `POST /api/v1/workshops`
- `PATCH /api/v1/workshops/:id`
- `DELETE /api/v1/workshops/:id`

### Bookings

- `POST /api/v1/bookings`
- `GET /api/v1/bookings/my`
- `GET /api/v1/bookings/:id`

### Payments

- `POST /api/v1/payments/create-order`
- `POST /api/v1/webhooks/razorpay`
- `POST /api/v1/webhooks/stripe`

### Videos

- `GET /api/v1/videos`
- `GET /api/v1/videos/:id`
- `GET /api/v1/videos/:id/stream`
- `POST /api/v1/videos/:id/purchase`

### User & Admin

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/bookings`
- `GET /api/v1/admin/users`

## Authentication

The platform uses a **two-token strategy**:

- **Access token:** short-lived, stored in memory on the frontend
- **Refresh token:** long-lived, stored in an `httpOnly` cookie

### Token details

- access token expiry: **15 minutes**
- refresh token expiry: **30 days**

### Flow

1. User logs in
2. Backend returns an access token and sets the refresh token cookie
3. Frontend sends the access token in the `Authorization` header
4. On `401`, Axios silently calls the refresh endpoint
5. New access token is stored and the failed request is retried

### Authorization

Admin-only routes are protected by:

- JWT verification
- role check for `admin`

## Booking Logic

Workshop booking is designed to be **atomic and race-condition safe**.

### Booking steps

1. The system checks slot availability atomically
2. It increments `bookedSeats` only if seats are still available
3. A booking record is created with `paymentStatus = pending`
4. Workshop cache is invalidated
5. A delayed job is scheduled to release the seat if payment is not completed in time

### Timeout handling

If payment is not completed:

- booking is marked as failed
- booked seat count is decremented
- workshop cache is cleared

This prevents seat leakage during abandoned checkouts.

## Payment Flow

### Order creation

When creating a payment order:

- the server always fetches the price from the database
- client-supplied amounts are ignored
- Razorpay/Stripe order is created server-side
- a `Payment` document is stored with `status = created`

### Webhook handling

Webhook processing is idempotent:

- signature is verified first
- duplicate events are ignored using `idempotencyKey`
- payment status is updated to `paid`
- booking is marked paid
- booking confirmation email is queued
- video purchases are added to the user account

### Important webhook rule

Webhook routes must use `express.raw()` so the signature can be validated correctly.

## Email Queue

The platform sends emails asynchronously using:

- **BullMQ**
- **Nodemailer**
- **AWS SES**

### Queue behavior

- retries: 3
- exponential backoff
- completion and failure cleanup rules

### Worker responsibilities

The worker sends:

- booking confirmation emails
- supporting transactional messages

### Confirmation email includes

- user name and booking reference
- workshop title and instructor
- booked date and slot time
- meeting link or venue details
- support contact
- unsubscribe/manage link

## Video Access Control

Paid videos are protected by signed, time-limited stream URLs.

### How access works

1. User logs in
2. Backend verifies that the video was purchased
3. Backend generates a signed Cloudflare URL
4. URL is cached temporarily in Redis
5. User receives the stream URL
6. The URL expires automatically

### Rules

- public listing shows metadata only
- stream URL is never exposed publicly
- access is checked per user
- cached signed URLs reduce repeated signing work

## Redis Strategy

Redis is used for:

- route-level response caching
- session / token storage
- rate limiting
- signed stream URL cache
- BullMQ queue storage

### Important cache keys

| Cache Key | TTL | Stores |
|---|---:|---|
| `workshop:list` | 5 min | all active workshops |
| `workshop:{id}` | 10 min | workshop details + slots |
| `video:list` | 10 min | published video list |
| `user:{id}:bookings` | 2 min | booking list |
| `user:{id}:videos` | 5 min | purchased video IDs |
| `video-url:{uid}:{vid}` | 50 min | signed Cloudflare URL |
| `rate:{ip}:{route}` | 1 min | request counter |
| `refresh:{userId}` | 30 days | refresh token hash |
| `admin:stats` | 1 min | dashboard metrics |

### Route caching

Routes can be wrapped with cache middleware so read-heavy endpoints are served quickly.

### Rate limiting

Redis-backed rate limiting is applied per IP and route.

## Security Checklist

- CORS allows only the frontend domain in production
- Helmet adds security headers
- input validation is enforced before DB access
- access tokens stay short-lived
- refresh tokens use `httpOnly` cookies
- passwords are hashed with bcrypt
- payment webhooks are signature-verified
- idempotency prevents duplicate webhook processing
- amount is always trusted from the database, not the client
- admin routes require both JWT and admin role
- rate limiting protects mutation endpoints
- stack traces are hidden in production
- large payloads are blocked

## Frontend Architecture

### Routes

#### Public
- homepage
- workshop listing
- workshop detail
- video library
- video detail

#### Auth
- login
- register

#### Protected
- dashboard
- bookings
- purchased videos
- checkout

#### Admin
- stats
- workshops management
- videos management

### Rendering strategy

| Page | Mode | Why |
|---|---|---|
| Homepage | ISR | occasional updates |
| Workshop listing | ISR | SEO and low churn |
| Workshop detail | ISR | slot data changes often |
| Video library | ISR | public listing |
| Video detail | ISR | metadata is mostly static |
| Login/Register | SSG | fully static |
| Checkout | CSR | user-specific |
| Dashboard | SSR | personalized |
| My bookings | SSR + React Query | always fresh |
| My videos | SSR + React Query | always fresh |
| Admin panel | CSR | no SEO needed |

### State and data fetching

The frontend uses:

- Axios with silent refresh
- Zustand for auth state
- React Query for server data
- `httpOnly` cookie support via `withCredentials`

## Key UI Components

- **Slot Picker:** groups workshop slots by date and disables full slots
- **Paywall Modal:** handles video purchase gating
- **Razorpay Button:** launches client-side checkout

## API Communication Pattern

Frontend and backend communicate only through:

- HTTPS
- versioned REST API
- allowed frontend origin
- cookie-based credential flow

### Environment variables

#### Frontend

```env
NEXT_PUBLIC_API_URL=https://api.aiscale.in/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxx
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=xxxxxxxxx
```

#### Backend

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://aiscale.in
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aiscale
JWT_ACCESS_SECRET=<64-char-random>
JWT_REFRESH_SECRET=<64-char-random>
REDIS_URL=rediss://default:token@endpoint.upstash.io:6380
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

## DevOps and Deployment

### Backend Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Worker process

The BullMQ worker runs as a separate process using the same image but a different command:

```bash
node worker.js
```

### CI/CD

GitHub Actions can:

- run tests on push to main
- deploy the backend service
- deploy the frontend service

## Scalability Plan

The system is prepared for **10,000+ concurrent users** using:

- `.lean()` for read-only MongoDB queries
- selective field projection
- indexed queries
- compound indexes for workshop listing filters
- connection pooling
- cursor-based pagination instead of offset pagination
- cached listing and detail pages
- queued email delivery
- CDN-backed video access

### Peak-load bottlenecks and solutions

| Bottleneck | Expected Load | Solution |
|---|---:|---|
| Workshop listing | ~8,000 req/min | ISR + Redis cache |
| Booking creation | ~500 concurrent | atomic MongoDB update |
| Payment webhooks | burst traffic | idempotency key |
| Email sending | 500+ emails | BullMQ + SES |
| Video stream URLs | ~2,000 concurrent | CDN + signed URLs |

### Load testing

Use k6 to simulate a traffic ramp to 10K users, with targets such as:

- 95% of requests under 500 ms
- error rate below 1%

## Development Timeline

### Phase 1 — Backend foundation
- Express boilerplate
- MongoDB + Redis connection
- env validation
- global error handling

### Phase 2 — Authentication
- user schema
- register/login/refresh/logout
- middleware for auth and role checks

### Phase 3 — Workshops and booking
- workshop CRUD
- slot management
- atomic booking endpoint
- BullMQ setup

### Phase 4 — Payments
- Razorpay and Stripe order creation
- webhook handler
- payment confirmation flow

### Phase 5 — Email system
- email templates
- BullMQ worker
- AWS SES integration

### Recommended next phase
After the backend is stable, wire the frontend to the API and complete the user flows end to end.

## Final Notes

This architecture is production-oriented and focuses on:

- clear separation of concerns
- secure payment handling
- scalable caching
- reliable async email delivery
- safe slot booking
- gated video access
- deployment-ready service separation

Start with the backend first, then connect the frontend, and finally validate the full payment and booking flow end to end.
