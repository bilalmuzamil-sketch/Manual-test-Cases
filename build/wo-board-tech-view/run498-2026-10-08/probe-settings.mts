/** Where is Settings > Staff, what call deactivates a staff member, and what lists this organisation's roles? (2026-10-08) */
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { t, shot } from './wob.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
for (const u of ['/settings/staff', '/settings/team', '/staff', '/settings/employees']) {
  await p.goto(APP + u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
  console.log(t(), u, '->', p.url().replace(APP, ''), '|', (await p.evaluate(`document.body.innerText.replace(/\\s+/g, ' ').slice(0, 160)`)));
}
await shot(p, 'probe-settings-last');
const js = await p.evaluate(`performance.getEntriesByType('resource').map(e => e.name).filter(n => /\\.js$/.test(n))`) as string[];
const found = new Set<string>();
for (const c of js) {
  const txt = await p.evaluate(`fetch(${JSON.stringify(c)}).then(r => r.text()).catch(() => '')`) as string;
  for (const m of txt.match(/["'`][^"'`]{0,60}(deactivat|activate|roles\/list|list-roles|\/roles["'`?])[^"'`]{0,60}["'`]/gi) || []) found.add(m.slice(0, 140) + '  <' + c.replace(APP, '').slice(0, 50) + '>');
}
console.log(t(), 'STRINGS', JSON.stringify([...found].slice(0, 40)));
for (const u of ['/api/roles', '/api/roles?limit=100', '/api/iam/roles', '/api/settings/roles']) { const r = await a.get(u); console.log(t(), u, r.status, JSON.stringify(r.body).slice(0, 300)); }
await done(browser);
