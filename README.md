# StudioSpace — Frontend

\<p align="center">   \<h2 align="center">StudioSpace\</h2>   \<p align="center">     A Modern Studio Booking & Management Platform   \</p> \</p>

\<p align="center">   \<img src="[https://img.shields.io/badge/Next.js-Framework-black?logo=next.js](https://img.shields.io/badge/Next.js-Framework-black?logo=next.js)" />   \<img src="[https://img.shields.io/badge/TypeScript-Language-blue?logo=typescript](https://img.shields.io/badge/TypeScript-Language-blue?logo=typescript)" />   \<img src="[https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwind-css](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwind-css)" />   \<img src="[https://img.shields.io/badge/Authentication-Better_Auth-orange](https://img.shields.io/badge/Authentication-Better_Auth-orange)" /> \</p>

## Overview

**StudioSpace** is a modern, responsive studio booking platform designed to connect creative professionals with suitable studio spaces.

The platform allows users to explore different studios, view detailed studio information, check availability, and book their preferred spaces. Studio owners can manage their studio listings, while users can track and manage their bookings through a personalized dashboard.

The frontend provides a clean, intuitive, and user-friendly experience with responsive layouts, modern UI components, and secure authentication integration.

## Key Features

- **Modern Landing Page:** A visually appealing homepage introducing the platform and its services.
- **Studio Exploration:** Browse and explore available studios.
- **Category Filtering:** Filter studios by Photo Studio, Film Stage, Podcast Lounge, Music Suite, and Workshop.
- **Studio Details:** View detailed information, images, pricing, capacity, and location.
- **Studio Booking:** Book studio spaces based on preferred dates and time slots.
- **Authentication:** User registration, login, and Google authentication through Better Auth.
- **Protected Routes:** Restrict access to authenticated-only pages.
- **My Bookings:** View and manage personal booking records.
- **Studio Management:** Create and manage studio listings.
- **Dashboard:** View booking activity and studio-related statistics.
- **Theme Support:** Light and dark theme experience.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Notifications:** User-friendly feedback through toast notifications.

## Technology Stack

| Technology                | Purpose                                 |
| ------------------------- | --------------------------------------- |
| Next.js                   | React framework and application routing |
| React                     | User interface development              |
| TypeScript                | Type-safe development                   |
| Tailwind CSS              | Utility-first styling                   |
| shadcn/ui                 | Reusable UI components                  |
| Better Auth               | Authentication client                   |
| React Context / Providers | Application-wide state and providers    |
| React Toastify            | Toast notifications                     |
| Lucide React              | Icons                                   |
| Fetch API                 | Backend API communication               |

## Project Structure

```text
studiospace-client/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── login/
│   │   ├── register/
│   │   ├── my-bookings/
│   │   ├── add-studio/
│   │   ├── studios/
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── shared/
│   │   ├── studios/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── auth-api.ts
│   │   └── bookings.ts
│   │
│   └── ...
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

*Note: The structure above is a representative overview. Some folders and files may vary depending on the final implementation.*

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_CLIENT_REPOSITORY_URL>
```

### 2. Navigate to the Project Directory

```bash
cd studiospace-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Add any additional public application or authentication URL variables required by your Better Auth client configuration.

**Important:** Never expose private API keys, authentication secrets, or server credentials through `NEXT_PUBLIC_` variables.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Backend Integration

The frontend communicates with the StudioSpace backend through REST APIs.

**Default API Base URL:**

```text
http://localhost:5000/api
```

The application uses credentialed requests to support secure cookie-based authentication.

The authentication architecture integrates Better Auth sessions with the Express API's JWT authentication system.

## Available Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start development server     |
| `npm run build`    | Build production application |
| `npm run start`    | Start production server      |
| `npm run lint`     | Run ESLint                   |
| `npx tsc --noEmit` | Check TypeScript types       |

## Security

- Protected pages require authentication.
- Authentication credentials are not stored in localStorage.
- HTTPOnly cookies are used for the Express API authentication token.
- API requests follow the configured CSRF and CORS security rules.
- Redirect destinations are validated to prevent unsafe external redirects.

## Development Notes

- Keep environment variables private.
- Ensure the backend server is running before testing API-dependent features.
- Use the correct API base URL for local development and production.
- Do not commit `.env.local` or other secret-containing files.

## License

This project was developed for academic and educational purposes.

---

\<p align="center">
&#x20; Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
\</p>
