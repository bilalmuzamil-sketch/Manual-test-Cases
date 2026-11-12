// s11_chevron.mjs — 12 Nov 2026, staging (v26.45.4): C715534 vs PRD v12 S4-R1 ("The chevron is blue, the same as each group's own chevron").
// A/P Aging Detail, all buckets closed: computed colour of the top-left header chevron and of a bucket chevron; picture. Read-only.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s11/', import.meta.url).pathname; const s = await stgStart(OUT); const p = s.page;
await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
const o = await p.evaluate(() => { const col = (el) => el ? getComputedStyle(el).color : null; const th = document.querySelector('main thead th'); const hi = th && th.querySelector('i, svg, .q-icon');
  const g = [...document.querySelectorAll('main tbody tr')].find((t) => /days past due|Current/.test(t.innerText)); const gi = g && g.querySelector('i, svg, .q-icon');
  const b = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
  return { header: { text: hi?.textContent?.trim(), color: col(hi), box: b(hi) }, group: { text: gi?.textContent?.trim(), color: col(gi), box: b(gi) } }; });
o.pic = await s.shot('apd-header-chevron'); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await s.close(); process.exit(0);
