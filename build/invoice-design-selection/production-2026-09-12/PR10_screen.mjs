// PRODUCTION -- captured THROUGH THE SCREEN, because an estimate that was never invoiced has no
// invoice id and the preview route cannot be called for it. This is also what the in-app cases
// are actually about: what the shop sees on the Finance tab and on a part sale.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), subjects:{}, cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR10.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const look=async(url, tag, waitMs=16000)=>{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(waitMs);
  const d=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {len:t.length,
      legacyMarkers:{remit:/Remit payment to/.test(t), lineTotal:/Line Total/.test(t)},
      modernMarkers:{addresses:/\bAddresses\b/.test(t), workPerformed:/\bWork Performed\b/.test(t), summary:/\bSummary\b/.test(t)},
      docNo:[...new Set(t.match(/\b(?:INV|EST|CM|P\d?)-[A-Z0-9-]+/g)||[])].sort(),
      money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(),
      payments:/\bPayments\b/.test(t), balance:/\bBalance\b/.test(t),
      documentRendered:/Bill To|BILL TO|Remit payment to|Addresses/.test(t),
      head:t.slice(0,200)};});
  await page.screenshot({path:`${EV}/PR10-${tag}.png`, fullPage:true});
  return d;
};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);
// subjects
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const est=wos.find(w=>/estimate/i.test(String(w.status||'')));
const inv=wos.find(w=>/invoiced/i.test(String(w.status||'')));
const paid=wos.find(w=>/paid/i.test(String(w.status||'')));
const ps=rowsOf((await call('/api/part-sales?limit=50')).j);
const psDone=ps.find(p=>/complete|invoiced/i.test(String(p.status||'')))||ps[0];
R.subjects={estimate:est&&{n:est.number,id:est.id,st:est.status}, invoiced:inv&&{n:inv.number,id:inv.id,st:inv.status},
  paid:paid&&{n:paid.number,id:paid.id,st:paid.status}, partSale:psDone&&{n:psDone.number,id:psDone.id,st:psDone.status}};
L('subjects: %s', JSON.stringify(R.subjects));
save();
const targets=[];
if(est)   targets.push(['estimate-finance',   `${APP}/workorders/${est.id}/finance`]);
if(inv)   targets.push(['invoiced-finance',   `${APP}/workorders/${inv.id}/finance`]);
if(paid)  targets.push(['paid-finance',       `${APP}/workorders/${paid.id}/finance`]);
if(psDone)targets.push(['partsale',           `${APP}/parts/part-sales/${psDone.id}`]);
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want) continue;
  R.cap[want]={};
  for(const [tag,url] of targets){
    const b4=await stored();
    const d=await look(url, `${want}-${tag}`);
    const af=await stored();
    if(b4!==af){ R.drift.push({tag,b4,af}); L('   !! drift on %s - discarded', tag); continue; }
    R.cap[want][tag]=d;
    L('  %-18s doc=%s rendered=%s legacy(remit=%s,lineTotal=%s) modern(addr=%s,work=%s) money=%d',
      tag, JSON.stringify(d.docNo), d.documentRendered, d.legacyMarkers.remit, d.legacyMarkers.lineTotal,
      d.modernMarkers.addresses, d.modernMarkers.workPerformed, d.money.length);
  }
  save();
}
R.compare=[];
for(const tag of Object.keys(R.cap.legacy||{})){
  const a=R.cap.legacy[tag], b=(R.cap.modern||{})[tag];
  if(!a||!b) continue;
  const sa=new Set(a.money), sb=new Set(b.money);
  R.compare.push({tag, bothRendered:a.documentRendered&&b.documentRendered,
    legacyLooksLegacy:a.legacyMarkers.remit||a.legacyMarkers.lineTotal,
    modernLooksModern:b.modernMarkers.addresses||b.modernMarkers.workPerformed,
    changed:(a.legacyMarkers.remit!==b.legacyMarkers.remit)||(a.modernMarkers.addresses!==b.modernMarkers.addresses)||(a.len!==b.len),
    docsSame:JSON.stringify(a.docNo)===JSON.stringify(b.docNo),
    moneySame:JSON.stringify(a.money)===JSON.stringify(b.money),
    onlyLegacy:[...sa].filter(x=>!sb.has(x)), onlyModern:[...sb].filter(x=>!sa.has(x)),
    paymentsL:a.payments, paymentsM:b.payments, balanceL:a.balance, balanceM:b.balance});
}
for(const c of R.compare) L('COMPARE %-18s rendered:%s changed:%s legacy-look:%s modern-look:%s docs same:%s money same:%s only-legacy:%s',
  c.tag, c.bothRendered, c.changed, c.legacyLooksLegacy, c.modernLooksModern, c.docsSame, c.moneySame, JSON.stringify(c.onlyLegacy||[]));
L('drift discards %d | design left at %s', R.drift.length, await stored());
save(); L('done'); await browser.close(); process.exit(0);
