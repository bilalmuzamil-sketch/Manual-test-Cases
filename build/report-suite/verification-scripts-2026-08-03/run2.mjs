import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import { writeFileSync } from 'fs';
async function paged(path,key){let o=[],off=0;for(;;){const r=await api(`${path}&limit=250&offset=${off}`);if(r.status!==200){console.error('ERR',path,r.status,JSON.stringify(r.body).slice(0,200));process.exit(1);}const b=r.body;o=o.concat(Array.isArray(b)?b:(b[key]||[]));if(!b._links||!b._links.next)break;off+=250;}return o;}
const tests = await paged('get_tests/359','tests');
console.log('TESTS in run 359:', tests.length);
writeFileSync('/tmp/verify/run359-tests-NOW.json', JSON.stringify(tests,null,1));
const results = await paged('get_results_for_run/359','results');
console.log('RESULT records in run 359:', results.length);
writeFileSync('/tmp/verify/run359-results-NOW.json', JSON.stringify(results,null,1));
