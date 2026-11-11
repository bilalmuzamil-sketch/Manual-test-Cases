// s89c_click.mjs — 11 Nov 2026 ~18:40: C715420 (A/P Detail) / C715421 (A/P Unpaid Invoices) for vendor "ZZY VCredit Links P89b". s89b looked for
// the vendor-return memo numbers (ZZYCM…), but the No. column shows the vendor CREDIT numbers: C-13686 ($-31.50, return at Heavy Duty = credit A),
// C-13687 ($-42.75, return at Lethbridge = credit B), C-13688 ($-23.45, entered directly = credit C). Here: on each report read each number's cell
// (a link element? colour, cursor), then click credit A's number and record where it lands (URL, page heading, new tab), with pictures.
import { start, REPORTS, A } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s89c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p);
const V = 'ZZY VCredit Links P89b'; const NUM = { A: 'C-13686', B: 'C-13687', C: 'C-13688' }; const R = {};
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
const cell = (n) => p.evaluate((n) => { const td = [...document.querySelectorAll('main tbody td')].find((t) => t.innerText.trim() === n); if (!td) return { found: 0 };
  const t = td.querySelector('a, [role=link]') || td.querySelector('span, div') || td; const c = getComputedStyle(t); return { found: 1, link: !!td.querySelector('a, [role=link]'), tag: t.tagName, href: td.querySelector('a')?.getAttribute('href') || null, color: c.color, cursor: c.cursor, row: td.closest('tr').innerText.replace(/\s+/g, ' ') }; }, n);
for (const [id, k] of [['C715420', 'apd'], ['C715421', 'apu']]) { const o = { id };
  try { await s.go(REPORTS[k]); await p.waitForTimeout(3500); await settle(); await F.pick('Vendor', V); await settle();
    if (k === 'apd') { for (const b of [/^91 or more/, /^61-90/, /^31-60/, /^1-30/, /^Current/]) await S.expand(b).catch(() => {}); } else await S.expand(new RegExp('^' + V + ' \\(')).catch(() => {}); await settle();
    for (const [l, n] of Object.entries(NUM)) o[l] = await cell(n); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + id + '-1-numbers.png' });
    const u0 = p.url(); const pages0 = p.context().pages().length; await p.locator('main tbody td').filter({ hasText: NUM.A }).first().locator('a, [role=link], span').first().click(); await p.waitForTimeout(5000);
    const pg = p.context().pages().length > pages0 ? p.context().pages().at(-1) : p; await pg.waitForTimeout(1500);
    o.clickA = { from: u0, url: pg.url(), newTab: pg !== p, heading: (await pg.locator('main').innerText().catch(() => '')).split('\n').slice(0, 8), dialogs: await p.locator('.q-dialog').count() };
    await pg.screenshot({ path: OUT + id + '-2-opened.png' }); if (pg !== p) await pg.close();
  } catch (e) { o.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + id + '-error.png' }).catch(() => {}); }
  R[id] = o; console.log(id, o.err || 'ok', JSON.stringify(o).slice(0, 600)); }
// C715391: vendor "ZZY VCredit Loc P89b" - credit from a Lethbridge return ($-52.25) and a direct credit entered at Heavy Duty ($-19.95). s89b never
// opened the group (a group-row click does not open it, L0671). Expand with sortlib, read each credit row's Location cell; untick Heavy Duty; expand; read.
{ const o = { id: 'C715391' }; const V2 = 'ZZY VCredit Loc P89b'; const grp = new RegExp('^' + V2 + ' \\(');
  const credits = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.innerText.replace(/\s+/g, ' ').trim())).filter((c) => c.some((x) => /Vendor Credit/.test(x))));
  try { await s.go(REPORTS.apu); await p.waitForTimeout(3500); await settle(); await F.pick('Vendor', V2); await settle(); o.expand1 = await S.expand(grp).catch((e) => String(e).slice(0, 80)); await settle();
    o.rows1 = await credits(); o.group1 = (await p.locator('main tbody tr').filter({ hasText: V2 }).first().innerText()).replace(/\s+/g, ' '); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715391-1-locations.png' });
    await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1200); const it = p.locator('.q-menu:visible').getByText('Staging Heavy Duty - 9919', { exact: true }); o.untick = await it.count(); if (o.untick) await it.click();
    await p.keyboard.press('Escape'); await settle(); o.chips2 = await F.chips(); o.group2 = (await p.locator('main tbody tr').filter({ hasText: V2 }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
    o.expand2 = await S.expand(grp).catch((e) => String(e).slice(0, 80)); await settle(); o.rows2 = await credits(); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715391-2-location-B.png' });
    await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1000); const all = p.locator('.q-menu:visible').getByText('Select all', { exact: true }); if (await all.count()) await all.click(); await p.keyboard.press('Escape');
  } catch (e) { o.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'C715391-error.png' }).catch(() => {}); }
  R.C715391 = o; console.log('C715391', o.err || 'ok', JSON.stringify(o).slice(0, 600)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(R, null, 1)); await s.close(); process.exit(0);
