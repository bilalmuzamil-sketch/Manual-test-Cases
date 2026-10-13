import {op,J,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const s=await op({dpr:1}); const p=s.page; await setLoc(s);
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="part_number_"]')].map(e=>e.getAttribute('data-test-id').replace('part_number_','')+' | '+e.closest('div.row,tr')?.innerText.replace(/\s+/g,' ').slice(0,160))).then(x=>x.join('\n')));
const inv=(await s.api('/api/inventory/parts?limit=5&search=ZZ11243-920183')).json.data.collection[0]; console.log('inventory now qty',inv.quantity,J(inv.binLocations));
await s.close();
