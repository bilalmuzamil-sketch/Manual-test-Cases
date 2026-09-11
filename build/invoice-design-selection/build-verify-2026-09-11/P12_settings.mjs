// The settings surface: where the value is stored, what the default is, who can see it,
// what happens when the save fails, and whether any second copy of the choice exists.
// Covers C53521, C53522, C53523, C53529, C53533, C53542.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P12.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,''),body:(r.postData()||'').slice(0,300)});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,400)};},{api:API,m,p,b:b||null});
const openInvoiceTab=async()=>{ await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5500);
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(4500); };
const currentDesign=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
  const i=f&&f.querySelector('input'); return i?i.value:null;},VIS);
const armToasts=()=>page.evaluate(()=>{ window.__toasts=[];
  const grab=()=>{ for(const n of document.querySelectorAll('.q-notification, .q-notifications__list *, [role=alert]')){
    const t=(n.innerText||'').replace(/\s+/g,' ').trim(); if(t&&t.length>8&&!window.__toasts.includes(t)) window.__toasts.push(t);} };
  if(window.__toastTimer) clearInterval(window.__toastTimer);
  window.__toastTimer=setInterval(grab,200); grab(); });
const toasts=()=>page.evaluate(()=>window.__toasts||[]);

// ---------- 1. where the value lives, and what the app calls to read/write it ----------
seen(); await openInvoiceTab();
R.readCalls=seen().filter(c=>/setting|organi|invoice|design|config/i.test(c.u));
R.designAsFound=await currentDesign();
log('design as found:',R.designAsFound);
log('calls the Invoice tab makes:',R.readCalls.map(c=>c.m+' '+c.u));
R.readCalls.push({m:'GET',u:'/api/organizations/invoice-settings/view'});
for (const c of R.readCalls){
  const r=await call('GET',c.u);
  if(r.status===200){ const flat=JSON.stringify(r.json);
    const hits=(flat.match(/"[a-z_A-Z]*(design|legacy|layout)[a-z_A-Z]*"\s*:\s*("[^"]{0,30}"|[a-z0-9]{1,10})/g)||[]);
    if(hits.length){ R.storageKey=R.storageKey||{path:c.u,hits}; log('  DESIGN VALUE at',c.u,hits.slice(0,5)); } }
}
save();

// ---------- 2. C53521 -- the same one setting on every location ----------
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const places=rowsOf((await call('GET','/api/staff/my-workplaces')).json);
R.locations=places.map(p=>({id:p.id,name:p.name}));
log('locations on this shop:',R.locations.map(l=>l.name));
R.perLocation={};
R.perLocation['(as found)']={location:await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim())
    .find(t=>/Staging .* - \d+/.test(t)); return b||null;},VIS), design:R.designAsFound};
// switch workplace through the top bar
for (const loc of R.locations){
  const clicked=await page.evaluate(({vis,name})=>{const isVis=eval(vis);
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const sw=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/Staging .* - \d+/.test(t(e)));
    if(sw){sw.click(); return t(sw);} return null;},{vis:VIS,name:loc.name});
  await page.waitForTimeout(2500);
  const picked=await page.evaluate(({vis,name})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option],.q-list .q-item')].filter(isVis).find(e=>t(e).includes(name));
    if(o){o.click(); return t(o);} return null;},{vis:VIS,name:loc.name});
  await page.waitForTimeout(7000);
  await openInvoiceTab();
  const d=await currentDesign();
  R.perLocation[loc.name]={switcherLabel:clicked, picked, design:d};
  log('  on location "%s": design reads %s (picked: %s)', loc.name, d, picked);
  await page.screenshot({path:`${DIR}/evidence/P12-loc-${loc.name.replace(/\W+/g,'_')}.png`});
}
save();

// ---------- 3. C53522/53523 -- what is the DEFAULT for an org that never set it? ----------
R.defaults={};
for (const p of ['/api/organization/feature-flags','/api/organizations','/api/auth/me','/api/auth/me/fe-permissions']){
  const r=await call('GET',p); if(r.status!==200) continue;
  const flat=JSON.stringify(r.json);
  const hits=(flat.match(/"[a-zA-Z_]*(design|legacy|layout)[a-zA-Z_]*"\s*:\s*("[^"]{0,30}"|[a-z0-9]{1,10})/g)||[]);
  if(hits.length){R.defaults[p]=hits; log('design-ish in',p,hits.slice(0,4));}
}
// can a new organization be created from this app at all?
R.orgCreate={};
for (const u of ['/administration/organization','/organizations/new','/administration/organizations']){
  await page.goto(APP+u,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(5000);
  const controls=await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('button,.q-btn,input,select')].filter(isVis).length;},VIS);
  const t=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,200));
  R.orgCreate[u]={controls, text:t}; log('org route',u,'controls='+controls, t.slice(0,90));
}
save();

