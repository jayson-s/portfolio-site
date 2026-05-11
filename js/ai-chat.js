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

const ANSWERS = [
  {
    keywords: ['current', 'role', 'job', 'meltwater', 'work now', 'doing now'],
    answer: "Jayson is a **Product Support Expert at Meltwater** in Toronto. He supports complex B2B SaaS issues across analytics, API integrations, data discrepancies, escalations, and incident resolution while partnering with Product and Engineering."
  },
  {
    keywords: ['experience', 'background', 'career', 'apple', 'ibm', 'shoppers', 'employment'],
    answer: "Jayson has **5+ years of technical and customer-facing experience**. His background includes Product Support at Meltwater, Senior Technical Expert work at Apple, software development through IBM's Developer Program, and operations leadership at Shoppers Drug Mart."
  },
  {
    keywords: ['cert', 'certificate', 'certification', 'aws', 'kubernetes', 'ckad', 'saa'],
    answer: "Jayson holds the **AWS Solutions Architect - Associate (SAA-C03)** certification and the **Certified Kubernetes Application Developer (CKAD)** certification. Those pair well with his SaaS support, cloud diagnostics, and technical escalation experience."
  },
  {
    keywords: ['skill', 'technology', 'tech stack', 'tools', 'languages', 'programming', 'know'],
    answer: "Jayson's technical toolkit includes **Python, SQL, Java, JavaScript, TypeScript, C++, Bash, React, Node.js, Flutter, Firebase, AWS, Docker, Kubernetes, Linux, Postman, Jira, Salesforce, PostgreSQL, MySQL, and MongoDB**. His strongest focus areas are API troubleshooting, SaaS incident resolution, root-cause analysis, cloud diagnostics, support automation, and escalation workflows."
  },
  {
    keywords: ['project', 'built', 'portfolio', 'github', 'pulse', 'skyline', 'real estate', 'othello', 'lifebalance', 'banking'],
    answer: "His selected projects include **Pulse**, a React news and sports dashboard with a serverless API proxy; **Skyline**, a weather dashboard with dynamic sky theming; a **Real Estate Prediction Model** using Python regression workflows; **AI Othello** in JavaFX; **LifeBalance+**, a Flutter wellness/productivity app; and a **C++ Banking System** simulation."
  },
  {
    keywords: ['api', 'apis', 'integration', 'debug', 'troubleshoot', 'postman'],
    answer: "Jayson has hands-on experience troubleshooting **API integrations and SaaS platform issues**. His support work includes investigating failed integrations, checking request/response behavior, using tools like Postman, reading logs and client context, and escalating clear findings to Product or Engineering."
  },
  {
    keywords: ['available', 'availability', 'open', 'new role', 'hiring', 'hire', 'opportunity', 'remote', 'hybrid'],
    answer: "Yes. Jayson is **open to Support Engineer roles**, especially opportunities where he can combine customer-facing technical support with API debugging, cloud diagnostics, incident resolution, and cross-functional engineering collaboration. He is based in Toronto and open to hybrid or remote roles."
  },
  {
    keywords: ['education', 'school', 'degree', 'university', 'ontario tech', 'uoit'],
    answer: "Jayson earned a **BSc (Honours) in Computer Science** from Ontario Tech University, class of 2024. His degree supports his developer-oriented approach to support engineering and technical troubleshooting."
  },
  {
    keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'connect'],
    answer: "You can reach Jayson at **jayson@jaysonsandhu.com**. He is also on LinkedIn at **linkedin.com/in/jaysonsandhu** and GitHub at **github.com/jayson-s**."
  },
  {
    keywords: ['fit', 'team', 'why', 'good fit', 'strength', 'hire him'],
    answer: "Jayson is a strong fit for teams that need someone who can **translate complex technical issues into clear action**. He brings customer-facing communication, SaaS troubleshooting, API debugging, cloud fundamentals, and a track record of partnering with Product and Engineering to resolve escalations."
  },
];

const FALLBACK_ANSWER = "I can answer questions about Jayson's experience, skills, certifications, projects, availability, and contact info. For anything more specific, reach him directly at **jayson@jaysonsandhu.com**.";

export function initAIChat() {
  const messagesEl  = document.getElementById('ai-chat-messages');
  const inputEl     = document.getElementById('ai-chat-input');
  const sendBtn     = document.getElementById('ai-chat-send');
  const quickWrap   = document.getElementById('ai-quick-chips');
  const teaserBtn   = document.getElementById('ai-teaser-btn');
  const chatSection = document.getElementById('ai-section');

  if (!messagesEl || !inputEl || !sendBtn) return;

  addMessage('ai', "Hi! I'm Jayson's portfolio assistant. Ask me about his experience, skills, certifications, projects, availability, or contact info.");

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
    const delay = Math.min(650, 220 + text.length * 8);

    window.setTimeout(() => {
      removeTyping(typingId);
      addMessage('ai', getLocalReply(text));
      sendBtn.disabled = false;
      inputEl.focus();
    }, delay);
  }

  function getLocalReply(text) {
    const question = normalizeText(text);
    let bestMatch = null;
    let bestScore = 0;

    ANSWERS.forEach(item => {
      const score = item.keywords.reduce((total, keyword) => {
        return question.includes(normalizeText(keyword)) ? total + keyword.split(' ').length : total;
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    });

    return bestScore > 0 ? bestMatch.answer : FALLBACK_ANSWER;
  }

  function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9+.\s-]/g, ' ').replace(/\s+/g, ' ').trim();
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
