// Read how the permission matrix is actually laid out before building any role: the Search
// permission box, the row for a named permission, and the state of its View / Create & Edit /
// Delete boxes. Read-only - nothing is created here.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(40000);
const R={};
// open an existing ZZAUTOTEST role rather than creating one
console.log(await page.evaluate(()=>{const r=[...document.querySelectorAll('tr')].find(t=>/ZZAUTOTEST Receive Later/.test(t.innerText||''));
  const b=r&&[...r.querySelectorAll('.q-btn,button')].find(e=>/edit/.test(e.innerText||'')); if(!b)return 'not found'; b.click(); return 'opened a role';}));
await page.waitForTimeout(11000);
R.headers=await page.evaluate(()=>[...document.querySelectorAll('th,.col-header,[class*=header]')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,24),x:Math.round(e.getBoundingClientRect().x)})).filter(h=>h.t).slice(0,14));
console.log('column headers:',JSON.stringify(R.headers));
const search=page.locator('.q-field:has-text("Search permission") input, input[placeholder*="ermission"]').first();
console.log('a search box exists:',await search.count()>0);
for(const term of ['Vendor','Invoicing','Review','Work Orders']){
  if(await search.count()){ await search.fill(''); await search.type(term,{delay:60}); await page.waitForTimeout(3500); }
  const found=await page.evaluate(()=>{
    const out=[];
    for(const row of document.querySelectorAll('tr,.q-item,div')){
      const cbs=[...row.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
      const tgs=[...row.querySelectorAll('.q-toggle')].filter(e=>e.getBoundingClientRect().width);
      if(cbs.length>=2&&cbs.length<=4&&row.getBoundingClientRect().width>400){
        const label=(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,46);
        if(!label) continue;
        out.push({label, boxes:cbs.map(c=>({x:Math.round(c.getBoundingClientRect().x),
          on:c.getAttribute('aria-checked')==='true'||/q-checkbox--truthy/.test(c.className)||!!c.querySelector('.q-checkbox__inner--truthy')})),
          toggles:tgs.length});
      }
    }
    const seen=new Set(); return out.filter(o=>{const k=o.label+o.boxes.map(b=>b.x).join(); if(seen.has(k))return false; seen.add(k); return true;}).slice(0,6);});
  console.log(`\n"${term}" ->`); found.forEach(f=>console.log('   ',JSON.stringify(f)));
  R[term]=found;
}
await page.screenshot({path:`${EV}/r107-role-matrix.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r107-role-matrix.json`,JSON.stringify(R,null,1));
await browser.close();
