import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json'));
let r=await s.api('/api/auth/me/fe-permissions'); const p=r.json?.data?.fe_permissions||[]; console.log('perms count',p.length,'woMoveLabor',p.includes('woMoveLabor'));
r=await s.api('/api/work-orders/lines/'+W.wo); for(const l of r.json.data.collection){ console.log(l.line_name.trim(),'assigned_techs=',JSON.stringify(l.assigned_techs),'tech_assigned_id=',l.tech_assigned_id); console.log('  task keys',Object.keys(l.tasks[0]).join(',')); console.log('  task0',JSON.stringify(l.tasks[0]).slice(0,400)); }
await s.browser.close(); process.exit(0);
