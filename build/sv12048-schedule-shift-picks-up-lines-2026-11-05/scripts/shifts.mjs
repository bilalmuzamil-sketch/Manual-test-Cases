// usage: node shifts.mjs <tag> [fromDaysOffset=-2] [toDaysOffset=10] -> every board shift of the WO: id, coverage, staff, start/end, minutes, line count + line statuses; WO lines' technicians
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,F,T]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8'));
const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2500);
const day=o=>new Date(Date.now()+o*86400000).toISOString().slice(0,10);
const b=(await s.api(`/api/schedule/board?from=${day(Number(F||-2))}T00:00:00Z&to=${day(Number(T||10))}T23:59:59Z`)).json?.data?.board;
const mine=(b.shifts||[]).filter(x=>(x.workOrder?.id||x.workOrderId)===S.wo);
if(process.env.DUMP) console.log(JSON.stringify(mine[0],null,1).slice(0,2500));
const out=mine.map(x=>({id:x.id.slice(0,8),coverage:x.coverage,staff:x.staffId?.slice(0,8)||'none',dept:x.departmentId?.slice(0,8)||null,start:x.startsAt,end:x.endsAt,min:x.durationMinutes,series:x.seriesId?.slice(0,8)||null,lines:(x.lines||x.workOrderLines||[]).length,lineInfo:(x.lines||x.workOrderLines||[]).map(l=>(l.status||l.statusLabel||'')+':'+(l.id||l.lineId||'').slice(0,6)).join(',')}));
console.log('SHIFTS',JSON.stringify(out));
if(process.env.ENV==='prod'){ await s.close(); process.exit(0);} const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const ST={}; JSON.stringify(v,(k,val)=>{ if(val&&val.line_id&&val.status!==undefined) ST[val.line_id]=val.status; return val; });
const lt=(await s.api('/api/work-orders/'+S.wo+'/line-technicians')).json?.data?.lineTechnicians||[];
console.log('LINES',JSON.stringify(Object.keys(ST).map(id=>{ const x=lt.find(z=>z.lineId===id); return {id:id.slice(0,6),status:ST[id],techs:(x?.technicians||[]).map(t=>t.staffId.slice(0,8)+'/'+t.source)}; })));
await s.close(); process.exit(0);
