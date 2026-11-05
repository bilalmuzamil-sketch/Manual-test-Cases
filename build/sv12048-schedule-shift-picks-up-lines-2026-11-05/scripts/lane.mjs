// usage: node lane.mjs <staffIdPrefix> <date YYYY-MM-DD> -> board shifts on that staff/day: id, coverage, WO number, start, min, lines
import {sess} from './common.mjs'; const [ST,D]=process.argv.slice(2); const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2000);
const b=(await s.api(`/api/schedule/board?from=${D}T00:00:00Z&to=${D}T23:59:59Z`)).json?.data?.board;
console.log(JSON.stringify((b.shifts||[]).filter(x=>(x.staffId||'').startsWith(ST)).map(x=>({id:x.id,cov:x.coverage,wo:x.workOrder?.number||x.workOrder?.workOrderNumber,woId:x.workOrder?.id||x.workOrderId,start:x.startsAt,min:x.durationMinutes,lines:(x.lines||x.workOrderLines||[]).length}))));
await s.close(); process.exit(0);
