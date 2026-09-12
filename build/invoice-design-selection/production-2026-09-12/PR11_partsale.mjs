// PRODUCTION -- part sale documents under both designs. Route found by walking the menus:
// Parts -> Part Sales -> a row -> /parts/part-sale/<id>/... with a Finance tab, exactly like a work order.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), cap:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR11.json`, JSON.stringify(R,null,1));
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
// case-insensitive markers: the Modern headings are title case in the HTML and CAPS on screen
const read=async(url,tag)=>{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(15000);
  const d=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    const ci=(re)=>new RegExp(re,'i').test(t);
    return {len:t.length,
      legacyLook: ci('Remit payment to') || ci('\\bLine Total\\b'),
      modernLook: ci('\\bAddresses\\b') || ci('Work Performed') || ci('Work Summary'),
      documentRendered: ci('Bill To') || ci('Remit payment to') || ci('\\bAddresses\\b'),
      docNo:[...new Set(t.match(/\b(?:INV|EST|CM|P\d?)-[A-Z0-9-]+/g)||[])].sort(),
      money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort(),
      head:t.slice(0,220)};});
  await page.screenshot({path:`${EV}/PR11-${tag}.png`, fullPage:true});
  return d;
};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.found=await stored(); L('build %s | design found %s', R.build, R.found);
// pick part sales across statuses -- one invoiced if there is one
const ps=rowsOf((await call('/api/part-sales?limit=100')).j);
R.statuses=[...new Set(ps.map(p=>p.status))];
L('part sales %d | statuses %s', ps.length, JSON.stringify(R.statuses));
const inv=ps.find(p=>/invoiced|paid/i.test(String(p.status||'')));
const other=ps.find(p=>/complete|approved/i.test(String(p.status||'')))||ps[0];
R.subjects=[inv,other].filter(Boolean).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i)
  .map(p=>({n:p.number,id:p.id,st:p.status}));
L('subjects: %s', JSON.stringify(R.subjects));
save();
for(const want of ['legacy','modern']){
  const now=await setDesign(want); L('=== design %s', now);
  if(now!==want) continue;
  R.cap[want]={};
  for(const s of R.subjects){
    const b4=await stored();
    const d=await read(`${APP}/parts/part-sale/${s.id}/finance`, `${want}-${s.n}`);
    const af=await stored();
    if(b4!==af){ R.drift.push({ps:s.n,b4,af}); L('   !! drift - discarded'); continue; }
    R.cap[want][s.n]=d;
    L('  %-8s rendered=%s legacy-look=%s modern-look=%s docs=%s money=%d',
      s.n, d.documentRendered, d.legacyLook, d.modernLook, JSON.stringify(d.docNo), d.money.length);
  }
  save();
}
R.compare=[];
for(const k of Object.keys(R.cap.legacy||{})){
  const a=R.cap.legacy[k], b=(R.cap.modern||{})[k]; if(!a||!b) continue;
  const sa=new Set(a.money), sb=new Set(b.money);
  R.compare.push({k, bothRendered:a.documentRendered&&b.documentRendered,
    legacyLooksLegacy:a.legacyLook, modernLooksModern:b.modernLook,
    changed:a.legacyLook!==b.legacyLook||a.modernLook!==b.modernLook||a.len!==b.len,
    docsSame:JSON.stringify(a.docNo)===JSON.stringify(b.docNo),
    moneySame:JSON.stringify(a.money)===JSON.stringify(b.money),
    onlyLegacy:[...sa].filter(x=>!sb.has(x)), onlyModern:[...sb].filter(x=>!sa.has(x))});
}
for(const c of R.compare) L('COMPARE %-8s rendered:%s changed:%s L-look:%s M-look:%s docs:%s money:%s onlyL:%s',
  c.k,c.bothRendered,c.changed,c.legacyLooksLegacy,c.modernLooksModern,c.docsSame,c.moneySame,JSON.stringify(c.onlyLegacy||[]));
L('drift %d | design left at %s', R.drift.length, await stored());
save(); L('done'); await browser.close(); process.exit(0);
