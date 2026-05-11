/**
 * accordion.js — Experience & FAQ accordions
 */

export function initAccordion() {
  const rows = document.querySelectorAll('[data-exp]');

  rows.forEach((row, index) => {
    const header = row.querySelector('.exp-header');
    const detail = row.querySelector('.exp-detail');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');

      // Close all
      rows.forEach(r => {
        r.classList.remove('open');
        const h = r.querySelector('.exp-header');
        const t = r.querySelector('.exp-toggle');
        if (h) h.setAttribute('aria-expanded', 'false');
        if (t) t.textContent = '+';
      });

      // Open clicked if it wasn't already open
      if (!isOpen) {
        row.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        const toggle = row.querySelector('.exp-toggle');
        if (toggle) toggle.textContent = '+';

        // Smooth scroll to ensure visible
        setTimeout(() => {
          const detail = row.querySelector('.exp-detail-inner');
          if (detail) {
            row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 50);
      }
    });

    // Keyboard accessibility
    if (detail) {
      const detailId = detail.id || `experience-detail-${index + 1}`;
      detail.id = detailId;
      header.setAttribute('aria-controls', detailId);
    }
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}
