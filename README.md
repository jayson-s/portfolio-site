# Jayson Sandhu — Portfolio v2

A modular, AI-enhanced portfolio website. Rebuilt from a monolithic single HTML file into a clean multi-file project structure.

---

## Project Structure

```
jayson-portfolio/
├── index.html
├── README.md
│
├── api/
│   └── chat.js              ← Vercel serverless proxy (Anthropic API + system prompt)
│
├── css/
│   ├── tokens.css           ← Design system (colours, spacing, motion)
│   ├── base.css             ← Reset, utilities, buttons
│   ├── nav.css              ← Navigation + custom cursor
│   ├── hero.css             ← Hero section
│   └── sections.css         ← Marquee, About, Skills, AI Chat, Projects, Experience, Contact
│
└── js/
    ├── main.js              ← Entry point — imports & initialises all modules
    ├── cursor.js            ← Custom cursor + nav scroll/hamburger
    ├── animations.js        ← Scroll reveals, counters, magnetic buttons
    ├── accordion.js         ← Experience accordion
    └── ai-chat.js           ← AI assistant (calls /api/chat)
```

---

## Features

### AI Assistant
- **Live Claude-powered chat** embedded in the portfolio
- Visitors can ask natural questions about experience, skills, projects, and availability
- Quick-prompt chips for one-tap exploration
- Full conversation context maintained across the session
- Graceful error handling

### Design System (tokens.css)
All visual decisions live in CSS custom properties:
- Colour palette (paper, navy, accent, AI gradient)
- Typography scale (Cormorant Garamond serif + Jost sans + JetBrains Mono)
- Spacing scale, motion easings, shadows, z-index layers

### JavaScript Modules (ES Modules)
Each concern is isolated:
| Module | Responsibility |
|---|---|
| `cursor.js` | Custom cursor + nav scroll shrink + mobile drawer |
| `animations.js` | IntersectionObserver scroll reveals, hero entrance stagger, counter animations |
| `accordion.js` | Experience accordion with keyboard accessibility |
| `ai-chat.js` | Anthropic API integration, message rendering, quick chips |

---

## Deployment

### Vercel (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd jayson-portfolio
vercel
```

### Netlify
The static site can be hosted on Netlify, but the AI assistant depends on the Vercel-style serverless function in `api/chat.js`. If you deploy to Netlify, port that function to a Netlify Function or disable the AI assistant.

### GitHub Pages
Push to a repo, enable Pages from Settings > Pages, set source to root of `main` branch. GitHub Pages only serves static files, so `/api/chat` will not run there unless you host the API somewhere else and update `js/ai-chat.js` to call that endpoint.

---

## AI Assistant Notes

The AI chat in `js/ai-chat.js` calls `/api/chat`, and `api/chat.js` proxies requests to Anthropic. This keeps `ANTHROPIC_API_KEY` and the assistant system prompt server-side.

Required Vercel environment variable:
- `ANTHROPIC_API_KEY`: Anthropic API key used by the serverless proxy.

Optional Vercel environment variables:
- `ANTHROPIC_MODEL`: Anthropic model ID. Defaults to `claude-sonnet-4-5-20250929`.
- `ALLOWED_ORIGINS`: comma-separated list of origins that may call the API cross-origin, such as `https://www.jaysonsandhu.com,https://jaysonsandhu.com`.
- `SITE_ORIGIN`: single-origin alternative to `ALLOWED_ORIGINS`.

The proxy validates message shape and size, handles CORS preflight requests, limits responses to concise output, and includes a best-effort in-memory rate limit. For higher-traffic production use, replace the in-memory limiter with a shared store such as Upstash Redis or Vercel KV.

---

## Customisation

- **Content**: Edit `index.html` — all copy lives there
- **Colours**: Edit `css/tokens.css` — change `--accent`, `--navy`, `--ai-1` etc.
- **AI persona**: Edit `SYSTEM_PROMPT` in `api/chat.js`
- **Quick chips**: Edit `QUICK_PROMPTS` array in `js/ai-chat.js`
