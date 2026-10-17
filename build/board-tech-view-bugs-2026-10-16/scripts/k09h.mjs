import {session} from './rec.mjs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1});
let all=[]; for(let pg=1;pg<8;pg++){ const r=await s.api(`/api/staff?limit=100&page=${pg}`); const c=r.json?.data?.collection||r.json?.data?.staff||r.json?.data||[]; if(pg===1) console.log('keys',Object.keys(r.json?.data||{}),'first',JSON.stringify(c[0]||{}).slice(0,400)); if(!c.length) break; all=all.concat(c); if(c.length<100) break; }
const names=all.map(x=>((x.first_name||x.firstName||'')+' '+(x.last_name||x.lastName||'')).trim()||x.name||x.full_name);
for(const n of ['David Haynes','Karen Peck','Jason Johnson','Julie Olson','Felicia Wang','Admin ShopView']) console.log(n, names.filter(x=>x===n).length?'IN STAFF':'NOT IN STAFF', all.filter(x=>JSON.stringify(x).includes(n.split(' ')[1])).map(x=>JSON.stringify({f:x.first_name,l:x.last_name,id:x.id,u:x.user_id}).slice(0,150)).slice(0,2).join(' ; '));
console.log('total',all.length); await s.close();
