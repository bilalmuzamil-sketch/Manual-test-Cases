/**
 * C368240 (2026-10-10), run LAST: signing out ends the session every other batch uses.
 * Fix of signout-fix: the first run hung for 16 minutes after the Reports click timed out (tab 1 had no top menu left to
 * click — it was already showing the sign-in page). Here tab 1's address is recorded the moment it is brought back to the
 * front, every click has an 8 s limit, every picture a 15 s limit, and the whole script stops itself after 4 minutes.
 * Positive control: tab 1's work-order rows are counted BEFORE the sign-out, so "no rows left" is measured against a real count.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { open as _open, APP } from './session.mts';
import { STATE as WSTATE } from './profile.mts';
import { EV, t } from './wob.mts';
setTimeout(() => { console.log(t(), 'C368240 watchdog: 4 minutes passed'); write(); process.exit(0); }, 240_000);
const o: any = {};
const write = () => fs.writeFileSync(path.join(EV, 'signout-fix5.json'), JSON.stringify({ C368240: o }, null, 1));
const first = await _open('/workorders?tab=all'); await first.browser.close().catch(() => {});
const STATE = WSTATE;
const fb = await chromium.launch({ channel: 'chromium', args: ['--no-sandbox'] }); o.browser = fb.version();
const p = await (await fb.newContext({ ignoreHTTPSErrors: true, storageState: STATE, viewport: { width: 1600, height: 1000 } })).newPage(); p.setDefaultTimeout(8_000);
// diagnostics: is the page busy because of a redirect loop, a pop-up dialog, or a script error?
o.nav1 = 0; o.dialogs = []; o.pageErrors = 0; o.req401 = 0;
p.on('framenavigated', (f) => { if (f === p.mainFrame()) o.nav1++; });
p.on('dialog', (d) => { o.dialogs.push(d.type() + ': ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
p.on('pageerror', () => { o.pageErrors++; });
p.on('response', (r) => { if (r.status() === 401) o.req401++; });
const lim = <T,>(x: Promise<T>, ms = 8000, name = 'step') => Promise.race([x, new Promise<T>((r) => setTimeout(() => { o.stuck = (o.stuck || []).concat(name); r(undefined as any); }, ms))]);
const pic = (pg: typeof p, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`), timeout: 15_000 }).catch((e) => { o['pic_' + n] = String(e).slice(0, 80); });
const red = (pg: typeof p) => pg.evaluate(`[...document.querySelectorAll('.q-notification, [role=alert]')].map(e => (e.className.match(/bg-([a-z-]+)/) || ['', ''])[1] + ': ' + e.innerText.replace(/\\s+/g, ' ').slice(0, 100))`).catch(() => []) as Promise<string[]>;
const onSignIn = async (pg: typeof p) => /login|sign-?in/i.test(pg.url()) || (await pg.locator('input[type=password]').count().catch(() => 0)) > 0;
try {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 45_000 }); await p.locator('tbody tr').first().waitFor({ timeout: 25_000 }).catch(() => {});
  o.tab1RowsBefore = await p.locator('tbody tr').count(); o.tab1Before = p.url().replace(APP, '');
  const t2 = await p.context().newPage(); await t2.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 45_000 }); await t2.waitForTimeout(5000);
  await t2.locator('[data-test-id="profile_menu_button"]').click(); await t2.waitForTimeout(800);
  const so = t2.locator('.q-menu').getByText('Logout', { exact: true }).last(); o.signOutFound = await so.count();
  await so.click(); await t2.waitForTimeout(5000); o.tab2After = t2.url().replace(APP, ''); await pic(t2, 'C368240-tab2-signed-out'); await t2.close().catch(() => {});
  o.nav1AtSignOut = o.nav1; await lim(p.bringToFront(), 5000, 'front'); o.tab1OnReturn = p.url().replace(APP, '');
  await new Promise((r) => setTimeout(r, 5000)); o.nav1After5s = o.nav1; o.urlAfter5s = p.url().replace(APP, '');
  o.alive = await lim(p.evaluate('1+1'), 5000, 'evaluate'); write();
  o.tab1SignInOnReturn = await lim(onSignIn(p), 8000, 'onSignIn'); write();
  // Reports > Inventory Value, only if tab 1 still shows the top menu
  const nav = p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: 'Reports' }).first(); o.reportsLinkShown = await lim(nav.count(), 8000, 'navCount'); write();
  if (o.reportsLinkShown) { await nav.click().catch((e) => { o.reportsClick = String(e).slice(0, 80); }); await p.waitForTimeout(2500);
    await p.getByText('Inventory Value', { exact: true }).last().click().catch((e) => { o.inventoryClick = String(e).slice(0, 80); }); }
  const seen = new Set<string>(); for (let i = 0; i < 10; i++) { ((await lim(red(p), 3000, 'red')) || []).forEach((x) => seen.add(x)); await p.waitForTimeout(1000); } o.messages = [...seen];
  o.tab1After = p.url().replace(APP, ''); o.tab1SignInAfter = await onSignIn(p);
  o.rowsLeft = await p.locator('tbody tr').count().catch(() => -1); o.cardsLeft = await p.locator('[data-test-id^="board_card_"], [data-test-id^="tech_view_row_"]').count().catch(() => -1);
  await pic(p, 'C368240-tab1-after'); o.nav1End = o.nav1; write();
  // sign in again (QA-branch quick-login on the sign-in page) and read current data
  const qb = p.getByRole('button', { name: /admin/i }).first(); o.quickLoginButton = await qb.count();
  if (o.quickLoginButton) { await qb.click().catch(() => {}); await p.waitForTimeout(8000); }
  o.afterSignIn = p.url().replace(APP, '');
  if (!(await onSignIn(p))) { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 45_000 }).catch(() => {}); await p.waitForTimeout(6000);
    o.rowsAfterSignIn = await p.locator('tbody tr').count(); o.messagesAfterSignIn = await red(p); await pic(p, 'C368240-after-sign-in'); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'C368240', JSON.stringify(o).slice(0, 3000)); write(); process.exit(0);
