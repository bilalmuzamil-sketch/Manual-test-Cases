// PRODUCTION -- C53568. The import posted to /api/imports/work-order-historical but nothing showed on
// the customer. Did it land at all? Search work orders and the import screen's Preview tab before
// concluding anything -- most likely my CSV was short of a required column, not the feature failing.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR64.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
// 1. does a work order carrying the tag exist?
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
R.steps.tagged=wos.filter(w=>/ZZAUTOTEST|IMP-001/i.test(JSON.stringify(w))).map(w=>({n:w.number,st:w.status}));
R.steps.total=wos.length;
L('work orders %d | carrying the tag: %s', wos.length, JSON.stringify(R.steps.tagged));
// 2. the Preview tab on the import screen
await page.goto(`${APP}/administration/invoices-import`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
const prev=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const t=[...document.querySelectorAll('*')].filter(ok).find(e=>/^Preview$/i.test((e.textContent||'').trim()));
  if(!t) return false; t.click(); return true;});
L('Preview tab clicked: %s', prev);
await page.waitForTimeout(11000);
await page.screenshot({path:`${EV}/PR64-preview.png`, fullPage:true});
R.steps.preview=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {hasTag:t.includes('ZZAUTOTEST'),
    rows:[...document.querySelectorAll('tr')].filter(ok).map(tr=>(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,110)).slice(0,10),
    msg:(t.match(/(skipped|error|invalid|missing|failed|imported|no data|empty)[^.]{0,130}/i)||[])[0]||null,
    body:t.slice(t.indexOf('Invoices Import'), t.indexOf('Invoices Import')+420)};});
L('preview tab: tag=%s msg=%s', R.steps.preview.hasTag, R.steps.preview.msg);
L('  rows: %s', JSON.stringify(R.steps.preview.rows));
L('  body: %s', (R.steps.preview.body||'').slice(0,320));
save();
// 3. global search for the tag
await page.goto(`${APP}/workorders?search=ZZAUTOTEST`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(11000);
R.steps.search=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {hasTag:t.includes('ZZAUTOTEST'), head:t.slice(0,200)};});
L('work-order search for the tag: %s', JSON.stringify(R.steps.search).slice(0,200));
save(); await browser.close();
