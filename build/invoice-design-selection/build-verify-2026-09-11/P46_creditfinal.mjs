// C53536 / C53537 / C53538: the credit memo documents CM-103 and CM-104 rendered under both designs.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APIH='sv9872api.qa.shopview.com', APP='https://sv9872.qa.shopview.com';
const CM=[{num:'CM-103',id:'a1958982-7b5f-4d34-bdce-8facc1f0c15e'},{num:'CM-104',id:'f90a7628-f520-468e-86fc-81a5a54a6f5a'}];
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P46.json`, JSON.stringify(R,null,1));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const C=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9872-full.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true});
await ctx.addCookies([
 {name:'sv_sso_session',value:C.sv_sso_session,domain:'sv9872.qa.shopview.com',path:'/',secure:true},
 {name:'sv_sso_session',value:C.sv_sso_session,domain:APIH,path:'/',secure:true},
 {name:'PHPSESSID',value:C.PHPSESSID,domain:'sv9872.qa.shopview.com',path:'/',secure:true},
 {name:'PHPSESSID',value:C.PHPSESSID,domain:APIH,path:'/',secure:true},
 {name:'cf_clearance',value:C.cf_clearance,domain:'.shopview.com',path:'/',secure:true}]);
const page=await ctx.newPage();
await page.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(5000);
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:APIH,m,p,b:b||null});
const bin=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  const ab=await r.arrayBuffer(); const u=new Uint8Array(ab); let s=''; for(let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]);
  return {status:r.status,len:u.length,ctype:r.headers.get('content-type'),body:s};},{a:APIH,p});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w});
  return await stored(); };

R.found=await stored(); log('design as found:', R.found);
R.renders={};
for(const want of ['legacy','modern']){
  const now=await setDesign(want); log('=== design now: %s', now);
  if(now!==want){ log('   could not set - skipping'); continue; }
  R.renders[want]={};
  for(const c of CM){
    const a=await stored();
    const r=await bin(`/api/credit-memos/${c.id}/pdf`);
    const b=await stored();
    if(a!==b){ R.guardDiscards.push({cm:c.num,before:a,after:b}); log('   DISCARDED %s (%s->%s)', c.num, a, b); continue; }
    R.renders[want][c.num]={design:a,status:r.status,len:r.len,ctype:r.ctype};
    if(r.status===200) fs.writeFileSync(`${DIR}/evidence/P46-${want}-${c.num}.pdf`, Buffer.from(r.body,'binary'));
    log('   %s under %s: HTTP %s, %d bytes, %s', c.num, want, r.status, r.len, r.ctype);
  }
  save();
}
R.compare=CM.map(c=>{
  const L=(R.renders.legacy||{})[c.num], M=(R.renders.modern||{})[c.num];
  if(!L||!M||L.status!==200||M.status!==200) return {cm:c.num, note:'not rendered under both', L:L&&L.status, M:M&&M.status};
  return {cm:c.num, legacyBytes:L.len, modernBytes:M.len, differs:L.len!==M.len, bothPdf:/pdf/.test(L.ctype||'')&&/pdf/.test(M.ctype||'')};
});
for(const c of R.compare) log('COMPARE %s', JSON.stringify(c));
save();
R.restored=await setDesign(R.found); log('restored to:', R.restored);
log('guard discards:', R.guardDiscards.length);
save(); log('done'); await browser.close(); process.exit(0);
