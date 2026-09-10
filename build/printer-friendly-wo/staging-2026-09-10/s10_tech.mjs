// Technicians, properly this time.
//   - The lead-technician picker's FIRST option is "Unassigned" — taking it assigned nobody, so the
//     last run proved nothing about the header. Pick a real person instead.
//   - The Labor row's own menu offers only "Add Labor Fee / Discount", so a line technician is not
//     assigned from there. Read the line's own data to find where a technician actually lives, then
//     use whichever control the screen really offers.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s10-tech.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}`});
const {page} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:API_HOST,m,p});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
await settle(page,{label:'work order'});

// ---- where does a technician live on a line? Read the data before touching the screen.
const ln = await lines();
R.lineShape = ln.slice(0,2).map(l=>({id:l.line_id.slice(0,8),
  techFields:Object.fromEntries(Object.entries(l).filter(([k])=>/tech|labour|labor|assign|staff/i.test(k))
    .map(([k,v])=>[k, Array.isArray(v)?`[${v.length}]`:(typeof v==='object'&&v?JSON.stringify(v).slice(0,60):v)]))}));
log('technician-related fields on a line: %s', JSON.stringify(R.lineShape));
save();

// ---- lead technician: pick a REAL person, skipping "Unassigned"
R.open = await page.evaluate(()=>{const i=document.querySelector('[data-test-id=select_lead_technician]');
  if(!i) return {found:false};
  i.scrollIntoView({block:'center'});
  (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
  i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus(); return {found:true};});
await page.waitForTimeout(3000);
R.pick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
  const real=o.find(e=>!/unassigned|none/i.test(t(e)) && t(e).replace(/^check/,'').trim().length>2);
  if(!real) return {chose:false, options:o.map(t).slice(0,6)};
  const label=t(real); real.scrollIntoView({block:'center'}); real.click();
  return {chose:true, label:label.slice(0,44), of:o.length};}, VIS);
log('lead technician chosen: %s', JSON.stringify(R.pick));
await page.waitForTimeout(4000);
await settle(page,{label:'after lead tech'});
await page.screenshot({path:`${DIR}/evidence/s10-1-leadtech.png`, fullPage:true});
const det = (await call('GET',`/api/work-orders/view/${WO}`)).json;
let d=(det&&(det.data||det))||{}; if(d.work_order) d=d.work_order;
R.leadTechStored = Object.fromEntries(Object.entries(d).filter(([k])=>/lead|tech/i.test(k)));
log('lead technician now stored as: %s', JSON.stringify(R.leadTechStored));
save();

// ---- print and look for both the lead technician and any line technician
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
R.print = await page.evaluate(()=>({calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}));
if (R.print.hasRoot){
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1800);
  const name = (R.pick.label||'').replace(/^check/,'').trim().split(/\s+/).slice(0,2).join(' ');
  R.printout = await page.evaluate(nm=>{const root=document.getElementById('wo-print-root');
    const txt=root.innerText||'';
    return {chars:txt.length,
      headerBlock: txt.slice(0, txt.indexOf('Name/Description')>0 ? txt.indexOf('Name/Description') : 600),
      mentionsLeadTechLabel:/lead tech/i.test(txt),
      mentionsChosenName: nm ? txt.includes(nm) : null, chosenName:nm,
      mentionsMileage:/mileage/i.test(txt), mentionsEngineHours:/engine hour/i.test(txt)};}, name);
  log('printed header block:\n%s', R.printout.headerBlock);
  log('lead-technician label present: %s | the chosen name "%s" present: %s',
    R.printout.mentionsLeadTechLabel, R.printout.chosenName, R.printout.mentionsChosenName);
  log('mileage on the printout: %s | engine hours: %s',
    R.printout.mentionsMileage, R.printout.mentionsEngineHours);
  await page.screenshot({path:`${DIR}/evidence/s10-printout.png`, fullPage:true});
  await page.emulateMedia({media:'screen'});
}
save();
await s.browser.close();
log('done');
