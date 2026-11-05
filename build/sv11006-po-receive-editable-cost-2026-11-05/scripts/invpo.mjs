// usage: node invpo.mjs <tag> <partNumber> <vendorName> -> creates an INVENTORY PO on screen (Parts > Purchase Orders > New), then opens its receive screen and dumps it
import {sess} from './common.mjs'; import {clickId,typeId,qSelect,tableText} from './po9833.mjs'; import fs from 'fs';
const [TAG,PN,VEN]=process.argv.slice(2); const s=await sess(); const p=s.page; const OUT=`../ev/branch-invpo-${TAG}`; fs.mkdirSync(OUT,{recursive:true});
await s.go('/parts/orders'); await p.waitForTimeout(3000); await clickId(p,'button_new_po'); await p.waitForTimeout(2500);
console.log('vendor ->',await qSelect(p,'select_order_vendor',VEN)); await p.waitForTimeout(800);
console.log('part ->',await qSelect(p,'select_part',PN,{typed:PN})); await p.waitForTimeout(800);
await typeId(p,'input_order_item_quantity',1); await typeId(p,'input_order_item_cost','12'); await clickId(p,'button_add_order_item'); await p.waitForTimeout(1800);
console.log(await tableText(p)); await clickId(p,'button_save_and_close_order'); await p.waitForTimeout(3500);
const w=s.writes.filter(x=>/order/i.test(x)).slice(-3); console.log(w.map(x=>x.slice(0,200)));
await s.go('/parts/orders'); await p.waitForTimeout(3000); const row=p.locator('tbody tr').filter({hasText:'5 Star'}).first(); console.log('first row',(await p.locator('tbody tr').first().innerText()).replace(/\s+/g,' ').slice(0,160));
await p.locator('tbody tr').first().locator('[data-test-id="button_receive"]').click(); await p.waitForTimeout(4000);
const d=await p.evaluate(()=>({url:location.pathname+location.search,headers:[...document.querySelectorAll('thead th')].filter(x=>x.offsetParent).map(t=>t.innerText.trim()),inputs:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>(i.getAttribute('data-test-id')||'?')+'='+i.value),rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,160))}));
console.log(JSON.stringify(d)); await p.screenshot({path:OUT+'/receive.png'}); fs.writeFileSync(OUT+'/dump.json',JSON.stringify(d,null,1)); await s.close(); process.exit(0);
