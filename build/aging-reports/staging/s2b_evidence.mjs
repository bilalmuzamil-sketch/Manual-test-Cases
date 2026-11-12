// s2b_evidence.mjs (browser in Asia/Karachi per Rule 125, from stglib; OUT_SUB picks the output folder) (bucket opened with sortlib.expand, which knows the row's arrow-icon prefix) — 12 Nov 2026, staging: the evidence rows for C715471/C715472 with their bucket OPENED (s2 left them closed):
// A/R Detail "ZZAUTOTEST SV11315 Staging CM" -> Current (CM2-4541); "E2E Credits Customer" -> Current (P3-2458 etc., due 11 Nov 7-8 pm UTC =
// 12 Nov in Karachi); "Tucson Truck Center" -> 31-60 (S3-17147, due 12 Sep 10:57 pm UTC = 13 Sep in Karachi); A/P Detail
// "ZZAUTOTEST SV11315 Staging VC" -> Current (C-13911). Reads the opened rows as shown (Date, Due Date, Past Due) and boxes the target row.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { mkSort } from '../exec/sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./' + (process.env.OUT_SUB || 's2') + '/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const S = mkSort(p); const o = {};
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
const box = (src) => p.evaluate((src) => { const re = new RegExp(src); const tr = [...document.querySelectorAll('main tbody tr')].find((t) => re.test(t.innerText)); if (!tr) return null; tr.scrollIntoView({ block: 'center' }); const r = tr.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }, src);
const heads = () => p.evaluate(() => [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()));
async function ev(tag, slug, kind, name, bucket, target) { const q = (o[tag] = {}); try { await s.go('/reports/' + slug); await p.waitForTimeout(3500); await F.pick(kind, name); await p.waitForTimeout(3000);
  q.exp = await S.expand(new RegExp('^' + bucket.replace(/[-()]/g, (c) => '\\' + c) + ' \\(')); await p.waitForTimeout(3500);
  q.heads = await heads(); q.rows = await rows(); await box(target); await p.waitForTimeout(800); q.box = await box(target); q.pic = await s.shot(tag); } catch (e) { q.err = String(e).slice(0, 200); await s.shot(tag + '-error'); } }
await ev('ev-cm', 'ar-aging-detail', 'Customer', 'ZZAUTOTEST SV11315 Staging CM', 'Current', 'CM2-4541');
await ev('ev-e2e', 'ar-aging-detail', 'Customer', 'E2E Credits Customer', 'Current', 'P3-2458');
await ev('ev-tucson', 'ar-aging-detail', 'Customer', 'Tucson Truck Center', '31-60 days past due', 'S3-17147');
await ev('ev-vc', 'ap-aging-detail', 'Vendor', 'ZZAUTOTEST SV11315 Staging VC', 'Current', 'C-13911');
fs.writeFileSync(OUT + 'evidence.json', JSON.stringify(o, null, 1));
for (const [k, v] of Object.entries(o)) console.log(k, JSON.stringify({ heads: v.heads, box: v.box, err: v.err, rows: v.rows?.filter((r) => /CM2-4541|P3-24|S3-399|S3-400|CM3-453|S3-1714|S3-17238|C-13911|Current|31-60/.test(r)).slice(0, 14) }).slice(0, 2200));
await s.close(); process.exit(0);
