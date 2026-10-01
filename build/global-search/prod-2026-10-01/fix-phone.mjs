/**
 * My seeded customer has no phone: the create payload used `phone`, which this API ignores (the
 * record came back with address_1 null too, so `address` was dropped the same way). That is why
 * searching 609-461-6502 found nothing - NOT a production fault. Rule 104's positive control is
 * what caught it; without reading the record back I would have filed a false regression.
 *
 * Fix it through the Edit Customer modal, which knows its own field names, and capture the request
 * so the correct payload shape is written down (Rule 93).
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/prod-2026-10-01/';
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(30000);
const posts=[];
page.on('request', r=>{ if(r.method()==='POST' && /api\.shopview/.test(r.url())) posts.push({u:r.url().replace('https://api.shopview.com',''), b:(r.postData()||'').slice(0,400)}); });

await page.goto('https://app.shopview.com/customers/951fdc13-f5d3-48f1-8af0-0389e9f4762f/work-orders',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(8000);
// the pencil opens "Edit Customer" (playbook line 3137)
const opened = await page.evaluate(()=>{
  const btns=[...document.querySelectorAll('button,a,i')];
  const p=btns.find(e=>/edit/i.test(e.getAttribute('aria-label')||'')||/^edit$/i.test((e.innerText||'').trim())||/edit/i.test(e.className||''));
  if(!p) return false; p.click(); return true;
});
await page.waitForTimeout(3500);
const filled = await page.evaluate(()=>{
  const ins=[...document.querySelectorAll('input')];
  const lab=i=>(i.getAttribute('aria-label')||i.placeholder||i.name||'').toLowerCase();
  const phone=ins.find(i=>/phone/.test(lab(i)));
  if(!phone) return {no:true, labels:ins.map(lab).filter(Boolean).slice(0,14)};
  const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    s.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));};
  set(phone,'609-461-6502');
  return {label:lab(phone)};
});
console.log('phone field:', JSON.stringify(filled));
await page.waitForTimeout(1200);
const saved = await page.evaluate(()=>{
  const b=[...document.querySelectorAll('button')].find(e=>/^save/i.test((e.innerText||'').trim()));
  if(!b) return false; b.click(); return b.innerText.trim();
});
console.log('save:', saved);
await page.waitForTimeout(7000);
fs.writeFileSync(OUT+'customer-change-payload.json', JSON.stringify(posts,null,1));
posts.filter(p=>/customers/.test(p.u)).slice(-3).forEach(p=>console.log('  POST', p.u, '|', p.b.slice(0,220)));
// read it back off the screen
await page.goto('https://app.shopview.com/customers/951fdc13-f5d3-48f1-8af0-0389e9f4762f/work-orders',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(8000);
const t=await page.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' '));
console.log('phone now on the page:', /609.?461.?6502/.test(t));
console.log('FIX DONE');
await browser.close();
