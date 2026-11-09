// ENV=prod node prodseed.mjs <WO number> <startDate> <days> <staffIdPrefix> -> rebooks a 2-day series on an existing production WO, writes /tmp/sv12267/wo-P.json
import {sess,post,arr,j} from './common.mjs'; import fs from 'fs';
const [NUM,START,DAYS,SP]=process.argv.slice(2); const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2500);
const ver=await s.page.evaluate(async()=>{const t=await (await fetch('/index.html?cb='+Date.now(),{cache:'no-store'})).text();return (t.match(/app-version" content="([^"]+)/)||[])[1];});
const b=(await s.api('/api/schedule/board?from=2026-10-26T00:00:00Z&to=2026-12-20T23:59:59Z')).json?.data?.board; const sh=(b?.shifts||[]).find(x=>JSON.stringify(x.workOrder||{}).includes('"'+NUM+'"')); const wo={id:sh?.workOrder?.id, company_name:sh?.workOrder?.customerName||sh?.workOrder?.company?.name}; console.log('build',ver,'found',j(sh?.workOrder));
const L=arr((await s.api('/api/staff?limit=300')).json?.data); const T=L.find(x=>(x.staff_id||'').startsWith(SP)||(x.id||'').startsWith(SP)); console.log('tech',T?.first_name,T?.last_name,T?.staff_id);
const det=(await s.api('/api/work-orders/'+wo.id)).json?.data; const lines=arr(det?.lines||det?.work_order?.lines).filter(l=>/authori/.test(l.status||'')).map(l=>l.line_id||l.id);
console.log('lines',lines.length, j(Object.keys(det||{})));
const LIDS=(sh.lines||sh.workOrderLines||[]).map(l=>l.id||l.lineId); console.log('existing shift',sh.id,sh.startsAt,sh.staffId,sh.coverage,LIDS.length);
const body={workOrderId:wo.id,lineIds:LIDS,staffId:sh.staffId,startDate:START,startTime:'08:00',spreadMode:'series',totalMinutes:480*Number(DAYS),perDayMinutes:480};
const c=await post(s,'/api/schedule/shifts',body); console.log('series',c.status,j(c.json));
const W={tag:'P',wo:wo.id,number:NUM,customerName:wo.company_name||wo.customer?.name||det?.company?.name,tech:(T?T.first_name+' '+T.last_name:sh.staffId),lines:LIDS}; fs.writeFileSync('/tmp/sv12267/wo-P.json',JSON.stringify(W,null,1)); console.log(j(W));
await s.close(); process.exit(0);
