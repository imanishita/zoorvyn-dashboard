<div align="center">

<h1>
  <img src="https://img.shields.io/badge/Zoorvyn-Dashboard-10b981?style=for-the-badge&logoColor=white" alt="Zoorvyn Dashboard" />
</h1>

<p><strong>A modern, production-ready financial dashboard — built for the Zoorvyn Frontend Intern Assignment.</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-22c55e?style=flat-square" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer" />
</p>

</div>

---

## Screenshots

### Dashboard — Dark Mode
![Dashboard Dark](ui/Dashboard.png)

### Dashboard — Light Mode
![Dashboard Light](ui/Dashboard(light).png)

### Transactions & Dropdown Filter
![Transactions Dropdown](ui/Dropdown.png)

### Insights Panel
![Insights](ui/Insights.png)

### Transactions View
![Transactions](ui/Transcation.png)

---

## Overview

Zoorvyn Dashboard is a single-page financial management application that combines clean architecture with premium UI/UX decisions. It demonstrates real-world frontend engineering patterns — Role-Based Access Control, dynamic data visualization, persistent state, and fluid micro-animations — packaged in a polished glassmorphism interface with full Dark Mode support.

---

## Features

| Feature | Description |
|---|---|
| **Dashboard Overview** | Displays total balance, income, and expenses. Includes a Cash Flow Trend line chart and Spending Breakdown donut chart powered by Recharts. |
| **Transactions Management** | Full search, filter, and sort functionality across all transactions with a clean, scannable table layout. |
| **Role-Based UI (RBAC)** | Toggle between `Viewer` (read-only) and `Admin` mode. Only Admins can add, edit, or delete transactions — no backend needed. |
| **Insights Engine** | Dynamically calculates savings rate, highest spending category, and largest single expense from live transaction data. |
| **Data Persistence** | Transactions and Dark Mode preference are synced to `localStorage` — state survives page reloads. |
| **Dark / Light Mode** | Fully themed across every component, with smooth transitions and persistent preference. |
| **Animations** | Framer Motion powers page transitions and modal mounts, giving the app a polished, premium feel. |

---

## Tech Stack

```
React 18          → UI framework (via Vite for fast HMR)
Tailwind CSS      → Utility-first styling
Recharts          → Data visualization (line chart, donut chart)
Framer Motion     → Page transitions & micro-animations
Lucide React      → Icon library
React Context API → Global state management
localStorage      → Client-side data persistence
```

---

## Getting Started

**Prerequisites:** Node.js (v16+) and npm

```bash
# 1. Clone the repository
git clone https://github.com/imanishita/zoorvyn-dashboard.git

# 2. Navigate into the project
cd zoorvyn-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable UI elements (Layout, Navbar, etc.)
├── context/          # Global state — ThemeContext, RoleContext, TransactionContext
├── data/             # mockData.js — seeds the app on first launch
├── features/
│   ├── dashboard/    # Balance cards, Cash Flow chart, Spending chart
│   ├── transactions/ # Transaction table, search, filter, sort, CRUD modals
│   └── insights/     # Computed financial metrics and summaries
└── utils/            # Helper functions (cn.js for class merging, etc.)
```

The project uses a **feature-based architecture** — each domain (dashboard, transactions, insights) is self-contained. Adding a new financial module is as simple as creating a new folder under `features/`.

---

## Design Decisions

**Glassmorphism + Emerald Accent**
The emerald color palette (`#10b981`) was chosen to convey financial positivity and trust. In dark mode, it pops sharply against deep neutral backgrounds for strong readability and visual hierarchy.

**Context API over Redux**
React Context + custom hooks (`useTransactions`, `useRole`, `useTheme`) provides clean, boilerplate-free state management that is perfectly scoped for this application. Redux would be overkill and add unnecessary complexity.

**Framer Motion for "Expensive" Feel**
Subtle route transitions and modal animations make the app feel thoughtfully crafted. The animations are intentionally restrained — they enhance, not distract.

**RBAC without a Backend**
The Admin/Viewer toggle simulates real-world RBAC patterns entirely on the client side, demonstrating how access control logic can be cleanly decoupled from UI components using Context.

---

## License

This project was built as part of a frontend internship assignment. Feel free to explore the code.

---

<div align="center">
  <sub>Built with care by <strong>Manishita</strong></sub>
</div>