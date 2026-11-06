import {sess,post} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
if(process.env.ENV==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
const r=(await s.api('/api/inventory/parts?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json?.data; const c=r.collection||r; console.log(c.slice(0,3).map(x=>x.part_number+' | '+(x.description||x.name)+' | qty '+x.quantity).join('\n'));
await s.close(); process.exit(0);
