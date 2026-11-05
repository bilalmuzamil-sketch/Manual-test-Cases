// usage: node shiftlines.mjs <tag> <keepIdx,...> -> PATCH the WO's (first) shift lineIds to only those lines (set-up only)
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,KEEP]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2000);
const day=o=>new Date(Date.now()+o*86400000).toISOString().slice(0,10); const b=(await s.api(`/api/schedule/board?from=${day(-2)}T00:00:00Z&to=${day(10)}T23:59:59Z`)).json.data.board; const sh=b.shifts.find(x=>(x.workOrder?.id||x.workOrderId)===S.wo);
const ids=KEEP.split(',').map(i=>S.lines[Number(i)]);
for(const body of [{lineIds:ids,scope:'shift'},{line_ids:ids,scope:'shift'},{workOrderLineIds:ids,scope:'shift'}]){ const r=await s.api('/api/schedule/shifts/'+sh.id,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); console.log(Object.keys(body)[0],r.status,JSON.stringify(r.json).slice(0,200)); }
await s.close(); process.exit(0);
