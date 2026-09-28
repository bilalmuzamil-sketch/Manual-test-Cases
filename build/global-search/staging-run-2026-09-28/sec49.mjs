import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
let cases = [], off = 0;
while (true) { const { body } = await api(`get_cases/1&suite_id=1&limit=250&offset=${off}`);
  cases = cases.concat(body.cases || body); if (!body._links || !body._links.next) break; off += 250; }
let tests = []; off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
const inRun = new Set(tests.map(t => t.case_id));
const users = {};
for (const sid of [49, 6499, 8056]) {
  const cs = cases.filter(c => c.section_id === sid);
  console.log(`\nsection ${sid}: ${cs.length} cases`);
  for (const c of cs) {
    if (!(c.created_by in users)) { const { body } = await api(`get_user/${c.created_by}`); users[c.created_by] = body.name || ('user ' + c.created_by); }
    console.log(`   C${c.id}  by ${users[c.created_by]}  inRun=${inRun.has(c.id)}  ${c.title.slice(0, 58)}`);
  }
}
