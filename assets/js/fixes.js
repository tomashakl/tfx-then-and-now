
/*! TFX Then & Now — drop‑in fixes (v1.0)
 *  Safe to include after your existing CSS/JS. No external deps.
 *  Restores:
 *   1) Before/After slider drag
 *   2) Hero arrows (prev/next)
 *   3) Back‑to‑top button
 *   4) Lightbox / Expanded View anchoring + zoom
 */
(function () {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ---------- 1) BEFORE/AFTER SLIDER ----------
  function initCompareSlider(container) {
    if (!container) return;
    // Accept multiple markup variants
    const before = $('.before, .compare__before, [data-compare="before"]', container);
    const after  = $('.after, .compare__after, [data-compare="after"]', container);
    const handle = $('.handle, .compare__handle, [data-compare="handle"]', container);
    if (!before || !after || !handle) return;

    const bounds = () => container.getBoundingClientRect();
    const setPos = (x) => {
      const b = bounds();
      const clamped = Math.max(0, Math.min(x - b.left, b.width));
      const pct = (clamped / b.width) * 100;
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      after.style.webkitClipPath = after.style.clipPath;
      handle.style.left = pct + '%';
      container.dataset.split = pct.toFixed(1);
    };

    // Start centered
    setPos(bounds().left + bounds().width / 2);

    let dragging = false;
    const start = (e) => { dragging = true; document.body.classList.add('is-dragging'); move(e); };
    const end   = () => { dragging = false; document.body.classList.remove('is-dragging'); };
    const move  = (e) => {
      if (!dragging) return;
      if (e.type.startsWith('touch')) e = e.touches[0];
      setPos(e.clientX);
    };

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, {passive:true});
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, {passive:false});
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    // Also allow clicking anywhere on the slider track
    container.addEventListener('mousedown', (e)=> setPos(e.clientX));
    container.addEventListener('touchstart', (e)=> setPos(e.touches[0].clientX), {passive:true});
    // Resize handler
    window.addEventListener('resize', ()=> setPos(container.getBoundingClientRect().left + container.getBoundingClientRect().width * (parseFloat(container.dataset.split||50)/100)));
  }

  // Auto-detect compare slider containers
  $$('[data-compare], .compare, .compare-slider').forEach((c) => {
    // Accept only containers (skip individual items)
    const looksLikeContainer = $(`.before, .after, .compare__before, .compare__after, [data-compare="before"], [data-compare="after"]`, c);
    if (looksLikeContainer) initCompareSlider(c);
  });

  // ---------- 2) HERO ARROWS ----------
  (function initHeroArrows(){
    const hero = $('[data-hero]') || $('.hero');
    if (!hero) return;
    const slides = $$('[data-hero-slide], .hero__slide', hero);
    if (slides.length < 2) return;
    let i = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    const show = (idx) => {
      i = (idx + slides.length) % slides.length;
      slides.forEach((s, si) => s.classList.toggle('is-active', si === i));
    };
    const prevBtn = $('[data-hero-prev], .hero__prev', hero);
    const nextBtn = $('[data-hero-next], .hero__next', hero);
    if (prevBtn) prevBtn.addEventListener('click', ()=> show(i-1));
    if (nextBtn) nextBtn.addEventListener('click', ()=> show(i+1));
    // Keyboard arrows
    window.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowLeft') show(i-1);
      if (e.key === 'ArrowRight') show(i+1);
    });
  })();

  // ---------- 3) BACK TO TOP ----------
  (function initBackToTop(){
    let btn = $('#backToTop') || $('[data-backtotop]');
    if (!btn) {
      // create one if missing
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '↑';
      document.body.appendChild(btn);
    }
    const revealAt = 300;
    const onScroll = () => {
      if (window.scrollY > revealAt) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  })();

  // ---------- 4) LIGHTBOX / EXPANDED VIEW ----------
  (function initLightbox(){
    // Reuse existing #lightbox if present; otherwise create
    let lb = $('#lightbox') || $('#expandedView') || null;
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      document.body.appendChild(lb);
    } else if (lb.parentElement !== document.body) {
      // ensure anchored to body
      document.body.appendChild(lb);
    }
    lb.innerHTML = `
      <div class="lb__backdrop" data-lb-close></div>
      <figure class="lb__figure">
        <img class="lb__img" alt="Expanded view">
        <figcaption class="lb__cap"></figcaption>
        <button class="lb__close" aria-label="Close" data-lb-close>×</button>
        <button class="lb__nav lb__prev" aria-label="Previous">‹</button>
        <button class="lb__nav lb__next" aria-label="Next">›</button>
      </figure>
    `;
    const imgEl = $('.lb__img', lb);
    const capEl = $('.lb__cap', lb);
    const prev  = $('.lb__prev', lb);
    const next  = $('.lb__next', lb);
    const closeEls = $$('[data-lb-close]', lb);

    const gallery = $$('a[data-lightbox], img[data-lightbox], .lightboxable img, .gallery img');
    let index = -1;

    function openAt(i){
      if (i < 0 || i >= gallery.length) return;
      index = i;
      const node = gallery[i];
      const src  = node.getAttribute('data-full') || node.currentSrc || node.src || (node.tagName === 'A' ? node.href : '');
      const cap  = node.getAttribute('alt') || node.getAttribute('data-caption') || node.title || '';
      imgEl.src = src;
      capEl.textContent = cap;
      document.documentElement.classList.add('lb-open');
      lb.classList.add('is-open');
      // preload neighbors
      [i-1, i+1].forEach(j=>{
        if (j>=0 && j<gallery.length){
          const pre = new Image(); pre.src = gallery[j].getAttribute('data-full') || gallery[j].currentSrc || gallery[j].src || '';
        }
      });
    }
    function close(){
      lb.classList.remove('is-open');
      document.documentElement.classList.remove('lb-open');
      index = -1;
    }
    function step(dx){ openAt((index + dx + gallery.length) % gallery.length); }

    gallery.forEach((el, i)=>{
      (el.tagName === 'A' ? el : el.parentElement || el).addEventListener('click', (e)=>{
        // Only hijack if likely an image open
        if (el.tagName !== 'A') e.preventDefault();
        openAt(i);
      });
    });
    closeEls.forEach(c=> c.addEventListener('click', close));

    document.addEventListener('keydown', (e)=>{
      if (index === -1) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key.toLowerCase() === 'x') close(); // fallback
    });
  })();

  // ---------- 5) SMALL POLISH ----------
  // Debounced resize for any future layout reads
  (function(){
    let t; window.addEventListener('resize', ()=> { clearTimeout(t); t = setTimeout(()=>{}, 150); });
  })();

})();
