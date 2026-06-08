export const siteConfig = {
  name: "Off Campus Jobs India",
  description:
    "Latest off campus jobs, internships, walk-ins, work from home jobs, and fresher hiring updates for Indian students and graduates.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  telegramUrl:
    process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/offcampusjobsindia_IT",
  nav: [
    { label: "IT Jobs", href: "/category/it-jobs" },
    { label: "Internships", href: "/category/internships" },
    { label: "Remote", href: "/remote-jobs" },
    { label: "Walk-ins", href: "/category/walk-ins" },
  ],
};
