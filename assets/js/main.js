document.addEventListener('DOMContentLoaded', () => {
  // Compare sliders (click or drag handle)
  document.querySelectorAll('[data-compare]').forEach(wrapper => {
    const resize = wrapper.querySelector('.compare-resize');
    const handle = wrapper.querySelector('.compare-handle');
    const range  = wrapper.querySelector('.compare-range');

    const setPos = (val) => {
      const pct = Math.min(100, Math.max(0, val));
      resize.style.width = pct + '%';
      handle.style.left = pct + '%';
      range.value = pct;
    };
    setPos(range.value || 50);

    // Drag anywhere on wrapper
    wrapper.addEventListener('pointerdown', e => {
      const rect = wrapper.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setPos(pct);
    });

    // Drag by handle
    let dragging = false;
    handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rect = wrapper.getBoundingClientRect();
      setPos(((e.clientX - rect.left) / rect.width) * 100);
    });
    handle.addEventListener('pointerup', (e) => { dragging = false; handle.releasePointerCapture(e.pointerId); });

    range.addEventListener('input', e => setPos(e.target.value));
  });

  // Static gallery → lightbox with prev/next
  (function(){
    const cards = Array.from(document.querySelectorAll('.gallery .card'));
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-cap');
    const closeBtn = lb.querySelector('[data-close]');
    const prevBtn = lb.querySelector('.nav.prev');
    const nextBtn = lb.querySelector('.nav.next');

    let idx = -1;
    const getSrc = i => cards[i].querySelector('img').getAttribute('src');

    function openAt(i){
      idx = (i + cards.length) % cards.length;
      const src = getSrc(idx);
      lbImg.src = src;
      lbCap.textContent = src.toLowerCase().includes('_now') ? '2025 version' : '1993 version';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden','false');
    }
    function close(){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      lbImg.removeAttribute('src');
    }
    function next(){ openAt(idx+1); }
    function prev(){ openAt(idx-1); }

    cards.forEach((c,i)=> c.addEventListener('click', ()=> openAt(i)));
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', (e)=>{ if(e.target===lb) close(); });
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    window.addEventListener('keydown', (e)=>{
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close();
      if(e.key==='ArrowRight') next();
      if(e.key==='ArrowLeft') prev();
    });
  })();

  // Back-to-top button
  (function(){
    const btn = document.getElementById('backToTop');
    const onScroll = () => {
      if(window.scrollY > 480) btn.classList.add('show'); else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  })();
});
