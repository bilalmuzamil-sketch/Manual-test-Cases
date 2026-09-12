// PRODUCTION RECON -- READ ONLY. Nothing is created, changed or deleted.
// Answers, in order: can I get in · what can this account DO · has the feature landed ·
// what paperwork already exists for the suite. All of it is independent of the feature,
// so it can be done before the deploy.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true, at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR1.json`, JSON.stringify(R,null,1));
const boot=await bootProdLogin('/');
const { browser, page } = boot;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,6000)};},{a:APIH,m,p,b:b||null});

R.url=page.url(); R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.signedIn=await page.evaluate(()=>{try{return !!localStorage.getItem('user');}catch(e){return false;}});
L('landed %s | signed in %s | build %s', R.url.slice(0,60), R.signedIn, R.build);

// --- WHAT CAN THIS ACCOUNT DO?  the thing that decides whether the run is even possible
const w=await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null');}catch(e){return null;}});
R.role = w ? {template_slug:w.template_slug, system_role:w.system_role, view_mode:w.view_mode,
              nPerms:(w.fe_permissions||[]).length} : null;
L('role: %s', JSON.stringify(R.role));
const perms=(w&&w.fe_permissions)||[];
const need=['setting','invoice','workorder','work_order','part','customer','credit','report'];
R.permsMatching={};
for(const k of need) R.permsMatching[k]=perms.filter(p=>String(p).toLowerCase().includes(k)).slice(0,12);
L('permissions mentioning settings : %s', JSON.stringify(R.permsMatching.setting));
L('permissions mentioning invoice  : %s', JSON.stringify(R.permsMatching.invoice));
L('permissions mentioning parts    : %s', JSON.stringify(R.permsMatching.part).slice(0,200));
R.allPerms=perms;
save();

// --- CAN IT REACH THE SETTING?
const st=await api('GET','/api/organizations/invoice-settings/view');
R.invoiceSettings={status:st.s};
try{ const d=JSON.parse(st.t).data||{}; R.invoiceSettings.keys=Object.keys(d); R.invoiceSettings.documentDesign=d.documentDesign??null; }
catch(e){ R.invoiceSettings.body=st.t.slice(0,220); }
R.featureLive = R.invoiceSettings.documentDesign!==undefined && R.invoiceSettings.documentDesign!==null;
L('invoice-settings %s | documentDesign=%s | FEATURE LIVE: %s | keys=%s',
  st.s, R.invoiceSettings.documentDesign, R.featureLive, JSON.stringify(R.invoiceSettings.keys));

// --- WHO ARE WE
const od=await api('GET','/api/organization/organization-details/view');
try{ const d=JSON.parse(od.t).data||JSON.parse(od.t); R.org={name:d.name,id:d.id,tax:d.tax_code||null}; }
catch(e){ R.org={status:od.s,body:od.t.slice(0,160)}; }
L('organisation: %s', JSON.stringify(R.org));
save();
await page.screenshot({path:`${DIR}/PR1-landing.png`, fullPage:true});
L('done part 1');
await browser.close(); process.exit(0);
