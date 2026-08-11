// The scope picker exists for MULTI-LINE orders. Earlier attempts dragged S-12876,
// a ONE-line order, so no picker was expected - our fault, not the build's.
// Drag a genuinely multi-line card and read the picker's labels.
const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const PICKER=/Schedule whole work order|Select multiple|Change scope|Full estimate|Select all/i;
(async()=>{
  const {browser,page}=await open();
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  const card=await page.evaluate(()=>{
    const cs=[...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')];
    for(const c of cs){ const t=(c.innerText||'');
      const m=t.match(/(\d+)\s+lines/i);
      if(m && +m[1]>1){ const r=c.getBoundingClientRect();
        return {x:r.x+r.width/2,y:r.y+r.height/2,lines:+m[1],label:t.split('\n')[0],woId:c.getAttribute('data-work-order-id')}; } }
    return null; });
  console.log('MULTI-LINE CARD:',JSON.stringify(card));
  if(!card){ console.log('RESULT: no multi-line card visible'); await browser.close(); return; }
  const spot=await page.evaluate(()=>{
    const cal=document.querySelector('[data-test-id=schedule_calendar]'); const r=cal.getBoundingClientRect();
    for(let fy=0.25; fy<0.9; fy+=0.06) for(let fx=0.4; fx<0.9; fx+=0.05){
      const x=r.x+r.width*fx,y=r.y+r.height*fy; const el=document.elementFromPoint(x,y); if(!el) continue;
      if(!(el.closest('[data-test-id=schedule_shift_block],[data-test-id=schedule_event_block]')||/resizer/i.test(el.className.toString()))) return {x,y}; }
    return null; });
  console.log('EMPTY CELL:',JSON.stringify(spot));
  const ox=card.x, oy=card.y;
  await page.mouse.move(ox,oy); await page.waitForTimeout(400);
  await page.mouse.down(); await page.waitForTimeout(700);
  for(const d of [4,10,20]) { await page.mouse.move(ox+d,oy+d); await page.waitForTimeout(200); }
  const N=40;
  for(let i=1;i<=N;i++){ await page.mouse.move(ox+(spot.x-ox)*i/N, oy+(spot.y-oy)*i/N); await page.waitForTimeout(85); }
  await page.waitForTimeout(1200);
  await page.mouse.up(); await page.waitForTimeout(4500);
  const txt=await page.evaluate(()=>document.body.innerText);
  const ok=PICKER.test(txt);
  await page.screenshot({path:OUT+'/drag4-multiline.png'}).catch(()=>{});
  const d=await page.evaluate(DUMP);
  fs.writeFileSync(OUT+'/drag4-multiline-dump.json',JSON.stringify(d,null,1));
  console.log('SCOPE PICKER VISIBLE:',ok);
  const hits=(d.texts||[]).filter(t=>PICKER.test(t));
  console.log('PICKER STRINGS:',JSON.stringify(hits.slice(0,12)));
  console.log('RESULT: scope picker '+(ok?'OPENED':'DID NOT OPEN'));
  await browser.close();
})();
