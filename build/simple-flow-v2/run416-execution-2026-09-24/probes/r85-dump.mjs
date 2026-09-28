import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
await openWo(page,'281adfa7-5925-4718-936d-91d12cda3873'); await page.waitForTimeout(10000);
const rows=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>({cls:/line-row-/.test(t.className||'')?'LINEROW':'', t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,95)})));
console.log('every row on the page, in order:');
rows.forEach((r,i)=>console.log(String(i).padStart(3),r.cls.padEnd(8),r.t));
fs.writeFileSync(`${EV}/r85-dump.json`,JSON.stringify(rows,null,1));
await browser.close();
