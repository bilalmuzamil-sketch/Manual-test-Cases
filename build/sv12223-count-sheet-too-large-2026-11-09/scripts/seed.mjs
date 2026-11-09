// assign bin "ZZRING12223" to N more parts whose name/number/bins don't contain RING. usage: N=41 node seed.mjs
import {sess,post} from './common.mjs'; import fs from 'fs';
const N=+process.env.N; const done=fs.existsSync('../ev/seeded.json')?JSON.parse(fs.readFileSync('../ev/seeded.json')):[];
const s=await sess(); await s.go('/parts/inventory');
const r=await s.api(`/api/inventory/parts?pagination%5BrowsPerPage%5D=300&pagination%5Bpage%5D=3&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&supply_filter=all&search=`);
const cand=r.json.data.collection.filter(x=>!/ring/i.test(x.name+' '+x.part_number+' '+(x.binLocations||[]).map(b=>b.name).join(' ')) && !done.includes(x.id));
let k=0; for(const x of cand){ if(k>=N)break;
  const w=await post(s,`/api/inventory/parts/${x.id}/bin-locations`,{binLocationId:'1d158ef9-2bd0-42d2-bd40-f691fa1afd3f',quantity:0,isDefault:false});
  console.log(x.part_number,w.status,JSON.stringify(w.json||w.text).slice(0,150)); if(w.status<300){done.push(x.id);k++;} else break; }
fs.writeFileSync('../ev/seeded.json',JSON.stringify(done)); console.log('total seeded',done.length);
await s.browser.close();
