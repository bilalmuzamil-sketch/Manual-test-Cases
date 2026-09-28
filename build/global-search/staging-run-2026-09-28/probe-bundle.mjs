// Does the shipped front-end even contain a pinned / top-hit concept?
// NOTE: the first version of this attached a response listener AFTER the page had loaded and saw
// zero files, then printed "NOT PRESENT" - a script failure dressed up as a finding. Scripts are
// now enumerated from the DOM, and the run refuses to conclude anything if it reads no files.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await P.openPalette(b.page, 'click');
await P.type(b.page, 'S2-15430', 3000);

const srcs = await b.page.evaluate(() => [...document.querySelectorAll('script[src]')].map(s => s.src));
const res = await b.page.evaluate(async (list) => {
  const keys = ['pinned', 'topHit', 'top_hit', 'exactMatch', 'exact_match', 'search-row', 'search-group', 'search-modal'];
  const out = { read: 0, failed: [], hits: {} };
  for (const u of list) {
    let t; try { t = await (await fetch(u)).text(); } catch (e) { out.failed.push(u); continue; }
    out.read++;
    for (const k of keys) if (t.includes(k)) (out.hits[k] ||= []).push(u.split('/').pop().slice(0, 44));
  }
  return out;
}, srcs);

console.log('script tags:', srcs.length, '| read:', res.read, '| failed:', res.failed.length);
// POSITIVE CONTROL: if the classes we KNOW render are not in what we read, the search found nothing
// because the reading is broken - not because the feature is missing.
const control = res.hits['search-row'] || res.hits['search-modal'];
console.log('positive control (search-row / search-modal present):', control ? 'YES -> the bundle really was read' : 'NO -> instrument failed, conclude nothing');
for (const k of ['pinned', 'topHit', 'top_hit', 'exactMatch', 'exact_match']) {
  console.log(`  ${k.padEnd(12)}: ${res.hits[k] ? 'present in ' + res.hits[k].slice(0,2).join(', ') : (control ? 'absent' : 'unknown')}`);
}
fs.writeFileSync('probe-bundle.json', JSON.stringify({ srcs, res }, null, 1));
await b.browser.close();
