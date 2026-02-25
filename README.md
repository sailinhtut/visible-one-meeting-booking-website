# Visible One Meeting Booking Frontend

## Overview

The Visible One Meeting Booking Frontend is a modern Single Page Application (SPA) built with React
and Vite. It communicates with the NestJS backend API and provides a role-based interface for
managing meeting room bookings.

The application supports: - Role-based login (Admin, Owner, User) - Booking creation and
management - User management (Admin only) - Real-time meeting status indicators - Responsive
dashboard UI

---

## Tech Stack

### Framework & Build Tool

- React 19
- Vite 7
- TypeScript (ES Modules)

### Routing

- react-router-dom v6 (Browser Router)

### HTTP Client

- axios

### Date & Time Handling

- dayjs (UTC handling supported)

### Styling

- TailwindCSS v4
- DaisyUI component library
- PostCSS + Autoprefixer

### Linting

- ESLint
- React Hooks ESLint Plugin

---

## Project Scripts

- npm run dev → Start development server
- npm run build → Build production bundle
- npm run preview → Preview production build
- npm run lint → Run ESLint

---

## Application Architecture

The frontend follows a modular structure:

- Auth Module
     - Login Page
     - Register Page
     - Auth Guard
     - Token handling
- Dashboard Layout
     - Sidebar navigation
     - Role display
     - Protected routes
- Booking Module
     - Booking list
     - Create booking modal
     - Update booking modal
     - Delete confirmation dialog
     - Live meeting indicator (green ping)
- Common Module (Shared Service and Utils)
     - API Config
     - API Service
     - Shared Component
     - Shared Layout

---

## Routing Structure

Public Routes: - /login - /register

Protected Routes: - /dashboard/profile - /dashboard/bookings - /dashboard/users

Client-side routing is handled via react-router-dom using createBrowserRouter.

---

## Role-Based UI Behavior

User: - Can create bookings - Can view all bookings - Can delete own bookings

Owner: - Can delete any booking - Can view usage summaries

Admin: - Can manage users - Can view all bookings - Can delete any booking

UI elements are conditionally rendered based on the authenticated user's role.

---

## Meeting Status Indicator

Active meetings display a green animated ping indicator when:

Current time \>= startTime\
Current time \< endTime

Time is handled consistently using dayjs with UTC conversion.

---

## State Management

- React useState
- React useEffect
- Local storage for token persistence
- Axios interceptor for JWT authentication

---

## API Communication

The frontend communicates with:

Base API URL: /api/v1

Authentication: Bearer Token (JWT)

Error handling: - 401 → Redirect to login - 403 → Permission denied - 400/409 → Validation error
display

---

## Deployment

The frontend is designed for deployment on:

- Vercel
- Netlify
- Render

For SPA routing on Vercel, a vercel.json rewrite rule is required to redirect all routes to
index.html.

---

## Environment Configuration

Example .env file:

VITE_API_URL=http://localhost:3000/api/v1

---

## Production Build

Build output directory: /dist

Generated using: npm run build
