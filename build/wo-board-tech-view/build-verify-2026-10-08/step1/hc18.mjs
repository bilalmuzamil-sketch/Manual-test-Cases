import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc18.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,body}=mk(page); page.setDefaultTimeout(15000);
try{ for(let a=1;a<=2;a++){ await page.reload(); await page.waitForTimeout(7000);
  const n1=await page.locator('tbody tr').count(); const t=await body(); log('ATTEMPT',a,'rows first',n1,'| paging words:',(t.match(/Rows per page|Records per page|\b\d+-\d+ of \d+\b|chevron_right/gi)||[]).join(','));
  for(let i=0;i<6;i++){ await page.mouse.wheel(0,4000); await page.waitForTimeout(1500);} const n2=await page.locator('tbody tr').count(); log('ATTEMPT',a,'rows after scroll',n2);
  const nums=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>(r.innerText.match(/S\d*-\d+|ZZIMP-\d+/)||[''])[0]).filter(Boolean)); log('dupes',nums.length-new Set(nums).size,'url',page.url()); }
  await dump('hc-list-scroll');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
