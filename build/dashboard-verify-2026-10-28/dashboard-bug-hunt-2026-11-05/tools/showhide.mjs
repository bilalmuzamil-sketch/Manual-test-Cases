// Area 3.6 — S11-E1: the show/hide choice for an embedded chart is remembered per report between visits.
import { boot, LOC, save, sleep, waitIdle, APP, finish, shot } from './hb.mjs';
const loc = LOC.HD; const { browser, ctx, page, rule99, app_version } = await boot(loc); const ev = { app_version, steps: [] };
const state = async (p, label) => { const t = await p.evaluate(() => [...document.querySelectorAll('button, [role="button"], .q-btn')].map(b => b.innerText.replace(/\s+/g, ' ').trim()).filter(x => /chart/i.test(x))); ev.steps.push({ label, url: p.url().replace(APP, ''), buttons: t }); return t; };
const go = async (p, r) => { await p.goto(APP + r, { waitUntil: 'domcontentloaded' }); await waitIdle(p, 8000); };
await go(page, '/reports/sales'); await state(page, 'sales first');
await page.getByText('Hide Chart', { exact: false }).first().click(); await sleep(2500); await state(page, 'sales after Hide click');
await shot(page, 'area3-showhide', '1-sales-hidden');
await go(page, '/reports/technician-efficiency'); await state(page, 'TE report (other report)');
await go(page, '/reports/sales'); await state(page, 'sales revisit same tab');
await shot(page, 'area3-showhide', '2-sales-revisit');
const p2 = await ctx.newPage(); await go(p2, '/reports/sales'); await state(p2, 'sales new tab');
await p2.reload({ waitUntil: 'domcontentloaded' }); await waitIdle(p2, 8000); await state(p2, 'sales new tab after reload');
const s = await state(p2, 'before restore'); if (s.some(x => /Show Chart/.test(x))) { await p2.getByText('Show Chart').first().click(); await sleep(2000); }
await state(p2, 'restored');
ev.rule99 = await finish(page, loc, rule99); save('area3-showhide', 'showhide', ev);
console.log(app_version, ev.rule99.all_match); for (const x of ev.steps) console.log(x.label, '|', x.url, '|', JSON.stringify(x.buttons));
await browser.close();
