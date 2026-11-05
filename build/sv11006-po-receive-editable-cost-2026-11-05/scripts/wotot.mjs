import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const L=[]; JSON.stringify(v,(k,val)=>{ if(val&&val.line_id&&val.fixed_line_total!==undefined) L.push({fixed:val.fixed_line_total,total:val.total||val.line_total||val.total_price,parts:val.total_parts_sell_price}); return val; }); console.log(JSON.stringify(L)); await s.close(); process.exit(0);
