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
      return;
    }
    img.addEventListener('load', function () {
      this.classList.add('loaded');
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
  injectGalleryImages();
  initImgFallbacks();
  initHeroSlider();
});

/* ── Inject Gallery Images (keeps src out of HTML source) ── */
function injectGalleryImages() {
  var track = document.getElementById('cgTrack');
  if (!track) return;
  var imgs = [
    { s: 'images/home1.webp', a: 'Gayatri Minerals facility overview' },
    { s: 'images/home2.webp', a: 'Chalk powder production unit' },
    { s: 'images/home3.webp', a: 'Mineral processing area' },
    { s: 'images/home4.webp', a: 'Whiting chalk mining site Porbandar' },
    { s: 'images/home5.webp', a: 'Bulk chalk powder storage' },
    { s: 'images/home6.webp', a: 'Packaging unit at Gayatri Minerals' },
    { s: 'images/home7.webp', a: 'Quality testing facility' },
    { s: 'images/home8.webp', a: 'Dispatch and logistics at plant' },
    { s: 'images/home9.webp', a: 'Gayatri Minerals plant exterior' }
  ];
  imgs.forEach(function (item, idx) {
    var slide = document.createElement('div');
    slide.className = 'cg-slide';
    var img = document.createElement('img');
    img.src = item.s;
    img.alt = item.a;
    img.decoding = 'async';
    if (idx > 0) img.loading = 'lazy';
    img.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    img.draggable = false;
    slide.appendChild(img);
    track.appendChild(slide);
  });
}

