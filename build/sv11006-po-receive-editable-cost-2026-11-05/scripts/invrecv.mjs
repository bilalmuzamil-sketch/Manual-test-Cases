// usage: node invrecv.mjs <tag> <search> -> finds the newest PO matching search, opens its receive screen (row Receive), dumps Cost/Sell
import {sess,arr} from './common.mjs'; import fs from 'fs';
const [TAG,Q]=process.argv.slice(2); const s=await sess(); const p=s.page; const OUT=`../ev/branch-invpo-${TAG}`; fs.mkdirSync(OUT,{recursive:true});
await s.go('/parts/orders'); await p.waitForTimeout(2500);

await p.locator('tbody tr',{hasText:Q}).first().locator('[data-test-id="button_receive"]').click(); await p.waitForTimeout(4000);
const d=await p.evaluate(()=>({url:location.pathname+location.search,headers:[...document.querySelectorAll('thead th')].filter(x=>x.offsetParent).map(t=>t.innerText.trim()),inputs:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>(i.getAttribute('data-test-id')||'?')+'='+i.value+(i.readOnly?' RO':'')),rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,160))}));
console.log(JSON.stringify(d)); await p.screenshot({path:OUT+'/receive.png'}); fs.writeFileSync(OUT+'/dump.json',JSON.stringify(d,null,1)); await s.close(); process.exit(0);
