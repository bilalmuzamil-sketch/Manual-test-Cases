// s20_rowheight.mjs — 14 Nov 2026, C1145247: does customer A's row in the A/R Customer menu stay inside its row only when the search list is short?
// Types several searches that include customer A and measures A's row (height, lines, spill onto the next row) and how many rows are listed. Read-only.
import { stgStart } from './stglib.mjs'; import { M } from './m16.mjs'; import fs from 'fs';
const OUT = new URL('./s20/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const m = M(p); const o = {};
const A = 'ZZAUTOTEST' + 'Abcdefghij'.repeat(11);
await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000); await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(2000); const menu = p.locator('.q-menu').last();
o.zzbreak = await m.menuRow('ZZBREAK <b>bold</b> "q" & \'x\' Superlongunbrokencustomernamewithoutanyspacesatalltotestoverflowandtruncationbehaviouroncardsandheaders');
for (const q of ['Abc', 'ZZA', 'Z', 'hij', 'ZZAUTOTESTAbcdefghij']) { await menu.locator('input:not([type=checkbox])').first().fill(q); await p.waitForTimeout(3000); const r = await m.menuRow(A); o[q] = r && { found: r.found, count: r.count, lines: r.lines, box: r.box, cutAtTop: r.cutAtTop, spillsBelow: r.spillsBelow, overNextRow: r.overNextRow, next: r.nextText }; if (r?.found) o[q].pic = await s.shot('search-' + q); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 3000)); await s.close(); process.exit(0);
