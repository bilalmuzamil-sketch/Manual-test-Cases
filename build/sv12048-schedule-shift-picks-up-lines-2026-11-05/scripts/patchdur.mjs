import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,MIN]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2000);
const d=new Date(Date.now()+86400000).toISOString().slice(0,10); const b=(await s.api(`/api/schedule/board?from=${d}T00:00:00Z&to=${d}T23:59:59Z`)).json.data.board; const sh=b.shifts.find(x=>(x.workOrder?.id||x.workOrderId)===S.wo);
const r=await s.api('/api/schedule/shifts/'+sh.id,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({durationMinutes:Number(MIN),scope:'shift'})}); console.log('patch',r.status,JSON.stringify(r.json).slice(0,150)); await s.close(); process.exit(0);
