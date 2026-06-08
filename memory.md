# Off Campus Jobs India - Project Memory

Last updated: 2026-06-08

## Product Definition

Off Campus Jobs India is an SEO-first jobs content platform for Indian job seekers. It is not a Naukri-style application portal and does not require public user accounts.

Primary categories:

- IT Jobs
- Non-IT Jobs
- Internships
- Walk-ins
- Work From Home Jobs

Primary business goals:

- Grow Telegram channel.
- Generate AdSense revenue.
- Support future course sales.
- Support future resume review services.

## User Roles

- Visitor: no login, can browse/search/filter jobs and articles, click apply, join Telegram, and submit email.
- Editor: login required, can create/edit jobs, upload images, generate AI content, publish jobs, and manage SEO metadata.
- Admin: can do everything and create editor accounts.

Public registration is not allowed. Google login is not required. Admin creates editor accounts manually.

## Technical Requirements

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase PostgreSQL
- Supabase Storage
- Prisma ORM
- Gemini API integration
- PostHog
- Google Analytics
- Google Search Console support
- Vercel deployment

## Key Architecture Decisions

- Public job/content pages must remain indexable and accessible without auth.
- Expired jobs must remain live and should never 404 solely because they expired.
- Apply flow is a direct redirect to the company career URL with no popup and no signup wall.
- Use ISR/revalidation for public content where possible.
- Use server-side authorization checks for admin/editor routes and actions.
- Keep service SDK initialization lazy to avoid build-time crashes when environment variables are absent.
- Current MVP uses seeded fallback data while preserving lazy Prisma access so the app builds before Supabase is configured.
- Public reads now use Prisma-backed queries when `DATABASE_URL` is configured and seeded fallback data when it is not.
- Prisma is pinned to v6.19.3 because Prisma v7 removed schema-level `url`/`directUrl`, while the project setup expects the standard Supabase `DATABASE_URL` and `DIRECT_URL` workflow.
- `next/font/google` was removed to avoid build-time Google Fonts network fetches in restricted/offline environments. The app uses CSS font fallbacks with Geist-compatible names.
- `postcss` is overridden to `^8.5.10` to keep npm audit clean while staying on Next.js 15.5.19.
- Admin/editor auth uses an HTTP-only `ocji_session` JWT cookie signed with `AUTH_SECRET`.
- Admin pages call `requireUser()` server-side; middleware/proxy is not the sole auth control.
- The first admin is created through `npm run seed` with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`; public registration remains unsupported.
- Admin mutations deliberately fail without `DATABASE_URL` instead of silently writing to fallback sample data.
- Supabase Storage upload is server-side through the service-role client. Thumbnail/medium/large/WebP behavior uses Supabase Storage image transformations rather than generating separate local derivative files.
- Gemini output is expected as strict JSON and is validated with Zod before being returned to the editor workflow.
- Site settings are stored in `SiteSetting` under key `site` and control Telegram URL, GA, PostHog, AdSense snippets, and internal-linking flag.
- Local Prisma connectivity to Supabase uses the dashboard-provided pooled URLs: transaction-mode pooler for `DATABASE_URL` and session-mode pooler for `DIRECT_URL`.
- Live admin verification created a published test job with slug `codex-live-prisma-test-20260609`; treat it as test content that can be archived or deleted before production launch.
- Live Storage verification created public bucket `job-assets` and uploaded test object `jobs/storage-validation-20260609.png`; treat it as test media that can be deleted before production launch.
- Featured image upload/path generation is verified, but public job pages do not currently render featured images from `featuredImage`.

## SEO Requirements

- Dynamic metadata
- Open Graph and Twitter cards
- Canonical URLs
- XML sitemap
- Robots.txt
- Breadcrumbs
- JobPosting structured data for job pages
- Pagination SEO
- Internal linking modules for related jobs
- Google Search Console verification through `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

## Admin and Content Workflow

Job creation supports:

- Pasted job description text.
- Pasted company career URL.

The system should extract structured data, then call Gemini to generate:

- 1200-1800 word SEO article content
- Job Summary
- Overview
- Key Responsibilities
- Eligibility
- Required Skills
- Benefits
- Selection Process
- How To Apply
- FAQ
- SEO title
- Meta description
- Suggested slug

Editors can modify all generated content before publishing.

Current admin workflow routes:

- `/admin/jobs/new` for create
- `/admin/jobs/[id]` for edit
- `/admin/settings` for Telegram, analytics, AdSense, and internal-linking settings
- `/admin/users` for admin-created editor/admin accounts
- `/admin/taxonomy` for taxonomy creation/upsert
- `/admin/media` for Supabase Storage upload
- `/admin/articles` for Career Hub article creation
- `/admin/analytics` for event summaries and recent events

## Data Model Notes

Core normalized entities:

- Job
- Company
- Qualification
- Batch
- Location
- Category

Additional likely entities:

- User for admin/editor accounts
- EmailSubscriber
- SiteSetting for Telegram, analytics, AdSense, and internal-linking settings
- Article for Career Hub content
- JobView/AnalyticsEvent or lightweight event logging if needed

## UI Direction

- Modern hybrid design.
- Mobile first.
- Fast, clean, professional, and SEO-focused.
- Avoid clutter and excessive animation.
- Operational/admin surfaces should be dense, restrained, and scan-friendly.

## Constraints and Assumptions

- No secrets should be stored in docs or source files.
- The workspace currently has no Git repository; do not initialize Git unless asked.
- Environment variables and external service setup will be documented, not hardcoded.
- `C:` had zero free bytes during setup; npm cache was redirected to `D:\new_downloads\websiteshubham\.npm-cache` for successful installs.
- Public visitor functionality takes precedence over account features because the product is SEO-first.
- In-app Browser automation was not exposed during the last verification attempt; HTTP route checks and production build verification were used instead.
- Live Supabase, Gemini, GA, PostHog, and Vercel verification remain dependent on environment credentials.
