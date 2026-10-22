/** impersonate-probe-prod-1022.mts — 22 Oct 2026, READ-ONLY probe (Rule 104): on production, imp-fix3 (C368238/C368239) and seed-carol
 *  never entered account access ("You are not currently impersonating a user."). Find out how production starts it: (1) the route the
 *  staging scripts use, /impersonate-user/<user id>, with every API response whose URL mentions switch/imperson/login-as recorded and the
 *  page/toasts photographed; (2) Settings > Staff: Esther Howard's row — every button/menu item offered on it (looking for Account Access /
 *  Login as), photographed. Positive control: the staff row must be found. Exits account access at the end if it did start. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts'; import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { responses: [] as string[] };
p.on('response', (r) => { if (/switch|imperson|login-as|account-access/i.test(r.url())) o.responses.push(`${r.request().method()} ${r.url().replace(/https:\/\/[^/]+/, '')} -> ${r.status()}`); });
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 160))`).catch(() => []);
try {
  const ES = (await staffRows(a, 'Esther')).find((x: any) => x.first_name === 'Esther' && x.last_name === 'Howard'); o.esther = ES ? { user_id: ES.id, staff_id: ES.staff_id, email: ES.email, keys: Object.keys(ES).slice(0, 40) } : null;
  if (ES) {
    await p.goto(`${APP}/impersonate-user/${ES.id}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
    o.route = { url: p.url().replace(APP, ''), bar: await p.locator('[data-test-id="button_exit_impersonation"]').count(), toasts: await toasts(), text: (await p.evaluate('document.body.innerText') as string).replace(/\s+/g, ' ').slice(0, 300) };
    await p.screenshot({ path: path.join(EV, 'impersonate-probe-route.png') });
    if (o.route.bar) { o.exit = (await a.post('/api/exit-switch-user', {})).status; await p.waitForTimeout(3000); }
    await p.goto(`${APP}/administration/staff`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
    await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
    await p.locator('input[placeholder*="Search" i], input[type="search"]').first().fill('Esther').catch(() => {}); await p.waitForTimeout(3500);
    const row = p.locator('tbody tr').filter({ hasText: 'Esther' }).first(); o.rowFound = await row.count();
    if (o.rowFound) { o.rowButtons = await row.locator('button, [role=button], i').allInnerTexts().catch(() => []);
      const more = row.locator('button').last(); await more.click().catch(() => {}); await p.waitForTimeout(1200);
      o.rowMenu = await p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(m => m.innerText.replace(/\\s+/g, ' ').slice(0, 300))`);
      await p.screenshot({ path: path.join(EV, 'impersonate-probe-staff-row.png') }); await p.keyboard.press('Escape').catch(() => {}); }
  }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'IMPERSONATE-PROBE', JSON.stringify(o).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'impersonate-probe-prod-1022.json'), JSON.stringify(o, null, 1));
await done(browser);
