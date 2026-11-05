import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const c=arr((await s.api('/api/work-orders/canned-lines')).json?.data); console.log('count',c.length,'keys',Object.keys(c[0]).join(','));
console.log(c.filter(x=>Number(x.total_parts)===0).map(x=>[x.canned_line_name,x.time_estimate,x.estimated_time,x.labour_time,x.workplace_id?.slice(0,8),x.fixed_line_total].join('|')).slice(0,25).join('\n'));
await s.close(); process.exit(0);