/* ── Gallery Slider — Professional Infinite Carousel ── */
(function () {
  'use strict';

  var AUTOPLAY_MS  = 3800;   /* ms between auto-advances */
  var SNAP_EASE    = 'transform 0.48s cubic-bezier(.25,.46,.45,.94)';
  var DRAG_EASE    = 'none';

  /* ── State ─────────────────────────────────────────────── */
  var REAL_TOTAL   = 0;
  var clonesBefore = 0;
  var rawPos       = 0;   /* current position in "total-slides" space */
  var isAnimating  = false;
  var autoTimer    = null;
  var progressAnim = null;
  var lbImages     = [];  /* src list for lightbox */
  var lbIndex      = 0;

  /* ── Helpers ─────────────────────────────────────────────*/
  function visCount() {
    return window.innerWidth < 768 ? 1
         : window.innerWidth < 1024 ? 2 : 3;
  }

  function logicalFromRaw(r) {
    return ((r - clonesBefore) % REAL_TOTAL + REAL_TOTAL) % REAL_TOTAL;
  }

  /* ── DOM refs ────────────────────────────────────────────*/
  function track()    { return document.getElementById('cgTrack'); }
  function dots()     { return document.getElementById('cgDots'); }

  /* ── Build clones ────────────────────────────────────────*/
  function build() {
    var t = track(); if (!t) return;
    var vis = visCount();

    /* Remove old clones */
    t.querySelectorAll('.cg-clone').forEach(function (el) { el.remove(); });

    var reals = Array.from(t.querySelectorAll('.cg-slide:not(.cg-clone)'));
    REAL_TOTAL   = reals.length;
    clonesBefore = vis;

    /* Wrap each real slide's img in .cg-slide-inner */
    reals.forEach(function (slide) {
      if (!slide.querySelector('.cg-slide-inner')) {
        var img = slide.querySelector('img');
        if (!img) return;
        var inner = document.createElement('div');
        inner.className = 'cg-slide-inner';

        slide.insertBefore(inner, img);
        inner.appendChild(img);

        /* Lazy-load shimmer removal */
        if (img.complete && img.naturalWidth) {
          img.classList.add('img-loaded');
          inner.classList.add('loaded');
        } else {
          img.addEventListener('load', function () {
            img.classList.add('img-loaded');
            inner.classList.add('loaded');
          });
          img.addEventListener('error', function () {
            inner.classList.add('loaded');
          });
        }
      }
    });

    /* Collect lightbox images from real slides */
    lbImages = reals.map(function (s) {
      var img = s.querySelector('img');
      return img ? { src: img.src, alt: img.alt || '' } : null;
    }).filter(Boolean);

    /* Right clones (first VIS reals → append) */
    for (var i = 0; i < vis; i++) {
      var cl = reals[i % REAL_TOTAL].cloneNode(true);
      cl.classList.add('cg-clone');
      /* Remove zoom binding from clones to avoid double lightbox */
      var clZoom = cl.querySelector('.cg-slide-zoom');
      if (clZoom) clZoom.onclick = null;
      t.appendChild(cl);
    }

    /* Left clones (last VIS reals → prepend) */
    for (var j = vis - 1; j >= 0; j--) {
      var clL = reals[(REAL_TOTAL - vis + j) % REAL_TOTAL].cloneNode(true);
      clL.classList.add('cg-clone');
      var clLZoom = clL.querySelector('.cg-slide-zoom');
      if (clLZoom) clLZoom.onclick = null;
      t.insertBefore(clL, t.firstChild);
    }

    /* Logical → raw position */
    rawPos = clonesBefore + logicalFromRaw(rawPos < clonesBefore ? clonesBefore : rawPos);
    setPos(rawPos, false);
  }

  /* ── Position ────────────────────────────────────────────*/
  function setPos(pos, animate) {
    var t = track(); if (!t) return;
    var vis = visCount();
    t.style.transition = animate ? SNAP_EASE : DRAG_EASE;
    t.style.transform  = 'translateX(-' + (100 / vis) * pos + '%)';
    updateSlideStates();
  }

  function updateSlideStates() {
    var t = track(); if (!t || !REAL_TOTAL) return;
    var vis = visCount();
    var nearest = Math.round(rawPos + (vis - 1) / 2);
    var slides = t.querySelectorAll('.cg-slide');
    slides.forEach(function (slide, i) {
      slide.classList.remove('is-active', 'is-side');
      if (i === nearest) {
        slide.classList.add('is-active');
      } else if (Math.abs(i - nearest) <= Math.max(1, Math.ceil(vis / 2))) {
        slide.classList.add('is-side');
      }
    });
  }

  /* ── Silently snap if in clone zone ─────────────────────*/
  function snapIfNeeded() {
    var total = REAL_TOTAL + clonesBefore + visCount();
    if (rawPos >= clonesBefore + REAL_TOTAL) {
      rawPos = clonesBefore + (rawPos - (clonesBefore + REAL_TOTAL));
      setPos(rawPos, false);
    } else if (rawPos < clonesBefore) {
      rawPos = clonesBefore + REAL_TOTAL + rawPos;
      setPos(rawPos, false);
    updateSlideStates();
    }
  }

  /* ── Dots ────────────────────────────────────────────────*/
  function buildDots() {
    var c = dots(); if (!c) return;
    c.innerHTML = '';
    for (var i = 0; i < REAL_TOTAL; i++) {
      var d = document.createElement('button');
      d.className   = 'cg-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to image ' + (i + 1));
      (function (idx) {
        d.addEventListener('click', function () {
          if (isAnimating) return;
          var logical = logicalFromRaw(rawPos);
          var diff = idx - logical;
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

  /* ── Progress bar (removed) ── */
  function startProgress() {}
  function resetProgress() {}

  /* ── Autoplay ────────────────────────────────────────────*/
  function startAutoplay() {
    stopAutoplay();
    startProgress();
    autoTimer = setInterval(function () {
      slideTo(1);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    clearInterval(autoTimer);
    autoTimer = null;
    resetProgress();
  }

  /* ── Slide by delta ──────────────────────────────────────*/
  function slideTo(delta) {
    if (isAnimating) return;
    stopAutoplay();

    var newRaw = rawPos + delta;
    isAnimating = true;

    var t = track(); if (!t) return;
    var vis = visCount();
    t.style.transition = SNAP_EASE;
    t.style.transform  = 'translateX(-' + (100 / vis) * newRaw + '%)';
    rawPos = newRaw;
    updateSlideStates();
    updateDots();

    t.addEventListener('transitionend', function onEnd() {
      t.removeEventListener('transitionend', onEnd);
      isAnimating = false;
      snapIfNeeded();
      startAutoplay();
    });
  }

  /* ── Drag / pointer support ──────────────────────────────*/
  function initDrag() {
    var vp = document.querySelector('.cg-viewport');
    if (!vp) return;

    var startX = 0, startRaw = 0, dragged = false, dragging = false;

    function onStart(clientX) {
      if (isAnimating) return;
      stopAutoplay();
      startX   = clientX;
      startRaw = rawPos;
      dragging = true;
      dragged  = false;
      vp.classList.add('is-dragging');
      var t = track(); if (t) t.style.transition = DRAG_EASE;
    }

    function onMove(clientX) {
      if (!dragging) return;
      var dx  = clientX - startX;
      var vis = visCount();
      var slideW = vp.offsetWidth / vis;
      if (Math.abs(dx) > 4) dragged = true;
      rawPos = startRaw - dx / slideW;
      var t = track(); if (t) t.style.transform = 'translateX(-' + (100 / vis) * rawPos + '%)';
      updateSlideStates();
    }

    function onEnd(clientX) {
      if (!dragging) return;
      dragging = false;
      vp.classList.remove('is-dragging');
      var dx  = clientX - startX;
      var vis = visCount();
      var slideW = vp.offsetWidth / vis;

      /* Snap to nearest whole slide */
      var logical  = logicalFromRaw(startRaw);
      var threshold = slideW * 0.22;
      var delta = dx < -threshold ? 1 : dx > threshold ? -1 : 0;

      rawPos = startRaw; /* reset for slideTo */
      if (!dragged || delta === 0) {
        slideTo(0); /* snap back */
      } else {
        slideTo(delta);
      }
    }

    /* Mouse */
    vp.addEventListener('mousedown',  function (e) { onStart(e.clientX); });
    window.addEventListener('mousemove', function (e) { if (dragging) onMove(e.clientX); });
    window.addEventListener('mouseup',   function (e) { if (dragging) onEnd(e.clientX); });
    vp.addEventListener('click', function (e) { if (dragged) e.preventDefault(); }, true);

    /* Touch */
    var touchStartY = 0;
    vp.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
      onStart(e.touches[0].clientX);
    }, { passive: true });
    vp.addEventListener('touchmove',  function (e) {
      var dy = Math.abs(e.touches[0].clientY - touchStartY);
      var dx = Math.abs(e.touches[0].clientX - startX);
      if (dy > dx) { dragging = false; return; } /* vertical scroll */
      onMove(e.touches[0].clientX);
    }, { passive: true });
    vp.addEventListener('touchend',   function (e) { onEnd(e.changedTouches[0].clientX); }, { passive: true });

    /* Pause autoplay on hover */
    vp.addEventListener('mouseenter', function () { stopAutoplay(); resetProgress(); });
    vp.addEventListener('mouseleave', function () { if (!dragging) startAutoplay(); });
  }

  /* ── Keyboard ────────────────────────────────────────────*/
  function initKeyboard() {
    document.addEventListener('keydown', function (e) {
      var wrap = document.querySelector('.cg-slider-wrap');
      if (!wrap) return;
      if (e.key === 'ArrowLeft')  slideTo(-1);
      if (e.key === 'ArrowRight') slideTo(1);
    });
  }

  /* ── Lightbox ────────────────────────────────────────────*/
  function lbOpen(idx) {
    lbIndex = ((idx % lbImages.length) + lbImages.length) % lbImages.length;
    var lb  = document.getElementById('cgLightbox');
    var img = document.getElementById('cgLbImg');
    var ctr = document.getElementById('cgLbCounter');
    if (!lb || !img) return;

    img.src = lbImages[lbIndex].src;
    img.alt = lbImages[lbIndex].alt;
    if (ctr) ctr.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    stopAutoplay();
  }

  function lbClose() {
    var lb = document.getElementById('cgLightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    startAutoplay();
  }

  function lbNav(dir) {
    lbOpen(lbIndex + dir);
  }

  function buildLightbox() {
    if (document.getElementById('cgLightbox')) return;
    var lb = document.createElement('div');
    lb.id = 'cgLightbox';
    lb.className = 'cg-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="cg-lightbox-close" id="cgLbClose" aria-label="Close lightbox">&#x2715;</button>' +
      '<button class="cg-lightbox-nav prev" id="cgLbPrev" aria-label="Previous image">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>' +
      '</button>' +
      '<img id="cgLbImg" src="" alt="" style="pointer-events:none"/>' +
      '<button class="cg-lightbox-nav next" id="cgLbNext" aria-label="Next image">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>' +
      '</button>' +
      '<div class="cg-lightbox-counter" id="cgLbCounter"></div>';
    document.body.appendChild(lb);

    document.getElementById('cgLbClose').onclick = lbClose;
    document.getElementById('cgLbPrev').onclick  = function () { lbNav(-1); };
    document.getElementById('cgLbNext').onclick  = function () { lbNav(1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });

    /* Keyboard nav inside lightbox */
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     lbClose();
      if (e.key === 'ArrowLeft')  lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });

    /* Swipe in lightbox */
    var lbTouchX = 0;
    lb.addEventListener('touchstart', function (e) { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend',   function (e) {
      var dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 50) lbNav(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ── Init ────────────────────────────────────────────────*/
  document.addEventListener('DOMContentLoaded', function () {
    var t = track(); if (!t) return;
    REAL_TOTAL = t.querySelectorAll('.cg-slide').length;
    if (!REAL_TOTAL) return;

    rawPos = 0;
    build();
    buildDots();
    buildLightbox();
    initDrag();
    initKeyboard();

    var prev = document.getElementById('cgPrev');
    var next = document.getElementById('cgNext');
    if (prev) prev.addEventListener('click', function () { slideTo(-1); });
    if (next) next.addEventListener('click', function () { slideTo(1);  });

    startAutoplay();
  });

  window.addEventListener('resize', function () {
    if (!REAL_TOTAL) return;
    rawPos = clonesBefore; /* reset to start */
    build();
    buildDots();
  });
})();

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