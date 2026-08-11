const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const log=[]; const say=(...a)=>{console.log(...a); log.push(a.join(' '));};
const PICKER=/Schedule whole work order|Select multiple|Change scope|Full estimate|Select all/i;
(async()=>{
  const {browser,page}=await open();
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  // what drop targets does the app declare?
  const attrs=await page.evaluate(()=>{
    const names=new Set();
    document.querySelectorAll('*').forEach(e=>{ for(const a of e.attributes) if(/^data-/.test(a.name)&&/drag|drop|schedule/.test(a.name)) names.add(a.name); });
    const drags=[...document.querySelectorAll('[data-schedule-drag]')].length;
    const drops=[...document.querySelectorAll('[data-schedule-drop]')].length;
    return {attr_names:[...names], drag_els:drags, drop_els:drops};
  });
  say('DROP-TARGET PROBE: '+JSON.stringify(attrs));
  // instrument: record every pointer/mouse/drag event the app's own elements receive
  await page.evaluate(()=>{
    window.__ev=[];
    const types=['pointerdown','pointermove','pointerup','mousedown','mousemove','mouseup','dragstart','dragover','drop','dragend','click'];
    types.forEach(t=>document.addEventListener(t,e=>{
      if(window.__ev.length<400) window.__ev.push({t,x:Math.round(e.clientX||0),y:Math.round(e.clientY||0),
        tgt:(e.target.getAttribute&&e.target.getAttribute('data-test-id'))||(e.target.className||'').toString().slice(0,40)});
    },true));
  });
  const spot=await page.evaluate(()=>{
    const cal=document.querySelector('[data-test-id=schedule_calendar]'); const r=cal.getBoundingClientRect();
    for(let fy=0.25; fy<0.9; fy+=0.06) for(let fx=0.35; fx<0.92; fx+=0.05){
      const x=r.x+r.width*fx, y=r.y+r.height*fy; const el=document.elementFromPoint(x,y); if(!el) continue;
      if(!(el.closest('[data-test-id=schedule_shift_block],[data-test-id=schedule_event_block]')||/resizer/i.test(el.className.toString())))
        return {x,y,cls:el.className.toString().slice(0,70)};
    } return null; });
  say('EMPTY CELL: '+JSON.stringify(spot));
  const shown=async()=>PICKER.test(await page.evaluate(()=>document.body.innerText));
  let ok=false;
  // ---- F: expand card, drag the LINE row (correct selector this time) ----
  try{
    const card=await page.$('[data-test-id=sidebar_work_order_card]');
    const cb=await card.boundingBox();
    await page.mouse.click(cb.x+cb.width-24,cb.y+24); await page.waitForTimeout(3500);
    const lineBox=await page.evaluate(()=>{
      const els=[...document.querySelectorAll('i,span,div')].filter(e=>(e.textContent||'').trim()==='drag_indicator');
      if(!els.length) return null; const r=els[0].getBoundingClientRect();
      return {x:r.x+r.width/2,y:r.y+r.height/2,n:els.length};
    });
    say('LINE HANDLE: '+JSON.stringify(lineBox));
    if(lineBox){
      const ox=lineBox.x, oy=lineBox.y;
      await page.mouse.move(ox,oy); await page.waitForTimeout(400);
      await page.mouse.down(); await page.waitForTimeout(800);
      for(const d of [3,6,12,24]) { await page.mouse.move(ox+d,oy+d); await page.waitForTimeout(200); }
      const N=45;
      for(let i=1;i<=N;i++){ await page.mouse.move(ox+(spot.x-ox)*i/N, oy+(spot.y-oy)*i/N); await page.waitForTimeout(80); }
      await page.waitForTimeout(1500);
      await page.mouse.up(); await page.waitForTimeout(4500);
      ok=await shown();
      await page.screenshot({path:OUT+'/drag3-F-line-row.png'}).catch(()=>{});
      say('  [F-line-row] scope picker visible: '+ok);
      if(ok){ const d=await page.evaluate(DUMP); fs.writeFileSync(OUT+'/drag3-picker-dump.json',JSON.stringify(d,null,1)); }
    }
  }catch(e){ say('  technique F error: '+String(e).slice(0,200)); }
  // what did the app actually receive?
  const ev=await page.evaluate(()=>window.__ev||[]);
  const counts=ev.reduce((a,e)=>{a[e.t]=(a[e.t]||0)+1;return a;},{});
  say('EVENTS THE APP RECEIVED: '+JSON.stringify(counts));
  say('first/last targets: '+JSON.stringify([ev[0],ev[Math.floor(ev.length/2)],ev[ev.length-1]]));
  fs.writeFileSync(OUT+'/drag-events.json',JSON.stringify({attrs,counts,sample:ev.slice(0,40)},null,1));
  say('RESULT: scope picker '+(ok?'OPENED':'DID NOT OPEN'));
  fs.writeFileSync(OUT+'/drag-attempt-3.log',log.join('\n'));
  await browser.close();
})();
