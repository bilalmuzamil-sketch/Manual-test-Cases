// EVERYTHING still open on Printer Friendly, in one pass.
// Header states · a cancelled line · line detail · borders and note space · the audit trail ·
// which job statuses exist. Each check records what it saw; nothing is inferred.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG1.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const doPrint = async ()=>{
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
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
  return page.evaluate(()=>({calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}));
};
const readPrint = async ()=>{ await page.emulateMedia({media:'print'}); await page.waitForTimeout(1600);
  const out = await page.evaluate(()=>{const root=document.getElementById('wo-print-root');
    if(!root) return {found:false}; const txt=root.innerText||'';
    const cells=[...root.querySelectorAll('tr')].map(r=>{const c=getComputedStyle(r);
      return {t:(r.innerText||'').replace(/\s+/g,' ').slice(0,40),
        bb:c.borderBottomWidth, bbs:c.borderBottomStyle, pb:c.paddingBottom, h:r.offsetHeight};});
    return {found:true, chars:txt.length, money:[...txt.matchAll(/\$[\d,]+\.?\d*/g)].length,
      header: txt.slice(0, Math.max(0,txt.indexOf('Name/Description'))),
      cancelled:/cancel/i.test(txt), rows:cells, text:txt};});
  await page.emulateMedia({media:'screen'}); return out;};

await settle(page,{label:'start'});

// ---- 1. put mileage and engine hours on the job so the header cases can be judged
R.setOdo={};
const det=(await call('GET',`/api/work-orders/view/${WO}`)).json;
let d=(det&&(det.data||det))||{}; if(d.work_order) d=d.work_order;
R.woBefore={mileage:d.mileage, engine_hours:d.engine_hours, vehicle_id:d.vehicle_id, id:d.id};
for (const [p,b] of [
  ['/api/work-orders/change',{...d, id:WO, mileage:123456, engine_hours:4321}],
  ['/api/work-orders/update',{id:WO, mileage:123456, engine_hours:4321}],
]){ const r=await call('POST',p,b); R.setOdo[p.split('/').pop()]={http:r.status,text:r.text.slice(0,120)};
     if(r.status>=200&&r.status<300) break; }
const det2=(await call('GET',`/api/work-orders/view/${WO}`)).json;
let d2=(det2&&(det2.data||det2))||{}; if(d2.work_order) d2=d2.work_order;
R.woAfter={mileage:d2.mileage, engine_hours:d2.engine_hours};
log('mileage/engine hours: %s -> %s (%s)', JSON.stringify(R.woBefore.mileage)+'/'+JSON.stringify(R.woBefore.engine_hours),
  JSON.stringify(R.woAfter), JSON.stringify(Object.fromEntries(Object.entries(R.setOdo).map(([k,v])=>[k,v.http]))));
save();

// ---- 2. cancel a line
let ln = await lines();
R.cancel={};
const victim = ln[ln.length-1];
if (victim){
  for (const st of ['cancelled','canceled','cancel']){
    const r=await call('POST','/api/work-orders/lines/change-status',{line_id:victim.line_id, status:st, workOrderId:WO});
    R.cancel[st]={http:r.status, text:r.text.slice(0,130)};
    if(r.status>=200&&r.status<300) break;
  }
  ln = await lines();
  R.cancelledNow = ln.map(l=>({id:l.line_id.slice(0,8), status:l.status}));
  log('cancel a line: %s -> %s',
    JSON.stringify(Object.fromEntries(Object.entries(R.cancel).map(([k,v])=>[k,v.http]))),
    JSON.stringify(R.cancelledNow));
}
save();

// ---- 3. print and read everything
R.print1 = await doPrint();
R.out1 = R.print1.hasRoot ? await readPrint() : {found:false};
if (R.out1.found){
  log('HEADER:\n%s', R.out1.header);
  log('cancelled line on the printout: %s | money: %d', R.out1.cancelled, R.out1.money);
  const borders = R.out1.rows.filter(r=>r.bb && r.bb!=='0px');
  R.borderRows = borders.slice(0,8);
  log('rows carrying a bottom border: %d of %d — %s', borders.length, R.out1.rows.length,
    JSON.stringify(R.borderRows));
  const spacers = R.out1.rows.filter(r=>r.t.trim()==='' );
  R.spacerRows = spacers.length;
  log('blank spacer rows between line groups: %d', spacers.length);
}
await page.screenshot({path:`${DIR}/evidence/BIG1-print.png`, fullPage:true});
save();

// ---- 4. the audit trail: print twice, then read the log
R.print2 = await doPrint();
log('second print fired: %s', JSON.stringify(R.print2));
for (const p of [`/api/work-orders/${WO}/audit-log`, `/api/work-orders/audit-log/${WO}`,
                 `/api/audit-log?work_order_id=${WO}`, `/api/work-orders/${WO}/history`]){
  const r = await call('GET', p);
  if (r.status>=200 && r.status<300){
    const rows = rowsOf(r.json);
    R.auditPath = p; R.auditCount = rows.length;
    R.auditPrintEvents = rows.filter(x=>/print/i.test(JSON.stringify(x)))
      .map(x=>({when:x.created_at||x.date||x.timestamp, who:x.user_name||x.user||x.created_by_name,
        what:(x.event||x.action||x.description||x.message||'').toString().slice(0,60)}));
    log('audit log at %s: %d entries, %d mention printing', p, rows.length, R.auditPrintEvents.length);
    for (const e of R.auditPrintEvents.slice(0,6)) log('    %s | %s | %s', e.when, e.who, e.what);
    break;
  } else { R[`audit_${p.split('/').pop()}`]=r.status; }
}
save();

// ---- 5. which job statuses exist on Staging
const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
R.statuses = [...new Set(wos.map(w=>w.status))].sort();
log('job statuses present on Staging: %s', JSON.stringify(R.statuses));
save();
await s.browser.close();
log('done');
