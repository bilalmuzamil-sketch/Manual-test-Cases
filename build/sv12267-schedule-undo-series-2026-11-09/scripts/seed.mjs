// usage: node seed.mjs <tag> <startDate YYYY-MM-DD> <days> <techIndex>  -> fresh WO (1 approved line) + day-by-day series 8h/day on an active tech
import {sess,post,arr,j} from './common.mjs'; import fs from 'fs'; import {execSync} from 'child_process';
const [TAG,START,DAYS,TI]=process.argv.slice(2);
execSync(`node wo.mjs ${TAG} 1`,{stdio:'inherit'});
const W=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8'));
const s=await sess(); const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const WP=ws.find(w=>w.id.startsWith('b3c8c820'));
await post(s,'/api/iam/change-location',{workplace_id:WP.id,workplace_timezone:WP.timezone||'America/Edmonton'});
const L=arr((await s.api('/api/staff?limit=200')).json?.data).filter(x=>/tech/i.test(x.role_label||'')&&x.is_active&&(x.workplace_id===WP.id||(x.defaultWorkplace||'').startsWith?.('b3c8')||true));
const T=isNaN(Number(TI))?L.find(x=>(x.first_name+' '+x.last_name)===TI):L[Number(TI||0)]; console.log('tech',T.first_name,T.last_name,'staff_id',T.staff_id,'id',T.id);
const body={workOrderId:W.wo,lineIds:W.lines,staffId:T.staff_id,startDate:START,startTime:'08:00',spreadMode:'series',totalMinutes:480*Number(DAYS),perDayMinutes:480};
let r=await post(s,'/api/schedule/shifts',body); console.log('series POST',r.status,j(r.json));
if(r.status>=400){ body.staffId=T.id; r=await post(s,'/api/schedule/shifts',body); console.log('retry with id',r.status,j(r.json)); }
const sh=r.json?.data?.shifts||[]; W.tech=T.first_name+' '+T.last_name; W.staffId=body.staffId; W.shifts=sh.map(x=>({id:x.id,s:x.startsAt,e:x.endsAt,m:x.durationMinutes,series:x.seriesId}));
console.log(W.number,W.tech,JSON.stringify(W.shifts)); fs.writeFileSync(`/tmp/sv12267/wo-${TAG}.json`,JSON.stringify(W,null,1)); await s.close(); process.exit(0);
