// PRODUCTION -- the real PDF the app generates. The print control creates a blob: URL and opens it in
// the browser's PDF viewer, so reading the tab's text gives nothing. The blob's own bytes are fetched
// from inside the tab and saved, which is the exact file a shop would print or keep.
import fs from 'fs';
import { execSync } from 'child_process';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR13.json`, JSON.stringify(R,null,1));
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
const pdfText=(p)=>{try{return execSync(`python3 -c "import pymupdf,sys;d=pymupdf.open(sys.argv[1]);print(chr(10).join(pg.get_text() for pg in d))" "${p}"`,{encoding:'utf8'});}catch(e){return '';}};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const paid=wos.find(w=>/paid/i.test(String(w.status||'')));
R.subject={n:paid.number,id:paid.id,st:paid.status}; L('subject %s', JSON.stringify(R.subject));
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  const b4=await stored();
  await page.goto(`${APP}/workorders/${paid.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(15000);
  const popups=[]; const on=p=>popups.push(p); ctx.on('page', on);
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const b=[...document.querySelectorAll('button,a')].filter(ok).find(e=>{const i=e.querySelector('i');
      return i && /^print$/i.test((i.innerText||'').trim());}); if(b) b.click();});
  await page.waitForTimeout(9000); ctx.off('page', on);
  const t=popups[popups.length-1];
  if(!t){ L('  no new tab opened'); continue; }
  const url=t.url();
  // pull the blob's own bytes out of the tab that holds it
  const b64=await t.evaluate(async(u)=>{ const r=await fetch(u); const b=await r.blob();
    const buf=await b.arrayBuffer(); let s=''; const v=new Uint8Array(buf);
    for(let i=0;i<v.length;i++) s+=String.fromCharCode(v[i]);
    return {b64:btoa(s), type:b.type, size:b.size}; }, url).catch(e=>({err:String(e).slice(0,90)}));
  if(b64 && b64.b64){
    const f=`${EV}/PR13-${want}-print.pdf`;
    fs.writeFileSync(f, Buffer.from(b64.b64,'base64'));
    const txt=pdfText(f).replace(/\s+/g,' ');
    R.cap[want]={url:url.slice(0,60), type:b64.type, bytes:b64.size, chars:txt.length,
      legacyTable:/Service Order Terms Due date/i.test(txt)||/Parts Total \$/i.test(txt)||/Remit payment to/i.test(txt)&&/Line Total/i.test(txt),
      modernBlocks:/ADDRESSES|WORK PERFORMED|WORK SUMMARY|SUMMARY/.test(txt),
      authorizer:/Authorizer/i.test(txt),
      authorizerCol:(txt.match(/Authorizer\s+([^\s][^|]{0,30})/i)||[])[1]||null,
      payments:/Payments/i.test(txt), balance:(txt.match(/Balance[^$]{0,10}(\$-?[\d,]+\.\d{2})/i)||[])[1]||null,
      docNo:[...new Set(txt.match(/\b(?:INV|EST|CM|P\d?)-[A-Z0-9-]+/g)||[])].sort(),
      money:[...new Set(txt.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(), head:txt.slice(0,200)};
    L('  pdf %s bytes=%d chars=%d legacyTable=%s modernBlocks=%s authorizer=%s balance=%s',
      b64.type, b64.size, txt.length, R.cap[want].legacyTable, R.cap[want].modernBlocks, R.cap[want].authorizer, R.cap[want].balance);
    L('  head: %s', R.cap[want].head.slice(0,150));
  } else L('  could not read the blob: %s', JSON.stringify(b64));
  await t.close().catch(()=>{});
  const af=await stored(); if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift'); }
  save();
}
const a=R.cap.legacy,b=R.cap.modern;
if(a&&b) { R.verdict={designChanged:a.legacyTable!==b.legacyTable||a.modernBlocks!==b.modernBlocks||a.bytes!==b.bytes,
  docsSame:JSON.stringify(a.docNo)===JSON.stringify(b.docNo), moneySame:JSON.stringify(a.money)===JSON.stringify(b.money),
  authorizerLegacy:a.authorizer, authorizerModern:b.authorizer,
  onlyLegacyMoney:a.money.filter(x=>!b.money.includes(x)), onlyModernMoney:b.money.filter(x=>!a.money.includes(x))};
  L('VERDICT %s', JSON.stringify(R.verdict)); }
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
