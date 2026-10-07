import {ob,j} from './lib.mjs'; const s=await ob();
for(const pn of process.argv.slice(2)) console.log(pn,j((await s.api('/api/inventory/parts?search='+encodeURIComponent(pn))).json.data.collection.filter(x=>x.part_number===pn).map(x=>[x.quantity,x.binLocations.map(b=>b.name+':'+b.quantity)])));
await s.close();
