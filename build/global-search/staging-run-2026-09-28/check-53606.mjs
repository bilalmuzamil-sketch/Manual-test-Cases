import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
const { body } = await api('get_results_for_case/415/53606&limit=50');
const rows = (body.results || body).filter(r => r.status_id);
console.log('C53606 result history (newest first):');
for (const r of rows) console.log(`   ${new Date(r.created_on*1000).toISOString().slice(0,16).replace('T',' ')}  ${S[r.status_id]}  build "${r.version || ''}"  ${(r.comment||'').slice(0,60).replace(/\n/g,' ')}`);
const { body: c } = await api('get_case/53606');
console.log('\ncase title:', c.title);
