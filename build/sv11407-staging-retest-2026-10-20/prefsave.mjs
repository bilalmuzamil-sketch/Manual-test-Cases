import {session} from './rec.mjs'; import fs from 'fs'; const [q,mode]=process.argv.slice(2); const s=await session({quick:q,vp:{width:800,height:600}});
const f=`/tmp/qa11310/ev07/prefs0-${q}.json`;
if(mode==='save'){ const v=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; fs.writeFileSync(f,JSON.stringify(v)); console.log(q,'saved',JSON.stringify(v).length); }
else { const v=JSON.parse(fs.readFileSync(f)); const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); const now=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; console.log(q,'restore',r.status,'identical',JSON.stringify(now)===JSON.stringify(v)); }
await s.close();
