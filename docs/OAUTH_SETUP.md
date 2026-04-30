# OAuth & Supabase Configuration Guide

## 🔧 Step 1: Fix Supabase API Keys

### Get the Correct Keys from Supabase Dashboard

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/hdbkdtrzztsffilqjfvx
2. **Navigate to Settings > API**
3. **Copy the correct keys**:
   - Project URL: `https://hdbkdtrzztsffilqjfvx.supabase.co`
   - anon/public key: (copy the full JWT token - should be ~200+ characters)
   - service_role key: (copy the full JWT token - should be ~200+ characters)

### Update Your .env.local File
Replace the current `.env.local` with the correct keys:

```env
# Resend API Configuration
RESEND_API_KEY=re_ESf4mLJW_EC5HqnwoLnUXNQkX5G25fdgx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hdbkdtrzztsffilqjfvx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PASTE_YOUR_ACTUAL_ANON_KEY_HERE]
SUPABASE_SERVICE_ROLE_KEY=[PASTE_YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE]

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🔐 Step 2: Configure Google OAuth

### 1. Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Durdle App"
   - Authorized redirect URIs: `https://hdbkdtrzztsffilqjfvx.supabase.co/auth/v1/callback`

### 2. Configure in Supabase

1. **Go to Supabase Dashboard**: Authentication > Providers
2. **Enable Google Provider**
3. **Enter your Google credentials**:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
4. **Save configuration**

## 🔗 Step 3: Configure LinkedIn OAuth

### 1. Create LinkedIn App

1. **Go to LinkedIn Developers**: https://www.linkedin.com/developers/
2. **Create a new app**:
   - App name: "Durdle Recruitment Platform"
   - LinkedIn Page: (create a company page if needed)
   - App logo: Upload any logo
3. **Configure OAuth settings**:
   - Authorized redirect URLs: `https://hdbkdtrzztsffilqjfvx.supabase.co/auth/v1/callback`
   - Request access to: "Sign In with LinkedIn using OpenID Connect"

### 2. Configure in Supabase

1. **Go to Supabase Dashboard**: Authentication > Providers
2. **Enable LinkedIn (OIDC) Provider**
3. **Enter your LinkedIn credentials**:
   - Client ID: (from LinkedIn App)
   - Client Secret: (from LinkedIn App)
4. **Save configuration**

## 🧪 Step 4: Test Authentication

### Email/Password Login
1. Restart your development server: `npm run dev`
2. Go to http://localhost:3001
3. Try signing up with email/password

### OAuth Testing
1. After configuring providers in Supabase
2. Test Google login button
3. Test LinkedIn login button

## ⚠️ Troubleshooting

### "Invalid API Key" Error
- Check that your Supabase keys are complete JWT tokens
- Ensure no extra characters or line breaks in the keys
- Restart the development server after changing .env.local

### OAuth Redirect Issues
- Ensure redirect URIs match exactly in both provider and Supabase
- Check that the provider is enabled in Supabase dashboard
- Verify the client ID and secret are correct

### Development vs Production URLs
- For development: Use `http://localhost:3001` in .env.local
- For production: Update to your actual domain
- Update redirect URIs accordingly in OAuth providers

## 🚀 Quick Fix Commands

```bash
# Restart development server
npm run dev

# Check environment variables
cat .env.local

# View Supabase logs (if needed)
# Go to Supabase Dashboard > Logs
```

## 🔍 Next Steps

1. **Fix Supabase keys first** - this will resolve the "Invalid API key" error
2. **Test email/password login** - should work immediately
3. **Set up Google OAuth** - follow steps above
4. **Set up LinkedIn OAuth** - follow steps above
5. **Test all login methods** - ensure they redirect to dashboard

---

**Need Help?** 
- Check Supabase Dashboard logs for detailed error messages
- Ensure all environment variables are properly formatted
- Restart the development server after any configuration changes
