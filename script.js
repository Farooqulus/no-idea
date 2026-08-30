(() => {
  'use strict';

  /* =========================================================
     ROLE-AWARE LOGIN
     ========================================================= */
  const roleToggle   = document.querySelector('.role-toggle');
  const roleIdeator  = document.getElementById('roleIdeator');
  const roleDeveloper= document.getElementById('roleDeveloper');
  const formHeading  = document.getElementById('formHeading');
  const formSub      = document.getElementById('formSubheading');
  const submitRole   = document.getElementById('submitRole');

  const copy = {
    ideator: {
      heading: 'Welcome back, Ideator',
      sub: 'Sign in to keep shaping your idea into something buildable.',
      label: 'Ideator'
    },
    developer: {
      heading: 'Welcome back, Developer',
      sub: 'Sign in to review matches and pick up your next build.',
      label: 'Developer'
    }
  };

  function setRole(role) {
    roleToggle.dataset.role = role;

    const isIdeator = role === 'ideator';
    roleIdeator.classList.toggle('is-active', isIdeator);
    roleDeveloper.classList.toggle('is-active', !isIdeator);
    roleIdeator.setAttribute('aria-selected', String(isIdeator));
    roleDeveloper.setAttribute('aria-selected', String(!isIdeator));

    // brief crossfade on the copy so the switch reads intentional, not abrupt
    [formHeading, formSub].forEach(el => (el.style.opacity = '0'));
    window.setTimeout(() => {
      formHeading.textContent = copy[role].heading;
      formSub.textContent = copy[role].sub;
      submitRole.textContent = copy[role].label;
      [formHeading, formSub].forEach(el => (el.style.opacity = '1'));
    }, 140);

    clearBanner();
  }

  roleIdeator.addEventListener('click', () => setRole('ideator'));
  roleDeveloper.addEventListener('click', () => setRole('developer'));

  // basic arrow-key tab behaviour for the role switch
  roleToggle.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = roleToggle.dataset.role === 'ideator' ? 'developer' : 'ideator';
    setRole(next);
    (next === 'ideator' ? roleIdeator : roleDeveloper).focus();
  });

  /* =========================================================
     PASSWORD VISIBILITY
     ========================================================= */
  const passwordInput = document.getElementById('password');
  const toggleVisibility = document.getElementById('toggleVisibility');
  const eyeIcon = toggleVisibility.querySelector('.icon-eye');
  const eyeOffIcon = toggleVisibility.querySelector('.icon-eye-off');

  toggleVisibility.addEventListener('click', () => {
    const showing = passwordInput.type === 'text';
    passwordInput.type = showing ? 'password' : 'text';
    toggleVisibility.setAttribute('aria-pressed', String(!showing));
    toggleVisibility.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    eyeIcon.style.display = showing ? '' : 'none';
    eyeOffIcon.style.display = showing ? 'none' : '';
  });

  /* =========================================================
     VALIDATION
     ========================================================= */
  const form = document.getElementById('loginForm');
  const identifierInput = document.getElementById('identifier');
  const identifierField = identifierInput.closest('.field');
  const identifierError = document.getElementById('identifierError');
  const passwordField = passwordInput.closest('.field');
  const passwordError = document.getElementById('passwordError');

  const submitBtn = document.getElementById('submitBtn');
  const banner = document.getElementById('formBanner');
  const bannerText = document.getElementById('formBannerText');

  function setFieldError(field, errorEl, message) {
    if (message) {
      field.classList.add('has-error');
      errorEl.textContent = message;
      field.querySelector('input').classList.add('shake');
      window.setTimeout(() => field.querySelector('input').classList.remove('shake'), 450);
    } else {
      field.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  function validateIdentifier() {
    const val = identifierInput.value.trim();
    if (!val) {
      setFieldError(identifierField, identifierError, 'Enter your email or username.');
      return false;
    }
    // if it looks like an email attempt, hold it to email shape
    if (val.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setFieldError(identifierField, identifierError, 'That email address doesn\u2019t look complete.');
      return false;
    }
    setFieldError(identifierField, identifierError, '');
    return true;
  }

  function validatePassword() {
    const val = passwordInput.value;
    if (!val) {
      setFieldError(passwordField, passwordError, 'Enter your password.');
      return false;
    }
    if (val.length < 6) {
      setFieldError(passwordField, passwordError, 'Password should be at least 6 characters.');
      return false;
    }
    setFieldError(passwordField, passwordError, '');
    return true;
  }

  identifierInput.addEventListener('blur', validateIdentifier);
  passwordInput.addEventListener('blur', validatePassword);
  identifierInput.addEventListener('input', () => {
    if (identifierField.classList.contains('has-error')) validateIdentifier();
  });
  passwordInput.addEventListener('input', () => {
    if (passwordField.classList.contains('has-error')) validatePassword();
  });

  function showBanner(message) {
    bannerText.textContent = message;
    banner.hidden = false;
  }
  function clearBanner() {
    banner.hidden = true;
    bannerText.textContent = '';
  }

  function setLoading(isLoading) {
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.disabled = isLoading;
    identifierInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearBanner();

    const identifierOk = validateIdentifier();
    const passwordOk = validatePassword();
    if (!identifierOk || !passwordOk) {
      (identifierOk ? passwordInput : identifierInput).focus();
      return;
    }

    setLoading(true);

    const payload = {
      role: roleToggle.dataset.role,
      identifier: identifierInput.value.trim(),
      password: passwordInput.value,
      remember: document.getElementById('rememberMe').checked
    };

    // Wire-up point: replace with the real auth endpoint.
    // A minimum visible duration keeps the loading state from flashing.
    const minWait = new Promise((res) => window.setTimeout(res, 700));
    const attempt = fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((res) => {
      if (!res.ok) throw new Error('bad-response');
      return res.json();
    });

    try {
      await Promise.all([attempt, minWait]);
      // success path would redirect to the role-specific dashboard here
    } catch (err) {
      await minWait;
      showBanner('We couldn\u2019t sign you in. Check your details, or try again in a moment.');
    } finally {
      setLoading(false);
    }
  });

  /* =========================================================
     LINKS THAT AREN'T WIRED TO A ROUTE YET
     ========================================================= */
  ['forgotLink', 'registerLink', 'githubBtn', 'linkedinBtn'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A') e.preventDefault();
      // Navigation / OAuth redirects hook in here.
    });
  });

  /* =========================================================
     AMBIENT PARALLAX — subtle, eased shard drift on pointer move
     (kept lightweight: no animation library, just lerped transforms)
     ========================================================= */
  const shardField = document.getElementById('shardField');
  if (shardField && window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetX = nx * 22; // max px drift
      targetY = ny * 22;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(loop);
      }
    });

    function loop() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      shardField.style.transform = `translate(${curX}px, ${curY}px)`;
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        requestAnimationFrame(loop);
      } else {
        ticking = false;
      }
    }
  }
})();
