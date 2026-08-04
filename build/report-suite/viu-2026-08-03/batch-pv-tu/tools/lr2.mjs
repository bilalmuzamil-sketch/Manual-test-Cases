import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const p=(n,r,l=700)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
for(const path of ['/api/labour-types','/api/labor-types','/api/labour-types?pagination[rowsPerPage]=50']) p(path, await api(S,'GET',path));
p('workplaces create empty', await api(S,'POST','/api/workplaces/create',{}));
p('workplaces add empty', await api(S,'POST','/api/workplaces/add',{}));
