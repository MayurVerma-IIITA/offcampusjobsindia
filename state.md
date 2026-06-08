# Off Campus Jobs India - Project State

Last updated: 2026-06-08

## Current Status

- Next.js 15.5.19 App Router project is scaffolded in `D:\new_downloads\websiteshubham`.
- The app now has a broad production-oriented implementation for the SEO jobs platform: public SEO pages, Prisma-backed data access with fallback sample data, admin/editor auth, admin CRUD workflows, settings, media upload plumbing, analytics, Career Hub, filters, pagination, breadcrumbs, and structured Gemini generation.
- The app still runs without Supabase credentials by falling back to seeded local content for public reads.
- Admin mutations require `DATABASE_URL`; Supabase is migrated and seeded, but the local Prisma connection still needs a reachable pooled connection string.

## Completed

- Created living project docs: `state.md` and `memory.md`.
- Installed patched Next.js 15 and React 19 versions.
- Installed core dependencies:
  - Prisma 6
  - Supabase client
  - Gemini SDK
  - PostHog
  - Zod
  - lucide-react
  - UI utility packages
- Added npm scripts for Prisma generation, migrations, studio, and seeding.
- Added `prisma/schema.prisma` with normalized models for:
  - Users
  - Jobs
  - Companies
  - Categories
  - Locations
  - Qualifications
  - Batches
  - Articles
  - Email subscribers
  - Site settings
  - Analytics events
- Added first-admin seed script using `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.
- Created Supabase project `Off Campus Jobs India` with ref `qojfhuvbjsoghwjjjacy`.
- Applied initial Prisma schema migration to Supabase.
- Enabled RLS on all app tables.
- Added missing foreign-key performance indexes in Supabase and updated local Prisma schema.
- Seeded first admin account `admin@example.com` directly in Supabase without storing the password in project files.
- Verified remote Supabase data through MCP SQL; the `User` table contains one seeded admin.
- Configured local Prisma database URLs with Supabase's dashboard-provided transaction/session poolers.
- Verified local Prisma connectivity to live Supabase through the transaction pooler; current counts are `users=1` and `jobs=0`.
- Verified admin login against live Supabase with the seeded admin account.
- Verified admin create/publish job flow against live Supabase by creating published job `codex-live-prisma-test-20260609`.
- Verified admin edit job flow by updating the test job salary to `4 LPA - 6 LPA`.
- Verified the published job renders on `/jobs/codex-live-prisma-test-20260609` and appears on `/jobs` with live taxonomy-backed filters.
- Created Supabase Storage bucket `job-assets` as a public image bucket.
- Verified Supabase Storage upload with test object `jobs/storage-validation-20260609.png`.
- Verified original, thumbnail, medium, and large Supabase transformation URLs return `200 image/png`.
- Verified `/admin/media?path=jobs%2Fstorage-validation-20260609.png` displays the storage path and transformed URLs.
- Added Prisma-backed job reads with seeded fallback when the database is not configured.
- Added public routes:
  - `/`
  - `/jobs`
  - `/jobs/[slug]`
  - `/companies/[company]`
  - `/qualification/[qualification]`
  - `/batch/[batch]`
  - `/location/[city]`
  - `/category/[category]`
  - `/remote-jobs`
  - `/hybrid-jobs`
  - `/onsite-jobs`
  - `/career-hub`
  - `/career-hub/[slug]`
- Added admin routes:
  - `/admin`
  - `/admin/jobs/new`
  - `/admin/jobs/[id]`
  - `/admin/login`
  - `/admin/logout`
  - `/admin/settings`
  - `/admin/users`
  - `/admin/taxonomy`
  - `/admin/media`
  - `/admin/articles`
  - `/admin/analytics`
- Added admin/editor auth:
  - HTTP-only JWT session cookie
  - server-side `requireUser()` checks
  - no public registration
  - admin-only editor account creation
- Added admin workflows:
  - Create job
  - Edit job
  - Archive job
  - Publish/draft/expired status selection
  - Expire jobs past deadline
  - Create editor/admin accounts
  - Create taxonomy records
  - Configure Telegram, GA, PostHog, AdSense slots, and internal-linking flag
  - Upload featured image to Supabase Storage
  - Create Career Hub articles
  - View analytics summary and recent events
- Added API routes:
  - `POST /api/ai/generate-job`
  - `POST /api/subscribe`
  - `POST /api/track`
- Improved Gemini route:
  - Accepts JSON or form input
  - Supports pasted job text or company career URL
  - Fetches career URL text when possible
  - Prompts Gemini for strict JSON
  - Validates structured output with Zod
- Added public UX/SEO features:
  - Search and full filter UI
  - Pagination UI
  - Breadcrumb UI
  - Configurable Telegram CTA
  - Configurable AdSense slots
  - Career Hub article pages
  - Related jobs/internal linking module
  - Job expiry display logic
  - Direct apply links
  - PostHog initialization and event capture plumbing
  - Google Analytics script support
- Added SEO infrastructure:
  - Dynamic page metadata helpers
  - Canonical URL helper
  - JobPosting JSON-LD
  - `sitemap.xml`
  - `robots.txt`
  - Google Search Console verification env support
- Added `docs/setup.md` and `.env.example`.
- Added PostCSS override for a clean security audit.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm audit --json`: passed with 0 vulnerabilities.
- Latest build generated 25 App Router pages/routes successfully.
- Dev server was restarted after clearing a stale `.next` development cache.
- Live Supabase admin flow verification passed:
  - admin login
  - job create/publish
  - job edit
  - public job detail rendering
  - public jobs listing rendering
