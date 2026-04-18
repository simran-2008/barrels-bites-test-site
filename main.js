/* ══════════════════════════════════════
   BARRELS & BITES — main.js
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV: shrink on scroll ── */
  const nav = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });


  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  document.getElementById('mobileCtaBtn').addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    closeMobile();
  });

  document.getElementById('navCtaBtn').addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });


  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ── REVIEWS SLIDER ── */
  const track   = document.getElementById('reviewTrack');
  const cards   = track.querySelectorAll('.review-card');
  const dotsEl  = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let current  = 0;
  let autoSlide;

  function getPerView() {
    return window.innerWidth < 900 ? 1 : 3;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const total = Math.ceil(cards.length / getPerView());
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(idx) {
    const total = Math.ceil(cards.length / getPerView());
    current = Math.max(0, Math.min(idx, total - 1));

    const cardWidth    = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    const scrollAmount = current * getPerView() * cardWidth;
    track.style.transform = `translateX(-${scrollAmount}px)`;

    dotsEl.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    stopAuto();
    autoSlide = setInterval(() => {
      const total = Math.ceil(cards.length / getPerView());
      goTo(current < total - 1 ? current + 1 : 0);
    }, 4000);
  }

  function stopAuto() {
    clearInterval(autoSlide);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  });

  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
  startAuto();


  /* ── MENU CHIPS ── */
  document.querySelectorAll('.menu-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.menu-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });


  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections   = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color   = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
          a.style.opacity = a.getAttribute('href') === `#${id}` ? '1' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ── SMOOTH SCROLL for all in-page links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
