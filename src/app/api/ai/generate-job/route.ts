import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  jobText: z.string().optional(),
  careerUrl: z.string().url().optional().or(z.literal("")),
});

const generatedJobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  qualifications: z.array(z.string()),
  batches: z.array(z.string()),
  salary: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  applyUrl: z.string().optional(),
  seoTitle: z.string(),
  metaDescription: z.string(),
  slug: z.string(),
  featuredImage: z.string().nullable().optional(),
  sections: z.object({
    jobSummary: z.string(),
    overview: z.string(),
    keyResponsibilities: z.array(z.string()),
    eligibility: z.string(),
    requiredSkills: z.array(z.string()),
    benefits: z.array(z.string()),
    selectionProcess: z.string(),
    howToApply: z.string(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

function getGemini() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function readInput(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return requestSchema.safeParse(await request.json());
  }

  const formData = await request.formData();
  return requestSchema.safeParse({
    jobText: formData.get("jobText"),
    careerUrl: formData.get("careerUrl"),
  });
}

async function fetchCareerUrl(url?: string) {
  if (!url) {
    return "";
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Off Campus Jobs India content extraction bot",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return "";
    }

    const html = await response.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").slice(0, 12000);
  } catch {
    return "";
  }
}

function extractJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini did not return JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(request: Request) {
  const body = await readInput(request);

  if (!body.success || (!body.data.jobText && !body.data.careerUrl)) {
    return NextResponse.json(
      { error: "Provide pasted job text or a company career URL." },
      { status: 400 },
    );
  }

  const gemini = getGemini();

  if (!gemini) {
    return NextResponse.json(
      {
        error: "GEMINI_API_KEY is not configured.",
        draft: null,
      },
      { status: 503 },
    );
  }

  const careerPageText = await fetchCareerUrl(body.data.careerUrl || undefined);
  const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Extract job data and generate an SEO article for Off Campus Jobs India.
Return strict JSON only. No markdown.
The JSON shape must be:
{
  "title": string,
  "company": string,
  "location": string,
  "qualifications": string[] (Only extract standard, short academic degrees like B.Tech, BCA, MCA, MBA. Do not include full sentences or soft skills),
  "batches": string[],
  "salary": string | null,
  "deadline": string | null,
  "applyUrl": string,
  "seoTitle": string,
  "metaDescription": string,
  "slug": string,
  "featuredImage": "string | null (If you know the company's official website domain e.g. google.com, return https://logo.clearbit.com/DOMAIN_NAME?size=800)",
  "sections": {
    "jobSummary": string,
    "overview": string,
    "keyResponsibilities": string[],
    "eligibility": string,
    "requiredSkills": string[],
    "benefits": string[],
    "selectionProcess": string,
    "howToApply": string,
    "faq": [{"question": string, "answer": string}]
  }
}
Target total article length: 1200-1800 words.

Career URL: ${body.data.careerUrl || "not provided"}
Pasted job text:
${body.data.jobText || "not provided"}

Career page extracted text:
${careerPageText || "not available"}`;

  const MAX_RETRIES = 2;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      const json = extractJson(raw);
      const parsed = generatedJobSchema.safeParse(json);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Generated content did not match the expected structure.", raw },
          { status: 422 },
        );
      }

      return NextResponse.json({ draft: parsed.data });
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message : "";
      const isTransient = message.includes("503") || message.includes("429") || message.includes("quota");

      if (isTransient && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 3000));
        continue;
      }

      break;
    }
  }

  const message = lastError instanceof Error ? lastError.message : "Unknown Gemini error.";

  if (message.includes("429") || message.includes("quota")) {
    return NextResponse.json(
      { error: "Gemini rate limit exceeded. Please wait a moment and try again.", details: message },
      { status: 429 },
    );
  }

  if (message.includes("503") || message.includes("high demand")) {
    return NextResponse.json(
      { error: "Gemini is experiencing high demand. Please try again in a few seconds.", details: message },
      { status: 503 },
    );
  }

  if (message.includes("403") || message.includes("API key")) {
    return NextResponse.json(
      { error: "Gemini API key is invalid or unauthorized.", details: message },
      { status: 403 },
    );
  }

  return NextResponse.json(
    { error: "Gemini generation failed.", details: message },
    { status: 500 },
  );
}
