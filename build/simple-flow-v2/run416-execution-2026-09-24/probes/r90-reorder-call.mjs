// C44605 Expected: a reorder for a line on an INVOICED work order is rejected with 409.
// The invoiced work order does not offer the control at all (r89), so to test the stated
// expectation I must learn what a real reorder asks the server, then ask the same thing about
// the invoiced work order's line and read the answer. Step 1 here: do a genuine reorder on the
// OPEN work order S2-917 and capture the exact call.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const seen=[];
page.on('request',req=>{const m=req.method(); if(m==='GET'||m==='OPTIONS')return; if(!/\/api\//.test(req.url()))return;
  seen.push({m,u:req.url(),body:(req.postData()||'').slice(0,600)});});
page.on('response',async r=>{const m=r.request().method(); if(m==='GET'||m==='OPTIONS')return; if(!/\/api\//.test(r.url()))return;
  const hit=seen.find(s=>s.u===r.url()&&s.status===undefined); if(hit) hit.status=r.status();});
await openWo(page,OPEN); await page.waitForTimeout(9000);
// the second part row on line 2 - "Move up" is a reorder
const spot=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr')].filter(t=>/drag_indicator/.test(t.innerText||'')&&t.getBoundingClientRect().height);
  const row=rows[2]||rows[1]; if(!row)return null;
  const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect();
  return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),row:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,58)};});
console.log('reordering this part:',JSON.stringify(spot&&spot.row));
await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2200);
const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
    .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});
console.log('menu:',JSON.stringify(items.map(i=>i.t+(i.dis?' [off]':''))));
const up=items.find(i=>/^Move up$/i.test(i.t)&&!i.dis)||items.find(i=>/^Move down$/i.test(i.t)&&!i.dis);
if(up){ await page.mouse.click(up.x,up.y); console.log('pressed',JSON.stringify(up.t)); await page.waitForTimeout(8000); }
else console.log('neither Move up nor Move down was offered');
R.writes=seen.filter(s=>s.status!==undefined);
console.log('\nwhat a real reorder asks the server:');
R.writes.forEach(w=>console.log(' ',w.m,w.status,w.u.replace('https://api.shopview.com',''),'\n    body:',w.body.slice(0,320)));
fs.writeFileSync(`${EV}/r90-reorder-call.json`,JSON.stringify(R,null,1));
await browser.close();
