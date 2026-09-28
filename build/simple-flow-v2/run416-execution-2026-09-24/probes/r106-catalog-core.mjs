// Last route: a part is ordered from the CATALOG, and a core so far has only been seen on the
// INVENTORY record. If a catalog part can carry a core charge, then an ordered part can have a core
// and C53489 can be built. Look at the catalog record.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/parts',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(40000);
const R={};
console.log(await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,[role=tab]')].find(e=>/Catalog/i.test(e.innerText||'')&&e.getBoundingClientRect().width);
  if(!t)return 'no Catalog tab'; t.click(); return 'opened the Catalog tab';}));
await page.waitForTimeout(8000);
R.columns=await page.evaluate(()=>{const h=[...document.querySelectorAll('tr')][0]; return h?(h.innerText||'').replace(/\s+/g,' ').trim().slice(0,200):null;});
console.log('the catalog columns:',JSON.stringify(R.columns));
R.mentionsCore=/core/i.test(R.columns||'');
console.log('do the columns mention a core:',R.mentionsCore);
// open a catalog part and read its fields
const opened=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height);
  const t=rows[1]; if(!t)return 'no rows'; t.click(); return 'opened '+(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,60);});
console.log(opened); await page.waitForTimeout(8000);
R.fields=await page.evaluate(()=>[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>({label:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,36),val:(e.querySelector('input')||{}).value||''})));
console.log('a catalog part carries these fields:',JSON.stringify(R.fields));
R.hasCoreField=(R.fields||[]).some(f=>/core/i.test(f.label));
console.log('\n>>> can a catalog part carry a core charge:',R.hasCoreField);
await page.screenshot({path:`${EV}/r106-catalog-part.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r106-catalog-core.json`,JSON.stringify(R,null,1));
await browser.close();
