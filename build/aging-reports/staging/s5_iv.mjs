// s5_iv.mjs — 12 Nov 2026, staging after the release, C715475: open the Inventory Value link saved before the release
// (before-iv/"page address.txt", only DVI Test ticked), read the chips and rows, Download (PDF) and Download (CSV) from the ⋯ menu, keep both
// files in s5/ for the byte/text comparison with the saved ones. QA lead's session only (stglib); browser Asia/Karachi.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s5/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const o = {};
const link = fs.readFileSync(decodeURIComponent(new URL('./before-iv/Inventory Value (DVI Test) - page address.txt', import.meta.url).pathname), 'utf8').trim(); o.link = link;
await p.goto(link, { waitUntil: 'domcontentloaded' }); await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(4000);
o.url = p.url(); o.chips = await p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /:/.test(t)).slice(0, 8));
o.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr, main tfoot tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)); o.pic1 = await s.shot('1-link-opened');
async function dl(item, tag) { const q = {}; const w = p.waitForEvent('download', { timeout: 90000 }).catch(() => null);
  await p.locator('main button[aria-label="Export report"], main button:has(i:text("more_horiz")), main .q-btn:has-text("more_horiz")').first().click(); await p.waitForTimeout(900); q.menu = await p.locator('.q-menu:visible').last().innerText().catch(() => '');
  await p.locator('.q-menu:visible').last().getByText(item, { exact: true }).click(); const d = await w; await p.waitForTimeout(1500);
  q.notes = await p.locator('.q-notification').allInnerTexts().catch(() => []); if (d) { q.file = d.suggestedFilename(); await d.saveAs(OUT + tag + '-' + q.file); q.saved = OUT + tag + '-' + q.file; } q.pic = await s.shot(tag); return q; }
try { o.pdf = await dl('Download (PDF)', '2-pdf'); } catch (e) { o.pdfErr = String(e).slice(0, 200); }
await p.waitForTimeout(3000); try { o.csv = await dl('Download (CSV)', '3-csv'); } catch (e) { o.csvErr = String(e).slice(0, 200); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
