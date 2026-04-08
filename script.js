/* ============================================================
   IIMBx Wireframe — script.js
   Handles: Navbar, Scroll Reveal, Stats Counter,
            Carousel, Filter, Particles, Modals
   ============================================================ */

(function () {
  'use strict';

  // ── NAVBAR SCROLL EFFECT ─────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ── HAMBURGER MENU ───────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('open');
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });

  // ── ACTIVE NAV LINK (scroll-based) ──────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  // ── SEARCH OVERLAY ───────────────────────────────────────────
  const searchBtn = document.getElementById('searchBtn');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');

  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput.focus(), 100);
  });

  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('open');
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') searchOverlay.classList.remove('open');
  });

  // ── HERO PARTICLES ───────────────────────────────────────────
  const particlesContainer = document.getElementById('particles');

  function createParticles() {
    if (!particlesContainer) return;
    const count = 18;
    const colors = ['#2563EB', '#60a5fa', '#F59E0B', '#93c5fd'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --dur: ${3 + Math.random() * 4}s;
        --delay: ${Math.random() * -6}s;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: ${0.2 + Math.random() * 0.4};
      `;
      particlesContainer.appendChild(p);
    }
  }

  createParticles();

  // ── SCROLL REVEAL ────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── STATS COUNTER ────────────────────────────────────────────
  const statsSection = document.getElementById('stats');
  let statsCounted = false;

  function animateCounter(el, target, suffix) {
    const duration = 2000;
    const start = performance.now();
    const isLarge = target >= 1000000;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (isLarge) {
        el.textContent = (current >= 1000000)
          ? (current / 1000000).toFixed(1).replace('.0', '') + 'M'
          : Math.floor(current / 1000) + 'K';
      } else {
        el.textContent = current;
      }

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isLarge ? '1M' : target;
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      document.querySelectorAll('.stat-item').forEach(item => {
        const count = parseInt(item.dataset.count);
        const suffix = item.dataset.suffix || '';
        const counterEl = item.querySelector('.counter');
        if (counterEl && count) animateCounter(counterEl, count, suffix);
      });
    }
  }, { threshold: 0.5 });

  if (statsSection) statsObserver.observe(statsSection);

  // ── TESTIMONIALS CAROUSEL ────────────────────────────────────
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  let autoSlideInterval;

  function goToSlide(index) {
    const cards = track.querySelectorAll('.testimonial-card');
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(parseInt(dot.dataset.index));
      startAutoSlide();
    });
  });

  startAutoSlide();

  // ── PROGRAMME FILTER ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const progCards = document.querySelectorAll('.prog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      progCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── VIDEO MODAL ──────────────────────────────────────────────
  const videoModal = document.getElementById('videoModal');
  const watchVideoBtn = document.getElementById('watchVideoBtn');
  const modalClose = document.getElementById('modalClose');
  const videoPlayBtn = document.querySelector('.video-play-btn');
  const videoOverlay = document.querySelector('.video-overlay');

  function openModal() {
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (watchVideoBtn) watchVideoBtn.addEventListener('click', openModal);
  if (videoPlayBtn) videoPlayBtn.addEventListener('click', openModal);
  if (videoOverlay) videoOverlay.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── HERO CARD MICRO-INTERACTIONS ─────────────────────────────
  document.querySelectorAll('.floating-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.animationPlayState = 'paused';
    });
    card.addEventListener('mouseleave', () => {
      card.style.animationPlayState = 'running';
    });
  });

  // ── PROG CARD TILT ───────────────────────────────────────────
  document.querySelectorAll('.prog-card, .impact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── ANNOUNCEMENT BANNER ──────────────────────────────────────
  const announcementBar = document.getElementById('announcementBar');
  const announcementClose = document.getElementById('announcementClose');

  if (announcementClose && announcementBar) {
    announcementClose.addEventListener('click', () => {
      announcementBar.classList.add('hidden');
      // When banner is hidden, bring navbar to top
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.style.top = '0';
      }
    });
  }

  console.log('%c IIMBx Revamp Wireframe v1.0 ✓', 'color: #2563EB; font-size: 14px; font-weight: bold;');
})();
