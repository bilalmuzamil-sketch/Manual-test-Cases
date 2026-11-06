// usage: node vfind.mjs <search> -> lists matching vendors (id, name, balance-ish fields)
import {sess} from './common.mjs'; const s=await sess(); await s.go('/parts/vendors'); await s.page.waitForTimeout(1500);
const r=await s.api('/api/parts-catalogue/vendors?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=30&search='+encodeURIComponent(process.argv[2]||''));
const c=r.json?.data?.collection||[]; console.log('n',c.length, c[0]?Object.keys(c[0]).join(','):'');
for(const v of c.slice(0,10)) console.log(v.id, v.name, JSON.stringify({bal:v.balance??v.open_balance??v.unpaid, ct:v.credit_term}));
await s.close(); process.exit(0);
