/**
 * nemotea.dev v2 — Shared JavaScript System
 */

// ══════════════════════════════════════════
//  MOBILE NAVIGATION (トップページと統一)
// ══════════════════════════════════════════
class MobileNav {
  constructor() {
    this.toggle = document.getElementById('navToggle');
    this.items = document.getElementById('navLinks');
    if (!this.toggle || !this.items) return;
    this.isOpen = false;
    this.setup();
  }

  setup() {
    this.toggle.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      this.isOpen ? this.close() : this.open();
    });

    document.addEventListener('click', e => {
      if (this.isOpen && !e.target.closest('nav')) this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720 && this.isOpen) this.close();
    });
  }

  open() {
    this.isOpen = true;
    this.items.classList.add('open');
    this.toggle.textContent = '\u2715';
    this.toggle.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.isOpen = false;
    this.items.classList.remove('open');
    this.toggle.textContent = '///';
    this.toggle.setAttribute('aria-expanded', 'false');
  }
}

// ══════════════════════════════════════════
//  SCROLL ANIMATIONS
// ══════════════════════════════════════════
class ScrollAnimations {
  constructor() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '40px 0px -40px 0px' });

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      this.observer.observe(el);
    });
  }
}

// ══════════════════════════════════════════
//  AMBIENT BACKGROUND
// ══════════════════════════════════════════
class AmbientBackground {
  constructor() {
    if (!document.querySelector('.bg-ambient')) {
      const ambient = document.createElement('div');
      ambient.className = 'bg-ambient';
      document.body.prepend(ambient);
    }
    if (!document.querySelector('.bg-grid')) {
      const grid = document.createElement('div');
      grid.className = 'bg-grid';
      document.body.prepend(grid);
    }
  }
}

// ══════════════════════════════════════════
//  PERFORMANCE
// ══════════════════════════════════════════
class Performance {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-speed', '0ms');
    }
  }
}

// ══════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════
const Utils = {
  debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  },
  throttle(fn, limit) {
    let throttled = false;
    return (...args) => {
      if (!throttled) {
        fn(...args);
        throttled = true;
        setTimeout(() => throttled = false, limit);
      }
    };
  }
};

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
  new ScrollAnimations();
  new AmbientBackground();
  new Performance();

  // Page fade-in
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
  // Fallback
  setTimeout(() => { document.body.style.opacity = '1'; }, 500);

  document.dispatchEvent(new CustomEvent('app:loaded'));
});
