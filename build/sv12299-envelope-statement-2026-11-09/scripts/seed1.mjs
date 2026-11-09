import {sess,mkpost,load,save,j} from './common.mjs';
const s=await sess(); const post=mkpost(s); const S=load();
const ws=(await s.api('/api/staff/my-workplaces')).json.data.collection; const wp=ws.find(w=>/Trucks Hill 2/.test(w.name))||ws[0];
await post('/api/iam/change-location',{workplace_id:wp.id,workplace_timezone:wp.timezone}); S.wp=wp.id;
const c=await post('/api/customers/create',{name:'ZZAUTOTEST SV12299 Charge Account'}); S.cid=c.json?.data?.company_id||c.json?.data?.id;
await post('/api/customers/change',{id:S.cid});
const cv=(await s.api('/api/customers/view/'+S.cid)).json?.data; console.log('view keys',Object.keys(cv?.company||cv||{}).join(','));
save(S); await s.close();
