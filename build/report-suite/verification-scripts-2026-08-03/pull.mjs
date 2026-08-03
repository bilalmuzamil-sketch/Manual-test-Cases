// READ-ONLY TestRail pull. get_sections + get_cases only.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import { writeFileSync } from 'fs';

async function pagedGet(path, key) {
  let out = [], offset = 0, limit = 250;
  for (;;) {
    const sep = path.includes('&') ? '&' : '&';
    const r = await api(`${path}${sep}limit=${limit}&offset=${offset}`);
    if (r.status !== 200) { console.error('ERR', path, r.status, JSON.stringify(r.body).slice(0,300)); process.exit(1); }
    const b = r.body;
    const arr = Array.isArray(b) ? b : (b[key] || []);
    out = out.concat(arr);
    if (!b._links || !b._links.next) break;
    offset += limit;
    if (out.length > 20000) break;
  }
  return out;
}

const sections = await pagedGet('get_sections/1&suite_id=1', 'sections');
writeFileSync('/tmp/verify/sections.json', JSON.stringify(sections, null, 1));
console.error('sections:', sections.length);

const cases = await pagedGet('get_cases/1&suite_id=1', 'cases');
writeFileSync('/tmp/verify/cases-all.json', JSON.stringify(cases, null, 1));
console.error('cases total in suite:', cases.length);
