// s12c_name.mjs — 12 Nov 2026, staging: C715534 step 3 "its name in bold": heaviest font weight of any text-bearing element in the bucket-name cell
// on A/P Aging Detail (closed), and of a normal data cell for contrast. Read-only.
import { stgStart } from './stglib.mjs';
const s = await stgStart(new URL('./s12/', import.meta.url).pathname); const p = s.page; await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
const o = await p.evaluate(() => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => /days past due/.test(t.innerText)); const td = [...tr.querySelectorAll('td')].find((x) => /days past due/.test(x.innerText));
  const els = [td, ...td.querySelectorAll('*')].filter((e) => e.childNodes && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map((e) => [e.tagName, e.className.slice(0, 40), getComputedStyle(e).fontWeight, e.textContent.trim().slice(0, 30)]);
  return els; });
console.log(JSON.stringify(o)); await s.close(); process.exit(0);
