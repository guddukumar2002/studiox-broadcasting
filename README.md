# StudioX — Content Broadcasting System

A frontend application for educational content broadcasting. Teachers upload subject-based content, principals approve or reject it, and students view live broadcasts on a public page.

Built with **Next.js 14**, **Tailwind CSS**, **React Hook Form**, **Zod**, and **Framer Motion**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Toasts | Sonner |
| Icons | Lucide React |
| Language | JavaScript (ES6+) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/studiox-broadcasting.git
cd studiox-broadcasting

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Teacher | teacher@school.com | password |
| Principal | principal@school.com | password |

> Use the **Quick Access Demo** buttons on the login page for one-click access.

---

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components (Skeleton, StatusBadge, EmptyState)
├── context/          # AuthContext — global session state
├── hooks/            # useContent, useApprovals — data fetching with loading/error states
├── layouts/          # DashboardLayout — sidebar + mobile nav + auth guard
├── services/         # auth.service.js, content.service.js, approval.service.js
└── utils/            # mockData.js — localStorage persistence layer
```

---

## Key Features

- **Role-based routing** — Teachers and Principals see different dashboards and navigation
- **Service layer** — All API calls go through `services/` (easily replaceable with real backend)
- **React Hook Form + Zod** — Full form validation with inline field errors
- **File validation** — JPG, PNG, GIF only · Max 10MB · Preview before upload
- **Scheduling status** — Scheduled / Active / Expired badges based on time data
- **Skeleton loaders** — Shown during all data fetches
- **Empty & error states** — Handled gracefully on every page
- **Approval workflow** — Principal can approve or reject with mandatory reason via modal
- **Public live page** — `/live/:teacherId` — no auth required, auto-refreshes every 5s
- **Responsive** — Sidebar on desktop, bottom navigation on mobile

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Architecture Notes

See [Frontend-notes.txt](./Frontend-notes.txt) for detailed documentation on:
- Authentication flow
- Role-based routing
- API integration approach
- State management
- Performance decisions
- Assumptions
