/**
 * The vendor create endpoint is not indexed for production and the three documented API shapes
 * answer 404/404/405. Playbook line 2881 records the UI route instead: Parts -> Vendors -> New
 * Vendor. So drive the screen (Rule 107: use the screen or go behind it, whichever reaches the
 * state) AND capture the request it fires, so the endpoint is written down and the next session
 * does not rediscover it (Rule 93).
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/prod-2026-10-01/';
const { page, browser } = await bootProdLogin('/parts/vendors', { settle: 12000 });
page.setDefaultTimeout(30000);
const calls=[];
page.on('request', r => { if (r.method()==='POST' && /api\./.test(r.url())) calls.push({url:r.url(), post:(r.postData()||'').slice(0,240)}); });

await page.waitForTimeout(4000);
// find the New Vendor control by its own label
const opened = await page.evaluate(()=>{
  const b=[...document.querySelectorAll('button,a')].find(e=>/new vendor/i.test(e.innerText||''));
  if(!b) return false; b.click(); return true;
});
console.log('New Vendor control found:', opened);
await page.waitForTimeout(3000);
if (opened) {
  const typed = await page.evaluate(()=>{
    const ins=[...document.querySelectorAll('input')];
    const name=ins.find(i=>/name/i.test(i.getAttribute('aria-label')||i.placeholder||i.name||''))||ins[0];
    if(!name) return false;
    const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
      s.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));};
    set(name,'ZZLONGROW Identical Name Supply');
    return {label:name.getAttribute('aria-label')||name.placeholder||name.name};
  });
  console.log('name field:', JSON.stringify(typed));
  await page.waitForTimeout(1200);
  const saved = await page.evaluate(()=>{
    const b=[...document.querySelectorAll('button')].find(e=>/save/i.test(e.innerText||''));
    if(!b) return false; b.click(); return b.innerText.trim();
  });
  console.log('save control:', saved);
  await page.waitForTimeout(6000);
}
fs.writeFileSync(OUT+'vendor-endpoint.json', JSON.stringify(calls,null,1));
console.log('--- POST calls captured ---');
calls.slice(-6).forEach(c=>console.log('  ', c.url.replace('https://api.shopview.com',''), '|', c.post.slice(0,110)));

// now verify the seeded CUSTOMERS are searchable (index refresh is allowed up to 30s)
await page.goto('https://app.shopview.com/customers',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(5000);
for (const term of ['ZZLONGROW','ZZSOFTHIT','ZZPHONE','609-461-6502','H8A3X9','ZZIDENTICAL']) {
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1100);
  await page.fill('.search-modal input',''); await page.waitForTimeout(250);
  await page.type('.search-modal input', term, {delay:30}); await page.waitForTimeout(3400);
  const r=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,2)
    .map(x=>x.innerText.replace(/\s*\n\s*/g,' | ').slice(0,100)));
  console.log(`  ${term.padEnd(14)} -> ${r.length?r[0]:'NO ROWS'}`);
}
console.log('VENDOR+VERIFY DONE');
await browser.close();
