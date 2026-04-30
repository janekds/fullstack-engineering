# Durdle - AI-Powered Recruitment Platform Setup

This guide will help you set up the Durdle recruitment platform with Supabase authentication, database storage, and Resend email service.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Resend account and API key

## Environment Setup

1. Create a `.env.local` file in the project root with the following variables:

```env
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Get your project credentials**:
   - Go to Settings > API
   - Copy the Project URL and anon/public key
   - Copy the service_role key (keep this secret!)

3. **Set up the database schema**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the script to create all tables, policies, and sample data

4. **Configure Authentication**:
   - Go to Authentication > Settings
   - Enable Email authentication
   - Optionally enable Google and LinkedIn OAuth:
     - Go to Authentication > Providers
     - Enable and configure Google OAuth (get credentials from Google Cloud Console)
     - Enable and configure LinkedIn OAuth (get credentials from LinkedIn Developer Portal)

5. **Storage Setup**:
   - The schema automatically creates a 'cvs' bucket for CV uploads
   - Storage policies are set up to allow users to upload/manage their own files

## Resend Setup

1. **Create a Resend account** at [resend.com](https://resend.com)

2. **Get your API key**:
   - Go to API Keys in your Resend dashboard
   - Create a new API key
   - Copy it to your `.env.local` file

3. **Domain Setup** (for production):
   - Add and verify your domain in Resend
   - Update the email sender addresses in `src/lib/resend.ts`

## Installation & Development

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## Features Implemented

### Authentication
- ✅ Email/password authentication
- ✅ Google OAuth (requires setup)
- ✅ LinkedIn OAuth (requires setup)
- ✅ Automatic profile creation
- ✅ Protected routes

### Database
- ✅ User profiles
- ✅ Job listings
- ✅ Interview records
- ✅ Job applications
- ✅ Row Level Security (RLS)

### Email Service
- ✅ Welcome emails
- ✅ Email confirmation
- ✅ Interview invitations

### UI/UX
- ✅ Landing page
- ✅ Login/Signup pages
- ✅ Dashboard with job listings (Mercor-inspired design)
- ✅ Responsive design
- ✅ Toast notifications

## File Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   ├── dashboard/              # Protected dashboard
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── onboarding/             # User onboarding
│   ├── interview/              # Voice interview
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── ui/                     # Shadcn/ui components
│   └── AuthProvider.tsx        # Authentication context
└── lib/
    ├── supabase.ts             # Supabase client & types
    ├── resend.ts               # Email service
    └── utils.ts                # Utilities
```

## Next Steps

1. **Complete the onboarding flow** with CV upload
2. **Implement the voice interview module** using Vapi
3. **Add job application functionality**
4. **Set up deployment** on Netlify
5. **Configure OAuth providers** for social login

## Production Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set environment variables in Netlify
   - Deploy with the build command: `npm run build`

3. **Update environment variables**:
   - Update `NEXT_PUBLIC_APP_URL` to your production domain
   - Update Supabase redirect URLs
   - Update OAuth provider redirect URLs

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check Supabase URL and keys
2. **Emails not sending**: Verify Resend API key and domain setup
3. **Database errors**: Ensure schema is properly applied
4. **OAuth issues**: Check provider configuration and redirect URLs

### Support

For issues or questions, check:
- Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Resend documentation: [resend.com/docs](https://resend.com/docs)
- Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
