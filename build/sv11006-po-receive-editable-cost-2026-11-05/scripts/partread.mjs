import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const out=[]; JSON.stringify(v,(k,val)=>{ if(val&&val.part_number&&S.parts.some(x=>x.pn===val.part_number)&&val.cost!==undefined) out.push({pn:val.part_number,status:val.status_val||val.status,cost:val.cost,sell:val.sell_price}); return val; });
console.log(JSON.stringify(out)); await s.close(); process.exit(0);
