// What exists in the Global Search tree vs what run 415 actually holds. Counted live from TestRail,
// paged, never from a local extract (Rule 100).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const secs = [];
let off = 0;
while (true) {
  const { body } = await api(`get_sections/1&suite_id=1&limit=250&offset=${off}`);
  const arr = body.sections || body;
  secs.push(...arr);
  if (!body._links || !body._links.next) break;
  off += 250;
}
// the Global Search group is 6720; walk its descendants
const byId = new Map(secs.map(s => [s.id, s]));
const inGroup = (s) => { let c = s, d = 0; while (c && d++ < 12) { if (c.id === 6720 || c.parent_id === 6720) return true; c = byId.get(c.parent_id); } return false; };
const mine = secs.filter(inGroup);
console.log('sections in the Global Search tree:', mine.length);
const cases = [];
off = 0;
while (true) {
  const { body } = await api(`get_cases/1&suite_id=1&limit=250&offset=${off}`);
  const arr = body.cases || body;
  cases.push(...arr);
  if (!body._links || !body._links.next) break;
  off += 250;
}
const ids = new Set(mine.map(s => s.id));
const gs = cases.filter(c => ids.has(c.section_id));
console.log('cases in that tree:', gs.length, '| ours (created_by 3):', gs.filter(c => c.created_by === 3).length);
let tests = [], o2 = 0;
while (true) {
  const { body } = await api(`get_tests/415&limit=250&offset=${o2}`);
  tests = tests.concat(body.tests || body);
  if (!body._links || !body._links.next) break;
  o2 += 250;
}
const inRun = new Set(tests.map(t => t.case_id));
console.log('tests in run 415:', tests.length);
const missing = gs.filter(c => !inRun.has(c.id));
console.log('\nIN THE TREE BUT NOT IN THE RUN:', missing.length);
for (const c of missing) {
  const sec = byId.get(c.section_id);
  console.log(`   C${c.id}  by=${c.created_by}  auto=${c.custom_atmstatus}  [${(sec || {}).name}]  ${c.title.slice(0, 68)}`);
}
fs.writeFileSync('gap.json', JSON.stringify({ runCaseIds: [...inRun], missing: missing.map(c => ({ id: c.id, title: c.title, section: (byId.get(c.section_id) || {}).name, created_by: c.created_by })) }, null, 1));
