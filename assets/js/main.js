document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-compare]').forEach(w=>{
    const r=w.querySelector('.compare-resize');const h=w.querySelector('.compare-handle');const x=w.querySelector('.compare-range');
    const set=p=>{p=Math.max(0,Math.min(100,p));r.style.width=p+'%';h.style.left=p+'%'}; set(x.value||50);
    x.addEventListener('input',e=>set(e.target.value));
    w.addEventListener('pointerdown',e=>{const b=w.getBoundingClientRect();set(((e.clientX-b.left)/b.width)*100)});
  });
  const lb=document.getElementById('lightbox');const img=document.getElementById('lightbox-img');const cap=document.getElementById('lightbox-cap');
  document.querySelectorAll('.gallery .card').forEach(c=>{
    const i=c.querySelector('img');const old=c.dataset.old;const nw=c.dataset.new;let flip=false;
    c.addEventListener('mouseenter',()=>{i.src=nw});c.addEventListener('mouseleave',()=>{i.src=old});
    c.addEventListener('click',()=>{flip=!flip;i.src=flip?nw:old;img.src=i.src;cap.textContent=flip?'2025 version':'1993 version';lb.classList.add('open')});
  });
  lb?.addEventListener('click',e=>{if(e.target===lb) lb.classList.remove('open')});
  window.addEventListener('keydown',e=>{if(e.key==='Escape') lb.classList.remove('open')});
});
// Enable dragging using the visible handle
document.querySelectorAll('[data-compare]').forEach(wrapper=>{
  const resize = wrapper.querySelector('.compare-resize');
  const handle = wrapper.querySelector('.compare-handle');
  const range  = wrapper.querySelector('.compare-range');
  let draggingHandle = false;

  const setPos = (clientX) => {
    const rect = wrapper.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    resize.style.width = pct + '%';
    handle.style.left = pct + '%';
    range.value = pct;
  };

  handle.addEventListener('pointerdown', (e)=>{ draggingHandle = true; handle.setPointerCapture(e.pointerId); });
  handle.addEventListener('pointermove', (e)=>{ if(draggingHandle) setPos(e.clientX); });
  handle.addEventListener('pointerup',   (e)=>{ draggingHandle = false; handle.releasePointerCapture(e.pointerId); });
});


// Static gallery: open lightbox on click, with next/prev navigation
(() => {
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

  cards.forEach((c,i)=>{
    c.addEventListener('click', ()=>openAt(i));
  });
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

// Back-to-top floating button
(() => {
  const btn = document.getElementById('backToTop');
  const onScroll = () => {
    if(window.scrollY > 480) btn.classList.add('show'); else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();
