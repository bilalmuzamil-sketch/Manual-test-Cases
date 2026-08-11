const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const log=[]; const say=(...a)=>{console.log(...a); log.push(a.join(' '));};
const PICKER=/Schedule whole work order|Select multiple|Change scope|Full estimate|Select all/i;
(async()=>{
  const {browser,page}=await open();
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  // ---- diagnose the drag mechanism ----
  const diag=await page.evaluate(()=>{
    const card=document.querySelector('[data-test-id=sidebar_work_order_card]');
    const cls=[...document.querySelectorAll('*')].reduce((a,e)=>{ (e.className&&typeof e.className==='string'?e.className.split(/\s+/):[]).forEach(c=>{if(/^fc-/.test(c))a.add(c);}); return a; },new Set());
    const grid=document.querySelector('.fc, .fc-view-harness, [class*=fc-timegrid], [class*=fc-resource]');
    return {
      fullcalendar_classes_present: cls.size, sample:[...cls].slice(0,18),
      grid_found: !!grid, grid_class: grid?grid.className.toString().slice(0,120):null,
      card_classes: card?card.className.toString().slice(0,160):null,
      card_html_head: card?card.outerHTML.slice(0,420):null,
      // FullCalendar external drag registers via its own Draggable on a selector
      fc_draggable_els: document.querySelectorAll('.fc-draggable, [class*=fc-draggable]').length,
      any_draggable_attr: document.querySelectorAll('[draggable="true"]').length,
      // does the app expose the FullCalendar instance?
      has_FullCalendar: typeof window.FullCalendar!=='undefined',
    };
  });
  say('DIAG: '+JSON.stringify(diag,null,1));

  // ---- find a genuinely EMPTY cell in a technician lane ----
  const spot=await page.evaluate(()=>{
    const cal=document.querySelector('[data-test-id=schedule_calendar]');
    if(!cal) return null;
    const r=cal.getBoundingClientRect();
    // scan a grid of candidate points; accept the first whose elementFromPoint is NOT
    // a shift/event block or a resizer
    for(let fy=0.25; fy<0.9; fy+=0.06){
      for(let fx=0.35; fx<0.92; fx+=0.05){
        const x=r.x+r.width*fx, y=r.y+r.height*fy;
        const el=document.elementFromPoint(x,y);
        if(!el) continue;
        const bad=el.closest('[data-test-id=schedule_shift_block],[data-test-id=schedule_event_block]')||/resizer/i.test(el.className.toString());
        if(!bad) return {x,y,tag:el.tagName,cls:el.className.toString().slice(0,90),tid:el.getAttribute('data-test-id')};
      }
    }
    return null;
  });
  say('EMPTY CELL: '+JSON.stringify(spot));
  if(!spot){ say('RESULT: no empty cell found'); fs.writeFileSync(OUT+'/drag-attempt-2.log',log.join('\n')); await browser.close(); return; }

  const src=await page.$('[data-test-id=sidebar_work_order_card]');
  const sb=await src.boundingBox();
  const sx=sb.x+sb.width/2, sy=sb.y+sb.height/2;
  const shown=async()=>PICKER.test(await page.evaluate(()=>document.body.innerText));
  const report=async(tag)=>{ const hit=await shown();
    await page.screenshot({path:`${OUT}/drag2-${tag}.png`}).catch(()=>{});
    if(hit){ const d=await page.evaluate(DUMP); fs.writeFileSync(`${OUT}/drag2-${tag}-dump.json`,JSON.stringify(d,null,1)); }
    say(`  [${tag}] scope picker visible: ${hit}`); return hit; };
  let ok=false;

  // ---- D: drag the DRAG HANDLE (the card exposes drag_indicator), slow, many steps ----
  try{
    const handle=await page.$('[data-test-id=sidebar_work_order_card] .q-icon, [data-test-id=sidebar_work_order_card] [class*=drag]');
    const hb=handle?await handle.boundingBox():null;
    const ox=hb?hb.x+hb.width/2:sx, oy=hb?hb.y+hb.height/2:sy;
    say(`technique D: from ${hb?'DRAG HANDLE':'card centre'} ${Math.round(ox)},${Math.round(oy)}`);
    await page.mouse.move(ox,oy); await page.waitForTimeout(400);
    await page.mouse.down(); await page.waitForTimeout(700);
    await page.mouse.move(ox+8,oy+8); await page.waitForTimeout(300);   // exceed minDistance
    const N=40;
    for(let i=1;i<=N;i++){
      await page.mouse.move(ox+(spot.x-ox)*i/N, oy+(spot.y-oy)*i/N);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(1200);
    await page.mouse.move(spot.x,spot.y); await page.waitForTimeout(700);
    await page.mouse.up(); await page.waitForTimeout(4000);
    ok=await report('D-handle-slow');
  }catch(e){ say('  technique D error: '+String(e).slice(0,180)); }

  // ---- E: expand the card and drag an individual LINE row (the documented alt path) ----
  if(!ok){
    try{
      const card=await page.$('[data-test-id=sidebar_work_order_card]');
      const cb=await card.boundingBox();
      await page.mouse.click(cb.x+cb.width-24,cb.y+24); await page.waitForTimeout(3000);
      const line=await page.$('[class*=drag_indicator], text=drag_indicator');
      const lb=line?await line.boundingBox():null;
      if(lb){
        say(`technique E: dragging a LINE row from ${Math.round(lb.x+lb.width/2)},${Math.round(lb.y+lb.height/2)}`);
        const ox=lb.x+lb.width/2, oy=lb.y+lb.height/2;
        await page.mouse.move(ox,oy); await page.waitForTimeout(400);
        await page.mouse.down(); await page.waitForTimeout(700);
        await page.mouse.move(ox+10,oy+10); await page.waitForTimeout(300);
        const N=36;
        for(let i=1;i<=N;i++){ await page.mouse.move(ox+(spot.x-ox)*i/N, oy+(spot.y-oy)*i/N); await page.waitForTimeout(90); }
        await page.waitForTimeout(1200);
        await page.mouse.up(); await page.waitForTimeout(4000);
        ok=await report('E-line-row');
      } else say('  technique E: no line drag handle found');
    }catch(e){ say('  technique E error: '+String(e).slice(0,180)); }
  }
  say('RESULT: scope picker '+(ok?'OPENED':'DID NOT OPEN'));
  fs.writeFileSync(OUT+'/drag-attempt-2.log',log.join('\n'));
  await browser.close();
})();
