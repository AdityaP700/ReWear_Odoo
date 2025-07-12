# ReWear Backend Design

This document outlines the backend architecture, data models, API endpoints, and implementation plan for the ReWear application.

## 1. Technology Stack

- **Framework**: Next.js (using API Routes for the backend)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Next-Auth.js or custom JWT-based authentication

## 2. Data Models (Prisma Schema)

We will define the following models in `prisma/schema.prisma`.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  hashedPassword String
  emailVerified DateTime?
  image         String?
  points        Int       @default(100) // Starting points for new users
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  listedItems   Item[]    @relation("UserItems")
  swapHistoryAsRequester Swap[] @relation("RequesterSwaps")
  swapHistoryAsResponder Swap[] @relation("ResponderSwaps")
  purchases     Item[]    @relation("PurchasedItems")
}

model Item {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  tags        String[]
  images      String[]
  status      ItemStatus @default(PENDING_APPROVAL)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  ownerId     String
  owner       User     @relation("UserItems", fields: [ownerId], references: [id])

  purchasedById String?
  purchasedBy   User?   @relation("PurchasedItems", fields: [purchasedById], references: [id])

  swapsAsItem1  Swap[]   @relation("Item1Swaps")
  swapsAsItem2  Swap[]   @relation("Item2Swaps")
}

model Swap {
  id        String     @id @default(cuid())
  status    SwapStatus @default(PENDING)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Requester's info
  requesterId String
  requester   User     @relation("RequesterSwaps", fields: [requesterId], references: [id])
  requesterItemId String
  requesterItem   Item     @relation("Item1Swaps", fields: [requesterItemId], references: [id])

  // Responder's info
  responderId String
  responder   User     @relation("ResponderSwaps", fields: [responderId], references: [id])
  responderItemId String
  responderItem   Item     @relation("Item2Swaps", fields: [responderItemId], references: [id])
}

enum Role {
  USER
  ADMIN
}

enum ItemStatus {
  PENDING_APPROVAL
  AVAILABLE
  REJECTED
  SWAPPED
  REDEEMED
}

enum SwapStatus {
  PENDING
  ACCEPTED
  REJECTED
  COMPLETED
  CANCELLED
}
```

## 3. API Endpoints

All endpoints will be under `/api/`.

### 3.1. Authentication (`/api/auth/...`)

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and return a session token.
- `POST /api/auth/logout`: Log out the user.
- `GET /api/auth/session`: Get the current user's session information.

### 3.2. Users (`/api/users/...`)

- `GET /api/users/me`: Get the profile, points, and items for the currently logged-in user (for the dashboard).
- `GET /api/users/:id`: Get a public user profile.
- `PUT /api/users/me`: Update the current user's profile.

### 3.3. Items (`/api/items/...`)

- `GET /api/items`: Get a list of all `AVAILABLE` items (for the browse page). Supports filtering and pagination.
- `GET /api/items/:id`: Get details for a single item.
- `POST /api/items`: Create a new item. The item status will be `PENDING_APPROVAL`.
- `PUT /api/items/:id`: Update an item's details (only for the item owner).
- `DELETE /api/items/:id`: Delete an item (only for the item owner).
- `POST /api/items/:id/redeem`: Redeem an item using points.

### 3.4. Swaps (`/api/swaps/...`)

- `POST /api/swaps`: Initiate a new swap request.
- `GET /api/swaps`: Get the user's swap history (both as requester and responder).
- `PUT /api/swaps/:id`: Respond to a swap request (accept or reject).
- `PUT /api/swaps/:id/cancel`: Cancel a pending swap request.

### 3.5. Admin (`/api/admin/...`)

- `GET /api/admin/items/pending`: Get all items with `PENDING_APPROVAL` status.
- `PUT /api/admin/items/:id/status`: Approve or reject an item.
- `DELETE /api/admin/items/:id`: Remove an inappropriate item.
- `GET /api/admin/users`: Get a list of all users.
- `PUT /api/admin/users/:id`: Update a user's role or status.

## 4. Implementation Workflow

1.  **Setup Environment**: Install PostgreSQL (e.g., via Docker) and configure environment variables (`.env` file) for the database connection string.
2.  **Install Dependencies**: Add Prisma and Next-Auth.js to the project.
    ```bash
    pnpm add prisma @prisma/client next-auth
    pnpm add -D @types/node
    ```
3.  **Initialize Prisma**:
    ```bash
    pnpm prisma init
    ```
    This creates the `prisma` directory and the `schema.prisma` file.
4.  **Define Schema**: Copy the data models above into `prisma/schema.prisma`.
5.  **Run First Migration**:
    ```bash
    pnpm prisma migrate dev --name init
    ```
    This will create the database tables based on your schema.
6.  **Implement Authentication**: Set up Next-Auth.js with an email/password provider.
7.  **Build API Routes**: Create the API endpoint files in `app/api/` directory by directory, starting with authentication, then items, users, etc.
8.  **Connect Frontend**: Update the frontend pages to fetch data from your new API endpoints instead of using static data.
9.  **Admin Panel**: Create a new section in the app for admin users to manage items and users.

This structured approach will allow us to build the backend systematically and ensure all features are covered.