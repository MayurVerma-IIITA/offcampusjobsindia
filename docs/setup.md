# Off Campus Jobs India Setup

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Configure Supabase PostgreSQL:

- `DATABASE_URL` should use the pooled Supabase connection string.
- `DIRECT_URL` should use the direct connection string for migrations.

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Create the first admin account:

```bash
npm run seed
```

Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` first. Public registration is intentionally not supported.

6. Start development:

```bash
npm run dev
```

## Supabase Storage

Create a private or public bucket named by `SUPABASE_STORAGE_BUCKET` for uploaded job images. The app is structured for WebP/thumbnail/medium/large variants; image processing can be added as a follow-up worker or route handler.

## Gemini

Set `GEMINI_API_KEY`. The route `POST /api/ai/generate-job` accepts either pasted job text or a career URL and returns structured job data plus SEO article sections.

## Analytics

Set:

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

Tracked event names include `job_view`, `apply_click`, `telegram_click`, `search`, and `filter`.

## Vercel

Add all environment variables in Vercel Project Settings. Use Supabase pooled connection for runtime and direct connection only for migration workflows.

## Search Console

After deployment, submit:

- `/sitemap.xml`
- `/robots.txt`

Set the production domain with `NEXT_PUBLIC_SITE_URL` so canonical URLs and sitemap entries are correct.
