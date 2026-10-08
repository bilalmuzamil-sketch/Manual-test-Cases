import {start} from './woblib.mjs'; import fs from 'fs';
const b=await start('/schedule','admin'); const {page}=b;
const t=await page.evaluate(async()=>{const x=await fetch('https://sv10043api.qa.shopview.com/api/schedule/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=25&search=S2-14294',{credentials:'include',headers:{Accept:'application/json'}});return await x.text();});
fs.writeFileSync('/tmp/cln/s2-14294.json',t); await b.browser.close();
