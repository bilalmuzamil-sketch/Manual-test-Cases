import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
// 1. all OUR cases in the estate (created_by=3), paged - one call per page, fast
let ours=[],o=0;
while(true){ const r=await api('get_cases/1&suite_id=1&created_by=3&limit=250&offset='+o); const b=r.body; const a=Array.isArray(b)?b:(b.cases||[]); ours=ours.concat(a); if(a.length<250) break; o+=250; }
console.log('cases created by us across the estate:',ours.length);
// 2. the run's case ids
let tests=[],o2=0;
while(true){ const r=await api('get_tests/415&limit=250&offset='+o2); const b=r.body; const a=Array.isArray(b)?b:(b.tests||[]); tests=tests.concat(a); if(a.length<250) break; o2+=250; }
const inRun=new Set(tests.map(t=>t.case_id));
console.log('tests in run 415:',tests.length);
// 3. which sections does the run live in? derive from OUR cases that ARE in the run
const runSecs=new Set(ours.filter(c=>inRun.has(c.id)).map(c=>c.section_id));
console.log('sections the run covers:',runSecs.size,[...runSecs].sort((a,b)=>a-b).join(', '));
// 4. our cases in those same sections that are NOT in the run
const miss=ours.filter(c=>runSecs.has(c.section_id) && !inRun.has(c.id));
console.log('OUR CASES IN THOSE SECTIONS BUT NOT IN RUN 415:',miss.length);
const names={};
for(const sid of new Set(miss.map(m=>m.section_id))) names[sid]=((await api('get_section/'+sid)).body||{}).name;
for(const m of miss) console.log('   C'+m.id,'| section',m.section_id,String(names[m.section_id]||'').slice(0,26).padEnd(26),'| automation',m.custom_atmstatus,'|',String(m.title).slice(0,56));
// 5. also: run cases NOT created by us (foreign) - for completeness
const oursIds=new Set(ours.map(c=>c.id));
const foreign=tests.filter(t=>!oursIds.has(t.case_id));
console.log('tests in the run NOT created by us:',foreign.length, foreign.slice(0,10).map(t=>'C'+t.case_id).join(' '));
