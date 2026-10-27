import {sess} from './lib.mjs'; const s=await sess();
for(const pn of ['QA-11669-IMP-1','QA-11669-IMP-6']){ const r=await s.api(`/api/inventory/parts?pagination[rowsPerPage]=5&pagination[page]=1&search=${pn}`); const a=Object.values(r.json?.data||{}).find(Array.isArray)||[];
 console.log(pn,r.status,a.length, JSON.stringify(a.filter(x=>JSON.stringify(x).includes(pn)).map(x=>({pn:x.part_number,qty:x.quantity??x.in_stock??x.available,bin:x.bin_location??x.bins??x.grid_location,vendor:x.vendor_name??x.vendor,cost:x.purchase_price??x.cost,min:x.min_qty??x.min,max:x.max_qty??x.max,keys:Object.keys(x).join(',').slice(0,300)}))).slice(0,900)); }
await s.browser.close(); process.exit(0);
