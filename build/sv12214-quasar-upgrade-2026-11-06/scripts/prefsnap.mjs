// read/save or restore the admin's Work Orders list preference on shared staging (restore-after discipline)
import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const F='../ev/staging-pref-before-2026-11-09.json';
if(process.env.RESTORE){ const v=JSON.parse(fs.readFileSync(F,'utf8')); const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({value:v})}); console.log('restore',r.status); }
const cur=(await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value; if(!process.env.RESTORE) fs.writeFileSync(F,JSON.stringify(cur)); console.log(JSON.stringify(cur).slice(0,400)); await s.close(); process.exit(0);
