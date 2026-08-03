// READ-ONLY: pull every case under group 4281 (Reports Suite) + section tree.
// Writes /tmp/vf/live-cases.json and /tmp/vf/sections.json (NOT committed - snapshot only).
import { api } from '../../../testing-tools/testrail-api.mjs';
import { writeFileSync } from 'fs';

async function pagedGet(path, key) {
  let out = [], offset = 0;
  for (;;) {
    const r = await api(`${path}&limit=250&offset=${offset}`);
    if (r.status !== 200) throw new Error(`${path} HTTP ${r.status} ${JSON.stringify(r.body).slice(0,300)}`);
    const chunk = Array.isArray(r.body) ? r.body : r.body[key];
    out = out.concat(chunk);
    if (chunk.length < 250) break;
    offset += 250;
  }
  return out;
}

const sections = await pagedGet('get_sections/1&suite_id=1', 'sections');
writeFileSync('/tmp/vf/sections.json', JSON.stringify(sections, null, 1));

// descendants of 4281
const byParent = new Map();
for (const s of sections) {
  const p = s.parent_id ?? 0;
  if (!byParent.has(p)) byParent.set(p, []);
  byParent.get(p).push(s);
}
const under = new Set();
(function walk(id) {
  for (const s of byParent.get(id) || []) { under.add(s.id); walk(s.id); }
})(4281);
under.add(4281);

const cases = await pagedGet('get_cases/1&suite_id=1', 'cases');
const mine = cases.filter(c => under.has(c.section_id));
writeFileSync('/tmp/vf/live-cases.json', JSON.stringify(mine, null, 1));
const bySec = new Map(sections.map(s => [s.id, s]));
const byCreator = {};
for (const c of mine) byCreator[c.created_by] = (byCreator[c.created_by] || 0) + 1;
console.log('sections total', sections.length, 'under 4281', under.size);
console.log('cases under 4281', mine.length, 'by created_by', JSON.stringify(byCreator));
console.log('ours(created_by=3)', mine.filter(c => c.created_by === 3).length);
writeFileSync('/tmp/vf/section-names.json', JSON.stringify(
  [...under].map(id => ({ id, name: bySec.get(id)?.name, parent: bySec.get(id)?.parent_id })), null, 1));
