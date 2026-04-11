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

/* ── Image load handler — skeleton → fade in ── */
function initImgFallbacks() {
  function handleImg(img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      img.classList.add('img-loaded');
      return;
    }
    img.addEventListener('load', function () {
      this.classList.add('loaded');
      this.classList.add('img-loaded');
    });
    img.addEventListener('error', function () {
      this.classList.add('error');
      this.style.display = 'none';
    });
  }
  document.querySelectorAll('img').forEach(handleImg);

  /* Watch for dynamically added images (slider clones etc.) */
  if (window.MutationObserver) {
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'IMG') handleImg(node);
          node.querySelectorAll && node.querySelectorAll('img').forEach(handleImg);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
}

/* ── Preload critical images ── */
function preloadCriticalImages() {
  var critical = [
    'images/chalkpowder1.webp',
    'images/chalkpowder2.webp',
    'images/chalkpowder3.webp',
    'images/GypsumPowder1.webp',
    'images/GypsumPowder4.webp'
  ];
  critical.forEach(function (src) {
    var link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
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

/* ── Home hero slider ── */
function initHeroSlider() {
  var heroSlides = document.querySelectorAll('.hero-slider .hero-slide');
  var heroDots   = document.querySelectorAll('.hero-dot');
  if (!heroSlides.length) return;
  var heroIndex = 0;
  var timer;

  function goTo(idx) {
    heroSlides[heroIndex].classList.remove('active');
    if (heroDots[heroIndex]) heroDots[heroIndex].classList.remove('active');
    heroIndex = ((idx % heroSlides.length) + heroSlides.length) % heroSlides.length;
    heroSlides[heroIndex].classList.add('active');
    if (heroDots[heroIndex]) heroDots[heroIndex].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(heroIndex + 1); }, 3200);
  }

  /* Arrows */
  var prev = document.getElementById('heroSliderPrev');
  var next = document.getElementById('heroSliderNext');
  if (prev) prev.addEventListener('click', function () { goTo(heroIndex - 1); startAuto(); });
  if (next) next.addEventListener('click', function () { goTo(heroIndex + 1); startAuto(); });

  /* Dots */
  heroDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); startAuto(); });
  });

  startAuto();
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', function () {
  preloadCriticalImages();
  loadComponent('header-placeholder', 'header.html');
  loadComponent('footer-placeholder', 'footer.html');
  initFadeIn();
  initImgFallbacks();
  initHeroSlider();
});

/* ── Gallery Slider — Infinite Carousel with Premium Autoplay ──
   Features:
   • Smooth infinite loop with clone-based wrapping
   • Autoplay every 3.8s with animated progress bar
   • Pauses on: hover, touch, drag, tab hidden, lightbox open
   • Delayed smooth resume after any user interaction
   • Page Visibility API — stops burning CPU when tab is hidden
   • prefers-reduced-motion respected — no animation if user set it
   • Self-healing: stuck isAnimating auto-clears on each autoplay tick
   • Debounced resize rebuild
 ── */
