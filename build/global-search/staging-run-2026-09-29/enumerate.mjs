// What is in the new folder, and which of its cases are in run 415? Counted live from TestRail.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const ROOT = 19387;
let secs = [], off = 0;
while (true) { const { body } = await api(`get_sections/1&suite_id=1&limit=250&offset=${off}`);
  secs = secs.concat(body.sections || body); if (!body._links || !body._links.next) break; off += 250; }
const byId = new Map(secs.map(s => [s.id, s]));
const root = byId.get(ROOT);
console.log('the folder:', root ? `"${root.name}"  (parent ${root.parent_id ?? 'none'}, depth ${root.depth})` : 'NOT FOUND');
const inRoot = s => { let c = s, d = 0; while (c && d++ < 12) { if (c.id === ROOT) return true; c = byId.get(c.parent_id); } return false; };
const mine = secs.filter(s => s.id !== ROOT && inRoot(s));
console.log('sub-folders:', mine.length);
let cases = []; off = 0;
while (true) { const { body } = await api(`get_cases/1&suite_id=1&limit=250&offset=${off}`);
  cases = cases.concat(body.cases || body); if (!body._links || !body._links.next) break; off += 250; }
let tests = []; off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
const inRun = new Map(tests.map(t => [t.case_id, t]));
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
const rows = [];
let total = 0;
for (const s of [root, ...mine].filter(Boolean)) {
  const cs = cases.filter(c => c.section_id === s.id);
  if (!cs.length && s.id === ROOT) continue;
  total += cs.length;
  const st = {};
  for (const c of cs) { const t = inRun.get(c.id); const k = t ? S[t.status_id] : 'not in the run'; st[k] = (st[k] || 0) + 1; }
  const authors = [...new Set(cs.map(c => c.created_by))];
  console.log(`\n  ${s.name}  —  ${cs.length} cases  ${JSON.stringify(st)}${authors.some(a => a !== 3) ? '  ⚠ authors: ' + authors.join(',') : ''}`);
  for (const c of cs) {
    const t = inRun.get(c.id);
    rows.push({ section: s.name, case_id: c.id, title: c.title, created_by: c.created_by,
                atm: c.custom_atmstatus, test_id: t?.id ?? null, status: t ? S[t.status_id] : null });
    console.log(`     C${c.id}  ${(t ? S[t.status_id] : 'NOT IN RUN').padEnd(11)} ${c.title.slice(0, 74)}`);
  }
}
console.log(`\nTOTAL in the folder: ${total} cases`);
fs.writeFileSync('folder-19387.json', JSON.stringify({ root: root?.name, sections: mine.map(s => s.name), rows }, null, 1));
