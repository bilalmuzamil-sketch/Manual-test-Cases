import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); console.log('workplaces',JSON.stringify(ws.map(w=>[w.name,w.timezone,w.id.slice(0,8)])));
const me=(await s.api('/api/auth/me')).json; console.log('me',JSON.stringify(me).match(/"(current_)?workplace[a-z_]*":[^,]*|timezone":"[^"]*"/gi)?.slice(0,6));
for(const n of (process.env.NUMS||'').split(',').filter(Boolean)){ const r=(await s.api('/api/work-orders?search='+n+'&limit=3')).json; const w=JSON.stringify(r).match(/"workplace[a-z_]*":"[^"]*"/gi); console.log(n,w?.slice(0,3)); }
await s.close(); process.exit(0);
