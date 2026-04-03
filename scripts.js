/* ============================================================
   GAYATRI MINERALS — GLOBAL SCRIPTS
   ============================================================ */

/* ── Scroll shadow on nav ── */
window.addEventListener('scroll', function () {
  var nav = document.getElementById('gm-nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── Active nav link highlight ── */
function highlightActiveLink() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links [data-page], .dropdown-panel a, .bn-item[data-page]').forEach(function (el) {
    var href = el.getAttribute('data-page') || el.getAttribute('href') || '';
    if (href === path) el.classList.add('active');
  });
}

/* ── Fade-in on scroll ── */
function initFadeIn() {
  var els = document.querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        setTimeout(function () { e.target.classList.add('visible'); }, i * 90);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) { obs.observe(el); });
}

/* ── Image error fallback ── */
function initImgFallbacks() {
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.display = 'none';
    });
  });
}

/* ── Hamburger (mobile top-nav toggle) ── */
function initHamburger() {
  var btn  = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  menu.setAttribute('aria-hidden', 'true');

  function openMenu() {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', 'true');
    /* Also collapse sub-menu when closing main menu */
    var subMenu   = menu.querySelector('.mobile-sub');
    var subToggle = menu.querySelector('.mobile-sub-toggle');
    if (subMenu) subMenu.classList.remove('open');
    if (subToggle) {
      subToggle.setAttribute('aria-expanded', 'false');
      var arrow = subToggle.querySelector('.mobile-sub-arrow');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Close on outside click — capture phase prevents racing with inner handlers */
  document.addEventListener('click', function (e) {
    var nav = document.querySelector('.gm-nav');
    if (nav && !nav.contains(e.target) && menu.classList.contains('open')) {
      closeMenu();
    }
  }, true);

  /* ── Event delegation on the menu element ──
     Single listener handles sub-toggle AND link clicks,
     preventing race conditions from multiple bound handlers. */
  menu.addEventListener('click', function (e) {

    /* Products sub-toggle tapped? */
    var toggle = e.target.closest('.mobile-sub-toggle');
    if (toggle) {
      e.stopPropagation();
      var subMenu = menu.querySelector('.mobile-sub');
      if (!subMenu) return;
      var isOpen = subMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      var arrow = toggle.querySelector('.mobile-sub-arrow');
      if (arrow) arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      return;
    }

    /* Real nav link tapped — close the whole menu */
    if (e.target.closest('a')) {
      closeMenu();
    }
  });
}

/* ── Desktop dropdown — also works on click/touch ── */
function initDesktopDropdown() {
  var dropdown = document.querySelector('.nav-dropdown');
  var trigger  = dropdown && dropdown.querySelector('.dropdown-trigger');
  var panel    = dropdown && dropdown.querySelector('.dropdown-panel');
  if (!dropdown || !trigger || !panel) return;

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = panel.style.display === 'block';
    panel.style.display = isOpen ? '' : 'block';
    trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });

  document.addEventListener('click', function () {
    panel.style.display = '';
    trigger.setAttribute('aria-expanded', 'false');
  });

  panel.addEventListener('click', function (e) { e.stopPropagation(); });
}

/* ── Products sheet (mobile bottom nav) ── */
function initProductsSheet() {
  var btn      = document.getElementById('bnProductsBtn');
  var sheet    = document.getElementById('bnSheet');
  var backdrop = document.getElementById('bnBackdrop');
  if (!btn || !sheet || !backdrop) return;

  var scrollY = 0;

  function openSheet() {
    scrollY = window.scrollY;
    sheet.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width    = '100%';
    document.body.style.top      = '-' + scrollY + 'px';
  }
  function closeSheet() {
    sheet.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width    = '';
    document.body.style.top      = '';
    window.scrollTo(0, scrollY);
  }

  btn.addEventListener('click', openSheet);
  backdrop.addEventListener('click', closeSheet);

  var startY = 0;
  sheet.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchend', function (e) {
    if (e.changedTouches[0].clientY - startY > 60) closeSheet();
  }, { passive: true });
}

/* ── Load shared HTML component ── */
function loadComponent(id, file) {
  fetch(file)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' loading ' + file);
      return r.text();
    })
    .then(function (html) {
      document.getElementById(id).innerHTML = html;
      if (id === 'header-placeholder') {
        highlightActiveLink();
        initFadeIn();
        initProductsSheet();
        initHamburger();
        initDesktopDropdown();
      }
    })
    .catch(function (e) {
      console.error('[GM] FAILED to load', file, '—', e.message);
      if (id === 'header-placeholder') {
        document.getElementById(id).innerHTML =
          '<nav style="position:fixed;top:0;width:100%;background:#0f1e3c;z-index:1000;' +
          'padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between;' +
          'border-bottom:1px solid rgba(255,255,255,0.08)">' +
          '<a href="index.html" style="color:#fff;font-weight:600;font-family:DM Sans,sans-serif;' +
          'text-decoration:none;font-size:0.9rem">Gayatri Minerals</a>' +
          '<div style="display:flex;gap:20px;align-items:center">' +
          '<a href="about.html" style="color:#8ba3c0;font-size:0.75rem;font-family:DM Sans,sans-serif;text-decoration:none">About</a>' +
          '<a href="contact.html" style="color:#fff;background:#e07b2a;padding:8px 18px;border-radius:7px;' +
          'font-size:0.75rem;font-weight:700;font-family:DM Sans,sans-serif;text-decoration:none">Contact</a>' +
          '</div></nav>';
      }
    });
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', function () {
  loadComponent('header-placeholder', 'header.html');
  loadComponent('footer-placeholder', 'footer.html');
  initFadeIn();
  initImgFallbacks();
});

/* ── Rubber Profiles Slider ── */
(function () {
  var rpIndex = 0;
  var TOTAL = 0;

  function rpGetVisible() {
    return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function rpUpdate() {
    var track = document.getElementById('rpTrack');
    if (!track) return;
    var vis = rpGetVisible();
    var maxIndex = Math.max(0, TOTAL - vis);
    if (rpIndex > maxIndex) rpIndex = maxIndex;
    if (rpIndex < 0) rpIndex = 0;
    var pct = (100 / vis) * rpIndex;
    track.style.transform = 'translateX(-' + pct + '%)';
    document.querySelectorAll('.rp-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === rpIndex);
    });
  }

  window.rpSlide = function (dir) {
    var vis = rpGetVisible();
    var maxIndex = Math.max(0, TOTAL - vis);
    rpIndex = Math.max(0, Math.min(rpIndex + dir, maxIndex));
    rpUpdate();
  };

  function rpBuildDots() {
    var container = document.getElementById('rpDots');
    if (!container) return;
    var vis = rpGetVisible();
    var count = Math.max(1, TOTAL - vis + 1);
    container.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var d = document.createElement('button');
      d.className = 'rp-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      (function (idx) {
        d.addEventListener('click', function () { rpIndex = idx; rpUpdate(); });
      })(i);
      container.appendChild(d);
    }
  }

  function rpBindArrows() {
    var prev = document.getElementById('rpPrev');
    var next = document.getElementById('rpNext');
    if (prev) prev.addEventListener('click', function () { window.rpSlide(-1); });
    if (next) next.addEventListener('click', function () { window.rpSlide(1); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var slides = document.querySelectorAll('.rp-slide');
    TOTAL = slides.length;
    if (!TOTAL) return;
    rpBindArrows();
    rpBuildDots();
    rpUpdate();
  });

  window.addEventListener('resize', function () {
    if (!TOTAL) return;
    rpBuildDots();
    rpUpdate();
  });
})();