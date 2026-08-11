// Attempt to open the SCOPE PICKER by driving a real drag. Three techniques, in
// order of fidelity. NOTHING is fabricated: we do not POST a shift and read the
// dialog as though a drag produced it - the picker's wording is the behaviour the
// 10 blocked cases assert, so producing it another way would make our own setup
// the source of the observation (Rules 12/57).
const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const log=[]; const say=(...a)=>{console.log(...a); log.push(a.join(' '));};
const PICKER=/Schedule whole work order|Select multiple|Change scope|Full estimate|Select all/i;
(async()=>{
  const {browser,page}=await open();
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  const src=await page.$('[data-test-id=sidebar_work_order_card]');
  const cal=await page.$('[data-test-id=schedule_calendar]');
  if(!src||!cal){ say('FATAL: source card or calendar missing'); await browser.close(); return; }
  const sb=await src.boundingBox(), cb=await cal.boundingBox();
  // land on an EMPTY part of a real technician lane: use a lane label to get its y
  const lanes=await page.$$('[data-test-id=schedule_lane_label]');
  let ty=cb.y+cb.height*0.55;
  if(lanes.length){ const lb=await lanes[Math.min(3,lanes.length-1)].boundingBox(); if(lb) ty=lb.y+lb.height/2; }
  const sx=sb.x+sb.width/2, sy=sb.y+sb.height/2;
  const tx=cb.x+cb.width-180;
  say(`source card at ${Math.round(sx)},${Math.round(sy)} -> target lane at ${Math.round(tx)},${Math.round(ty)}`);
  const shown=async()=>{ const t=await page.evaluate(()=>document.body.innerText); return PICKER.test(t); };
  const report=async(tag)=>{ const hit=await shown();
    await page.screenshot({path:`${OUT}/drag-${tag}.png`}).catch(()=>{});
    if(hit){ const d=await page.evaluate(DUMP); fs.writeFileSync(`${OUT}/drag-${tag}-dump.json`,JSON.stringify(d,null,1)); }
    say(`  [${tag}] scope picker visible: ${hit}`); return hit; };

  // ---------- technique A: draggable attribute + CDP Input.dispatchDragEvent ----------
  const draggable=await page.evaluate(()=>{
    const c=document.querySelector('[data-test-id=sidebar_work_order_card]');
    if(!c) return null;
    const d=c.closest('[draggable]')||c.querySelector('[draggable]');
    return {cardDraggable:c.getAttribute('draggable'), nested:!!d, nestedVal:d&&d.getAttribute('draggable'),
            hasDragHandle:!!document.querySelector('[data-test-id=sidebar_work_order_card] .q-icon, [class*=drag]')};
  });
  say('draggable probe: '+JSON.stringify(draggable));
  let ok=false;
  try{
    const cdp=await page.context().newCDPSession(page);
    const data={items:[{mimeType:'text/plain',data:'wo'}],dragOperationsMask:1};
    await cdp.send('Input.setInterceptDrags',{enabled:true}).catch(()=>{});
    await cdp.send('Input.dispatchDragEvent',{type:'dragEnter',x:tx,y:ty,data});
    await page.waitForTimeout(400);
    for(let i=0;i<4;i++){ await cdp.send('Input.dispatchDragEvent',{type:'dragOver',x:tx,y:ty,data}); await page.waitForTimeout(250); }
    await cdp.send('Input.dispatchDragEvent',{type:'drop',x:tx,y:ty,data});
    await page.waitForTimeout(3500);
    ok=await report('A-cdp-dragevent');
  }catch(e){ say('  technique A error: '+String(e).slice(0,180)); }

  // ---------- technique B: pointer/mouse with many small steps ----------
  if(!ok){
    try{
      await page.mouse.move(sx,sy); await page.waitForTimeout(300);
      await page.mouse.down(); await page.waitForTimeout(500);
      const N=24;
      for(let i=1;i<=N;i++){
        await page.mouse.move(sx+(tx-sx)*i/N, sy+(ty-sy)*i/N, {steps:2});
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(900);
      await page.mouse.move(tx,ty); await page.waitForTimeout(500);
      await page.mouse.up(); await page.waitForTimeout(3500);
      ok=await report('B-mouse-steps');
    }catch(e){ say('  technique B error: '+String(e).slice(0,180)); }
  }

  // ---------- technique C: synthesised HTML5 DragEvent with a real DataTransfer ----------
  if(!ok){
    try{
      const res=await page.evaluate(({tx,ty})=>{
        const card=document.querySelector('[data-test-id=sidebar_work_order_card]');
        const tgt=document.elementFromPoint(tx,ty);
        if(!card||!tgt) return {err:'no card or target'};
        const dt=new DataTransfer();
        const fire=(el,type,extra={})=>{ const ev=new DragEvent(type,Object.assign({bubbles:true,cancelable:true,composed:true,dataTransfer:dt,clientX:tx,clientY:ty},extra)); el.dispatchEvent(ev); return ev.defaultPrevented; };
        const out={};
        out.dragstart=fire(card,'dragstart');
        out.dragenter=fire(tgt,'dragenter');
        out.dragover =fire(tgt,'dragover');
        out.drop     =fire(tgt,'drop');
        fire(card,'dragend');
        out.target=tgt.getAttribute('data-test-id')||tgt.className.toString().slice(0,60);
        out.dtTypes=[...dt.types];
        return out;
      },{tx,ty});
      say('  technique C dispatch: '+JSON.stringify(res).slice(0,300));
      await page.waitForTimeout(3500);
      ok=await report('C-synth-dragevent');
    }catch(e){ say('  technique C error: '+String(e).slice(0,180)); }
  }
  say('RESULT: scope picker '+(ok?'OPENED':'DID NOT OPEN'));
  fs.writeFileSync(OUT+'/drag-attempt.log',log.join('\n'));
  await browser.close();
})();
