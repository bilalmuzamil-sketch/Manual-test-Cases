// PRODUCTION -- credit documents under both designs, captured as the real PDF the row's print action
// produces. Also hunts for the part sale credit CM2-4398 the QA lead seeded.
import fs from 'fs';
import { execSync } from 'child_process';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), cap:{}, drift:[], credits:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR15.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const pdfText=(p)=>{try{return execSync(`python3 -c "import pymupdf,sys;d=pymupdf.open(sys.argv[1]);print(chr(10).join(pg.get_text() for pg in d))" "${p}"`,{encoding:'utf8'});}catch(e){return '';}};
const openList=async()=>{ await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(15000);
  for(let i=0;i<6;i++){ await page.evaluate(()=>{const sc=[...document.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+50&&e.clientHeight>200);
    if(sc) sc.scrollTop=sc.scrollHeight; window.scrollTo(0,document.body.scrollHeight);}); await page.waitForTimeout(1500);} };
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design %s', R.build, R.found);
await openList();
R.credits=await page.evaluate(()=>[...document.querySelectorAll('tr,[role=row]')]
  .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>/\bCredit\b/.test(t)).slice(0,10));
L('credit rows found: %d', R.credits.length); R.credits.forEach(c=>L('   %s', c.slice(0,100)));
save();
const NUM = (R.credits[0]||'').match(/CM\d?-\d+/);
if(!NUM){ L('no credit row - stopping'); save(); await browser.close(); process.exit(1); }
R.subject=NUM[0]; L('subject credit: %s', R.subject);
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  const b4=await stored();
  await openList();
  const popups=[]; const on=p=>popups.push(p); ctx.on('page', on);
  const clicked=await page.evaluate((num)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const tr=[...document.querySelectorAll('tr,[role=row]')].find(r=>(r.innerText||'').includes(num));
    if(!tr) return 'row not found';
    const b=[...tr.querySelectorAll('button,a,i')].filter(ok).find(e=>/^print$/i.test((e.innerText||'').trim()));
    if(b){ (b.closest('button')||b).click(); return 'clicked print'; }
    return 'no print control in the row';}, R.subject);
  L('  %s', clicked);
  await page.waitForTimeout(10000); ctx.off('page', on);
  const t=popups[popups.length-1];
  if(!t){ L('  no new tab'); R.cap[want]={note:'no new tab from the print action', clicked}; save(); continue; }
  const url=t.url();
  const blob=await t.evaluate(async(u)=>{const r=await fetch(u); const b=await r.blob(); const buf=await b.arrayBuffer();
    let s=''; const v=new Uint8Array(buf); for(let i=0;i<v.length;i++) s+=String.fromCharCode(v[i]);
    return {b64:btoa(s), type:b.type, size:b.size};}, url).catch(e=>({err:String(e).slice(0,80)}));
  if(blob&&blob.b64){
    const f=`${EV}/PR15-${want}-credit.pdf`; fs.writeFileSync(f, Buffer.from(blob.b64,'base64'));
    const txt=pdfText(f).replace(/\s+/g,' ');
    R.cap[want]={type:blob.type, bytes:blob.size, chars:txt.length,
      legacyLook:/Remit payment to/i.test(txt)&&!/ADDRESSES/.test(txt),
      modernLook:/ADDRESSES|SUMMARY|WORK PERFORMED/.test(txt),
      disclaimer:/warrant|disclaimer/i.test(txt),
      docNo:[...new Set(txt.match(/\b(?:INV|EST|CM|P\d?)-[A-Z0-9-]+/g)||[])].sort(),
      money:[...new Set(txt.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), head:txt.slice(0,220)};
    L('  pdf bytes=%d chars=%d legacyLook=%s modernLook=%s docs=%s money=%s',
      blob.size, txt.length, R.cap[want].legacyLook, R.cap[want].modernLook,
      JSON.stringify(R.cap[want].docNo), JSON.stringify(R.cap[want].money));
    L('  head: %s', R.cap[want].head.slice(0,160));
  } else { L('  blob read failed: %s', JSON.stringify(blob)); R.cap[want]={err:blob}; }
  await t.close().catch(()=>{});
  const af=await stored(); if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift'); }
  save();
}
const a=R.cap.legacy,b=R.cap.modern;
if(a&&b&&a.bytes&&b.bytes) L('VERDICT designChanged=%s docsSame=%s moneySame=%s',
  a.legacyLook!==b.legacyLook||a.modernLook!==b.modernLook||a.bytes!==b.bytes,
  JSON.stringify(a.docNo)===JSON.stringify(b.docNo), JSON.stringify(a.money)===JSON.stringify(b.money));
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
