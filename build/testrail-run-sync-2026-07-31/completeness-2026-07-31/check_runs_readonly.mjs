import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import { writeFileSync } from 'fs';

async function paged(path, key){
  let out=[], offset=0;
  for(;;){
    const sep = path.includes('&')?'&':'&';
    const r = await api(`${path}${sep}limit=250&offset=${offset}`);
    if(r.status!==200){ throw new Error(path+' HTTP '+r.status+' '+JSON.stringify(r.body).slice(0,200)); }
    const b=r.body; const arr = Array.isArray(b)? b : (b[key]||[]);
    out=out.concat(arr);
    const size = arr.length;
    if(size<250) break; offset+=250;
  }
  return out;
}

const sectionsRes = await paged('get_sections/1&suite_id=1','sections');
const byParent = {};
for(const s of sectionsRes){ (byParent[s.parent_id]=byParent[s.parent_id]||[]).push(s.id); }
function descend(root){ const set=new Set([root]); const q=[root];
  while(q.length){ const n=q.pop(); for(const c of (byParent[n]||[])){ if(!set.has(c)){set.add(c); q.push(c);} } } return set; }

const allCases = await paged('get_cases/1&suite_id=1','cases');
console.log('total sections', sectionsRes.length, 'total cases', allCases.length);

const users = {};
async function user(id){ if(id==null) return null; if(users[id]) return users[id];
  const r = await api(`get_user/${id}`); users[id] = r.status===200? {id, name:r.body.name, email:r.body.email}: {id, name:'HTTP '+r.status}; return users[id]; }

const projects = [
  {label:'Filters', run:352, group:4110},
  {label:'Schedule', run:357, group:4254},
  {label:'Reports Suite', run:359, group:4281},
];
const out = {generated_at:new Date().toISOString(), runs:[]};
for(const p of projects){
  const runR = await api(`get_run/${p.run}`);
  const run = runR.body;
  const tests = await paged(`get_tests/${p.run}`,'tests');
  const results = await paged(`get_results_for_run/${p.run}`,'results');
  const secSet = descend(p.group);
  const groupCases = allCases.filter(c=>secSet.has(c.section_id));
  const authors = {};
  for(const c of groupCases){ authors[c.created_by]=(authors[c.created_by]||0)+1; }
  for(const a of Object.keys(authors)) await user(Number(a));
  const runCaseIds = new Set(tests.map(t=>t.case_id));
  const ours = groupCases.filter(c=>c.created_by===3);
  const foreign = groupCases.filter(c=>c.created_by!==3);
  const missing = ours.filter(c=>!runCaseIds.has(c.id)).map(c=>({id:c.id,title:c.title,section_id:c.section_id}));
  const allCaseIds = new Set(allCases.map(c=>c.id));
  const stale = tests.filter(t=>!allCaseIds.has(t.case_id)).map(t=>({test_id:t.id,case_id:t.case_id,title:t.title}));
  const statusBreak = {};
  for(const r of results){ statusBreak[r.status_id]=(statusBreak[r.status_id]||0)+1; }
  out.runs.push({
    label:p.label, run:p.run, group:p.group,
    name:run.name, include_all:run.include_all, is_completed:run.is_completed,
    assignedto_id:run.assignedto_id, created_by:run.created_by,
    created_by_user:(await user(run.created_by)), assignedto_user:(await user(run.assignedto_id)),
    counts:{passed:run.passed_count,blocked:run.blocked_count,untested:run.untested_count,retest:run.retest_count,failed:run.failed_count,custom:run.custom_status1_count},
    tests_in_run: tests.length,
    group_cases_total: groupCases.length,
    ours_active: ours.length,
    foreign: foreign.map(c=>({id:c.id,title:c.title,created_by:c.created_by,created_by_name:users[c.created_by]?.name})),
    authors: Object.fromEntries(Object.entries(authors).map(([k,v])=>[`${k} (${users[k]?.name})`,v])),
    missing, stale,
    extra_in_run_not_ours: [...runCaseIds].filter(id=>!ours.some(c=>c.id===id)),
    results_count: results.length, status_breakdown: statusBreak,
    run_case_ids: [...runCaseIds].sort((a,b)=>a-b),
    union_case_ids: [...new Set([...runCaseIds, ...missing.map(m=>m.id)])].sort((a,b)=>a-b),
  });
  console.log(p.label, 'run tests', tests.length, 'ours', ours.length, 'missing', missing.length, 'stale', stale.length, 'results', results.length);
}
writeFileSync('/tmp/testrail/check-out.json', JSON.stringify(out,null,1));
console.log('users', JSON.stringify(users));
