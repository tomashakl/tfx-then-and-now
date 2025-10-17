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
