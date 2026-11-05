import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${process.env.ENV||'branch'}-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
console.log('FIN',(await p.locator('[data-test-id="financial_info_card"]').innerText()).replace(/\s+/g,' '));
const inv=S.invoice?.invoice_id; if(inv){ const r=await s.api('/api/invoices/'+inv); console.log('INV',r.status,JSON.stringify(r.json).match(/"(total|subtotal|parts_total|total_parts)[a-z_]*":"?[0-9.]+/g)?.slice(0,8)); }
await p.screenshot({path:`../ev/branch-${process.argv[2]}-fin.png`}); await s.close(); process.exit(0);
