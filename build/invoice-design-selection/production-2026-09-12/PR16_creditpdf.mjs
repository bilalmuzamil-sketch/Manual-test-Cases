// PRODUCTION -- the credit document under both designs, fetched from the very route the row's print
// action uses (GET /api/credit-memos/<id>/pdf, seen live in the network log).
import fs from 'fs';
import { execSync } from 'child_process';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APIH='api.shopview.com';
const CM='6a994b27-4b36-4ce6-b5c1-833ce3efcb94';   // CM1-3561, credit against invoice S1-696
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), subject:'CM1-3561', cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR16.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const bin=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  if(!r.ok) return {s:r.status}; const b=await r.blob(); const buf=await b.arrayBuffer();
  let s=''; const v=new Uint8Array(buf); for(let i=0;i<v.length;i++) s+=String.fromCharCode(v[i]);
  return {s:r.status, b64:btoa(s), type:b.type, size:b.size};},{a:APIH,p});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const pdfText=(p)=>{try{return execSync(`python3 -c "import pymupdf,sys;d=pymupdf.open(sys.argv[1]);print(chr(10).join(pg.get_text() for pg in d))" "${p}"`,{encoding:'utf8'});}catch(e){return '';}};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
L('build %s | design found %s', R.build, await stored());
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  const b4=await stored();
  const r=await bin(`/api/credit-memos/${CM}/pdf`);
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift - discarded'); continue; }
  if(!r.b64){ L('  fetch failed: %s', r.s); R.cap[want]={status:r.s}; save(); continue; }
  const f=`${EV}/PR16-${want}-credit.pdf`; fs.writeFileSync(f, Buffer.from(r.b64,'base64'));
  const txt=pdfText(f).replace(/\s+/g,' ');
  R.cap[want]={type:r.type, bytes:r.size, chars:txt.length,
    legacyLook:/Remit payment to/i.test(txt) && !/ADDRESSES/.test(txt),
    modernLook:/ADDRESSES|SUMMARY|CREDIT SUMMARY/.test(txt),
    disclaimer:/warrant/i.test(txt),
    docNo:[...new Set(txt.match(/\b(?:INV|EST|CM|S\d?)-[A-Z0-9-]+/g)||[])].sort(),
    money:[...new Set(txt.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), head:txt.slice(0,240)};
  L('  pdf %s bytes=%d chars=%d legacyLook=%s modernLook=%s docs=%s money=%s',
    r.type, r.size, txt.length, R.cap[want].legacyLook, R.cap[want].modernLook,
    JSON.stringify(R.cap[want].docNo), JSON.stringify(R.cap[want].money));
  L('  head: %s', R.cap[want].head.slice(0,190));
  save();
}
const a=R.cap.legacy,b=R.cap.modern;
if(a&&b&&a.bytes&&b.bytes){
  R.verdict={designChanged:a.legacyLook!==b.legacyLook||a.modernLook!==b.modernLook||a.bytes!==b.bytes,
    docsSame:JSON.stringify(a.docNo)===JSON.stringify(b.docNo),
    moneySame:JSON.stringify(a.money)===JSON.stringify(b.money),
    disclaimerL:a.disclaimer, disclaimerM:b.disclaimer};
  L('VERDICT %s', JSON.stringify(R.verdict));
}
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
