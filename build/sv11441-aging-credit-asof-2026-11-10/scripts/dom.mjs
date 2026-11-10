import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(7000);
console.log(await p.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(r=>/Current \(/.test(r.innerText)); return tr?tr.outerHTML.slice(0,1500):'none';}));
await s.close(); process.exit(0);
