
// ===== TFX: Then & Now — core interactions (robust) =====
(function(){
  // ---- Compare (Before/After) ----
  function initCompare(wrapper){
    const resize = wrapper.querySelector('.compare-resize');
    const handle = wrapper.querySelector('.compare-handle');
    const range  = wrapper.querySelector('.compare-range');
    if(!resize || !handle){ return; }

    function setPct(pct){
      if(isNaN(pct)) pct = 50;
      pct = Math.max(0, Math.min(100, pct));
      resize.style.width = pct + '%';
      handle.style.left  = pct + '%';
      if(range) range.value = pct;
    }

    function pointToPct(e){
      const rect = wrapper.getBoundingClientRect();
      const clientX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    let dragging = false;
    function start(e){ dragging = true; setPct(pointToPct(e)); e.preventDefault(); }
    function move(e){ if(!dragging) return; setPct(pointToPct(e)); }
    function end(){ dragging = false; }

    // Pointer / mouse
    wrapper.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    // Touch
    wrapper.addEventListener('touchstart', start, {passive:false});
    window.addEventListener('touchmove', move, {passive:false});
    window.addEventListener('touchend', end);

    // Click anywhere to jump
    wrapper.addEventListener('click', (e)=> setPct(pointToPct(e)));

    // Init
    setPct(range && range.value ? parseFloat(range.value) : 50);
    window.addEventListener('resize', ()=> setPct(range && range.value ? parseFloat(range.value) : 50));
  }

  document.querySelectorAll('[data-compare]').forEach(initCompare);

  // ---- Lightbox for gallery ----
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const btnPrev = lb ? lb.querySelector('.nav.prev') : null;
  const btnNext = lb ? lb.querySelector('.nav.next') : null;
  const btnClose = lb ? (lb.querySelector('[data-close]') || lb.querySelector('.close')) : null;

  const cards = Array.from(document.querySelectorAll('.gallery .card img'));
  let idx = -1;

  function setCaptionFromSrc(src){
    if(!lbCap) return;
    lbCap.textContent = (src || '').toLowerCase().includes('_now') ? '2025 version' : '1993 version';
  }

  function openAt(i){
    if(!lb || !lbImg || cards.length === 0) return;
    idx = (i + cards.length) % cards.length;
    const src = cards[idx].getAttribute('src');
    lbImg.setAttribute('src', src);
    setCaptionFromSrc(src);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  }
  function closeLB(){
    if(!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    if(lbImg) lbImg.removeAttribute('src');
  }
  function next(){ openAt(idx+1); }
  function prev(){ openAt(idx-1); }

  // Click bindings
  cards.forEach((img, i)=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openAt(i));
  });
  if(btnClose) btnClose.addEventListener('click', closeLB);
  if(lb) lb.addEventListener('click', (e)=>{ if(e.target === lb) closeLB(); });
  if(btnNext) btnNext.addEventListener('click', next);
  if(btnPrev) btnPrev.addEventListener('click', prev);

  // Keys
  window.addEventListener('keydown', (e)=>{
    if(!lb || !lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

})();

// Back-to-top button (unchanged)
(function(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  const onScroll = () => {
    if(window.scrollY > 480) btn.classList.add('show'); else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();


// --- Flipcard tap support and lightbox with visible image ---
(function(){
  const supportsHover = window.matchMedia && window.matchMedia('(hover:hover)').matches;
  const cards = Array.from(document.querySelectorAll('.gallery .card.flipcard'));
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  let idx = -1;

  function visibleSrc(card){
    const newImg = card.querySelector('.img-new');
    const oldImg = card.querySelector('.img-old');
    // Decide by class or computed opacity
    if(card.classList.contains('flip') || (!supportsHover && newImg)) return newImg.getAttribute('src');
    const op = parseFloat(getComputedStyle(newImg).opacity || '0');
    return op >= 0.5 ? newImg.getAttribute('src') : oldImg.getAttribute('src');
  }

  function openAt(i){
    const card = cards[i];
    if(!card || !lb || !lbImg) return;
    const src = visibleSrc(card);
    lbImg.src = src;
    if(lbCap) lbCap.textContent = src.toLowerCase().includes('_now') ? '2025 version' : '1993 version';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    idx = i;
  }

  cards.forEach((card,i)=>{
    // On touch devices, toggle .flip on tap to simulate hover
    if(!supportsHover){
      card.addEventListener('click', (e)=>{
        if(!card.classList.contains('flip')){
          card.classList.add('flip');
        }else{
          // second tap opens
          openAt(i);
        }
      });
    }else{
      // Desktop: single click opens with the currently visible image
      card.addEventListener('click', ()=> openAt(i));
    }
  });
})();
