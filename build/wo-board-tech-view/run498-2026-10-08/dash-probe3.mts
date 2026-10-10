/** C368246, third look (10 Oct 2026). Nothing blocked (WOB_NOBLOCK=1): the earlier probes aborted analytics/maps/sentry calls,
 *  which could itself have kept the charts empty. Scrolls the whole dashboard so every card loads, reads each table card's
 *  rows, clicks the first sortable header of each and reads the order again. Full-page picture. Read-only. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const R: any = { consoleErrors: [] as string[] };
p.on('console', (m) => { if (m.type() === 'error') R.consoleErrors.push(m.text().slice(0, 160)); });
await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(20000);
for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(1500); } await p.waitForTimeout(8000);
await p.screenshot({ path: path.join(EV, 'dash-probe3-full.png'), fullPage: true });
R.kpis = await p.evaluate(`[...document.querySelectorAll('.q-card')].slice(0, 4).map(c => c.innerText.replace(/\\s+/g, ' ').slice(0, 90))`);
R.canvases = await p.evaluate(`[...document.querySelectorAll('canvas')].map(c => c.width + 'x' + c.height)`);
R.tables = await p.evaluate(`[...document.querySelectorAll('.q-card')].filter(c => c.querySelector('table')).map(c => ({ title: (c.innerText.split('\\n')[0] || '').trim(), heads: [...c.querySelectorAll('thead th')].map(h => h.innerText.replace(/\\s+/g, ' ').replace(/arrow_drop_(up|down)/g, '').trim()), rows: [...c.querySelectorAll('tbody tr')].slice(0, 5).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 120)), rowCount: c.querySelectorAll('tbody tr').length }))`);
// sort: click the 2nd header of every table card that has 2+ rows, read the first rows again
R.sorted = [];
const cards = p.locator('.q-card').filter({ has: p.locator('table') });
for (let i = 0; i < await cards.count(); i++) { const c = cards.nth(i); const n = await c.locator('tbody tr').count(); if (n < 2) continue;
  const h = c.locator('thead th').nth(1); await h.scrollIntoViewIfNeeded().catch(() => {}); const before = await c.locator('tbody tr').allInnerTexts();
  await h.click().catch(() => {}); await p.waitForTimeout(1500); const after1 = await c.locator('tbody tr').allInnerTexts(); await h.click().catch(() => {}); await p.waitForTimeout(1500); const after2 = await c.locator('tbody tr').allInnerTexts();
  R.sorted.push({ card: ((await c.innerText()).split('\n')[0] || '').trim(), header: (await h.innerText()).replace(/\s+/g, ' ').trim(), before: before.slice(0, 3).map((x) => x.replace(/\s+/g, ' ').slice(0, 60)), after1: after1.slice(0, 3).map((x) => x.replace(/\s+/g, ' ').slice(0, 60)), after2: after2.slice(0, 3).map((x) => x.replace(/\s+/g, ' ').slice(0, 60)) }); }
R.consoleErrors = R.consoleErrors.slice(0, 12);
fs.writeFileSync(path.join(EV, 'dash-probe3.json'), JSON.stringify(R, null, 1)); console.log(t(), JSON.stringify(R).slice(0, 3000)); await done(browser);
