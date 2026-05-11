/**
 * ai-chat.js — AI-powered portfolio assistant
 * Calls /api/chat (Vercel serverless proxy) — API key and system prompt are server-side only.
 */

// System prompt lives server-side in /api/chat.js — not exposed to the browser.

const QUICK_PROMPTS = [
  "What's Jayson's current role?",
  "Tell me about his certifications",
  "What projects has he built?",
  "Is he open to new roles?",
  "What technologies does he know?",
];

export function initAIChat() {
  const messagesEl  = document.getElementById('ai-chat-messages');
  const inputEl     = document.getElementById('ai-chat-input');
  const sendBtn     = document.getElementById('ai-chat-send');
  const quickWrap   = document.getElementById('ai-quick-chips');
  const teaserBtn   = document.getElementById('ai-teaser-btn');
  const chatSection = document.getElementById('ai-section');

  if (!messagesEl || !inputEl || !sendBtn) return;

  // Message history for context
  let history = [];

  // Add initial greeting
  addMessage('ai', "Hi! I'm Jayson's AI assistant. Ask me anything about his experience, skills, or projects — I'm happy to help you get to know him better. ✨");

  // Quick prompt chips
  if (quickWrap) {
    QUICK_PROMPTS.forEach(prompt => {
      const chip = document.createElement('button');
      chip.className = 'ai-quick-chip';
      chip.textContent = prompt;
      chip.addEventListener('click', () => sendMessage(prompt));
      quickWrap.appendChild(chip);
    });
  }

  // Teaser button scrolls to AI section
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

  // Send handlers
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

  async function sendMessage(text) {
    if (!text.trim()) return;

    addMessage('user', text);
    inputEl.value = '';
    sendBtn.disabled = true;

    const typingId = showTyping();

    history.push({ role: 'user', content: text });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const raw = await response.text();
      let data = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseErr) {
        console.error('AI Chat API returned non-JSON response:', {
          status: response.status,
          body: raw.slice(0, 300),
          parseErr,
        });
      }

      if (!response.ok) {
        console.error('AI Chat API error:', {
          status: response.status,
          error: data.error || raw.slice(0, 300) || 'Unknown error',
        });
      }

      const reply = response.ok && data.content?.[0]?.text
        ? data.content[0].text
        : "I'm having trouble connecting right now. Please try again or contact Jayson directly at jayson@jaysonsandhu.com.";

      removeTyping(typingId);
      addMessage('ai', reply);
      history.push({ role: 'assistant', content: reply });

      // Keep history manageable (last 10 exchanges)
      if (history.length > 20) history = history.slice(-20);

    } catch (err) {
      removeTyping(typingId);
      addMessage('ai', "I'm having trouble connecting right now. Feel free to reach out to Jayson directly at jayson@jaysonsandhu.com.");
      console.error('AI Chat error:', err);
    }

    sendBtn.disabled = false;
    inputEl.focus();
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
