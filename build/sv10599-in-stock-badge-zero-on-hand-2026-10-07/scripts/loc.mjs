import {ob,j} from './lib.mjs'; const s=await ob();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; console.log(j(wps.map(w=>[w.id,w.name,w.timezone])));
const hd=(await s.api('/api/inventory/parts?search=448-4865')).json.data.collection.find(x=>x.part_number==='448-4865');
const L=wps.find(w=>/Lethbridge/i.test(w.name)); if(!L){console.log('no lethbridge');process.exit(0);}
console.log('switch',(await P('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone})).status);
const there=(await s.api('/api/inventory/parts?search=448-4865')).json.data.collection; console.log('at L',j(there.map(x=>[x.part_number,x.quantity,x.workplace_id,x.binLocations])));
const bins=await s.api('/api/inventory/bin-locations'); console.log('bins',bins.status,j(bins.json,400));
await s.close();
