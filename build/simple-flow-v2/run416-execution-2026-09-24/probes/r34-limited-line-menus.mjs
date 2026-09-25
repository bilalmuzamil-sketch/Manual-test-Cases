// The two halves of Problem 3 that need the lower-permission person (has Pick parts and Tech view,
// does NOT have Order parts):
//   C44565 item 3 - a Technician in Tech View cannot complete a line, but can still pick parts.
//   C44603 item 3 - "Receive part" is absent for someone without Order Parts, whatever the setting.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
async function vmenu(page){return await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;});
  if(!m.length)return null;const el=m[m.length-1];
  return [...el.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
    .map(i=>({t:(i.innerText||'').trim().replace(/\s+/g,' '),disabled:i.classList.contains('disabled')||/q-item--disabled/.test(i.className)})).filter(i=>i.t);});}
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(9000);
R.rows=await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)});}return o;});
console.log('lines this person sees:');
for(const r of R.rows) console.log('   ',r.badges.join('+'),'->',JSON.stringify(r.buttons));
const page_t=await page.evaluate(()=>document.body.innerText);
R.completeAnywhere=/\bComplete\b/.test(page_t) && R.rows.some(r=>r.buttons.some(b=>/^Complete$/.test(b)));
R.pickAvailable=/\bPick\b/.test(page_t);
R.receiveAnywhere=/\bReceive\b/.test(page_t);
console.log('\nCan this person complete a line (a Complete button on a row):',R.completeAnywhere);
console.log('Can this person pick parts (Pick on the page)            :',R.pickAvailable);
console.log('Does the word Receive appear anywhere                     :',R.receiveAnywhere);
// every menu on the page, so "Receive part" cannot hide in one
R.menus=[];
const dots=await page.evaluate(()=>{const o=[];
  document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
    const r=b.getBoundingClientRect();if(!r.width||!r.height)return;o.push({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});});
  const seen=new Set();return o.filter(d=>{const k=d.x+','+d.y;if(seen.has(k))return false;seen.add(k);return true;});});
console.log('\nthree-dots on the page:',dots.length);
for(const d of dots){ await page.mouse.click(d.x,d.y).catch(()=>{}); await page.waitForTimeout(1500);
  const m=await vmenu(page);
  if(m&&m.length){R.menus.push({at:d,items:m.map(i=>i.t+(i.disabled?' [disabled]':''))});
    console.log('   @'+d.x+','+d.y,'->',JSON.stringify(m.map(i=>i.t+(i.disabled?' [d]':''))));}
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);}
R.receivePartInAnyMenu=R.menus.some(m=>m.items.some(i=>/^Receive part/i.test(i)));
R.completeInAnyMenu=R.menus.some(m=>m.items.some(i=>/^Complete/i.test(i)));
console.log('\n"Receive part" in ANY menu for a person without Order parts:',R.receivePartInAnyMenu);
await page.screenshot({path:`${EV}/p3j-limited-lines.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/p3j-limited-line-menus.json`,JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();
