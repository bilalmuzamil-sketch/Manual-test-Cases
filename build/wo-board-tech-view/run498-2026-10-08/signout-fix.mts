/**
 * C368240 (2026-10-09), run LAST in the queue: signing out ends the session every other batch uses.
 * Fix of rest2: the menu item's text is the icon name glued to its label ("logoutLogout"), so the anchored regex never
 * matched — use the exact label. The Reports sub-link is found by its exact text too (icon trap, playbook).
 * Tab 1 is watched for red messages for 10 s after the click; "sign in again" is the sign-in page's Admin quick-login.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t, shot } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const o: any = {};
const toasts = async (pg: typeof p, ms: number) => { const seen = new Set<string>(); const end = Date.now() + ms; while (Date.now() < end) { (await Promise.race([pg.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => (e.className.match(/bg-([a-z-]+)/) || ['', '?'])[1] + ': ' + e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []), new Promise((r) => setTimeout(() => r(['(page did not answer within 3 s)']), 3000))]) as string[]).forEach((x) => seen.add(x)); await pg.waitForTimeout(250); } return [...seen]; };
const report = async (pg: typeof p) => { await pg.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: 'Reports' }).first().click(); await pg.waitForTimeout(2500); await pg.getByText('Inventory Value', { exact: true }).last().click(); };
try {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.tab1Rows = await p.locator('tbody tr').count();
  const t2 = await p.context().newPage(); await t2.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await t2.waitForTimeout(5000);
  await t2.locator('[data-test-id="profile_menu_button"]').click(); await t2.waitForTimeout(800);
  const so = t2.locator('.q-menu').getByText('Logout', { exact: true }).last(); o.signOutFound = await so.count(); console.log(t(), 'C368240 progress: sign-out item', o.signOutFound);
  if (o.signOutFound) { await so.click(); await t2.waitForTimeout(6000); } o.tab2 = t2.url().replace(APP, '').slice(0, 80); await shot(t2, 'C368240-tab2-signed-out');
  console.log(t(), 'C368240 progress: tab 2 at', o.tab2); await p.bringToFront(); await report(p).catch((e) => { o.reportClick = String(e).slice(0, 120); });
  console.log(t(), 'C368240 progress: report clicked'); fs.writeFileSync(path.join(EV, 'signout-fix.json'), JSON.stringify({ C368240: { ...o, partial: 'after report click' } }, null, 1)); o.toasts = await toasts(p, 10_000); await p.waitForTimeout(2000);
  o.tab1 = p.url().replace(APP, '').slice(0, 80); o.signInShown = /login|sign-?in/i.test(p.url()) || (await p.locator('input[type=password], button:has-text("Sign in"), button:has-text("Google")').count()) > 0;
  o.rowsLeft = await p.locator('tbody tr').count(); o.cardsLeft = await p.locator('[data-test-id^="board_card_"], [data-test-id^="tech_view_row_"]').count(); await shot(p, 'C368240-tab1');
  // sign in again through the sign-in page (DEV MODE quick-login on QA branches)
  const qb = p.getByRole('button', { name: /admin/i }).first(); o.quickLoginButton = await qb.count();
  if (process.env.WOB_PROD_LOGIN) { // 22 Oct 2026: production has no quick-login; sign in through the form with the test account (L0525)
    o.signInHow = 'sign-in form, test account';
    const cr: Record<string, string> = {}; for (const l of fs.readFileSync(process.env.PROD_ENVF || '/tmp/shopview/prod-login.env', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(l.trim()); if (m) cr[m[1]] = m[2]; }
    if (!/\/login/.test(p.url())) { await p.goto(APP + '/login', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); }
    await p.locator('input[type=email], input[autocomplete=username]').first().fill(cr.SV_USER); await p.locator('input[type=password]').first().fill(cr.SV_PASS);
    await p.locator('button:has-text("Login"), button:has-text("Sign in"), button[type=submit]').first().click();
    for (let i = 0; i < 20 && /\/login/.test(p.url()); i++) await p.waitForTimeout(2000);
  } else if (o.quickLoginButton) { await qb.click(); await p.waitForTimeout(8000); }
  o.afterSignIn = p.url().replace(APP, '').slice(0, 80); console.log(t(), 'C368240 progress: after sign-in', o.afterSignIn);
  if (!/login/i.test(p.url())) { await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await report(p).catch(() => {}); await p.waitForTimeout(7000);
    o.reportAfter = { url: p.url().replace(APP, '').slice(0, 60), rows: await p.locator('tbody tr').count(), toasts: await toasts(p, 3000) }; await shot(p, 'C368240-after-sign-in'); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, 'C368240-error'); }
console.log(t(), 'C368240', JSON.stringify(o).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'signout-fix.json'), JSON.stringify({ C368240: o }, null, 1));
await Promise.race([done(browser), new Promise((r) => setTimeout(r, 10000))]); process.exit(0);
