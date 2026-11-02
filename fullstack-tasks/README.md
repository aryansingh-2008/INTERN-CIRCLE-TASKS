# InternCircle Fullstack Developer Suite

A production-grade, white-themed fullstack web application inspired by the clean, minimal SaaS interface of **ScamShield**. Built with **React 18**, **TypeScript**, **Tailwind CSS**, **Node.js / Express**, and a serverless **SQLite 3** database.

---

## ✦ Design System (ScamShield Aesthetic)

The entire user interface strictly follows a clean, predominantly white visual standard:

- **Canvas Background:** Pure White (`#FFFFFF`)
- **Secondary Surfaces:** Crisp Off-White (`#F8FAFC`)
- **Primary Text:** Dark Navy / Black (`#172033`)
- **Secondary Text:** Slate Gray (`#64748B`)
- **Accent Color:** Professional Blue (`#2563EB`)
- **Borders:** Thin Subtle Gray (`#E5E7EB`)
- **Cards & Containers:** 12px rounded corners (`rounded-xl`), soft shadows (`0 1px 3px rgba(0,0,0,0.04)`), no colorful backgrounds
- **Discipline:** No dark mode, no excessive gradients, no glassmorphism, no cluttered layouts

---

## ✦ The Five Completed Assignments

| Project | Title | Route | Stack | Key Features & Implementation |
|:---:|:---|:---:|:---|:---|
| **01** | **Personal Portfolio Landing Page** | `/portfolio` | React, TS, Tailwind, Express, SQLite | Hero introduction, profile avatar, About Me, technical skills grid, featured project cards, education/experience timeline, and a fully functional contact form connected to the SQLite backend database (`POST /api/contact`). |
| **02** | **Interactive To-Do List** | `/todo` | React, LocalStorage, CRUD | Add, inline-edit, delete, and mark tasks complete. Full persistence across page reloads using browser LocalStorage. Live task metrics (total, pending, completed) and search/category filters. |
| **03** | **Responsive Pricing Cards** | `/pricing` | React, Tailwind, State | Starter ($15/mo), Professional ($39/mo - Recommended), and Enterprise ($99/mo) plans. Monthly and yearly billing switch with dynamic ~20% discount calculation, feature comparison matrix, and checkout confirmation modal with promo code support (`INTERN20`). |
| **04** | **Live Weather Dashboard** | `/weather` | Fetch API, Open-Meteo REST | Global city search, real-time temperature, condition badge & icons, humidity, wind velocity, atmospheric pressure, feels-like metrics, and 5-day daily forecast with Celsius/Fahrenheit toggle. |
| **05** | **Interactive Quiz & Mini E-Commerce App** | `/quiz`, `/shop` | React, SQLite, REST | **Quiz Mode:** 10 web development multiple-choice questions, progress indicator, instant explanation feedback, final score card, and restart.<br>**Store Mode:** Developer product catalog, search & category filters, product details modal, cart drawer with quantity adjusters, subtotal/tax calculations, and checkout form that stores orders in the SQLite backend database (`POST /api/orders`). |

---

## ✦ Technology Stack & Architecture

```text
fullstack-suite/
├── database.sqlite         # SQLite 3 Database (messages, products, orders)
├── package.json            # Root workspace scripts
├── run.bat                 # Windows quick launcher
│
├── server/                 # Backend Node.js + Express REST API
│   ├── package.json
│   ├── .env / .env.example
│   └── src/
│       ├── index.js        # Server entry, routes mount & static client serving
│       ├── db.js           # SQLite tables setup & initial products seeder
│       └── routes/
│           ├── contact.js  # POST & GET /api/contact
│           ├── products.js # GET /api/products & /api/products/:id
│           ├── orders.js   # POST & GET /api/orders
│           └── weather.js  # GET /api/weather (Open-Meteo & OpenWeather proxy)
│
└── client/                 # Frontend React 18 + TypeScript + Vite
    ├── package.json
    ├── vite.config.ts      # Proxy /api to Express backend
    ├── tailwind.config.js  # ScamShield color definitions
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx         # React Router navigation
    │   ├── components/
    │   │   ├── Layout.tsx  # Persistent Sidebar + Header wrapper
    │   │   ├── Sidebar.tsx # Clean navigation with live database status
    │   │   └── Header.tsx  # Breadcrumb, global search, and user profile
    │   └── pages/
    │       ├── Dashboard.tsx
    │       ├── Portfolio.tsx
    │       ├── TodoList.tsx
    │       ├── Pricing.tsx
    │       ├── Weather.tsx
    │       └── QuizAndShop.tsx
```

---

## ✦ Getting Started & Running

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; verified on v22)
- **npm** (v9 or higher)

### 2. Run the Fullstack Application
From the `fullstack-suite` directory:

```bash
# Option A: Windows Quick Launcher
run.bat

# Option B: Terminal Command
npm start
```

Then visit **`http://localhost:5000`** in your browser!

### 3. Development Mode (Optional)
If you wish to run the Vite dev server with Hot Module Replacement (HMR):
```bash
# Terminal 1 (Backend API)
npm run server

# Terminal 2 (React Vite Dev Server)
npm run client
```
The React frontend will be available at `http://localhost:3000` with automated proxying to the Express API on port 5000.

---

## ✦ REST API Documentation

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | System diagnostics & SQLite record counts |
| `POST` | `/api/contact` | Validate and store portfolio contact messages in SQLite |
| `GET` | `/api/contact` | Retrieve list of submitted contact messages |
| `GET` | `/api/products` | Retrieve products catalog with category and search filters |
| `GET` | `/api/products/:id` | Retrieve single product specifications |
| `POST` | `/api/orders` | Validate and store customer checkout orders in SQLite |
| `GET` | `/api/orders` | Retrieve list of confirmed orders |
| `GET` | `/api/weather` | Fetch live weather data and 5-day forecast for any city |

---

## ✦ Quality & Testing Verification

- [x] **Database Connectivity:** Tested SQLite connection, table migrations, and automated initial product catalogue seeding.
- [x] **Contact Form Integration:** Tested `POST /api/contact` with validation (invalid email rejection, character constraints).
- [x] **Order Placement:** Tested e-commerce checkout `POST /api/orders` generating structured order records in SQLite.
- [x] **Weather Integration:** Tested Open-Meteo geocoding and forecast retrieval for multiple global locations.
- [x] **Production Bundle:** Built cleanly via `tsc -b && vite build` in 5.91s with 0 errors.
