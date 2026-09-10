// Next batch of states, all through the screen:
//   1. a LEAD TECHNICIAN on the job (the header must carry it) — control `select_lead_technician`
//   2. a TECHNICIAN on a line (the line must carry it; and a line without one must omit it)
//   3. a line with NO parts (the New Line form with a description only did NOT create a line —
//      the canned line appears to be required, and it drags parts in, so clear a line's requests)
//   4. the formatting checks that need no new data: status badges as plain text, line separation
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s09-more-states.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const firstOption=async()=>{await page.waitForTimeout(2800);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!o.length) return {chose:false};
    const l=t(o[0]); o[0].click(); return {chose:true, label:l.slice(0,44), of:o.length};}, VIS);};

await settle(page,{label:'work order'});

// ---- 1. LEAD TECHNICIAN on the job
R.leadTech = await page.evaluate(()=>{const i=document.querySelector('[data-test-id=select_lead_technician]');
  if(!i) return {found:false};
  i.scrollIntoView({block:'center'});
  (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
  i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus();
  return {found:true, valueBefore:i.value};});
if (R.leadTech.found){ R.leadTechPick = await firstOption(); await page.waitForTimeout(3500); }
log('lead technician: %s -> %s', JSON.stringify(R.leadTech), JSON.stringify(R.leadTechPick||{}));
await page.screenshot({path:`${DIR}/evidence/s09-1-leadtech.png`, fullPage:true});
save();

// ---- 2. a technician on a LINE, via the Labor row's own menu
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'lines'});
await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
  if(/expand_more/.test(b.textContent||'')) b.click();});
await page.waitForTimeout(4000);
let ln = await lines();
const L1 = ln[0] && ln[0].line_id;
R.laborMenu = await page.evaluate(({vis,line})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector(`[data-test-id="button_add_labor_adjustment_${line}"]`);
  if(!b) return {found:false};
  b.scrollIntoView({block:'center'}); b.click(); return {found:true};},{vis:VIS, line:L1});
await page.waitForTimeout(3000);
R.laborMenuItems = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  return m? [...m.querySelectorAll('.q-item')].filter(isVis).map(e=>({label:t(e), tid:e.getAttribute('data-test-id')})) : [];}, VIS);
log('the Labor row menu offers: %s', JSON.stringify(R.laborMenuItems));
await page.keyboard.press('Escape').catch(()=>{});
save();

// ---- 3. a line with no parts: clear one line's part requests
ln = await lines();
const victim = ln[ln.length-1];
R.clearTries={};
if (victim){
  for (const r of (victim.part_requests||[])){
    for (const p of ['/api/work-orders/part/delete-request','/api/work-orders/part/remove-request',
                     '/api/work-orders/part/request/delete']){
      const x = await call('POST', p, {part_request_id:r.id, workOrderId:WO, line_id:victim.line_id});
      R.clearTries[`${p.split('/').pop()}`] = {http:x.status, text:x.text.slice(0,110)};
      if (x.status>=200 && x.status<300) break;
    }
  }
  const after = (await lines()).find(l=>l.line_id===victim.line_id)||{};
  R.victimAfter = {id:victim.line_id.slice(0,8), reqs:(after.part_requests||[]).length, parts:(after.parts||[]).length};
  log('clearing a line to make it part-free: %s -> %s',
    JSON.stringify(Object.fromEntries(Object.entries(R.clearTries).map(([k,v])=>[k,v.http]))),
    JSON.stringify(R.victimAfter));
}
save();

// ---- 4. print, and read the formatting details too
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'reload for print'});
await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
    .filter(x=>/more_vert|more_horiz/.test(t(x))||/more/i.test(x.getAttribute('data-test-id')||''))
    .filter(x=>!(tbl&&tbl.contains(x)) && !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(x.getAttribute('data-test-id')||''))[0];
  if(b) b.click();}, VIS);
await page.waitForTimeout(3000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
await page.waitForTimeout(6000);
R.print = await page.evaluate(()=>({calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}));
if (R.print.hasRoot){
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1800);
  R.printout = await page.evaluate(()=>{const root=document.getElementById('wo-print-root');
    const txt=root.innerText||'';
    // status badge styling: is "Approved" a plain text label or a coloured chip?
    const badges=[...root.querySelectorAll('*')].filter(e=>!e.children.length &&
      /^(Approved|Estimate|In Progress|Complete|Cancelled|Declined)$/i.test((e.textContent||'').trim()))
      .slice(0,4).map(e=>{const c=getComputedStyle(e);
        return {text:(e.textContent||'').trim(), color:c.color, background:c.backgroundColor,
          radius:c.borderRadius, fontSize:c.fontSize};});
    // line separation: the border below each line group
    const rows=[...root.querySelectorAll('tr')].slice(0,14).map(r=>{const c=getComputedStyle(r);
      return {text:(r.innerText||'').replace(/\s+/g,' ').slice(0,34),
        borderBottom:c.borderBottomWidth+' '+c.borderBottomStyle, paddingBottom:c.paddingBottom};});
    const body=getComputedStyle(root);
    return {chars:txt.length, money:[...txt.matchAll(/\$[\d,]+\.?\d*/g)].length,
      badges, rows, rootColor:body.color, rootBackground:body.backgroundColor, rootFontSize:body.fontSize,
      hasLeadTech:/lead tech/i.test(txt), techMentions:(txt.match(/Tech(nician)?s?:/gi)||[]),
      text:txt};});
  log('PRINTOUT %d chars | money %d | text colour %s on %s | base size %s',
    R.printout.chars, R.printout.money, R.printout.rootColor, R.printout.rootBackground, R.printout.rootFontSize);
  log('  status badges: %s', JSON.stringify(R.printout.badges));
  log('  lead technician on the printout: %s | technician mentions: %s',
    R.printout.hasLeadTech, JSON.stringify(R.printout.techMentions));
  log('  row borders: %s', JSON.stringify(R.printout.rows.slice(0,8)));
  await page.screenshot({path:`${DIR}/evidence/s09-printout.png`, fullPage:true});
  await page.pdf({path:`${DIR}/evidence/s09-printout.pdf`, format:'A4', printBackground:true}).catch(()=>{});
  await page.emulateMedia({media:'screen'});
}
save();
await s.browser.close();
log('done');
