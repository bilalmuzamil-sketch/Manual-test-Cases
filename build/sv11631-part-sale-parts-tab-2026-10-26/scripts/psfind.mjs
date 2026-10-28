// Retest 28 Oct: find a part sale whose parts include a picked stock part (status received, source inventory).
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]||'prod';
const s=env==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21'}):await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21'});
const ids=new Set(); for(const path of ['/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=100&search=','/api/work-orders/part-sales?pagination[page]=1&pagination[rowsPerPage]=100&search=','/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=100&search=P2-&showMyWorkOrders=0']){
  const r=await s.api(path); console.log(path.split('?')[0],r.status); if(r.status!==200) continue; const t=JSON.stringify(r.json); (t.match(/"id":"[0-9a-f-]{36}"/g)||[]).forEach(x=>ids.add(x.slice(6,42))); }
let n=0; for(const id of ids){ const r=await s.api(`/api/work-orders/${id}/parts/list-requests-by-line?search=`); if(r.status!==200) continue; n++;
  const prs=(r.json.data?.collection||[]).flatMap(l=>l.part_requests||[]); const hit=prs.find(x=>/received|picked/i.test(x.status||'')&&/inventory/i.test(x.part_source_type||x.source||''));
  if(hit){ console.log('PS',id,hit.id,hit.status,hit.part_source_type,hit.description); break; } }
console.log('checked',n,'of',ids.size); process.exit(0);
