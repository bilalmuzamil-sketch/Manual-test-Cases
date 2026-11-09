// usage: node board.mjs <tag> -> the WO's board shifts: date, coverage, minutes, line ids
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG]=process.argv.slice(2); const W=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8'));
const s=await sess({dir:'/tmp/qa92'}); await s.go('/schedule'); await s.page.waitForTimeout(1500);
const b=(await s.api('/api/schedule/board?from=2026-10-26T00:00:00Z&to=2026-12-20T23:59:59Z')).json?.data?.board;
console.log(JSON.stringify((b?.shifts||[]).filter(x=>(x.workOrder?.id||x.workOrderId)===W.wo).map(x=>({id:x.id.slice(0,8),d:x.startsAt,cov:x.coverage,m:x.durationMinutes,staff:x.staffId.slice(0,8),lines:(x.lines||x.workOrderLines||[]).map(l=>(l.id||l.lineId||'').slice(0,8)+':'+(l.status||''))}))));
const w=(await s.api('/api/work-orders/'+W.wo+'/lines')).json; console.log('wo lines', JSON.stringify(w).slice(0,600));
await s.close(); process.exit(0);
