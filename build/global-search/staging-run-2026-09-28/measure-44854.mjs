// Now the fixture discriminates: the Wheel Seal leads the neutral page AND is on this work order.
// If the demotion works it must fall below the Brake Shoe Kit when searched from that work order.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
const { woId } = JSON.parse(fs.readFileSync('/tmp/staging/wo-44854.json', 'utf8'));
async function clickTab(page, n) {
  const g = await page.evaluate((n) => { const t = [...document.querySelectorAll('.search-tabs__tab')]
    .find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase())); if (!t) return null; t.click(); return 1; }, n);
  if (g) await page.waitForTimeout(1600);
}
const b = await P.openStaging('/customers', 'admin');
async function read(url, label) {
  await b.page.goto(url, { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(7500);
  await P.openPalette(b.page, 'click');
  await b.page.mouse.move(5, 5);
  await P.type(b.page, 'ZZAUTOTEST Fibridge', 4200);
  await clickTab(b.page, 'Parts');
  const s = await P.read(b.page);
  const rows = (s.rows || []).map(r => clean(r.text).split(' ').slice(2, 5).join(' '));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(800);
  console.log(`${label.padEnd(30)} ${rows.map((r, i) => `${i + 1}. ${r}`).join('   |   ')}`);
  return rows;
}
const WO = `https://app.staging.shopview.com/workorders/${woId}/part-requests`;
const out = { passes: [] };
for (let i = 1; i <= 2; i++) out.passes.push({
  neutral: await read('https://app.staging.shopview.com/customers', `pass ${i} · Customers page`),
  wo: await read(WO, `pass ${i} · the work order holding the Wheel Seal`),
});
const same = (a, c) => JSON.stringify(a) === JSON.stringify(c);
out.stable = same(out.passes[0].neutral, out.passes[1].neutral) && same(out.passes[0].wo, out.passes[1].wo);
out.changes = !same(out.passes[0].neutral, out.passes[0].wo);
const pos = (rows, w) => rows.findIndex(r => r.includes(w)) + 1;
out.wheelSealNeutral = pos(out.passes[0].neutral, 'Wheel');
out.wheelSealOnWo = pos(out.passes[0].wo, 'Wheel');
console.log(`\nboth passes agree: ${out.stable}`);
console.log(`the Wheel Seal sits at ${out.wheelSealNeutral} on a neutral page and ${out.wheelSealOnWo} from the work order it is on`);
console.log(`THE ORDER CHANGES WITH WHERE YOU STAND: ${out.changes}`);
fs.writeFileSync('measure-44854.json', JSON.stringify(out, null, 1));
await b.browser.close();
