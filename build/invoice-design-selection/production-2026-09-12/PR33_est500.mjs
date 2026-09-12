// PRODUCTION -- the finance screen of estimate job S1-860 posts /api/work-orders/invoices/estimate
// and gets HTTP 500 twice. Rule 104: prove the instrument before any negative claim. Positive
// control = the SAME screen on an INVOICED job, plus four more estimate jobs, all through the UI.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), purpose:'positive control for the estimate-document 500', jobs:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR33.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.design=(await call('/api/organizations/invoice-settings/view')).j?.data?.documentDesign;
L('build %s design %s', R.build, R.design);
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
const est=wos.filter(w=>/estimate/i.test(String(w.status||''))).slice(0,5);
const inv=wos.filter(w=>/invoiced|paid/i.test(String(w.status||''))).slice(0,2);
const subjects=[...est.map(w=>({...w,kind:'estimate'})), ...inv.map(w=>({...w,kind:'invoiced'}))];
L('subjects: %s', JSON.stringify(subjects.map(s=>`${s.number}/${s.kind}`)));
let cap=[];
page.on('request', r=>{ if(/\/api\/work-orders\/invoices\/estimate/.test(r.url())) cap.push({m:r.method(), body:(r.postData()||'').slice(0,400)}); });
page.on('response', async r=>{ if(/\/api\/work-orders\/invoices\/estimate/.test(r.url())){
  try{ const t=await r.text(); const last=cap[cap.length-1]||{}; last.s=r.status(); last.resp=t.slice(0,300); }catch(e){} }});
for(const s of subjects){
  cap=[];
  await page.goto(`${APP}/workorders/${s.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(13000);
  const scr=await page.evaluate((n)=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {onRecord:t.includes(n), len:t.length,
      errorToast:/error occurred|sorry for this inconvenience|went wrong/i.test(t),
      hasPrint:!!document.querySelector('[data-test-id="button_print_invoice"]'),
      snippet:t.slice(0,200)};}, s.number);
  await page.screenshot({path:`${EV}/PR33-${s.number}.png`, fullPage:true});
  R.jobs[s.number]={kind:s.kind, id:s.id, onRecord:scr.onRecord, errorToast:scr.errorToast,
    hasPrint:scr.hasPrint, calls:cap.map(c=>({m:c.m, s:c.s, body:c.body, resp:(c.resp||'').slice(0,160)}))};
  L('%-8s %-9s onRecord=%s print=%s calls=%s statuses=%s', s.number, s.kind, scr.onRecord, scr.hasPrint,
    cap.length, JSON.stringify(cap.map(c=>c.s)));
  save();
}
save(); await browser.close();
