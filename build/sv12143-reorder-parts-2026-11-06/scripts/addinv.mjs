// add a cored inventory part (INV) to the existing line of the saved WO
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const F=`/tmp/sv12143-${ENV}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
await post(s,'/api/iam/change-location',{workplace_id:S.W.id,workplace_timezone:S.W.timezone});
const all=arr((await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=50&search='+encodeURIComponent(process.env.INV))).json?.data);
const IP=all.find(x=>x.part_number===process.env.INV); console.log('inv part',IP?.part_number,IP?.core_charge,IP?.core_part_id,IP?.quantity);
const r=await post(s,'/api/work-orders/part/make-request',{line:S.L,work_order:S.id,description:IP.name,quantity:1,part_source_type:'inventory',inventory_part_id:IP.id,part_number:IP.part_number,sell_price:20,part_category_id:IP.category}); console.log(r.status,JSON.stringify(r.json).slice(0,200));
S.inv=IP.part_number; fs.writeFileSync(F,JSON.stringify(S,null,1)); await s.close(); process.exit(0);
