import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); console.log(JSON.stringify(ws.map(w=>[w.name,w.timezone,w.id.slice(0,8)]))); await s.close(); process.exit(0);
