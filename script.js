/* ════════════════════════════════════════════════════════════════
   CHAIMAA EL MEHDAOUI — CV WEBSITE
   script.js — Interactions, animations, scroll behavior
════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── THEME TOGGLE ────────────────────────────────────────────────
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');

  // Persist theme across page loads
  const savedTheme = localStorage.getItem('cv-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('cv-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark'
      ? 'fa-solid fa-moon'
      : 'fa-solid fa-sun';
  }

  // ─── NAVBAR SCROLL EFFECT ────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightNavOnScroll();
  }, { passive: true });

  // ─── MOBILE HAMBURGER ────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger bars
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

  // ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const top    = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(n => n.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  // ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── INTERSECTION OBSERVER — REVEAL ANIMATION ────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ─── COUNTER ANIMATION ───────────────────────────────────────────
  function animateCounter(el, target, duration = 1600) {
    const start     = performance.now();
    const startVal  = 0;

    function update(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // Trigger counters when stat cards become visible
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numEl  = entry.target.querySelector('.stat-number');
          const target = parseInt(numEl.getAttribute('data-target'), 10);
          animateCounter(numEl, target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
  });

  // ─── SKILL PILL HOVER GLOW ───────────────────────────────────────
  // Add subtle glow color cycling to skill pills
  const pills = document.querySelectorAll('.skill-pill');
  pills.forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 0.03}s`;
  });

  // ─── PROJECT CARD TILT (subtle 3D on hover) ──────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -5;
      const rotY   = ((x - cx) / cx) *  5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── TYPING EFFECT (hero greeting) ───────────────────────────────
  const greetings = [
    'Hello, I\'m',
    'Bonjour, je suis',
    'مرحباً، أنا',
  ];
  let gIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const greetEl = document.querySelector('.hero-greeting');

  function typeGreeting() {
    const current = greetings[gIndex];
    if (isDeleting) {
      greetEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      greetEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      gIndex = (gIndex + 1) % greetings.length;
      delay = 400;
    }

    setTimeout(typeGreeting, delay);
  }

  // Start typing after a short delay
  setTimeout(typeGreeting, 1000);

  // ─── PARTICLE BACKGROUND (subtle floating dots) ───────────────────
  (function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const PARTICLE_COUNT = 28;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'hero-particle';

      const size   = Math.random() * 4 + 1.5;
      const x      = Math.random() * 100;
      const y      = Math.random() * 100;
      const dur    = Math.random() * 12 + 10;
      const delay  = Math.random() * 8;
      const opac   = Math.random() * 0.25 + 0.05;

      dot.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #6a90b4;
        opacity: ${opac};
        pointer-events: none;
        animation: particle-float ${dur}s ${delay}s ease-in-out infinite;
      `;
      hero.appendChild(dot);
    }

    // Inject keyframes if not already added
    if (!document.getElementById('particle-kf')) {
      const style = document.createElement('style');
      style.id    = 'particle-kf';
      style.textContent = `
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          33%       { transform: translateY(-18px) translateX(10px) scale(1.1); }
          66%       { transform: translateY(8px) translateX(-8px) scale(0.9); }
        }
      `;
      document.head.appendChild(style);
    }
  })();

  // ─── SCROLL PROGRESS INDICATOR ───────────────────────────────────
  (function addScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #00385a, #6a90b4, #d2dbeb);
      z-index: 9999;
      transition: width 0.1s linear;
      pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const progress     = (scrollTop / docHeight) * 100;
      bar.style.width    = progress + '%';
    }, { passive: true });
  })();

  // ─── HAMBURGER ANIMATION STYLES ──────────────────────────────────
  (function addHamburgerStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-hamburger.active span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      .nav-hamburger.active span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      .nav-hamburger.active span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    `;
    document.head.appendChild(style);
  })();

  // ─── INIT ─────────────────────────────────────────────────────────
  // Trigger highlight on load
  highlightNavOnScroll();

  console.log('%cChaimaa El Mehdaoui — Portfolio', 'color:#6a90b4;font-size:1.2rem;font-weight:bold;');
  console.log('%cgithub.com/chximaa', 'color:#94a2bf;');

})();
