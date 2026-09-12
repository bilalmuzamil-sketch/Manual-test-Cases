// PRODUCTION RECON -- READ ONLY. Nothing is created, changed or deleted by this probe.
// Purpose: prove access, record the build marker, establish whether the Invoice Design Selection
// feature has landed yet, and inventory the documents each case in the suite will need. Everything
// here is independent of the feature being live, so it can be done BEFORE the deploy.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={readOnly:true, at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR1.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,4000)};},{a:APIH,m,p,b:b||null});

R.url=page.url();
R.signedIn=await page.evaluate(()=>{try{return !!localStorage.getItem('user');}catch(e){return false;}});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
L('landed %s | signed in %s | build %s', R.url.slice(0,60), R.signedIn, R.build);

// 1. HAS THE FEATURE LANDED? -- the exact endpoint the setting lives behind on staging
const st=await api('GET','/api/organizations/invoice-settings/view');
R.invoiceSettings={status:st.s};
try{ const d=JSON.parse(st.t).data||{}; R.invoiceSettings.keys=Object.keys(d); R.invoiceSettings.documentDesign=d.documentDesign??null; }
catch(e){ R.invoiceSettings.body=st.t.slice(0,200); }
R.featureLive = R.invoiceSettings.documentDesign!==undefined && R.invoiceSettings.documentDesign!==null;
L('invoice-settings %s | documentDesign = %s | FEATURE LIVE: %s',
  st.s, R.invoiceSettings.documentDesign, R.featureLive);
L('   keys: %s', JSON.stringify(R.invoiceSettings.keys));

// 2. WHERE ARE WE -- org, workplaces
const od=await api('GET','/api/organization/organization-details/view');
try{ const d=JSON.parse(od.t).data||JSON.parse(od.t); R.org={name:d.name,id:d.id,taxCode:d.tax_code||d.taxCode||null}; }
catch(e){ R.org={status:od.s, body:od.t.slice(0,160)}; }
L('organisation: %s', JSON.stringify(R.org));
const ff=await api('GET','/api/organization/feature-flags' + (R.org&&R.org.id?`?organization_id=${R.org.id}`:''));
try{ const d=JSON.parse(ff.t); R.featureFlags=(d.data||d); }catch(e){ R.featureFlags={status:ff.s}; }
L('feature flags: %s', JSON.stringify(R.featureFlags).slice(0,300));
save();
L('--- recon part 1 done, browser left open for part 2');
fs.writeFileSync(`${DIR}/.session-open`,'1');
await browser.close();
process.exit(0);
