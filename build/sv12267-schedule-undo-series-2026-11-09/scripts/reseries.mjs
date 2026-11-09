// usage: node reseries.mjs <tag> <startDate> <days> "<Tech Name>"  (WO already made)
import {sess,post,arr,j} from './common.mjs'; import fs from 'fs';
const [TAG,START,DAYS,TN]=process.argv.slice(2); const W=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8'));
const s=await sess(); const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const WP=ws.find(w=>w.id.startsWith('b3c8c820'));
await post(s,'/api/iam/change-location',{workplace_id:WP.id,workplace_timezone:WP.timezone||'America/Edmonton'});
const L=arr((await s.api('/api/staff?limit=200')).json?.data); const T=L.find(x=>(x.first_name+' '+x.last_name)===TN); console.log('tech',TN,T?.staff_id,T?.is_active,T?.workplace_id);
const body={workOrderId:W.wo,lineIds:W.lines,staffId:T.staff_id,startDate:START,startTime:'08:00',spreadMode:'series',totalMinutes:480*Number(DAYS),perDayMinutes:480}; if(process.env.COV){body.coverage=process.env.COV; }
const r=await post(s,'/api/schedule/shifts',body); console.log('series POST',r.status,j(r.json).slice(0,200));
const sh=r.json?.data?.shifts||[]; W.tech=TN; W.staffId=T.staff_id; W.shifts=sh.map(x=>({id:x.id,s:x.startsAt,e:x.endsAt,m:x.durationMinutes,series:x.seriesId}));
console.log(W.number,TN,JSON.stringify(W.shifts)); fs.writeFileSync(`/tmp/sv12267/wo-${TAG}.json`,JSON.stringify(W,null,1)); await s.close(); process.exit(0);
