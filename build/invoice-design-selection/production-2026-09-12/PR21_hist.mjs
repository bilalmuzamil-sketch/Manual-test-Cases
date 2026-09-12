// PRODUCTION -- C53590 (history snapshots follow the current setting) and C53527 (a document created
// right after a switch uses the new look).
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), hist:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR21.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,400)};},{a:APIH,p});
const html=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include'});
  return {s:r.status, body:await r.text()};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const marks=(b)=>{let t=b.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
  return {legacy:/Remit payment to/.test(t)&&/Line Total/.test(t), modern:/\bAddresses\b/.test(t)||/Work Performed/.test(t)||/Work Summary/.test(t),
    len:b.length, docs:[...new Set(t.match(/\b(?:INV|EST)-[A-Z0-9-]+/g)||[])].sort(),
    money:[...new Set(t.match(/\$-?[\d,]+\.\d{2}/g)||[])].sort()};};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const paid=wos.find(w=>/paid/i.test(String(w.status||'')));
const d=await call(`/api/work-orders/view/${paid.id}`);
let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
R.subject={n:paid.number,id:paid.id,invoiceId:x.invoice_id};
L('subject %s', JSON.stringify(R.subject));
// find a history event for this document -- the preview route takes historyEvent=
for(const p of [`/api/invoices/${R.subject.invoiceId}/history`, `/api/invoices/history?invoice_id=${R.subject.invoiceId}`,
                `/api/work-orders/${paid.id}/history`]){
  const r=await call(p);
  L('history try %s -> %s %s', p, r.s, r.s===200?String(JSON.stringify(r.j)).slice(0,220):r.t.slice(0,70));
  if(r.s===200){ R.historyRoute=p; R.historyRows=rowsOf(r.j).slice(0,5); break; }
}
save();
const ev=(R.historyRows&&R.historyRows[0]) ? (R.historyRows[0].id||R.historyRows[0].uuid||R.historyRows[0].history_event_id) : null;
L('history event id: %s', ev);
for(const want of ['modern','legacy']){
  const now=await setDesign(want); L('=== %s', now); if(now!==want) continue;
  const b4=await stored();
  const r=await html(`/api/invoices/preview?invoice_id=${R.subject.invoiceId}&type=html&isEstimate=0&includeDeclined=0&historyEvent=${ev||''}`);
  const af=await stored();
  if(b4!==af){ R.drift.push({want,b4,af}); L('  !! drift'); continue; }
  if(r.s!==200){ R.hist[want]={status:r.s}; L('  preview %s', r.s); continue; }
  R.hist[want]=marks(r.body);
  fs.writeFileSync(`${EV}/PR21-${want}-history.html`, r.body);
  L('  snapshot render: legacy=%s modern=%s docs=%s money=%d len=%d',
    R.hist[want].legacy, R.hist[want].modern, JSON.stringify(R.hist[want].docs), R.hist[want].money.length, R.hist[want].len);
  save();
}
const a=R.hist.modern,b=R.hist.legacy;
if(a&&b&&!a.status&&!b.status) L('VERDICT snapshot followed the setting: %s | docs same %s | money same %s',
  (b.legacy&&a.modern), JSON.stringify(a.docs)===JSON.stringify(b.docs), JSON.stringify(a.money)===JSON.stringify(b.money));
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
