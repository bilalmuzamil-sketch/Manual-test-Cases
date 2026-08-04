import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const p=(n,r,l=400)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
p('delete bogus id', await api(S,'POST','/api/workplaces/delete',{id:'00000000-0000-0000-0000-000000000000'}));
p('delete bogus workplace_id', await api(S,'POST','/api/workplaces/delete',{workplace_id:'00000000-0000-0000-0000-000000000000'}));
p('set-default probe', await api(S,'POST','/api/labour-types/set-default',{}));
p('labour remove probe', await api(S,'POST','/api/labour-types/remove',{}));
