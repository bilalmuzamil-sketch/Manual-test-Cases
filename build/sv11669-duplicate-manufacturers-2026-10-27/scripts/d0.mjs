import {sess} from './lib.mjs';
const s=await sess(); const P=s.page;
const r=await s.api('/api/parts-catalogue/manufacturers'); const names=(Object.values(r.json?.data||{}).find(Array.isArray)||[]).map(m=>m.label.trim().toLowerCase());
for(const n of ['haldex','meritor','fleetguard','bendix','dayco','phillips','stemco','conmet']) console.log(n, names.filter(x=>x===n).length);
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
let b=await s.box('button_new_catalog_part'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1500);
console.log(await P.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+(e.offsetParent?'':'(h)')+'«'+(e.innerText||'').trim().slice(0,25).replace(/\n/g,' ')+'»').join(' | ')));
await P.screenshot({path:'../ev/d0-new-dialog.png'});
await s.browser.close(); process.exit(0);
