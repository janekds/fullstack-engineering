# Durdle.AI - RLHF Talent Discovery Platform

<div align="center">
  <img src="public/logo.png" alt="Durdle.AI Logo" width="200" />

  **Where AI meets opportunity**

  [![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blue)](https://tailwindcss.com/)
</div>

## Overview

Durdle.AI is a revolutionary talent discovery platform that connects cutting-edge AI research labs with exceptional talent through AI-powered assessments. Skip traditional applications and resumes—let AI showcase your true potential.

###  Key Features

- 🤖 **AI-Powered Interviews** - Voice-based assessments using Vapi.ai
- 🎯 **Smart Matching** - Connect talent with opportunities based on skills and expertise
- 🔐 **Secure Authentication** - Multiple login options (Email, Google, LinkedIn)
- 📊 **Real-time Dashboard** - Track applications, interview progress, and opportunities
- 📧 **Email Automation** - Welcome emails and notifications via Resend
- 🎨 **Modern UI/UX** - Beautiful, responsive design with Framer Motion animations
- 🔒 **Enterprise Security** - Row-level security with Supabase

## Architecture

### Tech Stack

**Frontend:**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions

**Backend & Services:**
- **Supabase** - Database, authentication, and real-time subscriptions
- **Resend** - Transactional email service
- **Vapi.ai** - Voice AI interview platform
- **Vercel/Netlify** - Deployment and hosting

**Development Tools:**
- **ESLint** - Code linting
- **Turbopack** - Fast development builds
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Project Structure

```
durdle/
├── 📂 src/
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── 📂 api/                 # API routes
│   │   ├── 📂 auth/                # Authentication pages
│   │   ├── 📂 dashboard/           # Protected dashboard area
│   │   │   ├── 📂 interview/       # AI interview module
│   │   │   ├── 📂 onboarding/      # User onboarding
│   │   │   ├── 📂 profile/         # User profile management
│   │   │   └── 📄 page.tsx         # Main dashboard
│   │   ├── 📂 hire-experts/        # Employer section
│   │   ├── 📂 meet-friday/         # AI assistant page
│   │   ├── 📂 sign-in/             # Login page
│   │   ├── 📂 sign-up/             # Registration page
│   │   ├── 📄 layout.tsx           # Root layout
│   │   └── 📄 page.tsx             # Landing page
│   ├── 📂 components/              # Reusable components
│   │   ├── 📂 ui/                  # UI component library
│   │   ├── 📂 main/                # Main layout components
│   │   ├── 📄 AuthProvider.tsx     # Auth context provider
│   │   └── 📄 DashboardHeader.tsx  # Dashboard navigation
│   └── 📂 lib/                     # Utilities and configurations
│       ├── 📄 supabase.ts          # Supabase client
│       ├── 📄 resend.ts            # Email service
│       └── 📄 utils.ts             # Helper functions
├── 📂 docs/                        # Documentation
├── 📂 public/                      # Static assets
├── 📄 package.json                 # Dependencies
├── 📄 tailwind.config.js           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
└── 📄 README.md                    # This file
```

## Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Supabase account** - [supabase.com](https://supabase.com)
- **Resend account** - [resend.com](https://resend.com)
- **Vapi.ai account** - [vapi.ai](https://vapi.ai) (for voice interviews)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd durdle
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure your `.env.local` file:**
```env
# Resend Email Service
RESEND_API_KEY=your_resend_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vapi.ai (Voice AI)
VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_FRIDAY_ASSISTANT_ID=friday_key
VAPI_TEST_ASSISTANT_ID=interviewer_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Set up the database:**
   - Follow the setup guide in `docs/SETUP.md`
   - Import the database schema from your Supabase dashboard

6. **Start the development server:**
```bash
npm run dev
```

7. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Import the database schema (contact admin for schema file)
3. Configure authentication providers
4. Set up storage buckets for CV uploads

### Email Configuration

1. Sign up at [resend.com](https://resend.com)
2. Add your domain and verify DNS records
3. Create an API key and add to environment variables

### Voice AI Setup

1. Create account at [vapi.ai](https://vapi.ai)
2. Configure your voice assistant
3. Add API keys to environment variables

## 📱 Features Overview

### For Talent
- **Smart Registration** - Quick signup with social login options
- **AI Assessment** - Voice-based technical interviews
- **Skill Showcase** - AI-powered evaluation of expertise
- **Job Matching** - Get matched with relevant opportunities
- **Real-time Updates** - Track application status and interview progress

### For Employers
- **Talent Discovery** - Find candidates through AI assessments
- **Expert Hiring** - Connect with verified domain experts
- **Efficient Screening** - AI-powered initial candidate evaluation
- **Quality Assurance** - Data-driven hiring decisions

### Technical Features
- **Responsive Design** - Works seamlessly on all devices
- **Real-time Updates** - Live data synchronization
- **Security First** - Enterprise-grade security and privacy
- **Scalable Architecture** - Built to handle growth
- **Modern Stack** - Latest technologies and best practices

## 🔐 Security & Privacy

- **Row-Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure token-based auth
- **HTTPS Everywhere** - Encrypted data transmission
- **Privacy Compliant** - GDPR and privacy-focused design
- **Audit Trails** - Comprehensive logging and monitoring

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deploy to Netlify
```bash
npm run netlify-build
```

### Environment Variables for Production
Update these variables for your production environment:
- `NEXT_PUBLIC_APP_URL` - Your production domain
- Update OAuth redirect URLs
- Configure email sender domains

## Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript** - Strict type checking
- **ESLint** - Code linting and formatting
- **Component Library** - Consistent UI components
- **Form Validation** - Zod schema validation

## Documentation

- **Setup Guide** - `docs/SETUP.md`
- **OAuth Configuration** - `docs/OAUTH_SETUP.md`
- **Email Setup** - `docs/DISABLE_SUPABASE_EMAILS.md`
- **Onboarding Updates** - `docs/ONBOARDING_UPDATE.md`

## Support & Troubleshooting

### Common Issues
- **Authentication errors** - Check Supabase configuration
- **Email not sending** - Verify Resend API key and domain
- **Database errors** - Ensure schema is properly imported
- **Build errors** - Check Node.js version compatibility

### Getting Help
- Check the documentation in the `docs/` folder
- Review Supabase and Resend documentation
- Open an issue for bugs or feature requests

## License

This project is proprietary and confidential. All rights reserved.

## 🔗 Links

- **Production URL** - [durdle.ai](https://durdle.ai)
- **Supabase** - [Database Dashboard](https://supabase.com/dashboard)
- **Resend** - [Email Dashboard](https://resend.com/dashboard)
- **Vapi.ai** - [Voice AI Dashboard](https://vapi.ai/dashboard)

---

<div align="center">
  <p>Built with ❤️ by the Durdle.AI team</p>
  <p>Empowering the next generation of AI talent</p>
</div>