// ---------- 4. C53542 -- is there a per-document design choice anywhere? ----------
const woId='04ab678b-a2c2-4fd7-bcd9-76b6a23a419f';
seen(); await page.goto(`${APP}/workorders/${woId}/finance`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
R.financeCalls=seen().map(c=>c.m+' '+c.u).filter(u=>/setting|invoice|design/i.test(u));
// the per-invoice settings dialog the Finance tab loads
const invSettings=await call('GET',`/api/invoices/${woId}/settings/view`);
R.invoiceSettings={status:invSettings.status,
  keys:Object.keys((invSettings.json&&(invSettings.json.data||invSettings.json))||{}),
  designHits:(JSON.stringify(invSettings.json).match(/"[a-zA-Z_]*(design|legacy|layout|template)[a-zA-Z_]*"\s*:\s*("[^"]{0,30}"|[a-z0-9]{1,10})/g)||[])};
log('per-invoice settings keys:',R.invoiceSettings.keys);
log('per-invoice design-ish:',R.invoiceSettings.designHits);
// open the document Settings button and enumerate every control inside it (POSITIVE CONTROL: the dialog must open)
const opened=await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis)
    .find(e=>(e.getAttribute('aria-label')||'')==='Settings'||/^settings$/i.test((e.innerText||'').trim()));
  if(b){b.click(); return true;} return false;},VIS);
await page.waitForTimeout(4000);
R.docSettingsDialog={opened, controls: await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog,.q-menu')].filter(isVis).pop();
  if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,900),
    items:[...d.querySelectorAll('.q-item,label,button,input')].map(e=>((e.innerText||e.value||'').replace(/\s+/g,' ').trim())).filter(Boolean).slice(0,40)};},VIS)};
log('document settings dialog opened:',opened);
log('  contents:',JSON.stringify(R.docSettingsDialog.controls).slice(0,600));
await page.screenshot({path:`${DIR}/evidence/P12-doc-settings.png`});
save();

// ---------- 5. C53533 -- make the save fail, and read the toast from the moment of the click ----------
await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
await openInvoiceTab();
const before=await currentDesign(); const target = before==='Legacy'?'Modern':'Legacy';
R.failTest={before, target};
// find the save route first by watching a real save? no -- block ANY non-GET to the settings API
await page.route('**/*', async route=>{
  const r=route.request();
  if(r.method()!=='GET' && /sv9872api\.qa\.shopview\.com\/api\/.*(setting|organi|invoice)/i.test(r.url())){
    R.failTest.blocked=(R.failTest.blocked||[]).concat(r.method()+' '+r.url().replace(/^https?:\/\/[^/]+/,''));
    return route.fulfill({status:500,contentType:'application/json',body:'{"message":"forced failure for test"}'});
  }
  return route.continue();
});
await armToasts();
await page.evaluate(vis=>{const isVis=eval(vis);
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
  if(f)(f.querySelector('input')||f).click();},VIS);
await page.waitForTimeout(1800);
await page.evaluate(({vis,want})=>{const isVis=eval(vis);
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis).find(e=>new RegExp(want,'i').test(e.innerText||''));
  if(o)o.click();},{vis:VIS,want:target});
await page.waitForTimeout(2200);
await page.evaluate(({vis,want})=>{const isVis=eval(vis);const t=e=>(e.innerText||'').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d)return;
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>new RegExp('switch to '+want,'i').test(t(e))); if(b)b.click();},{vis:VIS,want:target});
await page.waitForTimeout(2500);
R.failTest.toastsAt2s=await toasts();
await page.screenshot({path:`${DIR}/evidence/P12-failed-save-2s.png`});
await page.waitForTimeout(10000);
R.failTest.toastsAt12s=await toasts();
R.failTest.stillOnScreenAt12s=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());},VIS);
R.failTest.hasCloseButton=await page.evaluate(vis=>{const isVis=eval(vis);
  const n=[...document.querySelectorAll('.q-notification')].filter(isVis).pop();
  return n?[...n.querySelectorAll('button,.q-btn,i')].map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()).filter(Boolean):null;},VIS);
R.failTest.valueAfter=await currentDesign();
await page.screenshot({path:`${DIR}/evidence/P12-failed-save-12s.png`});
log('FORCED-FAILURE: blocked=%s', JSON.stringify(R.failTest.blocked));
log('  toasts at 2s :',R.failTest.toastsAt2s);
log('  toasts at 12s:',R.failTest.toastsAt12s);
log('  still on screen at 12s:',R.failTest.stillOnScreenAt12s);
log('  close button :',R.failTest.hasCloseButton);
log('  value after  :',R.failTest.valueAfter,'(was',before+')');
await page.unroute('**/*');
save();
// reload and confirm the value really did not save
await openInvoiceTab(); R.failTest.valueAfterReload=await currentDesign();
log('  value after reload:',R.failTest.valueAfterReload);
save();
log('done'); await s.browser.close(); process.exit(0);
