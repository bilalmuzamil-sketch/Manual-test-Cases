import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const q=o=>new URLSearchParams(o).toString();
const all=[]; for(const st of ['approved','in_progress','estimate','review']){ const r=await s.api('/api/work-orders?'+q({'pagination[page]':1,'pagination[rowsPerPage]':100,'pagination[sortBy]':'companyName','pagination[descending]':false,search:'',showMyWorkOrders:0,'filters[0][field]':'status','filters[0][value]':st}));
  for(const w of (r.json?.data?.work_orders||[])) all.push(w); }
const c=all.filter(w=>w.partRequestsCount>=4&&w.linesCount>=2).sort((a,b)=>b.partRequestsCount-a.partRequestsCount).slice(0,6);
for(const w of c){ const pr=await s.api(`/api/work-orders/${w.id}/parts/list-requests-by-line`); const lines=pr.json?.data||pr.json; const flat=JSON.stringify(lines);
  const vend=(flat.match(/"vendor_id":"[0-9a-f-]{36}"/g)||[]).length, cat=(flat.match(/"category(_id)?":"[0-9a-f-]{36}"/g)||[]).length;
  console.log(w.id,w.number,w.status,w.companyName,'parts',w.partRequestsCount,'lines',w.linesCount,'vendorIds',vend,'catIds',cat,'unrecv',w.unreceivedPartRequestsCount,'http',pr.status); }
await s.close();
