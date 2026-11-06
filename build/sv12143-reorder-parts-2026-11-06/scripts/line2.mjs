import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const F=`/tmp/sv12143-${ENV}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500); const P=(u,b)=>post(s,u,b);
await P('/api/iam/change-location',{workplace_id:S.W.id,workplace_timezone:S.W.timezone});
const cl=arr((await s.api('/api/work-orders/canned-lines?limit=200')).json?.data).filter(x=>x.workplace_id===S.W.id&&Number(x.total_parts)===0);
await P(`/api/work-orders/${S.id}/lines/create-from-canned-line`,{canned_line_id:(cl[1]||cl[0]).id,status:'authorized'}); const lines=arr((await s.api('/api/work-orders/lines/'+S.id)).json?.data); const L2=lines.find(l=>l.line_id!==S.L).line_id;
const cats=arr((await s.api('/api/inventory/categories')).json?.data); const r=await P('/api/work-orders/part/make-request',{line:L2,work_order:S.id,description:'ZZ-MOVED-PART',quantity:1,part_source_type:'vendor',part_number:'ZZ-MOVED-PART',sell_price:10,cost:5,part_category_id:cats[0]?.value||cats[0]?.id});
S.L2=L2; S.moved=r.json?.data?.id; fs.writeFileSync(F,JSON.stringify(S,null,1)); console.log('line2',L2,'part',r.status,S.moved); await s.close(); process.exit(0);
