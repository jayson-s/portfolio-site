/**
 * ai-chat.js — Local portfolio assistant
 * Runs fully in the browser with no external API calls or paid AI provider.
 */

const QUICK_PROMPTS = [
  "What's Jayson's current role?",
  "Tell me about his certifications",
  "What projects has he built?",
  "Is he open to new roles?",
  "What technologies does he know?",
];

const EXPERIENCE = [
  {
    id: 'meltwater',
    company: 'Meltwater',
    aliases: ['meltwater', 'current role', 'current job', 'present role'],
    role: 'Product Support Expert - L1',
    period: 'August 2025 to Present',
    location: 'Toronto, ON',
    answer: "Jayson's current role is **Product Support Expert - L1 at Meltwater** in Toronto, from **August 2025 to Present**. He works on B2B SaaS support, API/integration issues, analytics and data discrepancies, escalations, incident resolution, and cross-functional work with Product and Engineering."
  },
  {
    id: 'apple',
    company: 'Apple',
    aliases: ['apple', 'senior technical expert', 'technical expert'],
    role: 'Senior Technical Expert',
    period: 'August 2021 to February 2026',
    location: 'Markham, ON',
    answer: "At **Apple**, Jayson worked as a **Senior Technical Expert** from **August 2021 to February 2026** in Markham. He handled hardware, software, account, and ecosystem support, resolved high volumes of complex issues, mentored specialists, and maintained strong customer satisfaction."
  },
  {
    id: 'ibm',
    company: 'IBM Developer Program',
    aliases: ['ibm', 'ibm developer program', 'software developer', 'drone'],
    role: 'Software Developer',
    period: 'May 2019 to December 2019',
    location: 'Markham, ON',
    answer: "At the **IBM Developer Program**, Jayson worked as a **Software Developer** from **May 2019 to December 2019**. The work focused on Python-based drone autonomy, AI/object detection, lightweight ML workflows, and IBM Cloud telemetry services."
  },
  {
    id: 'shoppers',
    company: 'Shoppers Drug Mart',
    aliases: ['shoppers', 'shoppers drug mart', 'assistant store manager', 'oldest role', 'first role', 'earliest role'],
    role: 'Assistant Store Manager',
    period: 'July 2017 to August 2022',
    location: 'Toronto, ON',
    answer: "Jayson's earliest listed role is **Assistant Store Manager at Shoppers Drug Mart**, from **July 2017 to August 2022** in Toronto. That role built his foundation in operations, leadership, customer experience, team development, and retail execution."
  },
];

const PROJECTS = [
  {
    id: 'pulse',
    aliases: ['pulse', 'news dashboard', 'sports dashboard', 'gnews'],
    answer: "**Pulse** is a React news and sports dashboard with a secure serverless API proxy for GNews. It highlights Jayson's understanding of frontend dashboards, API handling, Vercel deployment, and protecting third-party API keys."
  },
  {
    id: 'skyline',
    aliases: ['skyline', 'weather dashboard', 'weather', 'open-meteo', 'open meteo'],
    answer: "**Skyline** is a weather dashboard with dynamic sky theming based on live conditions from the Open-Meteo API. It demonstrates React UI work, API consumption, responsive visual design, and Vercel deployment."
  },
  {
    id: 'real-estate',
    aliases: ['real estate', 'house price', 'housing', 'prediction model', 'regression'],
    answer: "The **Real Estate Prediction Model** is a Python house-price prediction pipeline. It covers housing-data analysis, EDA, feature engineering, preprocessing, regression modeling, and generated visual outputs."
  },
  {
    id: 'othello',
    aliases: ['othello', 'ai othello', 'javafx game', 'minimax', 'alpha beta'],
    answer: "**AI Othello** is a JavaFX implementation of Othello/Reversi with game logic and an AI/strategy focus. It shows Jayson's Java skills, board-game state handling, and classical AI/gameplay interests."
  },
  {
    id: 'lifebalance',
    aliases: ['lifebalance', 'lifebalance+', 'wellness app', 'flutter app', 'habit tracking'],
    answer: "**LifeBalance+** is a Flutter productivity and wellness app focused on task management, habit tracking, progress analytics, reminders, and customizable themes across mobile platforms."
  },
  {
    id: 'banking',
    aliases: ['banking', 'banking system', 'c++ banking', 'bank simulation'],
    answer: "The **Banking System** project is a C++ OOP simulation for account management and core banking operations such as deposits, withdrawals, and balance tracking."
  },
];

