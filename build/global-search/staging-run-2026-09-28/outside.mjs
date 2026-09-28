// Are there Global Search cases OUTSIDE the 6720 tree? The project notes name a second regression
// section (8056) and eight foreign cases sitting directly in section 49.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
let secs = [], off = 0;
while (true) { const { body } = await api(`get_sections/1&suite_id=1&limit=250&offset=${off}`);
  secs = secs.concat(body.sections || body); if (!body._links || !body._links.next) break; off += 250; }
let cases = []; off = 0;
while (true) { const { body } = await api(`get_cases/1&suite_id=1&limit=250&offset=${off}`);
  cases = cases.concat(body.cases || body); if (!body._links || !body._links.next) break; off += 250; }
const byId = new Map(secs.map(s => [s.id, s]));
const inTree = (s) => { let c = s, d = 0; while (c && d++ < 12) { if (c.id === 6720 || c.parent_id === 6720) return true; c = byId.get(c.parent_id); } return false; };
const treeIds = new Set(secs.filter(inTree).map(s => s.id));
let tests = []; off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
const inRun = new Set(tests.map(t => t.case_id));
// anything whose section name mentions global search / regression, outside the tree
const suspects = secs.filter(s => !treeIds.has(s.id) && /global search|regression/i.test(s.name || ''));
console.log('sections outside the 6720 tree whose name mentions global search or regression:', suspects.length);
for (const s of suspects) {
  const cs = cases.filter(c => c.section_id === s.id);
  const ours = cs.filter(c => c.created_by === 3);
  const untested = ours.filter(c => !inRun.has(c.id));
  console.log(`   section ${s.id} "${s.name}" — ${cs.length} cases, ${ours.length} ours, ${untested.length} of ours not in run 415`);
  for (const c of untested.slice(0, 10)) console.log(`        C${c.id} ${c.title.slice(0, 66)}`);
}
console.log('\nsection 8056 exists:', !!byId.get(8056), byId.get(8056) ? `"${byId.get(8056).name}"` : '');
console.log('section 49 exists  :', !!byId.get(49), byId.get(49) ? `"${byId.get(49).name}"` : '');
