/**
 * animations.js — Scroll-triggered reveals & entrance animations
 */

export function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal for performance
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

export function initHeroEntrance() {
  // Stagger hero elements on load
  const elements = document.querySelectorAll('.hero-entrance');
  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    // Trigger after small delay to ensure CSS is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('visible');
      });
    });
  });
}

export function initCounters() {
  // Animated stat counters
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1400;
      const start  = performance.now();

      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        // Ease out expo
        const ease = 1 - Math.pow(2, -10 * p);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

export function initMagneticButtons() {
  // Subtle magnetic pull on CTA buttons
  document.querySelectorAll('.btn-navy, .btn-ai').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
