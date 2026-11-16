// s26_bill.mjs — 16 Nov 2026 (C715472): open the two Stillwater Diesel Repair bills (055-541861, 069-855902) from their links on A/P Detail and read what the bill page says (amount, paid, balance due). Read-only.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { M } from './m16.mjs'; import fs from 'fs';
const OUT = new URL('./s26/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const m = M(p); const o = {};
for (const num of ['055-541861', '069-855902']) { try {
  await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000); await F.pick('Vendor', 'Stillwater Diesel', 'Stillwater Diesel Repair'); await p.waitForTimeout(3000); await m.headerChevron().click(); await p.waitForTimeout(5000);
  const row = p.locator('main tbody tr', { hasText: num }).first(); o[num] = { row: (await row.innerText()).replace(/\s+/g, ' ') }; o[num].picRow = await s.shot('row-' + num);
  const pop = p.context().waitForEvent('page', { timeout: 8000 }).catch(() => null); await row.locator('a', { hasText: num }).first().click(); const np = await pop; const q = np || p; await q.waitForTimeout(6000);
  o[num].url = q.url().replace(/^https:\/\/[^/]+/, ''); o[num].text = (await q.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1800); await q.screenshot({ path: OUT + 'bill-' + num + '.png' }); o[num].pic = OUT + 'bill-' + num + '.png'; if (np) await np.close();
} catch (e) { o[num + '-err'] = String(e).slice(0, 200); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 4000)); await s.close(); process.exit(0);
