// usage: node entry.mjs <tag> -> Parts > purchase orders list: row actions for our PO; tries the Receive action
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${process.argv[2]}.json`,'utf8')); const po=S.parts[0].order.orderId;
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-explore-${process.argv[2]}`;
await s.go('/parts/orders'); await p.waitForTimeout(4000);
const ids=await p.evaluate(po=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&(b.getAttribute('data-test-id').includes(po)||/tab_|receive|search/i.test(b.getAttribute('data-test-id')))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,40)),po);
console.log(ids.slice(0,40)); await p.screenshot({path:OUT+'/po-list.png'});
await s.close(); process.exit(0);
