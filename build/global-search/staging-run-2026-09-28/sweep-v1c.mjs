// V1 regression, the "find X by Y" block. Each entry says what is typed, which group it must land
// in, and what must be in it. The "≈ close match:" marker is stripped because it is injected
// mid-word and makes a plain text comparison lie.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
const Q = [
  ['C53516', 'OHZZT471', 'Assets', 'ZZT-4471'],
  ['C53578', 'Bridgeport', 'Work orders', 'Bridgeport Hauling'],
  ['C53580', 'ZZT-4471', 'Assets', 'ZZT-4471'],
  ['C53581', 'Bridgeport', 'Assets', 'Bridgeport Hauling'],
  ['C53582a', 'Kestrelway', 'Customers', 'Bridgeport Hauling'],
  ['C53582b', 'Fernvale', 'Customers', 'Bridgeport Hauling'],
  ['C53582c', 'Ohio', 'Customers', 'Bridgeport Hauling'],
  ['C53582d', '44872-9931', 'Customers', 'Bridgeport Hauling'],
  ['C53583', 'bridgeporthauling-zzt.com', 'Customers', 'Bridgeport Hauling'],
  ['C53584', 'parts@kestrelsupply-zzt.com', 'Vendors', 'Kestrel Parts Supply'],
  ['C53585a', 'Halbrook', 'Vendors', 'Kestrel Parts Supply'],
  ['C53585b', 'Marnston', 'Vendors', 'Kestrel Parts Supply'],
  ['C53585c', '43055-2210', 'Vendors', 'Kestrel Parts Supply'],
  ['C53588', 'Bridgeport', 'Work orders', 'Bridgeport Hauling'],
  ['C53602a', 'ZZAUTOTESTBridgeportHauling', 'Customers', 'Bridgeport Hauling'],
  ['C53602b', 'ZZAUTOTEST Bridgeport Hauling', 'Customers', 'Bridgeport Hauling'],
  ['C53603', 'Dispatch Supervisor', 'Customers', 'Bridgeport Hauling'],
  ['C53604a', 'Dock 7B', 'Customers', 'Bridgeport Hauling'],
  ['C53604b', 'Bay 12C', 'Vendors', 'Kestrel Parts Supply'],
  ['C53605', '2019 Freightliner', 'Assets', 'Freightliner'],
  ['C53606', 'Ohio', 'Vendors', 'Kestrel Parts Supply'],
  ['C53607a', 'Kestrel', 'Parts', 'Brake Chamber Kestrel'],
  ['C53607b', 'Brake Chamber', 'Parts', 'Brake Chamber Kestrel'],
  ['C55662a', '419-555-0143', 'Customers', 'Bridgeport Hauling'],
  ['C55662b', '555-0143', 'Customers', 'Bridgeport Hauling'],
  ['C55663a', '(614) 555-0188', 'Vendors', 'Kestrel Parts Supply'],
  ['C55663b', '6145550188', 'Vendors', 'Kestrel Parts Supply'],
  ['C55664', 'Cascadia', 'Assets', 'Cascadia'],
  ['C55688', 'Freightliner', 'Assets', 'Freightliner'],
  ['C55689', '2019', 'Assets', '2019'],
  ['C45155', 'Cascadia', 'Assets', 'Cascadia'],
  ['C45157', 'Kestrel', null, null],
  ['C55659a', '34367', 'Work orders', 'Bridgeport Hauling'],
  ['C55659b', '88-4412', 'Parts', 'Brake Chamber Kestrel'],
];
const b = await P.openStaging('/customers', 'admin');
const out = {};
for (const [cid, q, group, must] of Q) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3400);
  const s = await P.read(b.page);
  const groups = (s.groupRows || []).map(g => ({ head: clean(g.head), rows: g.rows.map(r => clean(r).slice(0, 110)) }));
  const g = group ? groups.find(x => x.head.toLowerCase().startsWith(group.toLowerCase())) : null;
  const ok = group ? !!(g && g.rows.some(r => r.includes(must))) : null;
  // C45157 - does any row appear twice within a group?
  const dupes = groups.flatMap(x => {
    const seen = {}, d = [];
    for (const r of x.rows) { const k = r.slice(0, 50); if (seen[k]) d.push(`${x.head}: ${k}`); seen[k] = 1; }
    return d;
  });
  out[cid] = { q, group, must, ok, groups: groups.map(x => ({ head: x.head, n: x.rows.length })),
               rows: g ? g.rows.slice(0, 6) : null, dupes,
               headings: groups.map(x => x.head) };
  console.log(`${cid.padEnd(9)} "${q}" -> ${group || '(any)'}: ${ok === null ? (dupes.length ? 'DUPLICATES: ' + dupes.join(' ;; ') : 'no duplicates') : (ok ? 'found' : 'NOT FOUND')}`);
  if (ok === false) console.log(`          groups: ${out[cid].headings.join(', ') || '(none)'} | rows: ${(out[cid].rows || []).slice(0, 3).join(' ;; ')}`);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}
fs.writeFileSync('sweep-v1c.json', JSON.stringify(out, null, 1));
await b.browser.close();
