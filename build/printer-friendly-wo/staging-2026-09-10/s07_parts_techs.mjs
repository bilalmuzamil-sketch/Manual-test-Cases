// The remaining printed-page cases need three states this job does not yet have:
//   a line with NO parts · a line WITH a technician assigned · parts whose PART NUMBER is populated.
// The printed parts rows currently read "Misc hardware/ fittings | 1 | (blank)" — the blank may be a
// missing part number on the printout (a real finding) or simply a part that has none (not a
// finding). Rule 104: read the parts data before deciding, and build a part that HAS a number.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s07-parts-techs.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,220)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
await settle(page,{label:'lines'});
let ln = await lines();

// ---- 1. DO the parts already on the lines carry a part number at all?
R.partsData = ln.flatMap(l=>(l.parts||[]).map(p=>({line:l.line_id.slice(0,8),
  desc:p.description||p.part_description, part_number:p.part_number, pn2:p.partNumber,
  qty:p.quantity, keys:Object.keys(p).filter(k=>/number|desc|qty|quant/i.test(k))})));
log('parts on the lines: %s', JSON.stringify(R.partsData).slice(0,600));
R.anyPartNumber = R.partsData.some(p=>p.part_number || p.pn2);
log('does ANY part on this job carry a part number? %s', R.anyPartNumber);
save();

// ---- 2. add a line with NO parts (a canned line advertising zero parts)
const canned = rowsOf((await call('GET','/api/canned-lines?limit=100')).json)
  .map(c=>({id:c.id, name:c.name||c.description, parts:(c.parts||[]).length}));
R.cannedCounts = canned.map(c=>`${(c.name||'').slice(0,28)}:${c.parts}`).slice(0,10);
const zero = canned.find(c=>c.parts===0);
R.zeroPartsCanned = zero ? {name:zero.name, parts:zero.parts} : null;
log('canned lines and their part counts: %s | zero-parts option: %s',
  JSON.stringify(R.cannedCounts), JSON.stringify(R.zeroPartsCanned));
if (zero){
  const r = await call('POST',`/api/work-orders/${WO}/lines/create-from-canned-line`,
    {canned_line_id:zero.id, status:'authorized'});
  R.addedNoPartsLine = {http:r.status, text:r.text.slice(0,150)};
  log('line with no parts added: %s', JSON.stringify(R.addedNoPartsLine));
}
save();

// ---- 3. assign a technician to the first line
const techs = rowsOf((await call('GET','/api/staff?limit=50')).json)
  .map(t=>({id:t.id, name:t.full_name||t.name||`${t.first_name||''} ${t.last_name||''}`.trim()}));
R.staffSample = techs.slice(0,5);
log('staff available: %d, e.g. %s', techs.length, JSON.stringify(R.staffSample));
ln = await lines();
const target = ln[0];
R.assignTries={};
if (target && techs[0]){
  for (const [m,p,b] of [
    ['POST','/api/work-orders/lines/assign-technician',{line_id:target.line_id, workOrderId:WO, staff_id:techs[0].id}],
    ['POST','/api/work-orders/lines/technicians/assign',{line_id:target.line_id, workOrderId:WO, staff_ids:[techs[0].id]}],
    ['POST','/api/work-orders/lines/change',{...target, workOrderId:WO, line_id:target.line_id,
      line_tech_assigned_id:techs[0].id, parts:undefined, part_requests:undefined, tasks:undefined,
      task_records:undefined, tech_times:undefined}],
  ]){
    const r = await call(m,p,b);
    R.assignTries[p] = {http:r.status, text:r.text.slice(0,140)};
    save();
    if (r.status>=200 && r.status<300){
      const l2 = (await lines()).find(x=>x.line_id===target.line_id)||{};
      R.assignTries[p].techNow = l2.line_tech_assigned_id || (l2.tech_times||[]).length;
      if (l2.line_tech_assigned_id) break;
    }
  }
  log('assigning a technician: %s', JSON.stringify(
    Object.fromEntries(Object.entries(R.assignTries).map(([k,v])=>[k.split('/').pop(), v.http]))));
}
save();

// ---- 4. print and read
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'reload'});
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
    return {chars:txt.length, money:[...txt.matchAll(/\$[\d,]+\.?\d*/g)].length,
      partsRows:(txt.match(/Parts\t/g)||[]).length,
      mentionsTech:/Tech(nician)?s?\t/i.test(txt),
      text:txt};});
  log('PRINTOUT %d chars | money %d | parts sections %d | a technician row present: %s',
    R.printout.chars, R.printout.money, R.printout.partsRows, R.printout.mentionsTech);
  log('--- full printout ---'); log(R.printout.text.slice(0,2600));
  await page.screenshot({path:`${DIR}/evidence/s07-printout.png`, fullPage:true});
  await page.pdf({path:`${DIR}/evidence/s07-printout.pdf`, format:'A4', printBackground:true}).catch(()=>{});
  await page.emulateMedia({media:'screen'});
}
save();
await s.browser.close();
log('done');
