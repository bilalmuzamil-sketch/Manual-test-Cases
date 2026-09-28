// The move failed silently because I aimed at line 3, which is DECLINED. Aim at the approved line
// instead, and read the result from the row order (a part belongs to the last LINEROW above it -
// and a line row here reads "N more_vert <name>", with no expand_less prefix once loaded).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const layout=async()=>await page.evaluate(()=>{const out=[];let cur=null;
  for(const tr of document.querySelectorAll('tr')){ if(!tr.getBoundingClientRect().height) continue;
    const t=(tr.innerText||'').replace(/\s+/g,' ').trim();
    if(/line-row-/.test(tr.className||'') && /^\d+\s+more_vert/.test(t)){ cur=t.slice(0,40); out.push({line:cur,parts:[]}); continue; }
    if(/drag_indicator|\) Core for/.test(t) && out.length) out[out.length-1].parts.push(t.slice(0,60)); }
  return out;});
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await layout();
console.log('before:'); R.before.forEach(l=>{console.log('   LINE',l.line); l.parts.forEach(p=>console.log('      ',p));});
const spot=await page.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/ZZAUTOTEST-PLAIN/.test(t.innerText||''));
  if(!row)return null; const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(!spot){ console.log('cannot find that part'); await browser.close(); process.exit(0); }
await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2200);
const mv=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  if(!m)return null; const i=[...m.querySelectorAll('.q-item')].find(x=>/^Move$/i.test((x.innerText||'').trim())&&!/disabled/.test(x.className));
  if(!i)return null; const r=i.getBoundingClientRect(); return {x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};});
if(!mv){ console.log('Move is not offered on it'); await browser.close(); process.exit(0); }
await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(5000);
// choose the APPROVED line, not the declined one
const f=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const fl=[...d.querySelectorAll('.q-field')].find(x=>/Target Line/i.test(x.innerText||''));
  if(!fl)return null; const r=fl.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(f){ await page.mouse.click(f.x,f.y); await page.waitForTimeout(2600);
  const choices=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,44),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}));
  console.log('\nit offers:',JSON.stringify(choices.map(c=>c.t)));
  const want=choices.find(c=>/parts line/i.test(c.t)) || choices.find(c=>!/decline/i.test(c.t));
  if(want){ await page.mouse.click(want.x,want.y); console.log('chose',JSON.stringify(want.t)); await page.waitForTimeout(2500); } }
const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const all=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}));
  const c=all.filter(a=>a.t&&!a.dis&&!/^(cancel|close|×)$/i.test(a.t));
  if(!c.length)return 'nothing pressable: '+all.map(a=>a.t+(a.dis?'[d]':'')).join(' | ');
  c[c.length-1].e.click(); return 'pressed "'+c[c.length-1].t+'"';});
console.log(go); await page.waitForTimeout(7000);
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('message:',JSON.stringify(R.toast));
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await layout();
console.log('\nafter:'); R.after.forEach(l=>{console.log('   LINE',l.line); l.parts.forEach(p=>console.log('      ',p));});
const where=(lay)=>{for(const l of lay) if(l.parts.some(p=>/ZZAUTOTEST-PLAIN/.test(p))) return l.line; return null;};
R.from=where(R.before); R.to=where(R.after);
console.log('\n>>> the part was on',JSON.stringify(R.from),'and is now on',JSON.stringify(R.to));
R.moved=R.from!==R.to;
console.log('>>> it moved lines:',R.moved);
await page.screenshot({path:`${EV}/r86-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r86-move.json`,JSON.stringify(R,null,1));
await browser.close();
