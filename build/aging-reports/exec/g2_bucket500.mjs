// g2_bucket500.mjs — 12 Nov 2026 06:25 UTC: Rule 140 positive control for C1062582 (draft 04). A network failure on the QA site sends the
// browser to the site's own "Environment Sleeping" page (rv1112/p56c 04-error.png), so the offline result cannot be judged here. Does the
// product show "Something went wrong loading this bucket. Collapse and expand it to try again." when the bucket's rows call FAILS ON THE
// SERVER (HTTP 500), browser online? A/R Aging Detail and A/P Aging Detail, first open of "Current" / "1-30 days past due".
import { start, REPORTS } from './lib.mjs'; import { settle } from './q3_common.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./g2/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
for (const [k, path, bucket, re] of [['ard', REPORTS.ard, /^Current/, /\/buckets\/current\/rows/], ['apd', REPORTS.apd, /^1-30 days past due/, /\/buckets\/days_1_to_30\/rows/]]) { const q = (o[k] = {});
  try { await s.go(path); await p.waitForTimeout(4000); await settle(p); let hits = 0; await p.route(re, (r) => { hits++; return r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ errors: [{ error: 'ZZAUTOTEST forced failure' }] }) }); });
    await mkSort(p).expand(bucket); /* 06:30: the text is not the expand control - sortlib.expand clicks the chevron */ for (let i = 0; i < 16; i++) { await p.waitForTimeout(500); const t = (await p.locator('main').innerText({ timeout: 3000 }).catch(() => '')).replace(/\s+/g, ' '); const m = t.match(/Something went wrong loading this bucket[^.]*\.[^.]*\./); if (m) { q.msg = m[0]; break; } }
    q.hits = hits; q.url = p.url(); q.notes = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim()); await p.screenshot({ path: OUT + k + '-bucket-500.png' }); await p.unroute(re);
  } catch (e) { q.err = String(e).slice(0, 300); } console.log('g2', k, JSON.stringify(q)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