(function () {
  'use strict';

  /* ─── CONFIG ────────────────────────────────────────────── */
  var AUTOPLAY_MS    = 3800;   /* ms between auto-advances          */
  var RESUME_DELAY   = 2200;   /* ms to wait after user interaction  */
  var SNAP_EASE      = 'transform 0.46s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  var DRAG_EASE      = 'none';

  /* Respect OS-level "Reduce Motion" preference */
  var reducedMotion  = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ─── STATE ──────────────────────────────────────────────── */
  var REAL_TOTAL     = 0;
  var clonesBefore   = 0;
  var rawPos         = 0;
  var isAnimating    = false;

  /* Autoplay state machine:
     'running'  — interval is live, progress bar animating
     'paused'   — stopped, e.g. hover/touch; will resume on unpause
     'stopped'  — fully off (tab hidden, lightbox open)
  */
  var autoState      = 'stopped';
  var autoTimer      = null;   /* setInterval handle                 */
  var resumeTimer    = null;   /* setTimeout handle for delayed resume */
  var progressBar    = null;   /* DOM element — the filling line      */
  var progressAnim   = null;   /* requestAnimationFrame handle        */
  var progressStart  = 0;      /* timestamp when current progress began */

  var lbImages       = [];
  var lbIndex        = 0;

  /* ─── HELPERS ────────────────────────────────────────────── */
  function visCount() {
    return window.innerWidth < 768 ? 1
         : window.innerWidth < 1024 ? 2 : 3;
  }

  function logicalFromRaw(r) {
    return ((r - clonesBefore) % REAL_TOTAL + REAL_TOTAL) % REAL_TOTAL;
  }

  function track()  { return document.getElementById('cgTrack'); }
  function dotsEl() { return document.getElementById('cgDots'); }

  /* ─── PROGRESS BAR ───────────────────────────────────────── */
  /*
    The bar lives in .cg-progress-bar injected just above the dots.
    It fills from 0 → 100% over AUTOPLAY_MS ms using rAF for
    buttery smoothness, then resets instantly on each new slide.
  */
  function buildProgressBar() {
    if (progressBar) return;
    var wrap = document.querySelector('.cg-slider-wrap');
    if (!wrap) return;

    var container = document.createElement('div');
    container.className = 'cg-progress-track';

    progressBar = document.createElement('div');
    progressBar.className = 'cg-progress-bar';
    container.appendChild(progressBar);

    /* Insert between the slider-wrap and the dots */
    var dots = dotsEl();
    if (dots && dots.parentNode) {
      dots.parentNode.insertBefore(container, dots);
    } else {
      wrap.parentNode && wrap.parentNode.insertBefore(container, wrap.nextSibling);
    }
  }

  function startProgress() {
    stopProgress();
    if (!progressBar || reducedMotion) return;
    progressStart = performance.now();

    function tick(now) {
      var elapsed  = now - progressStart;
      var fraction = Math.min(elapsed / AUTOPLAY_MS, 1);
      progressBar.style.width = (fraction * 100) + '%';
      if (fraction < 1) {
        progressAnim = requestAnimationFrame(tick);
      }
    }
    progressAnim = requestAnimationFrame(tick);
  }

  function stopProgress() {
    if (progressAnim) { cancelAnimationFrame(progressAnim); progressAnim = null; }
    if (progressBar)  { progressBar.style.width = '0%'; }
  }

  /* ─── AUTOPLAY STATE MACHINE ─────────────────────────────── */
  /*
    runAutoplay()   — start the interval + progress, set state = 'running'
    stopAutoplay()  — kill interval + progress, cancel resume timer
    pauseAutoplay() — stop but queue a resume after RESUME_DELAY
    resumeAutoplay()— cancel any pending resume, then start fresh
    States ensure hover-pause → swipe → leave doesn't double-start.
  */

  function runAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      /* Self-healing: force-clear stuck isAnimating on each tick */
      isAnimating = false;
      slideTo(1);
    }, AUTOPLAY_MS);
    startProgress();
    autoState = 'running';
  }

  function stopAutoplay() {
    clearInterval(autoTimer);  autoTimer = null;
    clearTimeout(resumeTimer); resumeTimer = null;
    stopProgress();
    autoState = 'stopped';
  }

  /* Called on hover-enter, touchstart, mousedown */
  function pauseAutoplay() {
    if (autoState === 'stopped') return;
    clearInterval(autoTimer);  autoTimer = null;
    clearTimeout(resumeTimer); resumeTimer = null;
    stopProgress();
    autoState = 'paused';
  }

  /* Called on hover-leave, touchend, mouseup — waits RESUME_DELAY then restarts */
  function scheduleResume() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () {
      if (autoState === 'paused') runAutoplay();
    }, RESUME_DELAY);
  }

  /* Hard restart — used after a manual slideTo() completes */
  function resumeAutoplay() {
    clearTimeout(resumeTimer);
    if (autoState !== 'stopped') runAutoplay();
  }

  /* ─── POSITION / SLIDE ───────────────────────────────────── */
  function setPos(pos, animate) {
    var t = track(); if (!t) return;
    var vis = visCount();
    if (reducedMotion) animate = false;
    t.style.transition = animate ? SNAP_EASE : DRAG_EASE;
    t.style.transform  = 'translateX(-' + (100 / vis) * pos + '%)';
    updateSlideStates();
  }

  function updateSlideStates() {
    var t = track(); if (!t || !REAL_TOTAL) return;
    var vis     = visCount();
    var nearest = Math.round(rawPos);
    var slides  = t.querySelectorAll('.cg-slide');
    slides.forEach(function (slide, i) {
      slide.classList.remove('is-active', 'is-side');
      if (i === nearest) {
        slide.classList.add('is-active');
      } else if (Math.abs(i - nearest) <= vis) {
        slide.classList.add('is-side');
      }
    });
  }

  function snapIfNeeded() {
    if (rawPos >= clonesBefore + REAL_TOTAL) {
      rawPos -= REAL_TOTAL;
      setPos(rawPos, false);
    } else if (rawPos < clonesBefore) {
      rawPos += REAL_TOTAL;
      setPos(rawPos, false);
    }
  }

  function slideTo(delta) {
    if (isAnimating || !delta) return;
    /* Pause but keep state = paused so resume works */
    clearInterval(autoTimer); autoTimer = null;
    stopProgress();

    var t = track(); if (!t) return;
    var vis    = visCount();
    var newRaw = rawPos + delta;

    isAnimating = true;
    if (reducedMotion) {
      /* Instant cut — no animation */
      rawPos = newRaw;
      setPos(rawPos, false);
      isAnimating = false;
      snapIfNeeded();
      updateDots();
      resumeAutoplay();
      return;
    }

    t.style.transition = SNAP_EASE;
    t.style.transform  = 'translateX(-' + (100 / vis) * newRaw + '%)';
    rawPos = newRaw;
    updateSlideStates();
    updateDots();

    function onTransEnd() {
      t.removeEventListener('transitionend', onTransEnd);
      isAnimating = false;
      snapIfNeeded();
      resumeAutoplay();
    }
    t.addEventListener('transitionend', onTransEnd);

    /* Safety fallback: if transitionend never fires (e.g. tab was hidden
       mid-animation), unblock after transition duration + buffer */
    setTimeout(function () {
      if (!isAnimating) return;
      isAnimating = false;
      snapIfNeeded();
      resumeAutoplay();
    }, 560);
  }

  /* ─── BUILD / CLONES ─────────────────────────────────────── */
  function wrapSlides(reals) {
    reals.forEach(function (slide) {
      if (slide.querySelector('.cg-slide-inner')) return;
      var img = slide.querySelector('img');
      if (!img) return;
      var inner = document.createElement('div');
      inner.className = 'cg-slide-inner';
      slide.insertBefore(inner, img);
      inner.appendChild(img);

      function markLoaded() {
        img.classList.add('img-loaded');
        inner.classList.add('loaded');
      }
      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
      } else {
        img.addEventListener('load',  markLoaded);
        img.addEventListener('error', function () { inner.classList.add('loaded'); });
      }
    });
  }

  function build() {
    var t = track(); if (!t) return;
    var vis = visCount();

    t.querySelectorAll('.cg-clone').forEach(function (el) { el.remove(); });

    var reals = Array.from(t.querySelectorAll('.cg-slide:not(.cg-clone)'));
    REAL_TOTAL   = reals.length;
    clonesBefore = vis;

    wrapSlides(reals);

    lbImages = reals.map(function (s) {
      var img = s.querySelector('img');
      return img ? { src: img.src, alt: img.alt || '' } : null;
    }).filter(Boolean);

    for (var i = 0; i < vis; i++) {
      var cr = reals[i % REAL_TOTAL].cloneNode(true);
      cr.classList.add('cg-clone');
      t.appendChild(cr);
    }
    for (var j = vis - 1; j >= 0; j--) {
      var cl = reals[(REAL_TOTAL - vis + j) % REAL_TOTAL].cloneNode(true);
      cl.classList.add('cg-clone');
      t.insertBefore(cl, t.firstChild);
    }

    var logical = rawPos < clonesBefore ? 0 : logicalFromRaw(rawPos);
    rawPos = clonesBefore + logical;
    setPos(rawPos, false);
  }

  /* ─── DOTS ───────────────────────────────────────────────── */
  function buildDots() {
    var c = dotsEl(); if (!c) return;
    c.innerHTML = '';
    for (var i = 0; i < REAL_TOTAL; i++) {
      var d = document.createElement('button');
      d.className = 'cg-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to image ' + (i + 1));
      (function (idx) {
        d.addEventListener('click', function () {
          if (isAnimating) return;
          var diff = idx - logicalFromRaw(rawPos);
          if (diff >  REAL_TOTAL / 2) diff -= REAL_TOTAL;
          if (diff < -REAL_TOTAL / 2) diff += REAL_TOTAL;
          slideTo(diff);
        });
      })(i);
      c.appendChild(d);
    }
  }

  function updateDots() {
    var logical = logicalFromRaw(rawPos);
    document.querySelectorAll('#cgDots .cg-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === logical);
    });
  }

  /* ─── DRAG / SWIPE ───────────────────────────────────────── */
  function initDrag() {
    var vp = document.querySelector('.cg-viewport');
    if (!vp) return;

    var startX = 0, startRaw = 0;
    var dragging = false, dragged = false;
    var touchStartY = 0, verticalScroll = false;

    /* ── Touch ── */
    vp.addEventListener('touchstart', function (e) {
      if (isAnimating) return;
      pauseAutoplay();
      startX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      startRaw = rawPos;
      dragging = dragged = verticalScroll = false;
      var t = track(); if (t) t.style.transition = DRAG_EASE;
    }, { passive: true });

    vp.addEventListener('touchmove', function (e) {
      if (!dragging && !dragged && !verticalScroll) {
        /* Axis decision on first move */
        var dx0 = e.touches[0].clientX - startX;
        var dy0 = e.touches[0].clientY - touchStartY;
        if (Math.abs(dy0) > Math.abs(dx0) + 4) {
          verticalScroll = true;
          var t2 = track();
          if (t2) { t2.style.transition = SNAP_EASE; t2.style.transform = 'translateX(-' + (100 / visCount()) * startRaw + '%)'; }
          return;
        }
        dragging = true;
      }
      if (verticalScroll || !dragging) return;

      var dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 5) dragged = true;
      rawPos = startRaw - dx / (vp.offsetWidth / visCount());
      var t = track();
      if (t) t.style.transform = 'translateX(-' + (100 / visCount()) * rawPos + '%)';
      updateSlideStates();
    }, { passive: true });

    vp.addEventListener('touchend', function (e) {
      if (!dragging && !dragged) { scheduleResume(); return; }
      dragging = false;
      var dx = e.changedTouches[0].clientX - startX;
      var threshold = Math.max(vp.offsetWidth * 0.15, 40);

      rawPos = startRaw;
      if (dragged && dx < -threshold)       { slideTo(1); }
      else if (dragged && dx > threshold)   { slideTo(-1); }
      else { setPos(rawPos, true); scheduleResume(); }
    }, { passive: true });

    /* ── Mouse ── */
    vp.addEventListener('mousedown', function (e) {
      if (isAnimating) return;
      pauseAutoplay();
      startX = e.clientX; startRaw = rawPos;
      dragging = true; dragged = false;
      vp.classList.add('is-dragging');
      var t = track(); if (t) t.style.transition = DRAG_EASE;
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) dragged = true;
      rawPos = startRaw - dx / (vp.offsetWidth / visCount());
      var t = track(); if (t) t.style.transform = 'translateX(-' + (100 / visCount()) * rawPos + '%)';
      updateSlideStates();
    });

    window.addEventListener('mouseup', function (e) {
      if (!dragging) return;
      dragging = false;
      vp.classList.remove('is-dragging');
      var dx = e.clientX - startX;
      var threshold = Math.max(vp.offsetWidth * 0.15, 40);

      rawPos = startRaw;
      if (dragged && dx < -threshold)     { slideTo(1); }
      else if (dragged && dx > threshold) { slideTo(-1); }
      else { setPos(rawPos, true); scheduleResume(); }
    });

    vp.addEventListener('click', function (e) {
      if (dragged) e.preventDefault();
    }, true);

    /* ── Hover pause / resume (desktop) ── */
    vp.addEventListener('mouseenter', function () { pauseAutoplay(); });
    vp.addEventListener('mouseleave', function () {
      if (!dragging) scheduleResume();
    });
  }

  /* ─── KEYBOARD ───────────────────────────────────────────── */
  function initKeyboard() {
    document.addEventListener('keydown', function (e) {
      if (!document.querySelector('.cg-slider-wrap')) return;
      if (e.key === 'ArrowLeft')  slideTo(-1);
      if (e.key === 'ArrowRight') slideTo(1);
    });
  }

  /* ─── PAGE VISIBILITY API ────────────────────────────────── */
  /*
    When the user switches tabs or minimises the browser, the
    Page Visibility API fires. We stop the slider entirely to
    avoid wasted CPU, then restart when the tab comes back.
  */
  function initVisibilityHandling() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        /* Tab went background — full stop, don't waste resources */
        clearInterval(autoTimer); autoTimer = null;
        clearTimeout(resumeTimer); resumeTimer = null;
        stopProgress();
        /* Keep autoState as-is so we know whether to resume */
      } else {
        /* Tab is visible again */
        if (autoState === 'running' || autoState === 'paused') {
          /* Small delay so the browser has settled the repaint */
          setTimeout(function () {
            isAnimating = false; /* clear any stuck state from hidden-tab */
            snapIfNeeded();
            runAutoplay();
          }, 300);
        }
      }
    });

    /* Also handle page show/hide (back-forward cache on mobile Safari) */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted && (autoState === 'running' || autoState === 'paused')) {
        setTimeout(function () {
          isAnimating = false;
          snapIfNeeded();
          runAutoplay();
        }, 300);
      }
    });
  }

  /* ─── LIGHTBOX ───────────────────────────────────────────── */
  function lbOpen(idx) {
    lbIndex = ((idx % lbImages.length) + lbImages.length) % lbImages.length;
    var lb  = document.getElementById('cgLightbox');
    var img = document.getElementById('cgLbImg');
    var ctr = document.getElementById('cgLbCounter');
    if (!lb || !img) return;
    img.src = lbImages[lbIndex].src;
    img.alt = lbImages[lbIndex].alt || '';
    if (ctr) ctr.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    stopAutoplay();  /* fully stop — not just pause — while lightbox is open */
  }

  function lbClose() {
    var lb = document.getElementById('cgLightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    /* Small pause before restarting feels more natural */
    autoState = 'paused';
    scheduleResume();
  }

  function lbNav(dir) { lbOpen(lbIndex + dir); }

  function buildLightbox() {
    if (document.getElementById('cgLightbox')) return;
    var lb = document.createElement('div');
    lb.id = 'cgLightbox';
    lb.className = 'cg-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="cg-lightbox-close" id="cgLbClose" aria-label="Close">&#x2715;</button>' +
      '<button class="cg-lightbox-nav prev" id="cgLbPrev" aria-label="Previous">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>' +
      '</button>' +
      '<img id="cgLbImg" src="" alt="" style="pointer-events:none"/>' +
      '<button class="cg-lightbox-nav next" id="cgLbNext" aria-label="Next">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>' +
      '</button>' +
      '<div class="cg-lightbox-counter" id="cgLbCounter"></div>';
    document.body.appendChild(lb);

    document.getElementById('cgLbClose').onclick = lbClose;
    document.getElementById('cgLbPrev').onclick  = function () { lbNav(-1); };
    document.getElementById('cgLbNext').onclick  = function () { lbNav(1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     lbClose();
      if (e.key === 'ArrowLeft')  lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });

    var lbTouchX = 0;
    lb.addEventListener('touchstart', function (e) { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend',   function (e) {
      var dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 50) lbNav(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var t = track(); if (!t) return;
    REAL_TOTAL = t.querySelectorAll('.cg-slide').length;
    if (!REAL_TOTAL) return;

    rawPos = 0;
    build();
    buildProgressBar();
    buildDots();
    buildLightbox();
    initDrag();
    initKeyboard();
    initVisibilityHandling();

    var prev = document.getElementById('cgPrev');
    var next = document.getElementById('cgNext');
    if (prev) prev.addEventListener('click', function () { slideTo(-1); });
    if (next) next.addEventListener('click', function () { slideTo(1);  });

    /* Kick off autoplay — state starts as paused so runAutoplay sets it to running */
    autoState = 'paused';
    runAutoplay();
  });

  /* ─── RESIZE ─────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!REAL_TOTAL) return;
      stopProgress();
      build();
      buildDots();
      if (autoState !== 'stopped') runAutoplay();
    }, 150);
  });

}());

/* ── Rubber Profiles Slider ── */
(function () {
  var rpIndex = 0;
  var TOTAL = 0;

  function rpGetVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
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