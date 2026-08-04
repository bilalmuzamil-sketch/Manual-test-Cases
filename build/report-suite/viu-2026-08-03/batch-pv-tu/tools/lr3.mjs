import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const LE='f8a8b802-7780-4b16-bf10-343caeb616b2', HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
let page=1, all=[];
while(page<=10){const r=await api(S,'GET',`/api/labour-types?pagination[page]=${page}&pagination[rowsPerPage]=200`);
 const c=r.body?.data?.collection||[]; all.push(...c); if(c.length<200) break; page++;}
console.log('labour types:',all.length);
for(const w of [['HD',HD],['LE',LE]]){
  const mine=all.filter(x=>x.workplaceId===w[1]);
  const def=mine.filter(x=>x.is_default);
  console.log(w[0],'types:',mine.length,'| default:',JSON.stringify(def.map(x=>({id:x.id,name:x.name,rate:x.labour_rate,locDefCount:x.locationsDefaultCount}))));
  console.log('   locationsDefaultCount>0:',JSON.stringify(mine.filter(x=>x.locationsDefaultCount>0).map(x=>({id:x.id,name:x.name,rate:x.labour_rate,c:x.locationsDefaultCount,isDef:x.is_default}))));
}
const p=(n,r,l=500)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
p('labour change empty', await api(S,'POST','/api/labour-types/change',{}));
p('labour update empty', await api(S,'POST','/api/labour-types/update',{}));
p('workplaces delete empty', await api(S,'POST','/api/workplaces/delete',{}));
