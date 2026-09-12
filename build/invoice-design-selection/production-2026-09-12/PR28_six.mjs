// PRODUCTION -- C53543 (all six customer documents follow the setting) and C53570 (the Legacy
// template's own Authorizer column). Four of the six are already proven; this adds the Parts Sale
// Estimate and hunts the Part Sale Credit.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), docs:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR28.json`, JSON.stringify(R,null,1));
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
const read=async(url,tag,token)=>{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(15000);
  const d=await page.evaluate((tok)=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {onRightPage: tok? t.includes(tok) : true,
      legacyLook:/Remit payment to/i.test(t)&&/Line Total/i.test(t)&&!/ADDRESSES/.test(t),
      modernLook:/ADDRESSES|WORK PERFORMED|WORK SUMMARY/.test(t),
      authorizer:/Authorizer/i.test(t),
      documentRendered:/Bill To|BILL TO|Remit payment to|ADDRESSES/i.test(t),
      docNo:[...new Set(t.match(/\b(?:INV|EST|CM|P\d?)-[A-Z0-9-]+/g)||[])].sort(),
      money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), len:t.length};}, token||null);
  await page.screenshot({path:`${EV}/PR28-${tag}.png`, fullPage:true});
  return d;
};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// subjects
const ps=rowsOf((await call('/api/part-sales?limit=100')).j);
const psEst=ps.find(p=>/estimate/i.test(String(p.status||'')));
const psInv=ps.find(p=>/invoiced|paid/i.test(String(p.status||'')));
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const inv=wos.find(w=>/invoiced|paid/i.test(String(w.status||'')));
R.subjects={partSaleEstimate:psEst&&{n:psEst.number,id:psEst.id,st:psEst.status},
            partSaleInvoice:psInv&&{n:psInv.number,id:psInv.id,st:psInv.status},
            workOrder:inv&&{n:inv.number,id:inv.id,st:inv.status}};
L('subjects %s', JSON.stringify(R.subjects));
save();
const targets=[];
if(psEst) targets.push(['partSaleEstimate', `${APP}/parts/part-sale/${psEst.id}/finance`, psEst.number]);
if(psInv) targets.push(['partSaleInvoice',  `${APP}/parts/part-sale/${psInv.id}/finance`, psInv.number]);
if(inv)   targets.push(['workOrderInvoice', `${APP}/workorders/${inv.id}/finance`, inv.number]);
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  R.docs[want]={};
  for(const [tag,url,token] of targets){
    const b4=await stored(); const d=await read(url, `${want}-${tag}`, token); const af=await stored();
    if(b4!==af){ R.drift.push({tag,b4,af}); L('  !! drift on %s', tag); continue; }
    R.docs[want][tag]=d;
    L('  %-18s onPage=%s rendered=%s legacy=%s modern=%s authorizer=%s docs=%s',
      tag, d.onRightPage, d.documentRendered, d.legacyLook, d.modernLook, d.authorizer, JSON.stringify(d.docNo));
  }
  save();
}
R.compare={};
for(const tag of Object.keys(R.docs.legacy||{})){
  const a=R.docs.legacy[tag], b=(R.docs.modern||{})[tag]; if(!a||!b) continue;
  R.compare[tag]={followedTheSetting:a.legacyLook&&b.modernLook,
    docsSame:JSON.stringify(a.docNo)===JSON.stringify(b.docNo),
    moneySame:JSON.stringify(a.money)===JSON.stringify(b.money),
    authorizerLegacy:a.authorizer, authorizerModern:b.authorizer};
  L('COMPARE %-18s followed=%s docsSame=%s moneySame=%s authorizer L/M=%s/%s',
    tag, R.compare[tag].followedTheSetting, R.compare[tag].docsSame, R.compare[tag].moneySame,
    a.authorizer, b.authorizer);
}
L('design left at %s | drift %d', await stored(), R.drift.length);
save(); L('done'); await browser.close(); process.exit(0);
