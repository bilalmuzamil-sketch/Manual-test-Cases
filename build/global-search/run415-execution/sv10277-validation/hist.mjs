import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
let all=[],offset=0;
while(true){ const r=await api('get_tests/415&limit=250&offset='+offset); const b=r.body; const a=Array.isArray(b)?b:(b.tests||[]); all=all.concat(a); if(a.length<250) break; offset+=250; }
const S={1:'Passed',2:'Blocked',3:'Untested',4:'Retest',5:'Failed'};
const want=[55673,44825,44833,44836,44838,44865,45153,53601,53605,55660,55685,55736,55737];
for(const t of all){
  if(!want.includes(t.case_id)) continue;
  const r=await api('get_results/'+t.id+'&limit=10');
  const res=(r.body?.results||r.body||[]);
  const hist=res.map(x=>S[x.status_id]+'@'+String(x.created_on)).slice(0,6);
  const seq=res.map(x=>S[x.status_id]);
  const everPassed=seq.includes('Passed');
  console.log('C'+t.case_id, (S[t.status_id]||'').padEnd(8), '| ever passed before:', everPassed?'YES':'no ', '| history newest-first:', seq.join(' <- '));
}
