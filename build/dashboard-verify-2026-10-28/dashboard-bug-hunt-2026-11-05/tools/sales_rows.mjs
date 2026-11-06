// Area 2 lead: every Sales-report row (screen + its API) for a range, to compare each invoice's date with the chart bucket.
import { boot, LOC, save, sleep, waitIdle, netlog, APP, finish, shot } from './hb.mjs';
const loc = LOC[process.argv[2] || 'HD']; const q = process.argv[3] || 'range=this_month';
const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page);
await page.goto(APP + '/reports/sales?' + q, { waitUntil: 'domcontentloaded' }); await waitIdle(page, 9000);
const rows = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => [...r.querySelectorAll('td')].map(td => td.innerText.trim()).slice(0, 4)));
await shot(page, 'area2-daybound', `sales-${loc.name.replace(/[^A-Za-z]+/g, '').slice(0, 12)}-${q.replace(/[^a-z0-9]+/gi, '_')}`, { fullPage: true });
const apis = net.filter(n => /report|dashboard|sales/i.test(n.url)).map(n => ({ url: n.url, status: n.status, body: n.body }));
const r99 = await finish(page, loc, rule99);
save('area2-daybound', `sales-${loc.name.replace(/[^A-Za-z]+/g, '').slice(0, 12)}-${q.replace(/[^a-z0-9]+/gi, '_')}`, { app_version, rule99: r99, q, rows, apis });
console.log(app_version, r99.all_match, 'rows', rows.length); console.log(JSON.stringify(rows)); console.log(apis.map(a => a.status + ' ' + a.url.slice(0, 250)).join('\n'));
await browser.close();
