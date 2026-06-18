# Off Campus Jobs India - Project Memory

## Key Information
- **Domain**: `https://www.offcampusjobsindia.com`
- **Hosting**: Vercel (Production)
- **Database**: Supabase PostgreSQL + Storage
- **Tech Stack**: Next.js 15.5.19 (App Router), Tailwind CSS, Prisma, Zod

## Recent Decisions & Context
- **June 18, 2026**: Custom domain configured via GoDaddy DNS. Verified ownership in Google Search Console using HTML tag (managed via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel environment variables). Submitted `sitemap.xml`.
- **June 18, 2026**: Replaced generic Lucide icons with a custom generated vector logo (Graduation Cap + Briefcase) across the site header and favicon. Favicon implemented as `icon.png` in the App Router for automatic detection.
- **June 9, 2026**: Merged taxonomy duplicate tags logic implemented. Optimized Gemini prompt to strictly output 1-2 sentences for "How to Apply" section to prevent generic AI text while maintaining SEO keywords.