const TECH_ALIASES = {
  python: 'Python',
  sql: 'SQL',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  'c++': 'C++',
  cpp: 'C++',
  bash: 'Bash',
  react: 'React',
  next: 'Next.js',
  'next.js': 'Next.js',
  node: 'Node.js',
  'node.js': 'Node.js',
  flutter: 'Flutter',
  firebase: 'Firebase',
  aws: 'AWS',
  ec2: 'AWS EC2',
  s3: 'Amazon S3',
  lambda: 'AWS Lambda',
  dynamodb: 'DynamoDB',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  linux: 'Linux',
  postman: 'Postman',
  jira: 'Jira',
  salesforce: 'Salesforce',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
};

const INTENTS = [
  {
    id: 'greeting',
    priority: 100,
    phrases: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    keywords: ['hi', 'hello', 'hey'],
    answer: "Hi. I can help you quickly understand Jayson's experience, skills, projects, certifications, availability, and contact details."
  },
  {
    id: 'thanks',
    priority: 100,
    phrases: ['thanks', 'thank you', 'appreciate it'],
    keywords: ['thanks', 'thank'],
    answer: "You're welcome. Ask me about Jayson's projects, technical background, certifications, or fit for a Support Engineer role."
  },
  {
    id: 'oldest-role',
    priority: 95,
    phrases: ['oldest role', 'oldest job', 'first role', 'first job', 'earliest role', 'earliest job', 'career start', 'started career'],
    keywords: ['oldest', 'earliest', 'first', 'start'],
    answer: EXPERIENCE.find(item => item.id === 'shoppers').answer
  },
  {
    id: 'current-role',
    priority: 90,
    phrases: ['current role', 'current job', 'most recent role', 'latest role', 'present role', 'what does he do now'],
    keywords: ['current', 'latest', 'recent', 'present', 'now', 'role', 'job'],
    answer: EXPERIENCE.find(item => item.id === 'meltwater').answer
  },
  {
    id: 'timeline',
    priority: 82,
    phrases: ['timeline', 'work history', 'career history', 'employment history', 'list his roles', 'all roles'],
    keywords: ['timeline', 'history', 'roles', 'jobs', 'employment'],
    answer: "Jayson's listed timeline is: **Shoppers Drug Mart** - Assistant Store Manager, July 2017 to August 2022; **IBM Developer Program** - Software Developer, May 2019 to December 2019; **Apple** - Senior Technical Expert, August 2021 to February 2026; and **Meltwater** - Product Support Expert - L1, August 2025 to Present."
  },
  {
    id: 'experience',
    priority: 70,
    phrases: ['work experience', 'professional background', 'career background', 'tell me about his experience'],
    keywords: ['experience', 'background', 'career', 'employment'],
    answer: "Jayson has **5+ years of technical and customer-facing experience** across SaaS product support, hardware/software troubleshooting, software development, and operations leadership. His background spans Meltwater, Apple, IBM's Developer Program, and Shoppers Drug Mart."
  },
  {
    id: 'certifications',
    priority: 72,
    phrases: ['certifications', 'certificates', 'what certs', 'aws certification', 'kubernetes certification'],
    keywords: ['cert', 'certificate', 'certification', 'aws', 'kubernetes', 'ckad', 'saa'],
    answer: "Jayson holds the **AWS Solutions Architect - Associate (SAA-C03)** certification and the **Certified Kubernetes Application Developer (CKAD)** certification. Those support his cloud, infrastructure, API, and SaaS troubleshooting profile."
  },
  {
    id: 'skills',
    priority: 64,
    phrases: ['technical skills', 'tech stack', 'what technologies', 'what tools', 'what languages'],
    keywords: ['skill', 'technology', 'tech', 'stack', 'tool', 'language', 'programming', 'know'],
    answer: "Jayson's toolkit includes **Python, SQL, Java, JavaScript, TypeScript, C++, Bash, React, Node.js, Flutter, Firebase, AWS, Docker, Kubernetes, Linux, Postman, Jira, Salesforce, PostgreSQL, MySQL, and MongoDB**. His current focus areas are API troubleshooting, SaaS incident resolution, root-cause analysis, support automation, cloud diagnostics, and escalation workflows."
  },
  {
    id: 'projects',
    priority: 68,
    phrases: ['projects', 'what has he built', 'selected projects', 'portfolio projects'],
    keywords: ['project', 'projects', 'built', 'github', 'portfolio'],
    answer: "His selected projects are **Pulse**, **Skyline**, **Real Estate Prediction Model**, **AI Othello**, **LifeBalance+**, and **Banking System**. They cover React dashboards, API integration, Python regression workflows, JavaFX game development, Flutter mobile work, and C++ OOP."
  },
  {
    id: 'api-support',
    priority: 76,
    phrases: ['api troubleshooting', 'api experience', 'integration support', 'debug apis'],
    keywords: ['api', 'apis', 'integration', 'debug', 'troubleshoot', 'postman', 'logs'],
    answer: "Jayson has hands-on experience with **API troubleshooting and SaaS integration support**. He investigates failed integrations, request/response behavior, logs, data discrepancies, client context, and escalates clear findings to Product or Engineering."
  },
  {
    id: 'availability',
    priority: 74,
    phrases: ['open to roles', 'available for work', 'is he available', 'new role', 'hiring'],
    keywords: ['available', 'availability', 'open', 'hiring', 'hire', 'opportunity', 'remote', 'hybrid'],
    answer: "Yes. Jayson is **open to Support Engineer roles**, especially roles combining customer-facing technical support, API debugging, cloud diagnostics, incident resolution, and cross-functional engineering collaboration. He is based in Toronto and open to hybrid or remote opportunities."
  },
  {
    id: 'education',
    priority: 66,
    phrases: ['education', 'what degree', 'where did he study', 'university'],
    keywords: ['education', 'school', 'degree', 'university', 'ontario', 'tech', 'uoit'],
    answer: "Jayson earned a **BSc (Honours) in Computer Science** from Ontario Tech University, class of 2024. That gives him a developer foundation behind his support engineering and troubleshooting work."
  },
  {
    id: 'contact',
    priority: 78,
    phrases: ['contact', 'email', 'linkedin', 'github', 'reach him', 'connect with him'],
    keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'connect'],
    answer: "You can reach Jayson at **jayson@jaysonsandhu.com**. He is also on LinkedIn at **linkedin.com/in/jaysonsandhu** and GitHub at **github.com/jayson-s**."
  },
  {
    id: 'fit',
    priority: 69,
    phrases: ['good fit', 'why hire', 'fit for team', 'support engineer fit'],
    keywords: ['fit', 'team', 'why', 'strength', 'hire'],
    answer: "Jayson is a strong fit for teams that need someone who can **turn ambiguous technical issues into clear action**. He combines customer-facing communication, SaaS troubleshooting, API debugging, cloud fundamentals, and Product/Engineering collaboration."
  },
];

