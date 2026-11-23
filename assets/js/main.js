/* ==========================================================
   Petracq website scripts
   ========================================================== */

/*
 * Where inquiries are delivered.
 * Uses FormSubmit (https://formsubmit.co): free, no backend needed.
 * After you activate the form, FormSubmit gives you a random alias.
 * Replace the email below with that alias to hide your address from the page source.
 */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/muzammilsk90@gmail.com';

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileCta = document.getElementById('mobile-cta');

  /* ---------- Light / dark theme ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const readSaved = () => { try { return localStorage.getItem('petracq-theme'); } catch (e) { return null; } };

  const applyTheme = (theme, animate) => {
    if (animate) {
      root.classList.add('theme-anim');
      setTimeout(() => root.classList.remove('theme-anim'), 350);
    }
    root.setAttribute('data-theme', theme);
    const next = theme === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-checked', String(theme === 'dark'));
    themeBtn.setAttribute('title', `Switch to ${next} mode`);
  };
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  themeBtn.addEventListener('click', () => {
    const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('petracq-theme', theme); } catch (e) { /* private mode: still switches */ }
    applyTheme(theme, true);
  });
  // Follow the system setting until the visitor picks a theme themselves.
  systemDark.addEventListener('change', (e) => {
    if (!readSaved()) applyTheme(e.matches ? 'dark' : 'light', true);
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const setNav = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* ---------- In-page links: scroll below the sticky header ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const scrollToTarget = (target) => {
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      const menuWasOpen = nav.classList.contains('open');
      setNav(false); // closes the mobile menu and unlocks page scrolling
      scrollToTarget(target);
      if (history.pushState) history.pushState(null, '', hash);
      // On desktop, put the cursor in the first field of the form
      if (hash === '#inquiry' && finePointer && !menuWasOpen) {
        setTimeout(() => {
          const first = document.getElementById('f-name');
          if (first && !form.hidden) first.focus({ preventScroll: true });
        }, reduceMotion ? 0 : 600);
      }
    });
  });

  /* ---------- Header shadow + mobile CTA ---------- */
  const hero = document.querySelector('.hero');
  const contact = document.getElementById('contact');
  let contactVisible = false;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    const pastHero = hero ? window.scrollY > hero.offsetHeight - 80 : true;
    mobileCta.classList.toggle('show', pastHero && !contactVisible);
  };

  if ('IntersectionObserver' in window && contact) {
    new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      onScroll();
    }, { threshold: 0.05 }).observe(contact);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll('.nav-list a')];
  if ('IntersectionObserver' in window) {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((l) => {
      const s = document.querySelector(l.getAttribute('href'));
      if (s) sectionObs.observe(s);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => revealObs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Inquiry form ---------- */
  const form = document.getElementById('inquiry-form');
  const statusEl = document.getElementById('form-status');
  const successEl = document.getElementById('form-success');
  const interestSel = document.getElementById('f-interest');

  // CTA buttons pre-select the "interested in" option
  document.querySelectorAll('[data-interest]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-interest');
      if ([...interestSel.options].some((o) => o.value === v)) interestSel.value = v;
    });
  });

  const rules = {
    name: (v) => (v.length < 2 ? 'Please enter your name.' : ''),
    company: (v) => (v.length < 2 ? 'Please enter your company or plant name.' : ''),
    phone: (v) => {
      const digits = v.replace(/\D/g, '');
      if (!v) return 'Please enter your phone number.';
      if (!/^[+\d\s()-]+$/.test(v) || digits.length < 10 || digits.length > 15) return 'Please enter a valid phone number.';
      return '';
    },
    email: (v) => {
      if (!v) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email address.';
    },
  };

  const validateField = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const msg = rule(input.value.trim());
    const errEl = document.getElementById('e-' + input.name);
    if (errEl) errEl.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };

  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => { if (input.value.trim()) validateField(input); });
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  const setLoading = (on) => {
    form.classList.toggle('is-loading', on);
    const btn = document.getElementById('submit-btn');
    btn.disabled = on;
    btn.querySelector('.btn-label').textContent = on ? 'Sending...' : 'Send inquiry';
  };

  const showError = (msg) => {
    statusEl.className = 'form-status error';
    statusEl.textContent = msg;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    // Validate
    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      if (!validateField(input) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Spam trap
    if (form.elements._honey.value) return;

    if (location.protocol === 'file:') {
      showError('The form can only send when the site is opened from a web server (not as a local file). See README.md.');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach((k) => { if (typeof data[k] === 'string') data[k] = data[k].trim(); });
    data._subject = `New Petracq inquiry: ${data.company} (${data.name})`;
    data._replyto = data.email;
    data.page = location.href;

    setLoading(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const json = await res.json().catch(() => ({}));
      const ok = res.ok && (json.success === true || json.success === 'true');

      if (ok) {
        form.reset();
        form.hidden = true;
        successEl.hidden = false;
        successEl.focus();
      } else if (json.message && /activat/i.test(json.message)) {
        showError('This form is waiting for activation. Site owner: check your inbox for the FormSubmit activation email.');
      } else {
        showError("Sorry, your inquiry couldn't be sent. Please try again in a moment.");
      }
    } catch (err) {
      showError("Sorry, your inquiry couldn't be sent. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  });

  document.getElementById('send-another').addEventListener('click', () => {
    successEl.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
});
