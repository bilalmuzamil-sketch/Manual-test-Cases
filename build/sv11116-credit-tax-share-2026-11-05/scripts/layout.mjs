// usage: node layout.mjs <withCreditInv> <noCreditInv> -> rects of tax name / % / amount / icon cells in both rows; screenshot crop region printed
import {sess} from './common.mjs'; const [A,B]=process.argv.slice(2); const s=await sess({dpr:2,dir:'/tmp/qa93'}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
for(const inv of [A,B]){ const row=p.locator('table tbody tr').filter({hasText:inv}).first(); await row.scrollIntoViewIfNeeded();
 const r=await row.evaluate(tr=>{ const out={}; const rb=tr.getBoundingClientRect(); out.row=[rb.y,rb.bottom].map(Math.round); const leaves=[...tr.querySelectorAll('*')].filter(e=>e.children.length===0&&e.offsetParent&&e.textContent.trim()); for(const e of leaves){ const t=e.textContent.trim(); if(/^(GST|5%|\$\d|info_outline)/.test(t)){ const b=e.getBoundingClientRect(); out[t]=[b.x,b.y,b.right,b.bottom,(b.y+b.bottom)/2].map(v=>Math.round(v*10)/10); } } return out; });
 console.log(inv,JSON.stringify(r)); }
await p.screenshot({path:'../ev/layout-rows.png'}); await s.close(); process.exit(0);
