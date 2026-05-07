# StudioX — Content Broadcasting System

> A production-ready frontend for educational content broadcasting built as a technical assignment.

Teachers upload subject-based content → Principals approve or reject it → Students view live broadcasts on a public page.

---

## Live Demo

🔗 **Deployment:** [studiox-broadcasting.vercel.app](https://studiox-broadcasting.vercel.app)

| Role | Email | Password |
|---|---|---|
| 👨‍🏫 Teacher | `teacher@school.com` | `password` |
| 🏫 Principal | `principal@school.com` | `password` |

> Use the **Quick Demo Access** buttons on the login page for one-click login.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
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
git clone https://github.com/guddukumar2002/studiox-broadcasting.git
cd studiox-broadcasting

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── auth/login/             # Login page (RHF + Zod validation)
│   ├── teacher/
│   │   ├── dashboard/          # Stats + recent activity + live banner
│   │   ├── upload/             # Content upload form
│   │   └── content/            # My content list with filters
│   ├── principal/
│   │   ├── dashboard/          # Overview + pending queue + approval rate
│   │   ├── pending/            # Approve / Reject workflow with modal
│   │   └── all-content/        # Full content table with search + pagination
│   ├── live/[teacherId]/       # Public broadcast page (no auth required)
│   ├── layout.js               # Root layout — AuthProvider + Toaster
│   └── page.js                 # Root redirect based on role
├── components/
│   ├── SkeletonCard.js         # SkeletonCard, SkeletonRow, SkeletonStatCard
│   ├── StatusBadge.js          # ApprovalBadge, ScheduleBadge
│   └── EmptyState.js           # EmptyState, ErrorState
├── context/
│   └── AuthContext.js          # Global auth state
├── hooks/
│   ├── useContent.js           # useTeacherContent, useAllContent, useLiveContent, useCreateContent
│   └── useApprovals.js         # useApprovals — fetch + approve + reject
├── layouts/
│   └── DashboardLayout.js      # Sidebar (desktop) + bottom nav (mobile) + auth/role guard
├── services/
│   ├── auth.service.js         # login, saveSession, clearSession, getToken
│   ├── content.service.js      # getByTeacher, getAll, getByStatus, getLiveByTeacher, create
│   └── approval.service.js     # getPending, approve, reject
└── utils/
    └── mockData.js             # localStorage persistence + 50 seed items
```

---

## Key Features

### Architecture
- **Clean service layer** — all API calls go through `services/` — zero direct calls in components
- **Custom hooks** — `useContent`, `useApprovals` encapsulate all loading/error/data states
- **AuthContext** — global session state, no prop drilling
- **Replaceable API design** — swap `services/` files to connect a real backend, nothing else changes

### Authentication & Routing
- React Hook Form + Zod validation on login
- Role-based redirect on login (teacher → `/teacher/dashboard`, principal → `/principal/dashboard`)
- Auth guard in `DashboardLayout` — unauthenticated users redirected to login
- Role guard — teachers blocked from `/principal/*` routes and vice versa

### Teacher Features
- Upload content with title, subject, description, file, start/end time, rotation duration
- File validation — JPG/PNG/GIF only, max 10MB, preview before upload
- End time > start time cross-field Zod validation
- View content status (Pending / Approved / Rejected with reason)

### Principal Features
- Dashboard with total/pending/approved/rejected stats + approval rate
- Approve content with one click
- Reject content with mandatory reason via modal
- All Content table with search + status filter + **pagination (20 items/page)**

### Public Live Page
- `/live/:teacherId` — no authentication required
- Shows active broadcast with title, subject, preview, instructor details
- Auto-refreshes every 5 seconds (polling)
- Loading state + empty state

### UI/UX
- Skeleton loaders on every data fetch
- Toast notifications for all actions
- Empty states and error states with retry buttons
- Scheduling badges — **Scheduled / Active / Expired**
- Fully responsive — sidebar on desktop, bottom navigation on mobile
- No hydration mismatch — CSS-only responsive breakpoints (no `isMobile` state)

### Performance
- `useMemo` for all filtered lists and stats calculations
- `loading="lazy"` on all images
- Pagination on large lists (handles 500–1000 items)
- 50 realistic seed items for evaluation

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Documentation

See [`Frontend-notes.txt`](./Frontend-notes.txt) for detailed notes on:
- Authentication flow
- Role-based routing
- API integration approach
- State management approach
- Performance decisions
- Edge cases handled
- Assumptions

---

## Assignment Requirements Coverage

| Requirement | Implemented |
|---|---|
| React / Next.js | ✅ Next.js 14 App Router |
| Tailwind CSS | ✅ |
| React Hook Form + Zod | ✅ Login + Upload forms |
| Service layer (no API calls in components) | ✅ |
| Auth + role-based routing | ✅ |
| Teacher dashboard | ✅ |
| Principal dashboard | ✅ |
| Content upload with validation | ✅ |
| Approval workflow with reject modal | ✅ |
| Public live page `/live/:teacherId` | ✅ |
| Loading / empty / error states | ✅ Every page |
| Skeleton loaders | ✅ |
| Pagination (large list handling) | ✅ |
| Auto-refresh polling | ✅ 5s interval |
| Responsive design | ✅ |
| Frontend-notes.txt documentation | ✅ |
