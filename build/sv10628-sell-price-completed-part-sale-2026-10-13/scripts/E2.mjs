import {ob,J} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1});
const env=JSON.parse(fs.readFileSync('env.json'));
const st=(await s.api('/api/staff?limit=200&search=tech%40shopview.com')).json; const tl=st.collection||st.data?.collection||st.data; const t=tl.find(x=>x.email==='tech@shopview.com'); console.log('TECH',J(t,700)); fs.writeFileSync('tech-before.json',JSON.stringify(t,null,1));
for(const wp of env.wps){ await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:wp[0],workplace_timezone:wp[2]})});
 const ps=(await s.api('/api/part-sales?limit=100&rowsPerPage=100')).json.data.partSales.filter(x=>x.status==='complete');
 for(const x of ps){ const l=(await s.api('/api/work-orders/lines/'+x.id)).json; const parts=(l.collection||l.data?.collection||[]).flatMap(li=>li.parts||[]); console.log(wp[1].slice(8,20),x.number,x.id,x.companyName,'parts:',parts.map(p=>[p.part_number||p.partNumber,p.status,p.part_source_type||p.source||p.sourceType,p.sell_price??p.sellPrice].join(':')).join(' ; ').slice(0,300)); }
}
const r=await s.api('/api/organizations/'+env.org+'/roles'); const roles=r.json.data?.collection||r.json.data||[]; fs.writeFileSync('roles.json',JSON.stringify(roles.map(x=>({id:x.id,name:x.name})),null,1)); console.log('roles',roles.map(x=>x.name+'='+x.id.slice(0,8)).join(' | ').slice(0,1500));
await s.close();
