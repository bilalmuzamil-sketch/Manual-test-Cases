/** Which of the customers the cases name already exist on the branch, and their work orders. Read-only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, API, done } from './session.mts';

const here = path.dirname(new URL(import.meta.url).pathname);
const cases = JSON.parse(fs.readFileSync(path.join(here, 'cases-read-2026-10-08.json'), 'utf8'));
const wanted = new Set<string>();
for (const c of cases) for (const m of String(c.preconds).matchAll(/Customer "([^"]+)"/g)) wanted.add(m[1]);
const { browser, page } = await open('/workorders');
const get = (u: string) => page.evaluate(`fetch('${API}' + ${JSON.stringify(u)}, { credentials: 'include', headers: { Accept: 'application/json' } }).then(async r => ({ s: r.status, j: await r.json().catch(() => null) }))`) as Promise<any>;
const out: Record<string, any> = {};
for (const q of ['ZZAUTOTEST F1', 'ZZAUTOTEST F2', 'ZZAUTOTEST F', 'ZZAUTOTEST Fibridge', 'ZZAUTOTEST Fisquare']) {
  const r = await get(`/api/customers?pagination[rowsPerPage]=500&search=${encodeURIComponent(q)}`);
  for (const c of r.j?.data?.collection ?? []) out[c.name] = { id: c.id };
}
const have = [...wanted].filter((n) => out[n]);
console.log(`named by the cases: ${wanted.size} · on the branch: ${have.length}`);
console.log('present:', have.slice(0, 40).join(' | '));
console.log('missing (first 20):', [...wanted].filter((n) => !out[n]).slice(0, 20).join(' | '));
fs.writeFileSync(path.join(here, 'existing-customers.json'), JSON.stringify({ wanted: [...wanted], present: out }, null, 1));
await done(browser);
