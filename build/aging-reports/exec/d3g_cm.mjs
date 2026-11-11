// d3g_cm.mjs — 11 Nov 2026 ~19:45: C715538 step 1 asks for a customer group with an invoice (blue link) AND a credit memo (plain text) after Expand all;
// d3b2's pictures show only invoice-only groups. Here: A/R Aging Collection, Customer = "Andrews' Truck & Trailer Repair LLC" (credit memos CM11315-4190…
// and invoices), header chevron (Expand all), read each ID cell (link? colour) and picture at 1440, light theme.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./d3g/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = { id: 'C715538b' };
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
try { await s.go(REPORTS.arc); await p.waitForTimeout(3500); await settle(); await F.pick('Customer', "Andrews' Truck & Trailer Repair LLC"); await settle();
  await p.locator('main thead th').first().locator('button').first().click(); await settle();
  o.dark = await p.evaluate(() => document.body.classList.contains('body--dark'));
  o.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => { const tds = [...tr.querySelectorAll('td')]; const id = tds.find((td) => /^(S|CM|DEP|P)[\w-]*\d$/.test(td.innerText.trim()));
    return { text: tr.innerText.replace(/\s+/g, ' ').slice(0, 150), id: id ? id.innerText.trim() : null, link: id ? !!id.querySelector('a, [role=link]') : null, color: id ? getComputedStyle(id.querySelector('a, span, div') || id).color : null }; }));
  await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715538-cm.png' });
} catch (e) { o.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'error.png' }).catch(() => {}); }
// C715542 (added 19:55): d3b2 looked for the icon text "info"; the title's icon is "info_outline" (d3a filterRow). Hover it in light and dark,
// read the tooltip text, its box and colours and the icon colour before/while hovering; picture each; move away and confirm it closes.
async function setDark(on) { const isDark = () => p.evaluate(() => document.body.classList.contains('body--dark')); if ((await isDark()) === on) return true; const av = p.locator('header button, header .q-avatar').filter({ hasText: /^[A-Z]{2}$/ }).last(); await av.click().catch(() => {}); await p.waitForTimeout(1200);
  const item = p.locator('.q-menu').last().getByText(on ? 'Dark' : 'Light', { exact: true }).last(); if (await item.count()) { await item.click(); await p.waitForTimeout(2000); } await p.keyboard.press('Escape'); await p.waitForTimeout(800); return (await isDark()) === on; }
{ const q = { id: 'C715542' };
  try { await s.go(REPORTS.arc); await p.waitForTimeout(3500); await settle(); const ic = p.locator('main i, main .q-icon').filter({ hasText: /^info(_outline)?$/ }).first(); q.icon = await ic.count();
    for (const dark of [false, true]) { const k = dark ? 'dark' : 'light'; q[k + 'On'] = await setDark(dark); q[k + 'IconColor0'] = await ic.evaluate((e) => getComputedStyle(e).color); await ic.hover(); await p.waitForTimeout(1500);
      q[k + 'IconColor1'] = await ic.evaluate((e) => getComputedStyle(e).color); q[k + 'Tip'] = await p.locator('.q-tooltip').evaluateAll((ts) => ts.map((t) => { const r = t.getBoundingClientRect(); const c = getComputedStyle(t); return { text: t.innerText, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: c.backgroundColor, color: c.color }; }));
      q[k + 'IconBox'] = await ic.boundingBox(); await p.screenshot({ path: OUT + 'C715542-' + k + '-open.png' }); await p.mouse.move(700, 600); await p.waitForTimeout(1200); q[k + 'After'] = await p.locator('.q-tooltip').count(); if (!dark) await p.screenshot({ path: OUT + 'C715542-light-moved-away.png' }); }
    await setDark(false);
  } catch (e) { q.err = String(e).slice(0, 300); try { await setDark(false); } catch {} }
  o.C715542 = q; console.log('C715542', q.err || 'ok', JSON.stringify(q).slice(0, 700)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('C715538b', o.err || 'ok', JSON.stringify(o).slice(0, 600)); await s.close(); process.exit(0);
