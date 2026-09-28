// The core-bearing part sits on the line as "In Stock / Pick" even with no stock. Before concluding
// that a part with a core can never be ordered, look in its own menu for an ordering action.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
await openWo(page,WO); await page.waitForTimeout(9000);
const mv=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/bj679453/.test(x.innerText||''));
  if(!t)return null; const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
if(!mv){ console.log('the part is not on the page'); await browser.close(); process.exit(0); }
await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(2300);
R.menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
    .map(i=>{const r=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}):[];});
console.log('the core part\'s menu offers:',JSON.stringify((R.menu||[]).map(i=>i.t+(i.dis?' [off]':''))));
const ord=(R.menu||[]).find(i=>/order/i.test(i.t)&&!i.dis);
if(ord){
  await page.mouse.click(ord.x,ord.y); console.log('chose',JSON.stringify(ord.t)); await page.waitForTimeout(7000);
  for(let i=0;i<3;i++){
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!q)return 'no dialog';
      const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
        .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
      if(!c.length)return 'nothing pressable';
      const b=c[c.length-1]; if(b.dis)return '"'+b.t+'" is not pressable'; b.e.click(); return 'pressed "'+b.t+'"';});
    console.log('  ',go); if(/no dialog/.test(go))break; await page.waitForTimeout(5000);
  }
} else { await page.keyboard.press('Escape'); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.after=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height&&/bj679453|Item-6086|Core/i.test(t.innerText||''))
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(x=>x&&!/drag/.test(x));
    return (t.innerText||'').replace(/\s+/g,' ').trim().slice(0,92)+'  ->  '+b.join('|');}));
console.log('\nafter:'); R.after.forEach(x=>console.log('  ',x));
fs.writeFileSync(`${EV}/r105-core-order-menu.json`,JSON.stringify(R,null,1));
await browser.close();
