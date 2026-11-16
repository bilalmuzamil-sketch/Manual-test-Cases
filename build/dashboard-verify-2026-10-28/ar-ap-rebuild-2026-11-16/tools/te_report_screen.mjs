// Item 3: the Technician Efficiency REPORT on screen at Last 12 Months (the report's chip uses filter_chip_range /
// filter_preset_range_<preset>, proven 16 Nov in report-gaps W2 evidence_w2.mjs), with the tile figures read in the same session
// for comparison, plus a screenshot of each. Usage: TZ=<zone> node te_report_screen.mjs DVI|HD   SECRET-FREE.
import fs from 'fs';
import { boot, LOC, APP, sleep, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const KEY = process.argv[2]; const loc = LOC[KEY]; const EV = new URL('../evidence/', import.meta.url).pathname; const RAW = `/tmp/cln/arap/te/${KEY}/`;
const { browser, page } = await boot(loc, { viewport: { width: 1920, height: 1080 } }); const out = { start: await rule99(page, loc) };
const resp = []; page.on('response', async r => { if (/technician-efficiency\//.test(r.url())) { try { resp.push({ u: decodeURIComponent(r.url()).replace(/^.*\/api/, ''), j: await r.json() }); } catch {} } });
await page.goto(APP + '/reports/technician-efficiency', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(6000);
const chip = page.locator('[data-test-id="filter_chip_range"], [data-test-id="filter_chip_dateRange"]').first(); out.chip_before = await chip.innerText().catch(() => null);
await chip.click().catch(e => out.chip_err = String(e).slice(0, 100)); await sleep(1200);
out.presets = await page.locator('[data-test-id^="filter_preset_range_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id'))).catch(() => []);
await page.locator('[data-test-id="filter_preset_range_last_12_months"]').first().click().catch(e => out.preset_err = String(e).slice(0, 100)); await sleep(1000);
await page.keyboard.press('Escape'); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(7000);
out.chip_after = await chip.innerText().catch(() => null);
out.rows = await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\s+/g, ' ').trim())).filter(r => r.length > 2)).catch(() => []);
await page.screenshot({ path: `${RAW}report-te-last12-screen.png`, fullPage: true });
out.requests = resp.map(x => x.u.slice(0, 200)); out.last = resp.filter(x => /last_12_months/.test(x.u)).map(x => (x.j?.data?.collection || []).map(r => [r.technician, r.technicianTechHours, r.technicianClockedHours, r.technicianTechEfficiency])).slice(-1)[0];
out.end = await rule99(page, loc); save(EV + `te-report-screen-${KEY}.json`, out); console.log(JSON.stringify({ chip: out.chip_after, err: out.preset_err, rows: out.rows.slice(0, 6), last: out.last })); await browser.close();
