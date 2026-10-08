import {op} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
for (const f of ['wo-A','wo-B']){ const W=JSON.parse(fs.readFileSync('prod/'+f+'.json'));
 const r=await s.api('/api/work-orders/lines/'+W.wo); const c=(r.json?.collection||r.json?.data?.collection||[]);
 console.log('==',f, 'status',r.status);
 for(const l of c){ console.log(' line',l.name||l.title,'labor',l.labor_total??l.laborTotal, JSON.stringify((l.adjustments||[]).map(a=>[a.name,a.kind,a.calculationType||a.calculation_type,a.amount,a.resolvedAmount??a.resolved_amount])));
  for(const p of (l.parts||[])) console.log('   part',p.part_number||p.partNumber,p.sell_price,p.quantity, JSON.stringify((p.adjustments||[]).map(a=>[a.name,a.kind,a.calculationType||a.calculation_type,a.amount,a.resolvedAmount??a.resolved_amount])));}
}
await s.close();