const FALLBACK_ANSWER = "I do not have that specific detail in my local knowledge base. I can answer questions about Jayson's roles, timeline, skills, certifications, projects, availability, education, and contact info. For anything more specific, reach him at **jayson@jaysonsandhu.com**.";

export function initAIChat() {
  const messagesEl  = document.getElementById('ai-chat-messages');
  const inputEl     = document.getElementById('ai-chat-input');
  const sendBtn     = document.getElementById('ai-chat-send');
  const quickWrap   = document.getElementById('ai-quick-chips');
  const teaserBtn   = document.getElementById('ai-teaser-btn');
  const chatSection = document.getElementById('ai-section');

  if (!messagesEl || !inputEl || !sendBtn) return;

  addMessage('ai', "Hi. I'm Jayson's local portfolio assistant. Ask me about his experience, timeline, skills, certifications, projects, availability, or contact info.");

  if (quickWrap) {
    QUICK_PROMPTS.forEach(prompt => {
      const chip = document.createElement('button');
      chip.className = 'ai-quick-chip';
      chip.textContent = prompt;
      chip.addEventListener('click', () => sendMessage(prompt));
      quickWrap.appendChild(chip);
    });
  }

  if (teaserBtn && chatSection) {
    teaserBtn.addEventListener('click', () => {
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => inputEl.focus(), 700);
    });
    teaserBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        teaserBtn.click();
      }
    });
  }

  sendBtn.addEventListener('click', () => {
    const val = inputEl.value.trim();
    if (val) sendMessage(val);
  });

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const val = inputEl.value.trim();
      if (val) sendMessage(val);
    }
  });

  function sendMessage(text) {
    if (!text.trim()) return;

    addMessage('user', text);
    inputEl.value = '';
    sendBtn.disabled = true;

    const typingId = showTyping();
    const delay = Math.min(700, 180 + text.length * 7);

    window.setTimeout(() => {
      removeTyping(typingId);
      addMessage('ai', getLocalReply(text));
      sendBtn.disabled = false;
      inputEl.focus();
    }, delay);
  }

  function getLocalReply(text) {
    const query = createQuery(text);

    if (!query.normalized) return FALLBACK_ANSWER;

    const companyAnswer = getCompanyReply(query);
    if (companyAnswer) return companyAnswer;

    const projectAnswer = getProjectReply(query);
    if (projectAnswer) return projectAnswer;

    const techAnswer = getTechReply(query);
    if (techAnswer) return techAnswer;

    const matches = INTENTS
      .map((intent, index) => ({ intent, index, score: scoreIntent(intent, query) }))
      .filter(match => match.score >= 4)
      .sort((a, b) => b.score - a.score || b.intent.priority - a.intent.priority || a.index - b.index);

    if (!matches.length) return FALLBACK_ANSWER;

    const primary = matches[0];
    const secondary = matches.find(match => match.intent.id !== primary.intent.id && match.score >= Math.max(6, primary.score - 2));

    if (secondary && !['greeting', 'thanks'].includes(primary.intent.id)) {
      return `${primary.intent.answer}\n\nAlso: ${secondary.intent.answer}`;
    }

    return primary.intent.answer;
  }

  function getCompanyReply(query) {
    const company = EXPERIENCE.find(item => item.aliases.some(alias => hasPhrase(query, alias)));
    if (!company) return null;

    if (hasAny(query, ['oldest', 'earliest', 'first'])) {
      return EXPERIENCE.find(item => item.id === 'shoppers').answer;
    }

    if (hasAny(query, ['current', 'latest', 'recent', 'present', 'now'])) {
      return EXPERIENCE.find(item => item.id === 'meltwater').answer;
    }

    return company.answer;
  }

  function getProjectReply(query) {
    const project = PROJECTS.find(item => item.aliases.some(alias => hasPhrase(query, alias)));
    return project ? project.answer : null;
  }

  function getTechReply(query) {
    const asksAboutKnowledge = hasAny(query, ['know', 'use', 'uses', 'skill', 'skills', 'technology', 'tech', 'tool', 'tools', 'experience']);
    const foundTech = Object.entries(TECH_ALIASES)
      .filter(([alias]) => hasPhrase(query, alias))
      .map(([, label]) => label);

    const uniqueTech = [...new Set(foundTech)];

    if (uniqueTech.length) {
      return `Yes. Jayson's listed toolkit includes **${uniqueTech.join(', ')}**. In context, those skills connect most directly to SaaS troubleshooting, API support, cloud diagnostics, development projects, and technical escalation work.`;
    }

    if (asksAboutKnowledge && hasAny(query, ['rust', 'go', 'golang', 'rails', 'ruby', 'php', 'swift'])) {
      return "That technology is not listed in Jayson's current portfolio. His documented toolkit is strongest around **Python, SQL, Java, JavaScript/TypeScript, React, Node.js, Flutter, AWS, Docker, Kubernetes, Linux, Postman, Jira, and databases**.";
    }

    return null;
  }

  function scoreIntent(intent, query) {
    let score = 0;

    intent.phrases.forEach(phrase => {
      if (hasPhrase(query, phrase)) score += 10 + phrase.split(' ').length;
    });

    intent.keywords.forEach(keyword => {
      const normalized = normalizeText(keyword);
      if (hasPhrase(query, normalized)) {
        score += keyword.length > 4 ? 3 : 2;
        return;
      }

      if (isFuzzyTokenMatch(query.tokens, normalized)) {
        score += 1;
      }
    });

    return score + intent.priority / 100;
  }

  function createQuery(text) {
    const normalized = normalizeText(text);
    return {
      normalized,
      tokens: normalized.split(' ').filter(Boolean),
    };
  }

  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/\+/g, ' plus ')
      .replace(/c\s*plus\s*plus/g, 'c++')
      .replace(/[^a-z0-9+.\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hasPhrase(query, phrase) {
    const normalizedPhrase = normalizeText(phrase);
    return query.normalized === normalizedPhrase || query.normalized.includes(normalizedPhrase);
  }

  function hasAny(query, terms) {
    return terms.some(term => hasPhrase(query, term));
  }

  function isFuzzyTokenMatch(tokens, keyword) {
    if (keyword.length < 5 || keyword.includes(' ')) return false;
    return tokens.some(token => token.length >= 5 && levenshtein(token, keyword) <= 1);
  }

  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);

    for (let col = 0; col <= a.length; col += 1) {
      matrix[0][col] = col;
    }

    for (let row = 1; row <= b.length; row += 1) {
      for (let col = 1; col <= a.length; col += 1) {
        matrix[row][col] = b[row - 1] === a[col - 1]
          ? matrix[row - 1][col - 1]
          : Math.min(
              matrix[row - 1][col - 1] + 1,
              matrix[row][col - 1] + 1,
              matrix[row - 1][col] + 1
            );
      }
    }

    return matrix[b.length][a.length];
  }

  function addMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = `chat-avatar ${role === 'ai' ? 'ai-avatar' : 'user-avatar'}`;
    avatar.textContent = role === 'ai' ? '✦' : 'You';

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role === 'ai' ? 'ai-bubble' : 'user-bubble'}`;
    appendFormattedText(bubble, text);

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const id = 'typing-' + Date.now();
    const msg = document.createElement('div');
    msg.className = 'chat-msg ai';
    msg.id = id;

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar ai-avatar';
    avatar.textContent = '✦';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ai-bubble';

    const ind = document.createElement('div');
    ind.className = 'typing-indicator';
    ind.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

    bubble.appendChild(ind);
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function appendFormattedText(parent, text) {
    const lines = text.split('\n');

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) parent.appendChild(document.createElement('br'));

      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      parts.forEach(part => {
        if (!part) return;

        if (part.startsWith('**') && part.endsWith('**')) {
          const strong = document.createElement('strong');
          strong.textContent = part.slice(2, -2);
          parent.appendChild(strong);
          return;
        }

        parent.appendChild(document.createTextNode(part));
      });
    });
  }
}
