// Area 6 — switch location from the top bar while on the Dashboard (Heavy Duty -> Lethbridge, both America/Edmonton, so Rule 99 holds throughout).
// Watches every tile's text every ~150 ms during the switch for a figure from the previous location (S6-R14, S1-E1).
import { boot, LOC, gotoDash, tile, shot, save, sleep, netlog, setRange, finish, TILES, headerCheck } from './hb.mjs';
const A = LOC.HD, B = LOC.LB; const { browser, page, rule99, app_version } = await boot(A); const net = netlog(page, '/api/dashboard/reports');
const ev = { app_version, from: A.name, to: B.name };
await gotoDash(page);
await setRange(page, 'revenueKpi', 'Last Quarter');
await page.locator('[data-test-id="btn_toggle_details_techUtilizationKpi"]').click(); await sleep(6000);
const read = async () => Object.fromEntries(await Promise.all([...TILES, 'atRiskHero'].map(async k => [k, (await tile(page, k)).value])));
ev.before = await read(); ev.before_chips = Object.fromEntries(await Promise.all(TILES.map(async k => [k, (await tile(page, k)).chip])));
await shot(page, 'area6-locswitch', '1-heavy-duty');
// open the location selector in the header
await page.locator('header .short-text-content').first().click(); await sleep(1500);
await shot(page, 'area6-locswitch', '2-selector-open');
await page.locator('.q-menu').last().getByText(A.name, { exact: true }).first().click(); await sleep(1500);
await shot(page, 'area6-locswitch', '2b-location-list');
const item = page.locator('.q-menu').last().getByText(B.name, { exact: true }).first();
ev.menu = (await page.locator('.q-menu').last().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 12);
const n0 = net.length; const timeline = []; const t0 = Date.now();
await item.click();
for (let i = 0; i < 80; i++) { timeline.push({ ms: Date.now() - t0, url: page.url().replace(/^https:\/\/[^/]+/, ''), v: await read().catch(() => null) }); await sleep(150); }
await sleep(3000); await page.evaluate(([w, z]) => { /* record only */ return [localStorage.getItem('location'), localStorage.getItem('timezone')]; }, [B.id, B.tz]).then(x => ev.ls_after = x);
ev.after = await read(); ev.after_chips = Object.fromEntries(await Promise.all(TILES.map(async k => [k, (await tile(page, k)).chip])));
ev.expanded_after = await page.evaluate(() => document.querySelector('[data-test-id="hero_detail_panel"]')?.innerText?.replace(/\s+/g, ' ').slice(0, 80) ?? null);
ev.header_after = await headerCheck(page, B);
await shot(page, 'area6-locswitch', '3-lethbridge-after');
ev.requests_after = net.slice(n0).map(r => ({ status: r.status, url: r.url.slice(0, 200), loc: null }));
// the stale check: any value seen after the click that equals the Heavy Duty value and differs from the final Lethbridge value
ev.stale = []; for (const s of timeline) if (s.v) for (const k of Object.keys(s.v)) if (s.v[k] && s.v[k] === ev.before[k] && s.v[k] !== ev.after[k] && s.ms > 0) ev.stale.push({ ms: s.ms, tile: k, shown: s.v[k] });
ev.timeline = timeline; ev.rule99 = rule99; ev.rule99.header_end = ev.header_after;
save('area6-locswitch', 'hd-to-lb', ev);
console.log(app_version, JSON.stringify({ before: ev.before, after: ev.after, after_chips: ev.after_chips, expanded_after: ev.expanded_after, ls: ev.ls_after, hdr: ev.header_after.shows_location, stale: ev.stale.slice(0, 10), nReq: ev.requests_after.length, menu: ev.menu }));
await browser.close();
