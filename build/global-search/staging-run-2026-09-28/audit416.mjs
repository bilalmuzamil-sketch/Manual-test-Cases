import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const S={1:'Passed',2:'Blocked',3:'Untested',4:'Retest',5:'Failed'};
let tests=[],off=0;
while(true){const{body}=await api(`get_tests/416&limit=250&offset=${off}`);tests=tests.concat(body.tests||body);if(!body._links||!body._links.next)break;off+=250;}
let results=[],o2=0;
while(true){const{body}=await api(`get_results_for_run/416&limit=250&offset=${o2}`);results=results.concat(body.results||body);if(!body._links||!body._links.next)break;o2+=250;}
const latest=new Map();for(const r of results) if(r.status_id&&!latest.has(r.test_id)) latest.set(r.test_id,r);
const c={};let noRes=0,old=[];
for(const t of tests){c[S[t.status_id]]=(c[S[t.status_id]]||0)+1;const r=latest.get(t.id);
  if(!r){noRes++;continue;} if(new Date(r.created_on*1000)<new Date('2026-09-24T00:00:00Z')) old.push('C'+t.case_id);}
console.log(`run 416 holds ${tests.length} checks:`,JSON.stringify(c));
console.log('with no result:',noRes,'| judged before this pass:',old.length?old.join(', '):'none');
