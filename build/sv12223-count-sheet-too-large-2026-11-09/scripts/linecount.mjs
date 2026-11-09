import {sess} from './common.mjs';
const s=await sess(); await s.go('/parts/inventory');
for(const q of JSON.parse(process.env.Q)){ let n=0,parts=0,page=1;
  while(true){ const r=await s.api(`/api/inventory/parts?pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=${page}&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&supply_filter=all&search=${encodeURIComponent(q)}`);
    const c=r.json?.data?.collection||[]; for(const x of c){parts++; n+=Math.max(1,(x.binLocations||[]).length);} if(c.length<500)break; page++; }
  console.log(JSON.stringify({q,parts,lines:n}));}
await s.browser.close();
