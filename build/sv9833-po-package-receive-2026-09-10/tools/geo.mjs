import {boot} from './b.mjs';
import {clickId} from './po.mjs';
import fs from 'fs';
const env=process.argv[2], PN=process.argv[3], TAG=process.argv[4];
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const {browser,page}=await boot(env);
await page.goto(APP+'/parts',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(4500);
await clickId(page,'page_search_toggle'); await page.waitForTimeout(900);
await page.keyboard.type(PN,{delay:45}); await page.waitForTimeout(4200);
const g=await page.evaluate(()=>{
  const t=document.querySelector('table'); if(!t) return null;
  const heads=[...t.querySelectorAll('thead th')].map(h=>({txt:h.innerText.trim(),r:h.getBoundingClientRect()}));
  const row=[...t.querySelectorAll('tbody tr')].find(r=>r.querySelectorAll('td').length>3);
  const cells=row?[...row.querySelectorAll('td')].map(c=>({txt:c.innerText.trim(),r:c.getBoundingClientRect()})):[];
  const tr=t.getBoundingClientRect();
  return {heads:heads.map(h=>({txt:h.txt,x:h.r.x,y:h.r.y,w:h.r.width,h:h.r.height})),
          cells:cells.map(c=>({txt:c.txt,x:c.r.x,y:c.r.y,w:c.r.width,h:c.r.height})),
          table:{x:tr.x,y:tr.y,w:tr.width,h:tr.height}};
});
fs.writeFileSync(`/tmp/sv9833/geo-${env}-${TAG}.json`,JSON.stringify(g,null,1));
await page.screenshot({path:`/tmp/sv9833/geo-${env}-${TAG}.png`});
console.log(env,TAG,'heads:',g.heads.map(h=>h.txt).join('|'));
console.log('cells:',g.cells.map(c=>c.txt.replace(/\n/g,'/')).join('|'));
await browser.close();
