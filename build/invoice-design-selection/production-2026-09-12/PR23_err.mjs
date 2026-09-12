// Does the Finance tab error on S1-860 depend on the DESIGN, or on that record?
// Positive control in the same pass: S2-847, which renders fine, under both designs.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), grid:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR23.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const SUBJ=[['S1-860','f7fc549d-5b80-439b-b610-a64fdabe8c68'],['S2-847','f3094a96-24f4-42b6-85bf-678168d23e65']];
const look=async(id,tag)=>{
  await page.goto(`${APP}/workorders/${id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(17000);
  const d=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {errorToast:/Ooooops! An error occurred/i.test(t),
      errorCount:(t.match(/Ooooops! An error occurred/gi)||[]).length,
      requestIds:(t.match(/request ID: \[([0-9a-f-]+)\]/gi)||[]).slice(0,3),
      documentRendered:/Bill To|BILL TO|Remit payment to|ADDRESSES/.test(t),
      docNo:(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/)||[])[0]||null, len:t.length};});
  await page.screenshot({path:`${EV}/PR23-${tag}.png`, fullPage:true});
  return d;
};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  R.grid[want]={};
  for(const [n,id] of SUBJ){
    const b4=await stored();
    const d=await look(id, `${want}-${n}`);
    const af=await stored();
    if(b4!==af){ L('  !! drift on %s - discarded', n); continue; }
    R.grid[want][n]=d;
    L('  %-8s error=%s (x%d) documentRendered=%s doc=%s', n, d.errorToast, d.errorCount, d.documentRendered, d.docNo);
  }
  save();
}
const g=R.grid;
if(g.legacy&&g.modern){
  R.verdict={
    'S1-860 errors on legacy': g.legacy['S1-860'] && g.legacy['S1-860'].errorToast,
    'S1-860 errors on modern': g.modern['S1-860'] && g.modern['S1-860'].errorToast,
    'S2-847 errors on legacy': g.legacy['S2-847'] && g.legacy['S2-847'].errorToast,
    'S2-847 errors on modern': g.modern['S2-847'] && g.modern['S2-847'].errorToast,
    'dependsOnDesign': !!(g.legacy['S1-860'] && g.modern['S1-860'] &&
       g.legacy['S1-860'].errorToast !== g.modern['S1-860'].errorToast)};
  L('VERDICT %s', JSON.stringify(R.verdict,null,1));
}
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
