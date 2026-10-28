// set-up for the two-tab Pick check: turn picking on (auto-pick off) and add an unpicked inventory part to a line
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,line]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
await s.go('/workorders'); await s.page.waitForTimeout(3000);
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const st=(await s.api('/api/organizations/settings')).json; const S=st.data||st; const keys=Object.keys(S).filter(k=>/pick/i.test(k)); console.log('pick keys',keys.map(k=>k+'='+S[k]).join(' '));
fs.writeFileSync(`/tmp/s10928/settings-${env}-before.json`,JSON.stringify(S));
const k=keys.find(x=>/auto.?pick/i.test(x)); if(k&&S[k]){ const ch=await post('/api/organizations/settings/change',{...S,[k]:false}); console.log('settings change',ch.status,JSON.stringify(ch.json).slice(0,200)); }
const inv=await s.api('/api/inventory/parts?'+new URLSearchParams({'pagination[page]':1,'pagination[rowsPerPage]':50,search:''}));
const P=(inv.json?.data?.collection||[]).find(x=>+x.quantity>=3);
const r=await post('/api/work-orders/part/make-request',{work_order:wo,line,description:P.name,part_number:P.part_number,quantity:1,part_source_type:'inventory',is_authorized:true,inventory_part_id:P.id,sell_price:+P.sell_price||10});
const id=r.json?.data?.id; console.log('make',r.status,id);
const L=(await s.api(`/api/work-orders/${wo}/parts/list-requests-by-line`)).json.data.collection; for(const l of L) for(const q of l.part_requests||[]) if(q.id===id) console.log('new part status',q.status,q.part_source_type,q.description);
await s.close();
