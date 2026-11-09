import {sess,mkpost,load,j} from './common.mjs'; const s=await sess(); const post=mkpost(s); const S=load();
const r=(await s.api('/api/work-orders/lines/'+S.wo)).json; const L=r?.data?.collection||[];
for(const l of L){ for(const pr of (l.part_requests||[])){ console.log('pr',j(pr).slice(0,200)); const id=pr.id||pr.part_request_id; await post('/api/work-orders/part/remove-request/'+id,{}); } }
await s.close();
