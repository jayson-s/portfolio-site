/**
 * api/chat.js — Vercel Serverless Function
 *
 * Proxies requests to the Anthropic API so that:
 *  1. The API key lives in an env variable (never exposed to the browser)
 *  2. CORS is handled server-side (no browser blocked-request errors)
 *
 * Deploy: set ANTHROPIC_API_KEY in your Vercel project's Environment Variables.
 * Local:  create a .env.local file with ANTHROPIC_API_KEY=sk-ant-...
 */

const SYSTEM_PROMPT = `You are an AI assistant embedded in Jayson Sandhu's portfolio website. Your role is to help visitors learn about Jayson in an engaging, concise way.

About Jayson:
- Product Support Expert at Meltwater (Toronto, ON) — foundational Canadian hire, Aug 2025–Present
- Senior Technical Expert at Apple (Markham, ON) — Aug 2021–Feb 2026, top 10% performer
- Software Developer at IBM Developer Program (Markham, ON) — May–Dec 2019, built AI drone autonomy
- Assistant Store Manager at Shoppers Drug Mart — Jul 2017–Aug 2022, Employee of Quarter 2021
- BSc Computer Science (Honours) — Ontario Tech University, 2024
- Certifications: AWS Solutions Architect Associate (SAA-C03, Feb 2025), Certified Kubernetes Application Developer (CKAD, Jan 2026)
- Skills: Python, SQL, Java, JavaScript, TypeScript, C++, Bash; SaaS support, API troubleshooting, root-cause analysis, Jira, Postman; AWS (EC2, S3, Lambda, DynamoDB), Docker, Kubernetes, Linux; Next.js, React, Node.js, Flutter, Firebase; PostgreSQL, MySQL, MongoDB, Salesforce
- Projects: Pulse (React news/sports dashboard with serverless API proxy), Skyline (weather dashboard with dynamic theming), Real Estate Prediction Model (XGBoost ML pipeline), AI Othello (JavaFX + Minimax alpha-beta pruning), LifeBalance+ (Flutter cross-platform wellness app), Banking System (C++ OOP)
- Based in Toronto, ON. Open to Support Engineer roles, hybrid or remote.
- Email: jayson@jaysonsandhu.com | LinkedIn: linkedin.com/in/jaysonsandhu | GitHub: github.com/jayson-s

Keep responses concise (2-4 sentences usually). Be enthusiastic and professional. If asked about something not covered above, be honest that you don't have that detail and suggest they contact Jayson directly. Never make up information.`;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 1000;
const MAX_TOTAL_CHARS = 6000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 12;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
const rateLimitStore = new Map();

function getAllowedOrigins() {
  const configured = process.env.ALLOWED_ORIGINS || process.env.SITE_ORIGIN || '';
  const origins = configured
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  return origins;
}

function setCorsHeaders(req, res) {
  const origin = req.headers?.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function getClientId(req) {
  const forwardedFor = req.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(clientId) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientId, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    return { ok: false, error: 'messages array is required' };
  }

  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return { ok: false, error: `messages must contain 1-${MAX_MESSAGES} items` };
  }

  let totalChars = 0;
  const cleaned = [];

  for (const message of messages) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      return { ok: false, error: 'each message must include a valid role and string content' };
    }

    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, error: `message content must be 1-${MAX_MESSAGE_CHARS} characters` };
    }

    totalChars += content.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      return { ok: false, error: 'conversation is too long' };
    }

    cleaned.push({ role: message.role, content });
  }

  return { ok: true, messages: cleaned };
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};
  const validation = validateMessages(messages);

  if (!validation.ok) {
    return res.status(400).json({ error: validation.error });
  }

  if (isRateLimited(getClientId(req))) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 450,
        system: SYSTEM_PROMPT,
        messages: validation.messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('Anthropic error:', data);
      return res.status(anthropicRes.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
