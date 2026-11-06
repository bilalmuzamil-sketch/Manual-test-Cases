// usage: node ids.mjs -> prints org A ids: workplaces, departments, a few staff (id,name,role), and one approved WO with its first lines
import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const me=await s.api('/api/auth/me'); console.log('ME',JSON.stringify(me.json?.data||me.json).slice(0,300));
const wp=await s.api('/api/staff/my-workplaces'); console.log('WP',JSON.stringify(wp.json).slice(0,500));
const st=await s.api('/api/staff?limit=200'); console.log('STAFF',arr(st.json.data??st.json).slice(0,40).map(x=>[x.id,x.user_id,x.first_name,x.last_name,x.role_label].join('|')).join('\n'));
const d=await s.api('/api/departments'); console.log('DEP',d.status,JSON.stringify(d.json).slice(0,500));
await s.close(); process.exit(0);
