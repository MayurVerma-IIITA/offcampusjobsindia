# Off Campus Jobs India

A production-grade, SEO-focused jobs content platform built with Next.js 15 App Router.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & shadcn/ui
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **AI Content:** Google Gemini API
- **Analytics:** PostHog & Google Analytics
- **Deployment:** Vercel

## Prerequisites

1. **Node.js** v18+
2. **Supabase** account (for Database and Storage)
3. **Google Gemini** API key (with an active billing account linked in Google Cloud to avoid zero-quota limits)
4. **PostHog** account (optional, for advanced analytics)
5. **Google Analytics** property ID (optional)
6. **Vercel** account (for deployment)

## Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Supabase Database connection (Connection Pooling URL for Prisma)
DATABASE_URL="postgres://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct URL for Prisma migrations
DIRECT_URL="postgres://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_random_32_char_string_here" # Use `openssl rand -base64 32`

# Admin initial credentials (used by Prisma seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="SecurePassword123"

# Gemini API Key (ensure your Google Cloud project has billing enabled)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Supabase Admin / Storage Configuration
SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
SUPABASE_STORAGE_BUCKET="job-assets"

# Vercel Cron Secret (for automated job expiry)
CRON_SECRET="your_cron_secret"

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY="phc_your_key_here"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
# Google Analytics ID (can also be configured via Admin Dashboard Settings UI)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
   *(The seed script will create an initial admin account using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env.local`)*

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the Admin Dashboard:**
   Navigate to `http://localhost:3000/admin/login` and use the admin credentials seeded above.

## Supabase Storage Setup

To use the featured image upload and optimized image delivery features, you must configure a public storage bucket in Supabase:

1. Create a new storage bucket in your Supabase project named `job-assets` (or update `SUPABASE_STORAGE_BUCKET` if you choose a different name).
2. Set the bucket to **Public**.
3. *Note:* The application utilizes Supabase's built-in image transformations. Ensure your Supabase plan supports image transformations. The app automatically requests `/object/public/job-assets/[path]?width=768&resize=cover` for optimized delivery.

## Vercel Deployment

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure **all environment variables** listed above in the Vercel project settings.
   - For `NEXTAUTH_URL` in production, set it to your actual domain name (e.g., `https://offcampusjobsindia.com`).
4. Click **Deploy**. Vercel will automatically run the build and start the server.

### Vercel Cron Jobs (Job Expiry)
The repository includes a `vercel.json` file which defines a daily cron job to automatically mark jobs as `EXPIRED` once their deadline passes. 
- Ensure you have set the `CRON_SECRET` environment variable in Vercel to secure the `/api/cron/expire` endpoint.
- You can manually trigger the cron job from the Vercel Dashboard -> Settings -> Cron Jobs for testing.

## Post-Launch SEO Steps
1. Add your site to **Google Search Console**.
2. Submit your dynamically generated sitemap at `https://yourdomain.com/sitemap.xml`.
3. The site automatically generates `robots.txt` and rich `JobPosting` schema markup on individual job pages.
