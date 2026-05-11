/**
 * cursor.js — Custom cursor & navigation behaviour
 */

export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('custom-cursor');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
  });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
}

export function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  const overlay   = document.querySelector('.nav-drawer-overlay');

  if (!nav) return;

  // Shrink nav on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && drawer && overlay) {
    const toggleDrawer = open => {
      hamburger.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      toggleDrawer(!drawer.classList.contains('open'));
    });
    overlay.addEventListener('click', () => toggleDrawer(false));

    // Close on drawer link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleDrawer(false));
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const linkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => linkObserver.observe(s));
}
