import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,line]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob(); const r=await s.api('/api/work-orders/lines/change-story',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({line_id:line,tech_story:'ZZAUTOTEST SV-10642 new line done',work_order_id:wo})}); console.log('story',r.status); await s.close();
