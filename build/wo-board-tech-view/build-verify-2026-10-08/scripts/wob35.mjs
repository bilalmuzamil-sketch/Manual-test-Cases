import {start} from './woblib.mjs'; import fs from 'fs';
const b=await start('/schedule','admin'); const {page}=b;
const j=await page.evaluate(async()=>{const x=await fetch('https://sv10043api.qa.shopview.com/api/schedule/board?from=2026-10-08T06:00:00.000Z&to=2026-10-12T06:00:00.000Z',{credentials:'include',headers:{Accept:'application/json'}});return await x.text();});
fs.writeFileSync('/tmp/cln/sched-board.json',j);
await b.browser.close();
