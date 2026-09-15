// C45160 -- is a usage event recorded when a result is selected?
//
// The 14 September probe could not answer it: two analytics posts went out through sendBeacon and
// their bodies could not be read, so "no search event was seen" was one unreadable body away from
// being wrong. An unreadable instrument is not evidence (Rule 104), so this closes that hole three
// ways before any verdict:
//
//   1. WRAP sendBeacon AND fetch IN THE PAGE ITSELF, before any app code runs, so the payload is
//      captured in the page rather than inferred from the network.
//   2. Intercept the same traffic at the network layer as a second, independent record.
//   3. Read the app's own JavaScript for the event name the previous version sent
//      (global_search_use), so "the app never tries" and "the app tried and it was not captured"
//      can be told apart.
//
// Control: page_view events must be captured during the same run, or the silence says nothing.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/C45160-ANALYTICS.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APP } = await boot('sv9160','/','admin');

// 1. in-page capture, installed before the app loads
await page.addInitScript(() => {
  window.__beacons = [];
  const sb = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
  if (sb) navigator.sendBeacon = function (url, data) {
    let body = '';
    try { body = typeof data === 'string' ? data
      : (data instanceof Blob ? '[blob]' : JSON.stringify(data)); } catch (e) { body = '[unreadable]'; }
    window.__beacons.push({ how: 'sendBeacon', url: String(url), body: String(body).slice(0, 2000) });
    if (data instanceof Blob) { try { data.text().then(t =>
      window.__beacons.push({ how: 'sendBeacon-blob', url: String(url), body: t.slice(0, 2000) })); } catch (e) {} }
    return sb(url, data);
  };
  const of_ = window.fetch;
  window.fetch = function (input, init) {
    try { const u = typeof input === 'string' ? input : (input && input.url) || '';
      if (/collect|analytic|telemetry|track/i.test(u))
        window.__beacons.push({ how: 'fetch', url: u,
          body: String((init && init.body) || '').slice(0, 2000) }); } catch (e) {}
    return of_.apply(this, arguments);
  };
});

// 2. network-layer record
const routed = [];
await page.route(/google-analytics|analytics|telemetry|collect|gtag|gtm/i, async (route, req) => {
  let body = ''; try { body = req.postData() || ''; } catch (e) {}
  if (!body) { try { const b = req.postDataBuffer && req.postDataBuffer(); if (b) body = b.toString('utf8'); } catch (e) {} }
  routed.push({ url: req.url().slice(0, 120), method: req.method(), body: String(body).slice(0, 1200) });
  await route.continue();
}).catch(() => {});

await page.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);

const openModal = async () => { await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }); };
await openModal();
await page.fill('[data-test-id="search_modal_input"]', '');
await page.type('[data-test-id="search_modal_input"]', 'Bridgeport', { delay: 30 });
await page.waitForTimeout(9000);

const beaconsBefore = await page.evaluate(() => (window.__beacons || []).length);
const routedBefore = routed.length;
R.clicked = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  const row = d && d.querySelector('[data-test-id^="search_result_row_customers"]');
  if (!row) return null; const t = (row.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  row.click(); return t; });
await page.waitForTimeout(9000);

const beacons = await page.evaluate(() => window.__beacons || []);
R.inPageCaptured = { before: beaconsBefore, after: beacons.length,
  duringTheClick: beacons.slice(beaconsBefore) };
R.networkCaptured = { before: routedBefore, after: routed.length,
  duringTheClick: routed.slice(routedBefore) };
const names = s => [...String(s).matchAll(/(?:^|&|\n|\?)en=([^&\n]+)/g)].map(m => decodeURIComponent(m[1]));
R.eventNamesDuringTheClick = [...new Set([
  ...beacons.slice(beaconsBefore).flatMap(b => names(b.body + '\n' + b.url)),
  ...routed.slice(routedBefore).flatMap(r => names(r.body + '\n' + r.url))])];
R.eventNamesAtAnyPoint = [...new Set([
  ...beacons.flatMap(b => names(b.body + '\n' + b.url)),
  ...routed.flatMap(r => names(r.body + '\n' + r.url))])];
R.anySearchEvent = R.eventNamesAtAnyPoint.some(n => /search/i.test(n));
R.control_analyticsWorksAtAll = R.eventNamesAtAnyPoint.length > 0;
R.control_nothingUnreadable = !routed.slice(routedBefore).some(r => r.method === 'POST' && !r.body)
  && !beacons.slice(beaconsBefore).some(b => b.body === '[unreadable]');
L('events during the click:', JSON.stringify(R.eventNamesDuringTheClick));
L('events at any point   :', JSON.stringify(R.eventNamesAtAnyPoint));
save();

// 3. does the app's own code even mention it?
R.appCode = await page.evaluate(async () => {
  const srcs = [...document.querySelectorAll('script[src]')].map(s => s.src);
  const out = { scripts: srcs.length, mentions: [], scanned: 0, failed: [] };
  for (const s of srcs.slice(0, 40)) {
    try { const t = await (await fetch(s)).text(); out.scanned++;
      for (const w of ['global_search_use', 'globalSearchUse', 'global_search', 'search_use'])
        if (t.includes(w)) out.mentions.push({ script: s.split('/').pop(), word: w });
    } catch (e) { out.failed.push(s.split('/').pop()); }
  }
  return out; });
L('the app code mentions:', JSON.stringify(R.appCode.mentions), '| scanned', R.appCode.scanned, 'scripts');
save();
await page.screenshot({ path: `${DIR}/unrun3-evidence/C45160-after-select.png` });
await browser.close();
