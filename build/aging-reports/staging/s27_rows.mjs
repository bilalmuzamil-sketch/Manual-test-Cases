// s27_rows.mjs — 16 Nov 2026 (C715472): the two Stillwater Diesel Repair bills on A/P Detail as the SCREEN shows them, as of 11/12/2026 and as of today. Read-only.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { M } from './m16.mjs'; import fs from 'fs';
const OUT = new URL('./s27/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const m = M(p); const o = {};
for (const d of ['2026-11-12', '']) { const k = d || 'today'; await s.go('/reports/ap-aging-detail' + (d ? '?asOfDate=' + d : '')); await p.waitForTimeout(4000); await F.pick('Vendor', 'Stillwater Diesel', 'Stillwater Diesel Repair'); await p.waitForTimeout(3000); await m.headerChevron().click(); await p.waitForTimeout(6000);
  o[k] = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /055-541861|069-855902/.test(t))); o[k + 'Pic'] = await s.shot('stillwater-' + k); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await s.close(); process.exit(0);
