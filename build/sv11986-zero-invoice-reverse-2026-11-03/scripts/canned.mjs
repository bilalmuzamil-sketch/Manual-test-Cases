import {sess,arr} from './common.mjs'; const s=await sess();
const cls=arr((await s.api('/api/work-orders/canned-lines')).json?.data); console.log('n',cls.length);
const z=process.env.ALL?cls:cls.filter(c=>Number(c.total_parts)===0&&(Number(c.time_estimate)===0||Number(c.tech_time)===0||String(c.fixed_line_total)==='0'||c.fixed_price===0));
for(const c of z.slice(0,15)) console.log(c.id,'|',c.canned_line_name,'| te',c.time_estimate,'tt',c.tech_time,'fp',c.fixed_price,'flt',c.fixed_line_total,'rate',c.labour_rate,'wp',c.workplace_id?.slice(0,8));
await s.close(); process.exit(0);
