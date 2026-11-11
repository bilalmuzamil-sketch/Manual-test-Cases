// p08_billcheck.mjs — 11 Nov 2026: did the p07 receive make a vendor bill? Reads the order, the delivery search and the vendor's unpaid list.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs';
const OUT = new URL('./p08/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page); await S.loc(a);
const o = JSON.parse((await import('fs')).readFileSync(new URL('./p07/seedtest.json', import.meta.url))); 
const ord = await a.get('/api/inventory/orders/' + o.bill.orderId); console.log('order', ord.st, JSON.stringify(ord.j?.data?.order ? { status: ord.j.data.order.status, total: ord.j.data.order.total_price_decimal } : ord.j).slice(0, 300));
const del = await a.get('/api/inventory/deliveries?search=' + o.bill.number); console.log('deliveries', del.st, JSON.stringify(del.j).slice(0, 600));
const vt = await a.get('/api/parts-catalogue/vendor/' + o.vendor); console.log('vendor', JSON.stringify(vt.j).slice(0, 400));
await s.close(); process.exit(0);
