import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(7000);
await p.click('[data-test-id="filter_chip_pastDue"]'); await p.waitForTimeout(2000);
console.log(await p.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu,.q-dialog,[role=dialog],[role=menu],[role=listbox]')].map(x=>x.outerHTML.slice(0,8000)); return m.join('\n---\n')||'none';}));
await s.close(); process.exit(0);
