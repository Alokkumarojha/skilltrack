# SkillTrack

A modern full-stack portfolio and career tracking application that helps users manage their professional journey and create a shareable public portfolio.

## 🚀 Live Demo

**Live Application:** https://skilltrack-nine-henna.vercel.app/

## ✨ Features

- 🔐 Secure authentication with Clerk
- 👤 Professional profile management
- 🧑‍💻 Skills management
- 🎯 Career goals tracking
- 📂 Project management
- 💼 Work experience management
- 🎓 Education management
- 🌐 Public and private portfolio visibility
- 🔗 Shareable public portfolio
- 📊 Portfolio view analytics
  - Today
  - This Week
  - Total Views

- 📄 Resume upload and viewing
- 📑 Portfolio PDF generation
- 🖼️ Profile image upload
- 📱 Responsive design
- 🌙 Dark mode support

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend & Database

- Next.js Server Actions & API Routes
- Prisma ORM
- PostgreSQL
- Neon

### Authentication

- Clerk

### Media Storage

- Cloudinary

### Deployment

- Vercel

## 📸 Application Overview

SkillTrack allows users to build and manage their professional profile from a single dashboard.

Users can:

- Add and manage their technical skills
- Track professional goals
- Showcase projects
- Add work experience and education
- Upload resumes and profile images
- Control portfolio visibility
- Share their public portfolio with recruiters
- Track portfolio views

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── dashboard/
│   ├── portfolio/
│   ├── sign-in/
│   ├── sign-up/
│   └── api/
│
├── components/
│   └── ui/
│
├── lib/
│   ├── prisma.ts
│   └── current-user.ts
│
└── generated/
    └── prisma/
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Alokkumarojha/skilltrack.git
```

### 2. Navigate to the project

```bash
cd skilltrack
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` or `.env.local` file and add the required environment variables:

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev
```

### 7. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 🗄️ Database

SkillTrack uses PostgreSQL with Prisma ORM.

The application manages data related to:

- Users
- Skills
- Goals
- Projects
- Work Experience
- Education
- Portfolio Views

## 🔐 Authentication

Authentication is handled using Clerk.

Users can securely:

- Sign up
- Sign in
- Access protected dashboard pages
- Manage their own professional data

## 🌐 Deployment

The application is deployed on Vercel.

The production environment uses environment variables for:

- Database configuration
- Clerk authentication
- Cloudinary media storage

Prisma Client is generated during deployment using:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## 🎯 Future Improvements

- Portfolio templates
- Advanced portfolio analytics
- Custom portfolio domains
- AI-powered profile suggestions
- Portfolio SEO improvements
- Email notifications
- Mobile application

## 👨‍💻 Author

**Alok Kumar Ojha**

Aspiring Full-Stack Developer

GitHub: https://github.com/Alokkumarojha

---

⭐ If you found this project helpful, consider giving it a star on GitHub!
