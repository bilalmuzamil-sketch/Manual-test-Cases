import { open } from '/tmp/sv8814s/boot.mjs';
import fs from 'node:fs';
const [,,WO,OUT,TAB,SEL] = process.argv;
const s=await open(); const p=s.page;
await p.goto(`${s.APP}/workorders/${WO}/${TAB||'finance'}`,{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(13000);
const c=p.locator('[data-test-id="button_close_payment_dialog"]').first();
if(await c.count()){const cb=await c.boundingBox(); if(cb) await p.mouse.click(cb.x+cb.width/2,cb.y+cb.height/2); await p.waitForTimeout(2500);}
const labels=(SEL||'').split('||').filter(Boolean);
// scroll the LAST label into view within its scroll container
await p.evaluate(l=>{
  const el=[...document.querySelectorAll('div,tr,td,span')].find(e=>e.children.length<4 && e.innerText && e.innerText.trim().startsWith(l));
  if(el) el.scrollIntoView({block:'center'});
}, labels[labels.length-1]);
await p.waitForTimeout(1500);
await p.screenshot({path:OUT});
const boxes=await p.evaluate(ls=>{
  const out={};
  for(const l of ls){
    const el=[...document.querySelectorAll('div,tr,td,span')].find(e=>e.children.length<4 && e.innerText && e.innerText.trim().startsWith(l));
    if(!el) continue;
    let r=el.getBoundingClientRect();
    const row=el.closest('tr')||el.parentElement;
    if(row){const rr=row.getBoundingClientRect(); if(rr.width>r.width && rr.height<r.height*3) r=rr;}
    if(r.y<0||r.y>window.innerHeight) continue;
    out[l]={x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};
  }
  return out;
}, labels);
fs.writeFileSync(OUT.replace(/\.png$/,'.json'), JSON.stringify(boxes,null,1));
console.log(JSON.stringify(boxes));
await s.browser.close();
