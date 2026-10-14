/** 15 Oct 2026 — STAGING re-check of C368246 (wave 7: the Dashboard cards show their tables only after "View details",
 *  which the earlier script never opened). Steps: Dashboard → each card that shows a table → read its rows → click a column
 *  header to sort (twice). Each "View details" is opened in turn, read, photographed and closed. As Admin ShopView. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const OUT = path.join(EV, 'dash-details.json'); const o: any = { C368246: {} }; const R = o.C368246;
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
try {
  // step 1: the ShopView logo at the top left opens /dashboard on this build
  const logo = p.locator('header a[href*="dashboard"], header img, [data-test-id*="logo"]').first(); if (await logo.count()) { await logo.click().catch(() => {}); await p.waitForTimeout(6000); }
  if (!/dashboard/.test(p.url())) { R.openedBy = 'url'; await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); } else R.openedBy = 'logo';
  await p.waitForTimeout(9000); R.url = p.url().replace(APP, ''); await shot('C368246-dashboard');
  R.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`);
  const btns = p.getByRole('button', { name: /View details/i }); const n = await btns.count(); R.viewDetails = n; R.cards = [];
  const readTable = async (scope: string) => p.evaluate(`(() => { const roots = [...document.querySelectorAll('${scope}')].filter(e => e.getBoundingClientRect().width > 0); const root = roots.pop() || document; const tb = root.querySelector('table');
      if (!tb) return null; return { heads: [...tb.querySelectorAll('thead th')].map(h => h.innerText.replace(/\\s+/g, ' ').trim()), rows: [...tb.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean), title: (root.innerText || '').split('\\n')[0].trim().slice(0, 60) }; })()`);
  for (let i = 0; i < n; i++) { const c: any = {}; const b = btns.nth(i); await b.scrollIntoViewIfNeeded().catch(() => {});
    c.card = await b.evaluate((e) => { let x: any = e; for (let k = 0; k < 6 && x; k++, x = x.parentElement) if (x.classList?.contains('q-card')) break; return (x?.innerText || '').split('\n')[0].trim().slice(0, 60); }).catch(() => null);
    await b.click().catch((e) => { c.clickError = String(e).slice(0, 120); }); await p.waitForTimeout(4000);
    const scope = (await p.locator('.q-dialog').count()) ? '.q-dialog' : '.q-card'; c.opened = scope;
    c.table = await readTable(scope); await shot(`C368246-details-${i + 1}`);
    if (c.table?.heads?.length) { const dlg = scope === '.q-dialog' ? p.locator('.q-dialog').last() : p.locator('body');
      const th = dlg.locator('thead th').filter({ has: p.locator('i, .q-icon') }).first(); const th2 = (await th.count()) ? th : dlg.locator('thead th').nth(1);
      c.sortHeader = (await th2.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      await th2.click().catch(() => {}); await p.waitForTimeout(2000); c.sort1 = (await readTable(scope))?.rows?.slice(0, 5);
      await th2.click().catch(() => {}); await p.waitForTimeout(2000); c.sort2 = (await readTable(scope))?.rows?.slice(0, 5); await shot(`C368246-details-${i + 1}-sorted`);
      c.sortChanged = JSON.stringify(c.sort1) !== JSON.stringify(c.sort2); }
    c.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`);
    if (scope === '.q-dialog') { await p.keyboard.press('Escape'); await p.waitForTimeout(1500); if (await p.locator('.q-dialog').count()) await p.locator('.q-dialog button').filter({ hasText: /close|Close/ }).first().click().catch(() => {}); await p.waitForTimeout(1000); }
    R.cards.push(c); console.log(t(), 'card', i + 1, JSON.stringify(c).slice(0, 700)); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); await shot('C368246-error'); }
fs.writeFileSync(OUT, JSON.stringify(o, null, 1)); console.log(t(), 'C368246', JSON.stringify(R).slice(0, 2500));
await done(browser);
