# Wine Reservation App - Implementation Plan

## Tech Stack
- **Framework:** SvelteKit
- **Database:** SQLite (with Drizzle ORM) - can migrate to PostgreSQL later
- **Auth:** Custom auth with secure sessions (or Lucia Auth)
- **Styling:** Tailwind CSS (mobile-first)
- **PWA:** Vite PWA plugin

---

## Phase 1: Project Setup ✅
- [x] Initialize SvelteKit project with TypeScript
- [x] Install and configure Tailwind CSS
- [x] Set up Drizzle ORM with SQLite
- [x] Create basic project structure (routes, lib, components)
- [x] Set up environment variables

## Phase 2: Database Schema ✅
- [x] Create `users` table (id, email, password_hash, name, created_at)
- [x] Create `wines` table (id, name, description, price, image_url, stock, created_at)
- [x] Create `reservations` table (id, user_id, wine_id, quantity, status, created_at)
- [x] Generate and run initial migration

## Phase 3: Authentication ✅
- [x] Create registration page (`/register`)
- [x] Create login page (`/login`)
- [x] Implement password hashing (PBKDF2)
- [x] Set up session management (cookies)
- [x] Create auth middleware/hooks for protected routes
- [x] Add logout functionality
- [x] Create basic dashboard page (`/dashboard`)

## Phase 4: Wine Catalog ✅
- [x] Create wine listing page (`/wines`)
- [x] Build wine card component (image, name, price, description preview)
- [x] Create wine detail page (`/wines/[id]`)
- [x] Add responsive grid layout for mobile/desktop
- [x] Add seed script with sample wines

## Phase 5: Reservation System ✅
- [x] Add "Reserve" button to wine detail page
- [x] Create reservation form with quantity selector (+/- buttons)
- [x] Implement reservation API endpoint
- [x] Add confirmation feedback (success message)
- [x] Validate stock availability
- [x] Update stock after reservation

## Phase 6: User Dashboard ✅
- [x] Create user dashboard page (`/dashboard`)
- [x] Display reservation history (wine, quantity, date, status)
- [x] Add status indicators (pending, ready, completed, cancelled)
- [x] Allow cancellation of pending reservations (restores stock)
- [x] Separate active vs past reservations

## Phase 7: Admin Panel (Basic) ✅
- [x] Create admin-only routes (`/admin`) with role-based auth guard
- [x] Admin dashboard with stats (wines, users, reservations)
- [x] Wine management (list, create, edit, delete)
- [x] Image URL support for wines
- [x] View all reservations with customer details
- [x] Update reservation status (pending → ready → completed)
- [x] Filter reservations by status
- [x] Script to promote user to admin: `npm run db:make-admin <email>`

## Phase 8: PWA & Mobile Optimization ✅
- [x] Install and configure @vite-pwa/sveltekit
- [x] Create app manifest (name, icons, theme color)
- [x] Add SVG app icon with wine glass design
- [x] Add service worker with workbox (auto-update)
- [x] Add iOS meta tags (apple-mobile-web-app)
- [x] Image caching for offline support
- [x] Mobile-first responsive design throughout

## Phase 9: Polish & Testing ✅
- [x] Add toast notification system (success, error, info)
- [x] Toast notifications on all key actions
- [x] Loading states on all forms
- [x] Server-side form validation
- [x] Error handling with user-friendly messages
- [x] Mobile-responsive tested (--host flag for LAN testing)

## Phase 10: Deployment ✅
- [x] Vercel adapter configured
- [x] Turso (SQLite cloud) integration ready
- [x] Build passes

### Deployment Steps:

**1. Create Turso Database:**
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Sign up / Login
turso auth signup   # or: turso auth login

# Create database
turso db create wine-club

# Get connection URL
turso db show wine-club --url

# Create auth token
turso db tokens create wine-club
```

**2. Push Schema to Turso:**
```bash
# Apply schema to Turso
turso db shell wine-club < drizzle/schema.sql
```

**3. Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# TURSO_DATABASE_URL = libsql://wine-club-[your-username].turso.io
# TURSO_AUTH_TOKEN = [your token from step 1]
```

**4. Seed Production Data (Optional):**
Create an admin account and add wines via the admin panel after deploying.

---

## Future Enhancements (Later)
- [ ] Multiple images per wine
- [ ] Wine categories/filtering
- [ ] Search functionality
- [ ] Email notifications
- [ ] Password reset
- [ ] Wine ratings/reviews
- [ ] Inventory management

---

## Notes
- Start simple, iterate
- Mobile-first design approach
- Each phase should result in working functionality
