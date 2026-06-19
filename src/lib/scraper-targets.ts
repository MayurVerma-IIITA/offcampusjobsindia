export type BoardType = "greenhouse" | "lever";

export interface ScraperTarget {
  name: string;
  type: BoardType;
  slug: string;
}

export const scraperTargets: ScraperTarget[] = [
  // Greenhouse ATS
  { name: "PhonePe", type: "greenhouse", slug: "phonepe" },
  { name: "Myntra", type: "greenhouse", slug: "myntra" },
  { name: "Canonical", type: "greenhouse", slug: "canonical" },
  { name: "Airbnb", type: "greenhouse", slug: "airbnb" },
  { name: "Twilio", type: "greenhouse", slug: "twilio" },
  { name: "Dropbox", type: "greenhouse", slug: "dropbox" },
  { name: "Figma", type: "greenhouse", slug: "figma" },
  { name: "Stripe", type: "greenhouse", slug: "stripe" },

  // Lever ATS
  { name: "Atlassian", type: "lever", slug: "atlassian" },
  { name: "Razorpay", type: "lever", slug: "razorpay" },
  { name: "BrowserStack", type: "lever", slug: "browserstack" },
  { name: "Postman", type: "lever", slug: "postman" },
  { name: "Zepto", type: "lever", slug: "zepto" },
  { name: "Netflix", type: "lever", slug: "netflix" },
  { name: "Spotify", type: "lever", slug: "spotify" },
  { name: "Coursera", type: "lever", slug: "coursera" },
];
