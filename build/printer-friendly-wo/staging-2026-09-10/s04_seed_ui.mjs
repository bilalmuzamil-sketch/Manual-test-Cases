// Seed work orders through the SCREEN, because creating them behind the screen fails here.
// The playbook already records this exact gotcha (§C, "Create WO (API)"):
//     "create can 500 in some staging sessions -> create via the UI instead
//      (UI recipe: /workorders -> New -> pick Customer + Asset -> Save -> Confirmation
//       'over credit limit' -> Create)"
// Rule 97: the answer was already written down; this follows it rather than re-discovering it.
// Note also: the work order record carries company_id but NO vehicle_id (the asset is picked in the
// form), which is why the behind-the-screen call could never have been completed from that record.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle, afterAction } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/s04-seed-ui.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:'/workorders'});
const {page, ctx} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:API_HOST,m,p});
await settle(page,{label:'work orders'});
const before = rowsOf((await call('GET','/api/work-orders?limit=100')).json).map(w=>w.id);
R.before = before.length;

const clickText = (re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button],a')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,22)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},{vis:VIS,re:re.source||re});
const describe = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const scope=d||document;
  return {url:location.pathname, dialog:!!d,
    heading:t(scope.querySelector('.text-h6,h4,h5,h6')||{}).slice(0,60),
    fields:[...scope.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
      const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label');
      return {label:l?t(l):(i.getAttribute('data-test-id')||i.placeholder||''),
        testid:i.getAttribute('data-test-id'), value:i.value};}).slice(0,14),
    buttons:[...scope.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,14)};}, VIS);

// ---- open the create form
R.openCreate = await afterAction(page, ctx, ()=>clickText(/^(create work order|new work order|\+ ?new)$/),
  {label:'Create Work Order'});
log('Create Work Order -> %s', R.openCreate.summary);
R.form = await describe();
log('the form: %s', JSON.stringify(R.form).slice(0,600));
await page.screenshot({path:`${DIR}/evidence/s04-1-form.png`, fullPage:true});
save();

// ---- fill it: pick the first option in each select the form offers
const pickInto = async (testidRe, typed)=>page.evaluate(async ({vis,testidRe,typed})=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const inputs=[...document.querySelectorAll('input')].filter(isVis)
    .filter(i=>new RegExp(testidRe,'i').test(i.getAttribute('data-test-id')||''));
  const i=inputs[0]; if(!i) return {found:false};
  i.scrollIntoView({block:'center'}); i.focus();
  if (typed){ const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    S.call(i,typed); i.dispatchEvent(new Event('input',{bubbles:true})); }
  else { i.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
  return {found:true, testid:i.getAttribute('data-test-id')};}, {vis:VIS, testidRe, typed:typed||null});
const chooseFirstOption = async ()=>{ await page.waitForTimeout(2500);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!o.length) return {chose:false};
    const label=t(o[0]); o[0].click(); return {chose:true, label:label.slice(0,60), of:o.length};}, VIS);};

R.customer = await pickInto('customer|company');
R.customerPick = R.customer.found ? await chooseFirstOption() : {chose:false};
log('customer: %s -> %s', JSON.stringify(R.customer), JSON.stringify(R.customerPick));
await page.waitForTimeout(2500);
R.asset = await pickInto('vehicle|asset|unit');
R.assetPick = R.asset.found ? await chooseFirstOption() : {chose:false};
log('asset: %s -> %s', JSON.stringify(R.asset), JSON.stringify(R.assetPick));
await page.waitForTimeout(2000);
await page.screenshot({path:`${DIR}/evidence/s04-2-filled.png`, fullPage:true});
R.formAfterFill = await describe();
save();

// ---- save, then clear the credit-limit confirmation the playbook warns about
R.save = await afterAction(page, ctx, ()=>clickText(/^(save|create)$/), {label:'Save'});
log('Save -> %s', R.save.summary);
R.confirmScreen = await describe();
if (R.confirmScreen.dialog){
  R.confirm = await clickText(/^(create|continue|yes|ok|proceed)$/);
  log('confirmation "%s" -> %s', R.confirmScreen.heading, JSON.stringify(R.confirm));
  await settle(page,{label:'after confirm'});
}
await page.screenshot({path:`${DIR}/evidence/s04-3-after-save.png`, fullPage:true});

const after = rowsOf((await call('GET','/api/work-orders?limit=100')).json);
const fresh = after.map(w=>w.id).filter(x=>!before.includes(x));
R.created = fresh.map(id=>{const w=after.find(y=>y.id===id); return {id, number:w?.number, status:w?.status};});
R.landedOn = page.url();
log('NEW work orders created: %s', JSON.stringify(R.created));
log('landed on: %s', R.landedOn);
save();
await s.browser.close();
log('done');