- Live Supabase Storage verification passed:
  - bucket creation
  - image upload
  - public original image URL
  - transformed image URLs
  - admin media path display
- Local HTTP checks returned:
  - `/`: `200`
  - `/jobs?workMode=Remote`: `200`
  - `/career-hub`: `200`
  - `/admin`: `307` redirect to login when unauthenticated

## Pending / Credential-Bound

- Verify live Supabase Storage upload and transformed image URLs.
- Verify Gemini generation with a real `GEMINI_API_KEY`.
- Verify GA/PostHog with real production keys.
- Deploy to Vercel and set production environment variables.
- Submit sitemap in Google Search Console after deployment.

## Remaining Product Gaps

- Taxonomy management supports creation/upsert, but not dedicated edit/delete screens.
- Image delivery uses Supabase Storage## Outstanding Tasks
1. **Analytics integration**:
   - Needs configuration for Google Analytics or PostHog.
2. **Automated Expiry**:
   - `src/app/api/cron/expire/route.ts` runs on a schedule (e.g. Vercel Cron) to move passed-deadline jobs to EXPIRED.
3. **Deployment**:
   - Final Vercel setup (database URL, auth secret, cron).

## Recent Progress
- **AI Form UX**:
  - Replaced native `<form>` on `/admin/jobs/new` with `AiGeneratePanel` and `NewJobPageClient`.
  - Generation happens via `fetch`, allowing validation errors or results without losing local state.
  - Form inputs auto-fill correctly via a `key`-based remount on the `JobForm`.
- **Gemini Verification**:
  - API route (`/api/ai/generate-job`) works correctly, validates schema, and parses output.
  - **Issue**: Google API is aggressively returning `503 Service Unavailable` (High Demand) for `gemini-2.5-flash` and `429 Quota Exceeded` for the free-tier on `gemini-2.0-flash` and `gemini-2.0-flash-lite`. 
  - Code correctly uses exponential backoff and retry, but limits are persistent from Google Cloud side for this key's project.
- **Featured Images**:
  - Implemented `getTransformedImageUrls` usage in `JobCard` and `JobDetailPage`.
  - Verified public views correctly request the generated `medium` and `large` Supabase thumbnails for optimized loading.
- Branch: none.
- Deployment: none.

## Next Actions

1. Verify Gemini with a real API key.
2. Verify GA/PostHog with real production keys.
3. Add public featured-image rendering if required before launch.
4. Deploy to Vercel.
