// p03_vendorpage.mjs — 11 Nov 2026: what can a vendor's Unpaid Invoices page and the Purchase Orders page create? (looking for the
// shortest route to a vendor bill for the A/P seeds). Lists buttons with data-test-id; records POST calls if any. Read only.
import { start } from './lib.mjs';
const OUT = new URL('./p03/', import.meta.url).pathname; const s = await start(OUT); const p = s.page;
const btns = () => p.evaluate(`[...document.querySelectorAll('main button, main a.q-btn')].map(b => (b.getAttribute('data-test-id')||'') + '=' + b.innerText.replace(/\\s+/g,' ').trim()).filter(x => x.length > 1).slice(0, 40)`);
await s.go('/parts/vendor/98c705a1-ba42-42c1-b291-303deb797d3b/unpaid-invoices'); await p.waitForTimeout(4000); console.log('vendor unpaid:', JSON.stringify(await btns())); await s.shot('vendor-unpaid');
await s.go('/parts/orders'); await p.waitForTimeout(4000); console.log('orders:', JSON.stringify(await btns())); await s.shot('orders');
await s.go('/parts/deliveries'); await p.waitForTimeout(4000); console.log('deliveries:', JSON.stringify(await btns())); await s.shot('deliveries');
await s.close(); process.exit(0);
