// Retest 28 Oct: find a work order with several parts (for the N1 work-order Parts tab comparison).
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2];
const s=env==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21'})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21'});
const l=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=200&pagination[sortBy]=status&pagination[descending]=false&filters[0][field]=status&filters[0][value]=approved&search=&showMyWorkOrders=0')).json;
for(const w of l.data.work_orders){ const r=(await s.api(`/api/work-orders/${w.id}/parts/list-requests-by-line?search=`)).json; const n=JSON.stringify(r).split('"part_number"').length-1; const long=process.env.CAT? (JSON.stringify(r).match(/"category[a-z_]*":"[^"]{16,}"/gi)||[]).length : (JSON.stringify(r).match(/"description":"[^"]{45,}"/g)||[]).length;
  if(n>=3&&long>=(+process.argv[3]||0)){ console.log('WO',w.id,w.number||w.work_order_number||'',n,'long',long); break; } }
process.exit(0);
