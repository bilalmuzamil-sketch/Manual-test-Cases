import {sess,arr} from './common.mjs';
const s=await sess(); console.log('marker',JSON.stringify(await s.marker()));
await s.go('/workorders'); await s.page.waitForTimeout(3000);
for(const q of ['HEADLIGHT','LAMP']){ const r=await s.api('/api/inventory/parts?limit=20&search='+encodeURIComponent(q)); console.log('Q',q,r.status, JSON.stringify(r.json).slice(0,200));
  for(const p of arr(r.json?.data).slice(0,12)) console.log(' ',p.id,'|',p.part_number||p.partNumber,'|',(p.description||'').slice(0,60),'| qty',p.quantity??p.on_hand,'| wp',p.workplace_id||p.workplaceId); }
const me=(await s.api('/api/staff/my-workplaces')).json?.data; console.log('MY',arr(me).map(w=>w.name+':'+w.id.slice(0,8)).join(', '));
await s.close(); process.exit(0);
