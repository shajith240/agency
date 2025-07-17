# Vercel Deployment Setup Guide for Sharp Flow Agency

## 🚀 Quick Setup Steps

### 1. Set Up Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing project: `whatsapp_intro_validator`
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: `https://mwkgwozzzlebbjrqqzuw.supabase.co`
   - **anon/public key**: Copy the `anon` key
   - **service_role key**: Copy the `service_role` key (keep secret!)

### 2. Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Sharp Flow agency project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production**, **Preview**, and **Development**:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://mwkgwozzzlebbjrqqzuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key-from-supabase]
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key-from-supabase]
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
```

#### Security Variables (Recommended):
```
CSRF_SECRET = [generate-32-character-random-string]
RATE_LIMIT_SECRET = [generate-32-character-random-string]
NODE_ENV = production
```

### 3. Generate Security Secrets

Use one of these methods to generate secure random strings:

**Option A: Online Generator**
- Visit: https://www.random.org/strings/
- Generate 32+ character strings

**Option B: Command Line**
```bash
# Generate CSRF secret
openssl rand -base64 32

# Generate Rate Limit secret  
openssl rand -base64 32
```

**Option C: Node.js**
```javascript
// Run in browser console or Node.js
crypto.randomBytes(32).toString('base64')
```

### 4. Set Your App URL

Replace `your-project-name` with your actual Vercel project name:
```
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
```

### 5. Deploy

After adding all environment variables:
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## 🔧 Environment Variables Reference

### Required for Build:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `NEXT_PUBLIC_APP_URL` - Your application URL

### Recommended for Security:
- `CSRF_SECRET` - 32+ character secret for CSRF protection
- `RATE_LIMIT_SECRET` - Secret for rate limiting
- `NODE_ENV` - Set to "production" for production environment

### Optional (for future features):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password
- `SENTRY_DSN` - Sentry error tracking DSN
- `LOG_LEVEL` - Logging level (info, debug, warn, error)

## 🛠️ Troubleshooting

### Build Fails with "Environment validation failed"
1. Check that all required variables are set in Vercel
2. Ensure variable names match exactly (case-sensitive)
3. Verify Supabase URL format: `https://project-id.supabase.co`
4. Check that secrets are at least 32 characters long

### "Invalid Supabase URL" Error
- Ensure URL starts with `https://`
- Verify project ID is correct
- Check for trailing slashes (remove them)

### CSRF or Security Errors
- Generate proper 32+ character secrets
- Set `NODE_ENV=production` for production
- Ensure `NEXT_PUBLIC_APP_URL` uses HTTPS in production

## 📝 Local Development Setup

1. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Never commit `.env.local` to version control

## 🔒 Security Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-side only)
- Use different secrets for different environments
- Rotate secrets regularly in production
- Always use HTTPS in production
- Never expose service role keys in client-side code
