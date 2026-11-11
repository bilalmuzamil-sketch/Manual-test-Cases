// pr2_credit_before.mjs — 11 Nov 2026: C1062590 "before the release" side on PRODUCTION (build before the release). Makes customer "ZZAUTOTEST
// Credit Today PR2" with a $25 credit memo dated today (POST /api/credit-memos as the Issue Credit screen sends it, L0622), opens A/R Aging
// Detail from the Reports menu (as of today), records every reporting answer the page receives and finds which bucket holds the credit; expands
// that bucket on screen and takes the picture. Rule 107: production CRUD authorised, no cleanup. Output exec/prod/pr2.json + pictures.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const o = {}; const save = () => fs.writeFileSync(OUT + 'pr2.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/customers', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version; const API = 'https://' + B.APIH;
const req = (m, u, b) => p.evaluate(async ([m, u, b]) => { const r = await fetch(u, { method: m, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); return { st: r.status, j: await r.json().catch(() => null) }; }, [m, API + u, b]);
const resp = []; p.on('response', async (r) => { if (/reporting|aging|account-receivable|receivable/i.test(r.url()) && r.request().method() === 'GET') { try { resp.push({ u: r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 200), t: (await r.text()).slice(0, 200000) }); } catch {} } });
try { const me = await req('GET', '/api/auth/me/fe-permissions'); o.loc = JSON.stringify(me.j?.data?.workplace || me.j?.data?.current_workplace || '').slice(0, 200);
  const c = await req('POST', '/api/customers/create', { name: 'ZZAUTOTEST Credit Today PR2 ' + (Date.now() % 1e5) }); o.customer = [c.st, JSON.stringify(c.j).slice(0, 200)]; const cid = c.j?.data?.company_id;
  const v = await req('GET', '/api/customers/view/' + cid); const acct = v.j?.data?.customer_account_id || v.j?.data?.company?.customer_account_id; o.acct = acct; o.viewKeys = Object.keys(v.j?.data || {}).slice(0, 30);
  const now = new Date(); const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 7)).toISOString();
  const cr = await req('POST', '/api/credit-memos', { customerAccountId: acct, amount: 25, reason: 'ZZAUTOTEST credit dated today (C1062590 before side)', originKind: 'manual', originDate: day }); o.credit = [cr.st, JSON.stringify(cr.j).slice(0, 300)]; o.creditNum = cr.j?.data?.creditNumber;
  o.name = c.j?.data?.name || null; save();
  await p.goto(B.APP + '/reports', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await p.getByText('A/R Aging Detail', { exact: true }).first().click(); await p.waitForTimeout(7000); o.url = p.url(); await p.screenshot({ path: OUT + 'pr2-1-detail.png' });
  o.hits = resp.filter((r) => o.creditNum && r.t.includes(o.creditNum)).map((r) => { const i = r.t.indexOf(o.creditNum); return { u: r.u, ctx: r.t.slice(Math.max(0, i - 700), i + 300) }; }); o.respUrls = resp.map((r) => r.u).slice(0, 15);
  o.buckets = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')).filter((t) => /past due|Current|days/i.test(t)).slice(0, 8);
  for (const lbl of ['Current', '1-30 days past due']) { const row = p.locator('main tbody tr').filter({ hasText: new RegExp('^\\s*(keyboard_arrow_\\w+\\s*)?' + lbl) }).first(); if (await row.count()) { await row.locator('button, i').first().click().catch(() => {}); await p.waitForTimeout(4000); } }
  const loc = p.locator('main tbody tr').filter({ hasText: o.creditNum || '###' }).first(); o.onScreen = await loc.count(); if (o.onScreen) { await loc.scrollIntoViewIfNeeded(); o.row = (await loc.innerText()).replace(/\s+/g, ' '); }
  o.hits2 = resp.filter((r) => o.creditNum && r.t.includes(o.creditNum)).map((r) => { const i = r.t.indexOf(o.creditNum); return { u: r.u, ctx: r.t.slice(Math.max(0, i - 500), i + 200) }; }).slice(0, 4); await p.screenshot({ path: OUT + 'pr2-2-credit-row.png' });
} catch (e) { o.err = String(e).slice(0, 300); }
save(); console.log('pr2', JSON.stringify({ v: o.version, credit: o.credit, num: o.creditNum, url: o.url, hits: (o.hits2 || o.hits || []).map((h) => h.u), row: o.row, err: o.err }).slice(0, 900)); await B.browser.close(); process.exit(0);
