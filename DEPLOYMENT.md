# Lottery Reality Check - Deployment Guide

This guide will help you deploy the Lottery Reality Check calculator to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Email Integration](#email-integration)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database (or access to a hosted PostgreSQL service)
- Email service account (SendGrid or Mailchimp recommended)
- Domain name (optional but recommended)

## Environment Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd lotto-site
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```env
# Required for analytics
DATABASE_URL=postgresql://user:password@host:5432/database

# Required for admin access (CHANGE THIS!)
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here

# Required for email features
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=hello@tweakyourgeek.com

# Application URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:

```bash
createdb lottery_calculator
```

3. Run the schema:

```bash
psql lottery_calculator < lib/db/schema.sql
```

### Option 2: Hosted PostgreSQL (Recommended for Production)

We recommend using a hosted PostgreSQL service:

#### Vercel Postgres

```bash
npm i -g vercel
vercel link
vercel postgres create
```

#### Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the connection string from Settings > Database
3. Run the schema in the SQL Editor:

```sql
-- Copy and paste contents of lib/db/schema.sql
```

#### Railway

1. Create new project at [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy the DATABASE_URL from the service variables
4. Connect and run schema

#### Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Run schema via their SQL editor

### Verify Database Setup

Test your database connection:

```bash
npm run dev
# Navigate to http://localhost:3000 and interact with the calculator
# Check your database for new entries in the sessions table
```

## Email Integration

### Option 1: SendGrid (Recommended)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. Verify your sender email address
4. Add to `.env`:

```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=hello@tweakyourgeek.com
```

5. Update `app/api/email/route.ts` to implement SendGrid:

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const msg = {
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Your Lottery Reality Check Report',
  html: generateEmailHTML(data),
}

await sgMail.send(msg)
```

### Option 2: Mailchimp

1. Sign up at [mailchimp.com](https://mailchimp.com)
2. Create API key
3. Get your audience ID
4. Add to `.env`:

```env
MAILCHIMP_API_KEY=xxxxx
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=xxxxx
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications.

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file

5. Redeploy with production environment:

```bash
vercel --prod
```

**Important for Vercel:**
- If using Vercel Postgres, it's automatically configured
- Make sure to run the schema SQL in the Vercel Postgres dashboard

### Option 2: Netlify

1. Install Netlify CLI:

```bash
npm i -g netlify-cli
```

2. Build the site:

```bash
npm run build
```

3. Deploy:

```bash
netlify deploy --prod
```

4. Add environment variables in Netlify dashboard

### Option 3: Railway

1. Install Railway CLI:

```bash
npm i -g @railway/cli
```

2. Login and initialize:

```bash
railway login
railway init
```

3. Add PostgreSQL service (if not done already):

```bash
railway add
# Select PostgreSQL
```

4. Deploy:

```bash
railway up
```

5. Set environment variables:

```bash
railway variables set NEXT_PUBLIC_ADMIN_PASSWORD=your_password
# ... add other variables
```

### Option 4: Docker (Self-Hosted)

1. Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build and run:

```bash
docker build -t lottery-calculator .
docker run -p 3000:3000 --env-file .env lottery-calculator
```

### Option 5: Traditional VPS (DigitalOcean, AWS, etc.)

1. SSH into your server
2. Install Node.js 18+
3. Clone repository
4. Install dependencies:

```bash
npm ci --only=production
```

5. Build application:

```bash
npm run build
```

6. Use PM2 for process management:

```bash
npm i -g pm2
pm2 start npm --name "lottery-calculator" -- start
pm2 startup
pm2 save
```

7. Set up Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Set up SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment

### 1. Test the Application

- Visit your deployed URL
- Complete the calculator flow
- Test email capture
- Verify PDF generation
- Check admin dashboard at `/admin`

### 2. Set Up Monitoring

#### Vercel Analytics (if using Vercel)

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

// In the return statement:
<Analytics />
```

#### Google Analytics

1. Create GA4 property
2. Add tracking ID to `.env`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Add Google Analytics script to `app/layout.tsx`

### 3. Set Up Database Backups

#### For Vercel Postgres:
- Automatic backups included

#### For Supabase:
- Automatic backups included (daily for free tier)

#### For self-hosted:
- Set up cron job for daily backups:

```bash
# Add to crontab
0 2 * * * pg_dump -h localhost -U user lottery_calculator | gzip > /backups/lottery_$(date +\%Y\%m\%d).sql.gz
```

### 4. Update DNS

Point your domain to your deployment:

- **Vercel**: Add domain in Vercel dashboard
- **Netlify**: Add domain in Netlify dashboard
- **VPS**: Point A record to your server IP

### 5. Configure Email Templates

Update the email template in `app/api/email/route.ts` to include your branding and links.

### 6. Set Admin Password

**CRITICAL**: Change the default admin password!

```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_very_secure_password_123!
```

### 7. Test Admin Dashboard

1. Visit `https://yourdomain.com/admin`
2. Login with your password
3. Verify analytics are tracking

## Security Checklist

- [ ] Changed default admin password
- [ ] Database credentials are secure
- [ ] Environment variables are not committed to git
- [ ] HTTPS is enabled
- [ ] Email API keys are restricted to necessary permissions only
- [ ] Database has regular backups
- [ ] Admin dashboard uses proper authentication (consider adding better auth for production)

## Performance Optimization

### Enable Caching

Add to `next.config.js`:

```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Database Connection Pooling

The app is already configured with connection pooling (max 20 connections). Adjust in `lib/db/index.ts` if needed.

### CDN for Static Assets

Most hosting providers automatically handle this. For Vercel, it's automatic.

## Updating Content/Links

To update the links to your Dream Life Calculator, No Spend Journal, and Community:

1. Update `.env`:

```env
NEXT_PUBLIC_DREAM_LIFE_CALCULATOR_URL=https://yourdomain.com/tools/dream-life
NEXT_PUBLIC_NO_SPEND_JOURNAL_URL=https://yourdomain.com/tools/no-spend
NEXT_PUBLIC_COMMUNITY_URL=https://yourdomain.com/community
```

2. These will be used in the PDF reports and email templates

## Troubleshooting

### Database Connection Issues

**Error**: `Connection terminated unexpectedly`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify database is running
3. Check firewall rules allow connection
4. For hosted services, check if IP needs to be whitelisted

### Build Failures

**Error**: `Module not found`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Email Not Sending

**Solution**:
1. Check API keys are correct
2. Verify sender email is verified
3. Check email service logs/dashboard
4. Ensure environment variables are set in production

### PDF Generation Issues

The current implementation returns HTML that can be printed to PDF. For production PDF generation:

1. Consider using a service like:
   - [Browserless](https://www.browserless.io/)
   - [PDFShift](https://pdfshift.io/)
   - [CloudConvert](https://cloudconvert.com/)

2. Or self-host with Puppeteer (requires additional setup)

### Admin Dashboard Not Loading Data

**Solution**:
1. Verify DATABASE_URL is set
2. Check database schema was created
3. Verify API routes are accessible
4. Check browser console for errors

## Support

For issues or questions:
1. Check the [GitHub repository](https://github.com/tweakyourgeek/lotto-site)
2. Review error logs in your hosting dashboard
3. Check database logs for connection issues
4. Verify all environment variables are set correctly

## Maintenance

### Regular Tasks

1. **Weekly**: Review analytics and user behavior
2. **Monthly**: Check database size and optimize if needed
3. **Quarterly**: Update dependencies:
   ```bash
   npm outdated
   npm update
   ```
4. **As needed**: Update tax rates in `lib/constants.ts` when laws change

### Scaling

If you outgrow free tiers:
1. Upgrade database plan (most important)
2. Upgrade hosting plan for more compute
3. Consider adding Redis for session caching
4. Implement rate limiting for API routes

---

**Built with ❤️ for Tweak Your Geek**
