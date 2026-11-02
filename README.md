# Asset Performance Tracker

A web application for tracking investment portfolios, recording monthly asset values, and monitoring portfolio performance over time.

**Live Application:** [https://asset-performance-tracker-peach.vercel.app/](https://asset-performance-tracker-peach.vercel.app/)

---

## Overview

Managing investments across different platforms and asset categories can make it difficult to understand how a portfolio is performing.

The Asset Performance Tracker provides a centralized place to organize investments, record their monthly values, track cash flows, and monitor portfolio performance.

Instead of manually calculating changes in asset values every month, users record their monthly figures and let the application organize and calculate the results.

The core principle is:

> The user records what happened. The system does the calculations.

## Features

### 1. Authentication
- Sign in using Google OAuth.
- Authentication handled by Supabase.
- Protected application routes.
- User-specific data access.

### 2. Dashboard
- View an overview of portfolio value.
- Monitor portfolio performance.
- View portfolio breakdown by category.
- Review recent monthly activity.

### 3. Portfolio Management
- View the total portfolio value.
- See how investments are distributed across categories.
- Compare category values and allocation percentages.
- View portfolio performance information.

### 4. Category Management
- Create investment categories.
- View existing categories.
- Edit category names.
- Delete categories.

Examples of investment categories:
- Ghana Stock Exchange
- US Stocks
- Mutual Funds
- Cryptocurrency
- Fixed Income

### 5. Asset Management
- Create assets under investment categories.
- View registered assets.
- Edit asset information.
- Delete assets.
- Organize investments by category.

### 6. Monthly Asset Records
Record the following information for each asset:

- **Asset Value:** Current total value of the investment.
- **Money Added:** Additional contributions made during the month.
- **Money Removed:** Withdrawals made during the month.
- **Income:** Dividends, interest, or other investment income received.

The application stores historical records to support monthly performance tracking.

### 7. History
- View previously recorded monthly asset values.
- Review contributions, withdrawals, and income.
- Track historical investment records.

### 8. Settings
- View account information.
- View authentication information.
- Sign out of the application.

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

### Authentication and Database
- Supabase Authentication
- Supabase PostgreSQL

### Deployment
- Vercel — Frontend hosting
- Render — Backend hosting

---

## Application Architecture

The application follows a frontend/backend architecture.

```text
                 User
                  |
                  v
          React + Vite Frontend
              (Vercel)
                  |
                  | HTTP Requests
                  | Bearer Token
                  v
           Express.js Backend
               (Render)
                  |
          +-------+-------+
          |               |
          v               v
      Supabase         Prisma ORM
      Auth                 |
                           v
                    PostgreSQL
                       (Supabase)
```

### How it works

1. Users authenticate through Supabase using Google.
2. The frontend obtains the user's Supabase access token.
3. API requests include the token in the Authorization header.
4. The Express backend verifies authentication.
5. Prisma handles database operations.
6. PostgreSQL stores categories, assets, and monthly asset records.
7. The backend returns data to the frontend for presentation.

---

## Database Structure

The application uses three main database models:

```text
Category
   |
   | One-to-Many
   |
   v
Asset
   |
   | One-to-Many
   |
   v
MonthlyAssetRecord
```

### Category
Represents an investment category.

### Asset
Represents an individual investment belonging to a category.

### MonthlyAssetRecord
Stores an asset's value and cash-flow information for a particular month.

Each asset can have only one monthly record per month.

---

## Project Structure

The project is organized into separate frontend and backend applications.

```text
asset-performance-tracker/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── layout/
│       ├── lib/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*The structure above shows the main application organization; individual files may vary as the project evolves.*

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Git
- A Supabase account
- A PostgreSQL database (Supabase can provide this)

### 1. Clone the repository

```bash
git clone https://github.com/Bashiru09/asset-performance-tracker.git
```

Navigate into the project:

```bash
cd asset-performance-tracker
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the environment variables required by your backend:

```env
DATABASE_URL=your_supabase_database_connection_string
SUPABASE_URL=your_supabase_project_url
PORT=3000
```

Make sure the variable names match those used by your backend configuration.

Generate the Prisma Client:

```bash
npx prisma generate
```

Start the backend using the development script defined in `server/package.json`:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Configure your frontend API base URL to point to your backend.

For local development, the backend currently uses:

```text
http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The application should now be available at:

```text
http://localhost:5173
```

---

## API Overview

The backend exposes REST API endpoints under:

```text
/api/v1
```

Main API resources include:

| Resource | Base endpoint |
|---|---|
| Categories | `/api/v1/categories` |
| Assets | `/api/v1/assets` |
| Monthly Asset Records | `/api/v1/monthly-asset-records` |
| Portfolio | `/api/v1/portfolios` |

Portfolio endpoints include:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/portfolios/summary` | Monthly portfolio summary |
| GET | `/portfolios/category-summary` | Category allocation summary |
| GET | `/portfolios/performance` | Portfolio performance |
| GET | `/portfolios/history` | Historical portfolio values |

Protected endpoints require a valid Supabase access token.

---

## Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database and authentication:** Supabase

Live application:

[https://asset-performance-tracker-peach.vercel.app/](https://asset-performance-tracker-peach.vercel.app/)

For a production deployment, configure the frontend environment variables, backend environment variables, Supabase authentication redirect URLs, and backend CORS allowed origins to match the deployed domains.

Never commit `.env` files, database credentials, or private service-role keys to Git.

---

## Project Scope

The Asset Performance Tracker focuses on recording and analyzing investment performance.

It is not intended to function as:

- A brokerage platform.
- A trading application.
- A real-time stock price tracker.
- An investment recommendation service.

Asset values are entered by users based on information from their investment platforms.

## Author

Developed as a personal software engineering project to simplify investment portfolio tracking and demonstrate full-stack application development.

**Live Demo:** [Asset Performance Tracker](https://asset-performance-tracker-peach.vercel.app/)
