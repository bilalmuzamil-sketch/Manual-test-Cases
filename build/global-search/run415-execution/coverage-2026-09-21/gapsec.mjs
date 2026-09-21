import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const covered=new Set([6721,6722,6723,6724,6725,6726,6727,6728,6729,6730,6732,6733,6734,6737,6738,6739,6740,6767,6769,6774,8056]);
const probe=[6720,6731,6735,6736,6741,6742,6743,6744,6745,6750,6760,6765,6766,6768,6770,6771,6772,6773,6775,6776,6777,8055,8057];
let ours=[],o=0;
while(true){ const r=await api('get_cases/1&suite_id=1&created_by=3&limit=250&offset='+o); const b=r.body; const a=Array.isArray(b)?b:(b.cases||[]); ours=ours.concat(a); if(a.length<250) break; o+=250; }
const byS={}; ours.forEach(c=>{(byS[c.section_id]=byS[c.section_id]||[]).push(c);});
console.log('checking sections that the run does NOT cover, for Global Search content:');
for(const id of probe){
  const s=(await api('get_section/'+id)).body;
  if(!s||!s.id){ console.log('  ',id,'- does not exist'); continue; }
  const mine=(byS[id]||[]).length;
  const flag = covered.has(id)?'(already covered by the run)':(mine>0?'  *** OUR CASES HERE, NONE IN THE RUN ***':'no cases of ours');
  console.log('  ',String(id).padEnd(5),'parent',String(s.parent_id||'-').padEnd(6),'"'+String(s.name).slice(0,40)+'"','| our cases:',String(mine).padEnd(4),flag);
}
