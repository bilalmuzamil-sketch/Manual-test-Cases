// C45251 clause 2 — order and receive a special-order part THROUGH THE SCREEN, on the work order the
// QA lead pointed at. His correction, 2026-09-10: the part is added with **Source = Vendor**, the row
// then shows **Auth To Order** with an **Order** button, and pressing that orders it.
// My earlier attempt went behind the screen and concluded the product was broken. It is not. This one
// clicks what a user clicks, and waits properly at every step.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/121-order-receive.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';        // the QA lead's work order
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const T=e=>e; // marker
const clickByText = (re, scopeSel)=>page.evaluate(({vis,re,scopeSel})=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const root=scopeSel? document.querySelector(scopeSel) : document;
  if(!root) return {clicked:false, why:'scope missing'};
  const rx=new RegExp(re,'i');
  const b=[...root.querySelectorAll('button,[role=button],a')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...root.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,25)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},{vis:VIS,re:re.source||re,scopeSel:scopeSel||null});
const snap = async (tag)=>{ await page.screenshot({path:`${DIR}/evidence/121-${tag}.png`, fullPage:true}); };
const describe = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const dlg=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  return {url:location.pathname,
    dialog: dlg? {text:t(dlg).slice(0,400),
      inputs:[...dlg.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label');
        return {label:l?t(l):(i.getAttribute('data-test-id')||i.placeholder||''), value:i.value,
          testid:i.getAttribute('data-test-id')};}),
      buttons:[...dlg.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,12)} : null,
    drawers:[...document.querySelectorAll('.q-drawer,[role=dialog]')].filter(isVis).length,
    bodyHead:(document.body.innerText||'').slice(0,220)};}, VIS);

await page.waitForTimeout(11000);
R.startLines = (await lines()).map(l=>({id:l.line_id, status:l.status,
  reqs:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
  parts:(l.parts||[]).map(p=>p.part_number)}));
log('lines at start: %s', JSON.stringify(R.startLines));
save();
const LINE = (R.startLines[0]||{}).id;
if(!LINE){ R.fatal='the work order has no lines'; save(); await s.browser.close(); process.exit(0); }

// ---- if there is no Auth-To-Order request yet, create one the way the QA lead showed:
//      Add Part -> New Part Request window -> Source = Vendor -> Save & Close
let req = (R.startLines[0].reqs||[]).find(r=>/auth|order/i.test(r.status));
if (!req){
  R.addPart = await clickByText(/\+?\s*Add Part/);
  log('Add Part: %s', JSON.stringify(R.addPart).slice(0,200));
  await page.waitForTimeout(6000);
  await snap('1-addpart');
  R.afterAddPart = await describe();
  // the inline row's "More Options" opens the New Part Request window where Source lives
  if (!R.afterAddPart.dialog){
    await clickByText(/more option/i);
    await page.waitForTimeout(5000);
    R.afterAddPart = await describe();
  }
  log('the New Part Request window: %s', JSON.stringify(R.afterAddPart.dialog||{}).slice(0,400));
  save();
}
await snap('2-state');
R.finalNote = 'see the JSON for the window contents; the ordering steps follow in probe122';
save();
await s.browser.close();
log('done');
