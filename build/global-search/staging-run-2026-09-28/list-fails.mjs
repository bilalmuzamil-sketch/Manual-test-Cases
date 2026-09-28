import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
let out = [], offset = 0;
while (true) {
  const { body } = await api(`get_tests/415&limit=250&offset=${offset}`);
  const t = body.tests || body; out = out.concat(t);
  if (!body._links || !body._links.next) break; offset += 250;
}
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
console.log('tests in run:', out.length);
for (const t of out) if (t.status_id !== 1) console.log(` ${S[t.status_id] || t.status_id}  C${t.case_id}  ${t.title.slice(0, 80)}`);
