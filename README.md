# Jayson Sandhu — Portfolio v2

A modular, AI-enhanced portfolio website. Rebuilt from a monolithic single HTML file into a clean multi-file project structure.

---

## Project Structure

```
jayson-portfolio/
├── index.html
├── README.md
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
    └── ai-chat.js           ← Local no-cost portfolio assistant
```

---

## Features

### AI Assistant
- **Local no-cost portfolio assistant** embedded in the site
- Visitors can ask natural questions about experience, skills, projects, and availability
- Quick-prompt chips for one-tap exploration
- Intent-based responses from a built-in knowledge base
- No external AI provider, API key, billing, or serverless function required

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
| `ai-chat.js` | Local assistant knowledge base, message rendering, quick chips |

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
The static site can be hosted on Netlify. The assistant runs locally in the browser and does not require serverless functions.

### GitHub Pages
Push to a repo, enable Pages from Settings > Pages, set source to root of `main` branch. The assistant runs locally in the browser, so GitHub Pages can host the full portfolio experience.

---

## AI Assistant Notes

The assistant in `js/ai-chat.js` is local and deterministic. It matches visitor questions against a small keyword-based knowledge base and returns prewritten answers about Jayson's experience, certifications, skills, projects, availability, and contact information.

This approach has no API cost, no secrets, no billing risk, and works on static hosting. The tradeoff is that it is not a full language model; it should be treated as a guided portfolio assistant rather than a general chatbot.

---

## Customisation

- **Content**: Edit `index.html` — all copy lives there
- **Colours**: Edit `css/tokens.css` — change `--accent`, `--navy`, `--ai-1` etc.
- **AI assistant answers**: Edit the `ANSWERS` array in `js/ai-chat.js`
- **Quick chips**: Edit `QUICK_PROMPTS` array in `js/ai-chat.js`
