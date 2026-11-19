# StudioSpace — Frontend

<p align="center">

  <img src="https://img.shields.io/badge/Next.js-Framework-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Language-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Authentication-Better_Auth-orange" alt="Better Auth" />

</p>

**StudioSpace** is a modern studio booking and management platform designed to connect creative professionals with suitable studio spaces.

The platform allows users to discover studios, explore studio details, check booking information, and reserve their preferred creative spaces. It provides a smooth and responsive user experience with modern UI components, secure authentication, and an intuitive dashboard.

Whether someone needs a photography studio, film stage, podcast lounge, music suite, or workshop space, StudioSpace makes the studio discovery and booking process easier.

## ✨ Key Features

- **Modern Landing Page:** Clean and visually appealing homepage.
- **Studio Exploration:** Browse and discover available studio spaces.
- **Category Filtering:** Filter studios by Photo Studio, Film Stage, Podcast Lounge, Music Suite, and Workshop.
- **Studio Details:** View studio images, descriptions, locations, capacity, and pricing.
- **Studio Booking:** Submit booking requests for preferred studio spaces.
- **User Authentication:** Registration and login with Better Auth.
- **Google Authentication:** Google OAuth integration when configured.
- **Protected Routes:** Restrict access to authenticated users.
- **My Bookings:** View and manage personal booking records.
- **Studio Management:** Add and manage studio listings.
- **Dashboard:** View booking activity and studio-related statistics.
- **Dark & Light Theme:** Switch between different visual themes.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Toast Notifications:** Interactive feedback for user actions.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | User interface development |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Reusable UI components |
| Better Auth | Authentication client |
| React Context / Providers | Application-wide providers |
| React Toastify | Toast notifications |
| Lucide React | Icons |
| Fetch API | Backend API communication |

## 📁 Project Structure

```text
studiospace-client/
│
├── public/
│
├── src/
│   ├── app/
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

*Note: This is a representative project structure. Some folders and filenames may vary depending on the implementation.*

## 🚀 Installation & Setup

Follow these steps to run the frontend application locally.

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

Create a `.env.local` file in the root directory of the project.

Add the following environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Add any other environment variables required by your Better Auth client configuration.

> **Important:** Never expose private API keys, JWT secrets, or server credentials through `NEXT_PUBLIC_` variables.

### 5. Run the Development Server

```bash
npm run dev
```

The frontend application will be available at:

**http://localhost:3000**

## 🔗 Backend Integration

The frontend communicates with the StudioSpace backend through RESTful APIs.

**Default API Base URL:**

```text
http://localhost:5000/api
```

The frontend uses credentialed requests to support secure cookie-based authentication.

The authentication architecture integrates Better Auth sessions with the Express API's JWT authentication system.

### Backend Repository

[StudioSpace Backend Repository](<YOUR_SERVER_REPOSITORY_URL>)

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript types |

## 🔐 Security

- Protected pages require authentication.
- Authentication credentials are not stored in localStorage.
- HTTPOnly cookies are used for Express API authentication.
- API requests follow configured CSRF and CORS security rules.
- Internal redirect destinations are validated to prevent unsafe redirects.
- Sensitive environment variables are kept outside the frontend bundle.

## 💻 Development Notes

- Make sure the backend server is running before testing API-dependent features.
- Configure the correct API URL for local development and production.
- Keep environment variables private.
- Do not commit `.env.local` or other secret-containing files.
- Follow the existing component and project structure when adding new features.

## 📄 License

This project was developed for academic and educational purposes.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.**
