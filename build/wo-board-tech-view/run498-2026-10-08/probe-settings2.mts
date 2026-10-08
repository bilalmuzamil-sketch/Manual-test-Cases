/** Settings through the screen: menu > Settings, then Staff and Roles; record every API call those pages make (2026-10-08). */
import { open, done, APP } from './session.mts';
import { t, shot } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const calls: string[] = []; p.on('request', (q) => { if (/\/api\//.test(q.url()) && !/sentry|envelope/.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 160)}`); });
await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200);
await p.locator('.q-menu').getByText('Settings', { exact: true }).click(); await p.waitForTimeout(4000);
console.log(t(), 'settings url', p.url().replace(APP, ''));
const nav = await p.evaluate(`[...document.querySelectorAll('a, .q-item, [role=tab]')].map(e => e.innerText.trim()).filter(x => x && x.length < 40)`) as string[];
console.log(t(), 'nav', JSON.stringify([...new Set(nav)].slice(0, 60)));
await shot(p, 'probe-settings-home');
calls.length = 0;
await p.getByText('Staff', { exact: true }).first().click(); await p.waitForTimeout(4000);
console.log(t(), 'staff url', p.url().replace(APP, ''), 'calls', JSON.stringify(calls.slice(0, 10)));
await shot(p, 'probe-settings-staff');
const js = await p.evaluate(`performance.getEntriesByType('resource').map(e => e.name).filter(n => /\\.js$/.test(n))`) as string[];
const found = new Set<string>();
for (const c of js) {
  if (/sentry/.test(c)) continue;
  const txt = await p.evaluate(`fetch(${JSON.stringify(c)}).then(r => r.text()).catch(() => '')`) as string;
  for (const m of txt.match(/.{0,80}(deactivat|reactivat|is_active|isActive).{0,80}/gi) || []) found.add(m.replace(/\s+/g, ' ').slice(0, 170) + '  <' + c.replace(APP, '').slice(0, 40) + '>');
}
console.log(t(), 'DEACT', JSON.stringify([...found].slice(0, 25)));
calls.length = 0;
await p.getByText('Roles & Permissions', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(4000);
console.log(t(), 'roles url', p.url().replace(APP, ''), 'calls', JSON.stringify(calls.slice(0, 10)));
await done(browser);
