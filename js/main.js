/**
 * main.js — Portfolio entry point
 * Imports and initialises all modules
 */

import { initCursor, initNav }              from './cursor.js';
import { initReveal, initHeroEntrance,
         initCounters, initMagneticButtons } from './animations.js';
import { initAccordion }                    from './accordion.js';
import { initAIChat }                       from './ai-chat.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initReveal();
  initHeroEntrance();
  initCounters();
  initMagneticButtons();
  initAccordion();
  initAIChat();
});
