// PRODUCTION -- the in-app print/PDF, the fully paid invoice receipt, and the Authorizer column.
// The print control is clicked the way a person clicks it; whatever it opens is captured with the
// browser's own print engine, which is what "generate a PDF" means to a shop.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR12.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
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
const analyse=(t)=>({ len:t.length,
  legacyTable: /Service Order\s+Terms\s+Due date/i.test(t) || /Parts Total\s+\$/i.test(t),
  modernBlocks: /ADDRESSES/.test(t) || /WORK PERFORMED/.test(t) || /WORK SUMMARY/.test(t) || /SUMMARY/.test(t),
  authorizer: /Authorizer/i.test(t),
  authorizerValue: (t.match(/Authorizer[^A-Za-z0-9]{0,6}([A-Za-z0-9 .,'-]{1,40})/)||[])[1]||null,
  payments: /Payments/i.test(t), balance:(t.match(/Balance[^$]{0,12}(\$-?[\d,]+\.\d{2})/i)||[])[1]||null,
  docNo:[...new Set(t.match(/\b(?:INV|EST|CM|P\d?)-[A-Z0-9-]+/g)||[])].sort(),
  money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort() });
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const paid=wos.find(w=>/paid/i.test(String(w.status||'')));
R.subject={n:paid.number, id:paid.id, st:paid.status}; L('subject: %s', JSON.stringify(R.subject));
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now); if(now!==want) continue;
  const b4=await stored();
  await page.goto(`${APP}/workorders/${paid.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(15000);
  // the paid invoice on screen -- C53540
  const onScreen=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' '));
  const scr=analyse(onScreen);
  await page.screenshot({path:`${EV}/PR12-${want}-onscreen.png`, fullPage:true});
  // the PRINT control, clicked as a person clicks it -- C53564
  const popups=[]; const onPage=p=>popups.push(p); ctx.on('page', onPage);
  const clicked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const b=[...document.querySelectorAll('button,a')].filter(ok).find(e=>{
      const i=e.querySelector('i'); return i && /^print$/i.test((i.innerText||'').trim());});
    if(b){b.click(); return true;} return false;});
  await page.waitForTimeout(9000);
  ctx.off('page', onPage);
  const target = popups.length ? popups[popups.length-1] : page;
  await target.waitForTimeout(5000).catch(()=>{});
  const printUrl = target===page ? '(same tab)' : target.url();
  const printText = await target.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ')).catch(()=>'');
  const pr = analyse(printText);
  let pdfBytes=null;
  try{ await target.emulateMedia({media:'print'});
       await target.pdf({path:`${EV}/PR12-${want}-print.pdf`, format:'Letter', printBackground:true});
       pdfBytes=fs.statSync(`${EV}/PR12-${want}-print.pdf`).size;
       await target.emulateMedia({media:'screen'}); }catch(e){ pr.pdfError=String(e).slice(0,90); }
  await target.screenshot({path:`${EV}/PR12-${want}-print.png`, fullPage:true}).catch(()=>{});
  if(target!==page) await target.close().catch(()=>{});
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift - discarded'); continue; }
  R.cap[want]={onScreen:scr, print:{...pr, url:printUrl, clicked, pdfBytes, popup:popups.length>0}};
  L('  on screen: legacyTable=%s modernBlocks=%s payments=%s balance=%s docs=%s',
    scr.legacyTable, scr.modernBlocks, scr.payments, scr.balance, JSON.stringify(scr.docNo));
  L('  print: clicked=%s newTab=%s url=%s legacyTable=%s modernBlocks=%s authorizer=%s pdfBytes=%s',
    clicked, popups.length>0, String(printUrl).slice(0,70), pr.legacyTable, pr.modernBlocks, pr.authorizer, pdfBytes);
  save();
}
const a=R.cap.legacy, b=R.cap.modern;
if(a&&b){
  R.verdict={
    onScreenChanged: a.onScreen.legacyTable!==b.onScreen.legacyTable || a.onScreen.modernBlocks!==b.onScreen.modernBlocks,
    printChanged: a.print.legacyTable!==b.print.legacyTable || a.print.modernBlocks!==b.print.modernBlocks || a.print.len!==b.print.len,
    paidReceipt:{legacyBalance:a.onScreen.balance, modernBalance:b.onScreen.balance,
      legacyPayments:a.onScreen.payments, modernPayments:b.onScreen.payments},
    authorizer:{legacy:a.print.authorizer, modern:b.print.authorizer,
      legacyValue:a.print.authorizerValue, modernValue:b.print.authorizerValue},
    docsSame: JSON.stringify(a.print.docNo)===JSON.stringify(b.print.docNo),
    moneySame: JSON.stringify(a.print.money)===JSON.stringify(b.print.money)};
  L('VERDICT: %s', JSON.stringify(R.verdict,null,1));
}
L('drift %d | design left at %s', R.drift.length, await stored());
save(); L('done'); await browser.close(); process.exit(0);
