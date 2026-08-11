// Open the scope picker on a MULTI-LINE order, then go INTO the `Select multiple`
// sub-state and look for `Select all` / `Cancel` / `Change scope` / `Full estimate`.
// Board is diffed BEFORE and AFTER in this same run (not at pass end).
const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const API='https://sv8685api.qa.shopview.com';
const CK=fs.readFileSync('/tmp/qa-cookies/schedule-cookie-header.txt','utf8').trim();
const S={}; const log=[]; const say=(...a)=>{console.log(...a); log.push(a.join(' '));};
const board=async()=>{ const r=await fetch(`${API}/api/schedule/board?from=2026-08-11T00:00:00Z&to=2026-08-12T00:00:00Z`,
  {headers:{Cookie:CK,Accept:'application/json'}}); const j=await r.json(); return j.data.board; };
(async()=>{
  const B0=await board(); say(`BOARD BEFORE: shifts=${B0.shifts.length} events=${B0.events.length} series=${B0.series.length}`);
  const {browser,page}=await open();
  const grab=async n=>{ S[n]=await page.evaluate(DUMP); await page.screenshot({path:`${OUT}/pick-${n}.png`}).catch(()=>{});
    say(`  [${n}] texts=${S[n].texts.length}`); return S[n]; };
  const clickText=async(label,tag,exact=true)=>{
    const box=await page.evaluate(({label,exact})=>{
      const all=[...document.querySelectorAll('button,[role=button],div,span,a,li')];
      const els=all.filter(e=>{ const t=(e.textContent||'').trim();
        return (exact? t===label : t.includes(label)) && e.children.length<=2; });
      if(!els.length) return null; const r=els[0].getBoundingClientRect();
      if(r.width===0) return null; return {x:r.x+r.width/2,y:r.y+r.height/2};
    },{label,exact});
    if(!box){ say(`  [${tag}] "${label}" NOT FOUND`); return false; }
    await page.mouse.click(box.x,box.y); await page.waitForTimeout(3000);
    say(`  [${tag}] clicked "${label}"`); return true; };
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  // drag the multi-line card
  const card=await page.evaluate(()=>{
    for(const c of document.querySelectorAll('[data-test-id=sidebar_work_order_card]')){
      const m=(c.innerText||'').match(/(\d+)\s+lines/i);
      if(m && +m[1]>1){ const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,lines:+m[1],label:(c.innerText||'').split('\n')[0]}; } }
    return null; });
  const spot=await page.evaluate(()=>{
    const cal=document.querySelector('[data-test-id=schedule_calendar]'); const r=cal.getBoundingClientRect();
    for(let fy=0.25; fy<0.9; fy+=0.06) for(let fx=0.4; fx<0.9; fx+=0.05){
      const x=r.x+r.width*fx,y=r.y+r.height*fy; const el=document.elementFromPoint(x,y); if(!el) continue;
      if(!(el.closest('[data-test-id=schedule_shift_block],[data-test-id=schedule_event_block]')||/resizer/i.test(el.className.toString()))) return {x,y}; }
    return null; });
  say(`dragging ${card.label} (${card.lines} lines) -> empty lane cell`);
  await page.mouse.move(card.x,card.y); await page.waitForTimeout(400);
  await page.mouse.down(); await page.waitForTimeout(700);
  for(const d of [4,10,20]){ await page.mouse.move(card.x+d,card.y+d); await page.waitForTimeout(200); }
  const N=40; for(let i=1;i<=N;i++){ await page.mouse.move(card.x+(spot.x-card.x)*i/N, card.y+(spot.y-card.y)*i/N); await page.waitForTimeout(85); }
  await page.waitForTimeout(1200); await page.mouse.up(); await page.waitForTimeout(4500);
  await grab('01-picker');
  // ---- INTO THE SUB-STATE ----
  const wentIn = await clickText('Select multiple','02');
  if(wentIn){ await page.waitForTimeout(2500); await grab('02-select-multiple'); }
  // tick a couple of lines, which is what usually reveals a footer with Select all / Cancel
  try{
    const boxes=await page.evaluate(()=>{
      const cbs=[...document.querySelectorAll('input[type=checkbox], [role=checkbox], .q-checkbox')];
      return cbs.slice(0,3).map(e=>{const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}).filter(b=>b.x>0);
    });
    say(`  checkboxes found: ${boxes.length}`);
    for(const b of boxes.slice(0,2)){ await page.mouse.click(b.x,b.y); await page.waitForTimeout(1200); }
    await grab('03-lines-ticked');
  }catch(e){ say('  tick error '+String(e).slice(0,120)); }
  // search the WHOLE document (incl. hidden) for the four labels
  const probe=await page.evaluate(()=>{
    const want=['Select all','Cancel','Change scope','Full estimate'];
    const html=document.documentElement.innerHTML;
    const vis=el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);
      return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.opacity!=='0';};
    const out={};
    for(const w of want){
      const inHtml=new RegExp(w.replace(/ /g,'\\s*'),'i').test(html);
      const els=[...document.querySelectorAll('*')].filter(e=>e.children.length===0 && (e.textContent||'').trim().toLowerCase()===w.toLowerCase());
      out[w]={in_markup:inHtml, exact_text_nodes:els.length, visible:els.some(vis),
              variants:[...new Set([...document.querySelectorAll('*')].filter(e=>e.children.length===0&&new RegExp(w.split(' ')[0],'i').test((e.textContent||'').trim())&&(e.textContent||'').trim().length<40).map(e=>(e.textContent||'').trim()))].slice(0,8)};
    }
    return out;
  });
  say('FOUR-LABEL PROBE: '+JSON.stringify(probe,null,1));
  fs.writeFileSync(OUT+'/picker-substate.json',JSON.stringify({surfaces:S,probe,read_at_utc:new Date().toISOString()},null,1));
  // ---- cancel out without committing anything ----
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(2000);
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(2000);
  await browser.close();
  const B1=await board();
  say(`BOARD AFTER : shifts=${B1.shifts.length} events=${B1.events.length} series=${B1.series.length}`);
  const a=new Set(B0.shifts.map(s=>s.id)), b=new Set(B1.shifts.map(s=>s.id));
  const added=[...b].filter(i=>!a.has(i)), removed=[...a].filter(i=>!b.has(i));
  say(`DIFF NOW: added=${added.length} ${JSON.stringify(added)} removed=${removed.length}`);
  fs.writeFileSync(OUT+'/picker-substate.log',log.join('\n'));
  fs.writeFileSync('/tmp/added_shifts.json',JSON.stringify(added));
})();
