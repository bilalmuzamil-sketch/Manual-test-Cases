import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/administration/locations',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(7000);
await page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>/Heavy Duty/.test(t.innerText)); tr.click(); const b=tr.querySelector('button,i'); if(b)b.click();});
await page.waitForTimeout(4200);
await page.evaluate(()=>document.querySelector('[data-test-id=toggle_business_hours]').click());
await page.waitForTimeout(2200);
await page.screenshot({path:E+'86-business-hours-on.png',fullPage:true});
F.bh=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,1600));
console.log('BH',JSON.stringify(F.bh));
F.ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(x=>/hour/i.test(x)));
console.log('IDS',JSON.stringify(F.ids));
// add a second Monday range and make it overlap
const add=F.ids.find(x=>/add.*monday/i.test(x));
if(add){ await page.evaluate(a=>document.querySelector(`[data-test-id="${a}"]`).click(),add); await page.waitForTimeout(1500);
  const rng=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id*=monday]')].map(e=>({id:e.getAttribute('data-test-id'),tag:e.tagName,v:e.value||''})));
  console.log('MONDAY',JSON.stringify(rng));
  const inputs=rng.filter(r=>r.tag==='INPUT').map(r=>r.id);
  for(const [i,v] of [[0,'08:00'],[1,'12:00'],[2,'11:00'],[3,'15:00']]){ const el=await page.$(`[data-test-id="${inputs[i]}"]`); if(el) await el.fill(v); }
  await page.waitForTimeout(2000);
  await page.screenshot({path:E+'87-overlap-msg.png',fullPage:true});
  F.msg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const t=d.innerText; return t.match(/These hours overlap[^\n]*/)?.[0]||t.match(/[^\n]*overlap[^\n]*/i)?.[0]||null;});
  console.log('OVERLAP MSG',JSON.stringify(F.msg));
}
// close without saving
await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); const c=[...d.querySelectorAll('button')].find(e=>/^close$/i.test(e.innerText.trim())); if(c)c.click();});
await page.waitForTimeout(1600);
F.dialogs=await page.evaluate(()=>document.querySelectorAll('.q-dialog').length);
console.log('dialogs after close',F.dialogs);
fs.writeFileSync('/tmp/sviu/f-bh.json',JSON.stringify(F,null,1));
await browser.close();
