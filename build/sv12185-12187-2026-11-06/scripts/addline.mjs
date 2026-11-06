// node addline.mjs <woId> <status> -> add a canned line with that status to the WO (pending = Needs Approval); prints line id + statuses
import {sess,post} from './common.mjs';
const E=process.env.ENV==='prod'; const [wo,st]=process.argv.slice(2); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500); const arr=x=>Array.isArray(x)?x:(x?.collection||[]);
if(E){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
const all=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=all.find(x=>Number(x.total_parts)===0);
const r=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',(st==='none'?{canned_line_id:can.id}:{canned_line_id:can.id,status:st})); console.log('create',r.status,JSON.stringify(r.json).slice(0,150));
const L=(await s.api('/api/work-orders/lines/'+wo)).json?.data; console.log(JSON.stringify(L).match(/"status":"[a-z_]+"/g)?.join(' '));
await s.close(); process.exit(0);
