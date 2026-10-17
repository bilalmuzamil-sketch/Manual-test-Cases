import {session} from './rec.mjs';
const [q,d]=process.argv.slice(2); const s=await session({quick:q,vp:{width:800,height:600},dpr:1});
const v=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const nv={...v}; if(d==='none') delete nv.density; else nv.density=d;
const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:nv})}); console.log(q,'density',v.density,'->',d,r.status); await s.close();
