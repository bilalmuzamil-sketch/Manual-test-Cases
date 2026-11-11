// pr2d_bucket.mjs — 11 Nov 2026: C1062590 before-side on PRODUCTION, final read. pr2c found the credits as "CM1-4412"/"CM1-4413" (production
// prefixes credit numbers with a location number) in the old A/R Aging Detail reply. Here: that reply as of today, parsed - which bucket holds
// each credit (dated today 07:00), with its date and due date; plus a picture of A/R Aging Detail with the bucket opened. Output exec/prod/pr2d.json.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; const API = 'https://' + B.APIH;
try { const day = new Date().toISOString().slice(0, 10); o.day = day;
  const t = await p.evaluate(async (u) => (await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } })).text(), `${API}/api/reporting/account-receivable/aging-detail-report?asOfDate=${day}T23%3A59%3A59.999Z`);
  const j = JSON.parse(t); const b = j.data?.buckets || {}; o.bucketKeys = Object.keys(b); o.hits = [];
  for (const [k, v] of Object.entries(b)) for (const x of (v.transactions || [])) if (/^CM1-441[23]$/.test(x.transactionNumber)) o.hits.push({ bucket: k, ...x });
  await p.getByText('A/R Aging Detail', { exact: true }).first().click(); await p.waitForTimeout(7000); await p.screenshot({ path: OUT + 'pr2d-1-detail.png' });
  const lbl = o.hits[0] && { current: 'Current', '1-30': '1-30 days', days_1_to_30: '1-30 days' }[o.hits[0].bucket]; o.label = lbl;
  const row = p.locator('main tbody tr').filter({ hasText: new RegExp(lbl ? lbl.replace(/[-]/g, '\\-') : 'Current') }).first(); if (await row.count()) { await row.locator('td').nth(1).click().catch(() => {}); await p.waitForTimeout(4000); }
  const cr = p.locator('main tbody tr').filter({ hasText: 'CM1-4412' }).first(); o.onScreen = await cr.count(); if (o.onScreen) { await cr.scrollIntoViewIfNeeded(); o.row = (await cr.innerText()).replace(/\s+/g, ' '); } await p.screenshot({ path: OUT + 'pr2d-2-credit.png' });
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'pr2d.json', JSON.stringify(o, null, 1)); console.log('pr2d', JSON.stringify({ keys: o.bucketKeys, hits: o.hits?.map((h) => [h.bucket, h.transactionNumber, h.date, h.dueDate, h.balance]), row: o.row, err: o.err })); await B.browser.close(); process.exit(0);
