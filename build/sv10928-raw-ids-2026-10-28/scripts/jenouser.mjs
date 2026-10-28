// Set-up for "Journal Entry with no user": as Krystal Davis (switch-user) make one stock count, then (as admin) delete her.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const U={user:'0201ef09-fc90-43e3-8996-a9fe260e870b',staff:'45462c2e-36ed-4bfd-bb78-fe0bbb0136f1'};
const ck=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const post=(s,u,b,m='POST')=>s.api(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});
const je=async s=>((await s.api('/api/bookkeeping/unexported-items?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=100&filters%5B0%5D%5Bfield%5D=groupName&filters%5B0%5D%5Bvalue%5D=journal_entry')).json?.data?.collection||[]);
let s=await open({env:'branch',ticket:'10928',cookies:ck,dir:'/tmp/qa28'});
console.log('JE before',JSON.stringify((await je(s)).map(x=>[x.number,x.customer])));
const sw=await post(s,'/api/switch-user',{user_id:U.user}); console.log('switch-user',sw.status);
const me=(await s.api('/api/iam/view-profile/')).json?.data?.user; console.log('now',me?.email);
const P=((await s.api('/api/inventory/parts?limit=5&search=ZZPV590814')).json?.data?.parts||[])[0]||((await s.api('/api/inventory/parts?limit=5&search=ZZPV590814')).json?.data?.collection||[])[0];
const cc=await post(s,'/api/inventory/parts/cycle-count',{part_quantities:[{id:P.id,bins:[{id:P.binLocations[0].binLocationId,quantity:1}]}]}); console.log('cycle count as Krystal',cc.status);
await s.close();
if(cc.status!==200||me?.email!=='krystal.davis@staging.shopview.local'){ console.log('STOP: stock count not made as Krystal — not deleting'); process.exit(1); }
s=await open({env:'branch',ticket:'10928',cookies:ck,dir:'/tmp/qa28'});
const me2=(await s.api('/api/iam/view-profile/')).json?.data?.user; console.log('back as',me2?.email);
const after1=await je(s); console.log('JE after count',JSON.stringify(after1.map(x=>[x.number,x.customer])));
const d=await post(s,`/api/staff/${U.staff}`,null,'DELETE'); console.log('delete staff',d.status,JSON.stringify(d.json||d.text).slice(0,150));
const after2=await je(s); console.log('JE after delete',JSON.stringify(after2.map(x=>[x.number,x.customer,x.referenceId])));
await s.close(); process.exit(0);
