/* ============================================================
   JAHID PORTFOLIO — Main JavaScript
   Animations, interactions, dark/light theme, AJAX forms
   ============================================================ */
(function () {
  'use strict';

  // ── Theme ──────────────────────────────────────────────────
  const html        = document.documentElement;
  const themeBtn    = document.getElementById('theme-toggle');
  const THEME_KEY   = 'jahid_theme';

  function getTheme() {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith(THEME_KEY + '='));
    if (cookie) return cookie.split('=')[1].trim();
    return html.classList.contains('dark') ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${THEME_KEY}=${theme};path=/;expires=${expires};SameSite=Lax`;
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ── Scroll progress bar ────────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ── Local clock ────────────────────────────────────────────
  const clockEl = document.querySelector('.jahid-clock');
  if (clockEl) {
    const tz = clockEl.dataset.tz || 'UTC';
    const tick = () => {
      try {
        clockEl.textContent = new Date().toLocaleTimeString('en-US', {
          timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
      } catch {
        clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  // ── Reveal on scroll (IntersectionObserver) ────────────────
  const revealEls = document.querySelectorAll('[data-reveal], .reveal-up');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '-40px 0px' });
    revealEls.forEach(el => {
      el.classList.add('reveal-up');
      observer.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ── Mouse Glow ─────────────────────────────────────────────
  const glow = document.getElementById('mouse-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    let raf = 0, cx = -9999, cy = -9999;
    const flush = () => {
      raf = 0;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
    };
    window.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    }, { passive: true });
  } else if (glow) {
    glow.style.display = 'none';
  }

  // ── Contact form ────────────────────────────────────────────
  function initContactForm(formEl) {
    if (!formEl) return;
    const msgEl  = formEl.querySelector('[id$="-form-msg"]') || formEl.parentElement.querySelector('[id$="-form-msg"]');
    const btnEl  = formEl.querySelector('.jahid-form-submit');
    const txtEl  = btnEl?.querySelector('.jahid-submit-text');

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btnEl) { btnEl.disabled = true; btnEl.style.opacity = '0.7'; }
      if (txtEl) txtEl.textContent = 'Sending...';

      const data = new FormData(formEl);
      data.append('action', 'jahid_contact');
      data.append('nonce', jahidData.nonce);

      fetch(jahidData.ajaxUrl, { method: 'POST', body: data })
        .then(r => r.json())
        .then(res => {
          if (msgEl) { msgEl.textContent = res.data?.message || (res.success ? 'Message sent!' : 'Error. Please try again.'); msgEl.className = 'jahid-form-msg ' + (res.success ? 'success' : 'error'); }
          if (res.success) formEl.reset();
        })
        .catch(() => { if (msgEl) { msgEl.textContent = 'Network error. Please try again.'; msgEl.className = 'jahid-form-msg error'; } })
        .finally(() => {
          if (btnEl) { btnEl.disabled = false; btnEl.style.opacity = '1'; }
          if (txtEl) txtEl.textContent = 'Send Message';
        });
    });
  }

  document.querySelectorAll('.jahid-contact-form').forEach(initContactForm);

  // ── Newsletter form ─────────────────────────────────────────
  document.querySelectorAll('.jahid-newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailEl = form.querySelector('[type="email"]');
      const msgEl   = form.querySelector('.jahid-newsletter-msg');
      const data    = new FormData();
      data.append('action', 'jahid_subscribe');
      data.append('nonce', jahidData.nonce);
      data.append('email', emailEl?.value || '');

      fetch(jahidData.ajaxUrl, { method: 'POST', body: data })
        .then(r => r.json())
        .then(res => { if (msgEl) { msgEl.textContent = res.data?.message || (res.success ? 'Subscribed!' : 'Error.'); } if (res.success) form.reset(); })
        .catch(() => { if (msgEl) msgEl.textContent = 'Network error.'; });
    });
  });

  // ── Copy link button ───────────────────────────────────────
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = copyBtn.dataset.url;
      if (url && navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          copyBtn.title = 'Copied!';
          setTimeout(() => (copyBtn.title = ''), 2000);
        });
      }
    });
  }

  // ── Nav active indicator 3D tilt ─────────────────────────
  const navPill = document.getElementById('jahid-nav-pill');
  if (navPill) {
    navPill.addEventListener('mousemove', e => {
      const r  = navPill.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * -8;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      navPill.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    navPill.addEventListener('mouseleave', () => { navPill.style.transform = ''; });
  }

})();
