// The local copy of these cases is empty - it was written by a fetch that failed quietly. Rule 100:
// read them from the system of record, not from the file.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const ids = process.argv.slice(2).map(Number);
const all = JSON.parse(fs.readFileSync('cases/ALL-194.json', 'utf8'));
const byId = new Map(all.map(c => [c.case_id, c]));
const secs = new Map();
for (const id of ids) {
  const { status, body } = await api(`get_case/${id}`);
  if (status !== 200) { console.log('C' + id, 'FAILED', status); continue; }
  let sec = secs.get(body.section_id);
  if (!sec) { const r = await api(`get_section/${body.section_id}`); sec = r.body?.name || String(body.section_id); secs.set(body.section_id, sec); }
  const c = byId.get(id) || { case_id: id };
  Object.assign(c, { title: body.title, section: sec, section_id: body.section_id,
    preconds: body.custom_preconds || '', steps: body.custom_steps || '', expected: body.custom_expected || '' });
  if (!byId.has(id)) all.push(c);
  console.log(`C${id} [${sec}] ${body.title}`);
}
fs.writeFileSync('cases/ALL-194.json', JSON.stringify(all, null, 1));
