import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/parts/orders');
const all=JSON.parse(fs.readFileSync('../ev/orders-'+(process.env.ENV||'branch')+'.json')).none;
const norm=x=>x.toLowerCase(); const strip=x=>x.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const expect=t=>{ const w=norm(t).split(/[^\p{L}\p{N}]+/u).filter(Boolean); return new Set(all.filter(o=>(o.v||[]).some(v=>w.every(x=>norm(v).includes(x))||strip(v).startsWith(strip(t)))||(o.n||'').toLowerCase().includes(norm(t))).map(o=>o.id)); };
for(const t of JSON.parse(process.env.T)){
  let got=[],pg=1; while(true){ const r=await s.api(`/api/inventory/orders?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=${pg}&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&search=${encodeURIComponent(t)}`); const c=r.json?.data?.collection||[]; got.push(...c); if(c.length<30)break; pg++; }
  const g=new Set(got.map(o=>o.id)), e=expect(t); const miss=[...e].filter(x=>!g.has(x)), extra=[...g].filter(x=>!e.has(x));
  const o={t,got:g.size,expected:e.size,missing:miss.length,extra:extra.length,sample:got.slice(0,3).map(x=>x.order_number+':'+(x.vendorNames||[]).join('|'))};
  console.log(JSON.stringify(o)); fs.appendFileSync('../ev/search-runs.jsonl',JSON.stringify({...o,env:process.env.ENV||'branch',at:new Date().toISOString(),extraIds:extra.slice(0,5)})+'\n');
}
await s.browser.close();
