import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X,Y]=S.wos; const T=JSON.parse(rd('br-tech.json')); const Z=JSON.parse(rd('br-z.json')); const V=JSON.parse(rd('br-v.json')); const W=JSON.parse(rd('br-w.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const ents=async wo=>(await s.api(`/api/technician-tasks/list?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&filters%5B0%5D%5Bfield%5D=work_order&filters%5B0%5D%5Bvalue%5D=${wo}&search=`)).json?.data?.collection||[];
const fmt=c=>c.map(x=>[x.id.slice(0,8),x.workplace_id===B.id?'LETH':'HD',x.staff_id.slice(0,8),x.end_date?'closed':'OPEN',(x.description||'check-in').slice(0,28)].join('/')).join(' ; ');
for(const L of [A,B]){ await post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone}); console.log('@',L.name.slice(8));
  for(const [k,id] of [['X',X.woId],['Z',Z.zId],['V',V.vId]]) console.log('  ',k,fmt(await ents(id)));
  const b=(await s.api('/api/work-orders/board?search=S10579-175&showMyWorkOrders=0&fill=12&perGroup=25')).json; const all=[]; const walk=o=>{ if(Array.isArray(o)) o.forEach(walk); else if(o&&typeof o==='object'){ if(o.id&&o.number) all.push(o); Object.values(o).forEach(walk);} }; walk(b);
  for(const [k,id] of [['X',X.woId],['Y',Y.woId],['W',W.wId],['V',V.vId],['Z',Z.zId]]){ const r=all.find(x=>x.id===id); if(r) console.log('   board',k,r.number,'lt=',JSON.stringify((r.lineTechnicians||[]).map(t=>t.firstName+' '+t.lastName)),'cl=',JSON.stringify((r.clockedInTechnicians||[]).map(t=>t.firstName+' '+t.lastName))); } }
process.exit(0);
