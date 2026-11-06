// D2 cross-check: what the Sales report and the Dashboard send for one custom day at Heavy Duty, and the browser's own offset.
import { boot, LOC, save, sleep, waitIdle, netlog, APP, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page);
const ev = { app_version, browser_offset_min_on_nov3: await page.evaluate(() => new Date('2026-11-03T12:00:00Z').getTimezoneOffset()), browser_nov3_midnight_local_as_utc: await page.evaluate(() => new Date(2026, 10, 3).toISOString()) };
await page.goto(APP + '/reports/sales?range=custom&range=2026-11-03&range=2026-11-03', { waitUntil: 'domcontentloaded' }); await waitIdle(page, 8000);
ev.sales_requests = net.filter(n => /reporting|dashboard/.test(n.url)).map(n => n.url.slice(0, 400));
ev.rule99 = await finish(page, loc, rule99); save('D2-cm-day-crosscheck', 'requests', ev); console.log(JSON.stringify(ev, null, 0).slice(0, 2500)); await browser.close();
