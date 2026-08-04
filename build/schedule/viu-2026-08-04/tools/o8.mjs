import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule?date=2026-08-09',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(8000);
F.url=page.url();
// navigate forward one week if needed
const rangeLabel=async()=>await page.evaluate(()=>document.body.innerText.match(/Aug \d+ [–-] \d+, 2026|Aug \d+ to \d+, 2026|[A-Z][a-z]{2} \d+ – [A-Z]?[a-z]* ?\d+, \d{4}/)?.[0]||null);
F.range0=await rangeLabel();
for(let i=0;i<3;i++){
  const has=await page.evaluate(()=>document.body.innerText.includes('10123073'));
  if(has) break;
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.innerText.trim()==='chevron_right'&&e.closest('.mini-calendar')===null); if(b)b.click();});
  await page.waitForTimeout(3000);
}
F.range=await rangeLabel();
await page.screenshot({path:E+'24-week-aug9.png'});
F.pill=await page.evaluate(()=>document.querySelector('.conflicts-pill')?.innerText.trim());
await page.evaluate(()=>{const b=document.querySelector('.conflicts-pill'); if(b)b.click();});
await page.waitForTimeout(1300);
F.pillMenu=await page.evaluate(()=>document.querySelector('.q-menu')?.innerText.trim());
await page.screenshot({path:E+'25-pill-menu.png'});
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
F.blocks=await page.evaluate(()=>[...document.querySelectorAll('.schedule-block')].map(e=>({t:e.innerText.trim().replace(/\n/g,' / ').slice(0,80),cls:e.className})));
// open the non-working-day one (Sunday)
const b1=await page.evaluate(()=>{const bs=[...document.querySelectorAll('.schedule-block')].filter(e=>/10123073/.test(e.innerText)); const b=bs[0]; if(!b)return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,n:bs.length};});
F.count=b1&&b1.n;
if(b1){ await page.mouse.click(b1.x,b1.y); await page.waitForTimeout(2200);
  await page.screenshot({path:E+'26-conflict-modal.png'});
  F.modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim(),btns:[...d.querySelectorAll('button')].map(x=>x.innerText.trim()).filter(Boolean),inputs:[...d.querySelectorAll('input')].map(i=>({ph:i.placeholder||'',v:i.value,ro:i.readOnly}))}:null;});
  // try clicking the estimated hours value (SV-8829)
  F.estClickable=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); if(!d)return null;
    const els=[...d.querySelectorAll('*')].filter(e=>e.children.length===0 && /^\d+h( \d+m)?$/.test(e.innerText.trim()));
    return els.map(e=>({t:e.innerText.trim(),tag:e.tagName,cls:e.className.toString().slice(0,60),clickable:/cursor-pointer|editable|q-btn/.test(e.className.toString())||e.onclick!=null}));});
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
fs.writeFileSync('/tmp/sviu/f-batch5.json',JSON.stringify(F,null,1));
console.log(JSON.stringify(F,null,1));
await browser.close();
