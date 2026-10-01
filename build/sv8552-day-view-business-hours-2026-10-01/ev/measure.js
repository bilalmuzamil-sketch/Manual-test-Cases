// Day-view window as the user sees it.
// leftHour  = scrollLeft / pixelsPerHour   (which hour sits at the left edge)
// visible   = clientWidth / pixelsPerHour  (how many hours fit on screen)
() => {
  let sc=null,best=0;
  document.querySelectorAll('*').forEach(e=>{ const o=e.scrollWidth-e.clientWidth;
    if(o>best && e.clientWidth>400){ best=o; sc=e; } });
  if(!sc) return {error:'no scroll container'};
  const box=sc.getBoundingClientRect();
  const all=[...document.querySelectorAll('*')].filter(e=>{
    const t=(e.textContent||'').trim();
    return /^(1[0-2]|[1-9])\s?(AM|PM)$/i.test(t) && e.children.length===0;
  }).map(e=>{const r=e.getBoundingClientRect(); return {t:(e.textContent||'').trim().replace(/\s+/g,' '), x:r.x, w:r.width};})
    .filter(l=>l.w>0).sort((a,b)=>a.x-b.x);
  const uniq=[]; all.forEach(l=>{ if(!uniq.length||uniq[uniq.length-1].t!==l.t) uniq.push(l); });
  const gaps=[]; for(let i=1;i<uniq.length;i++) gaps.push(uniq[i].x-uniq[i-1].x);
  gaps.sort((a,b)=>a-b);
  const pph = gaps.length? Math.round(gaps[Math.floor(gaps.length/2)]) : null;
  const onScreen = uniq.filter(l=>l.x+l.w>box.left+2 && l.x<box.right-2).map(l=>l.t);
  const hr = h => { const v=Math.round(h*100)/100; const H=Math.floor(v)%24; const ap=H<12?'AM':'PM';
    const h12=H%12===0?12:H%12; return h12+' '+ap+(v%1?(' +'+Math.round((v%1)*60)+'m'):''); };
  const leftHour = pph? sc.scrollLeft/pph : null;
  const visible  = pph? sc.clientWidth/pph : null;
  return {
    leftEdge: leftHour!==null? hr(leftHour) : null,
    rightEdge: leftHour!==null? hr(leftHour+visible) : null,
    hoursVisible: visible!==null? Math.round(visible*100)/100 : null,
    pixelsPerHour: pph,
    scrollLeft: Math.round(sc.scrollLeft),
    maxScroll: Math.round(sc.scrollWidth-sc.clientWidth),
    totalHoursInGrid: pph? Math.round(sc.scrollWidth/pph) : null,
    labelsOnScreen: onScreen
  };
}
