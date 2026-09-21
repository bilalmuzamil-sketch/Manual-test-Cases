import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
let ours=[],o=0;
while(true){ const r=await api('get_cases/1&suite_id=1&created_by=3&limit=250&offset='+o); const b=r.body; const a=Array.isArray(b)?b:(b.cases||[]); ours=ours.concat(a); if(a.length<250) break; o+=250; }
const byS={}; ours.forEach(c=>{(byS[c.section_id]=byS[c.section_id]||[]).push(c);});
let tests=[],o2=0;
while(true){ const r=await api('get_tests/415&limit=250&offset='+o2); const b=r.body; const a=Array.isArray(b)?b:(b.tests||[]); tests=tests.concat(a); if(a.length<250) break; o2+=250; }
const inRun=new Set(tests.map(t=>t.case_id));
const ids=[];
for(let i=6720;i<=6800;i++) ids.push(i);
for(let i=8050;i<=8070;i++) ids.push(i);
const kids=[];
for(const id of ids){
  const s=(await api('get_section/'+id)).body;
  if(!s||!s.id) continue;
  if(s.parent_id===6720 || s.id===6720) kids.push(s);
}
console.log('EVERY SECTION UNDER THE GLOBAL SEARCH GROUP (6720):', kids.length);
let missTotal=0;
for(const s of kids){
  const cs=byS[s.id]||[];
  const notInRun=cs.filter(c=>!inRun.has(c.id));
  missTotal+=notInRun.length;
  console.log('  ',String(s.id).padEnd(5),'"'+String(s.name).slice(0,44).padEnd(44)+'" | our cases',String(cs.length).padEnd(4),'| NOT in run 415:',notInRun.length);
  notInRun.forEach(c=>console.log('        C'+c.id,'|',String(c.title).slice(0,60)));
}
console.log('\nTOTAL Global Search cases of ours NOT in run 415:',missTotal);
