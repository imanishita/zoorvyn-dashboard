# Zoorvyn Frontend Dashboard

A modern, responsive financial dashboard built for the Zoorvyn Frontend Intern assignment. This application demonstrates clean architecture, scalable component design, and premium UX decisions.

## Features

- **Dashboard Overview**: Visualizes total balance, income, and expenses with responsive Recharts (Cash Flow Trend and Spending Breakdown).
- **Transactions Management**: Includes searching, filtering, and sorting capabilities.
- **Role-Based UI (RBAC Simulation)**: Toggle between `Viewer` (read-only) and `Admin` mode. Admins have exclusive access to add, edit, and delete transactions.
- **Insights Engine**: Dynamically calculates and displays your savings rate, highest spending category, and largest single expense.
- **Data Persistence**: Transactions and Dark Mode preferences are automatically synced with `localStorage`.
- **Premium Aesthetics**: Features a fully responsive glassmorphism design, smooth Framer Motion page transitions, and an elegant Dark Mode.

## Tech Stack

- **Framework**: React 18 (via Vite for hot module replacement)
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Context API, LocalStorage
- **Data Visualization**: Recharts
- **Animations**: Framer Motion

## Getting Started

1. **Navigate into the directory**:
   ```bash
   cd zoorvyn-dashboard
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).

## Architecture & Code Structure

The project follows a scalable, feature-based pattern:

- **`src/context/`**: Contains `ThemeContext`, `RoleContext`, and `TransactionContext`. Keeping global state decoupled from UI components.
- **`src/components/`**: Reusable generic UI elements (e.g., the `Layout` wrapper, navigation).
- **`src/features/`**: Domain-specific logic divided into `dashboard`, `transactions`, and `insights`. This structure makes the codebase easy to navigate and scale if more financial features are added.
- **`src/data/`**: Initial mock data structured to seed the application on first launch.

## Design Decisions

- **Color Palette**: Utilized an "Emerald" accent color to denote financial positivity and brand identity, contrasted heavily in dark mode for readability.
- **Context over Redux**: For a project of this scope, React Context is combined with custom hooks (`useTransactions`, `useRole`) to provide clean, boilerplate-free state management.
- **Framer Motion**: Applied subtle micro-animations to route changes and modal mounts to make the app feel "expensive" and authentic without overwhelming the user.
