import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); console.log('marker',JSON.stringify(await s.marker()));
const me=arr((await s.api('/api/staff/my-workplaces')).json?.data); console.log('MY',me.map(w=>w.name+':'+w.id.slice(0,8)+':'+w.timezone).join(' ; '));
const prof=await s.page.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.split('\n')[0]); console.log('current',prof);
for(const q of [process.env.Q||'HEADLIGHT']){ const r=await s.api('/api/inventory/parts?limit=100&search='+encodeURIComponent(q)); const xs=arr(r.json?.data); console.log('Q',q,r.status,xs.length);
  for(const p of xs.slice(0,30)) console.log(' ',p.id,'|',p.part_number,'|',(p.catalog_part?.description||p.description||'').slice(0,50),'| qty',p.quantity,'| wp',(p.workplace_id||'').slice(0,8)); }
await s.close(); process.exit(0);
