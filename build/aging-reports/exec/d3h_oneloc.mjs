// d3h_oneloc.mjs — 11 Nov 2026 ~20:40: C715549 (one location ticked hides the Location column): the case assumes two locations, sv11315 has three, so d3b2's
// "untick A" left two ticked ("2 selected", "Location: 2 locations", column kept). Here: untick Heavy Duty (A) - picture with the menu open (rows must not
// move) - then untick Location C too so only Lethbridge (B) is ticked: count, chip, picture; close; header row. Also C715557's missing picture (d3b2 read
// the data, then timed out before the picture).
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./d3h/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
const menu = async () => (await p.locator('.q-menu:visible').last().innerText().catch(() => '')).split('\n').map((t) => t.trim()).filter(Boolean);
const pos = () => p.locator('.q-menu:visible').last().locator('.q-item').evaluateAll((xs) => xs.map((x) => [x.innerText.replace(/\s+/g, ' ').trim().slice(0, 40), Math.round(x.getBoundingClientRect().y)]));
{ const q = { id: 'C715549' };
  try { await s.go(REPORTS.ard); await p.waitForTimeout(3500); await settle(); await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1200); q.menu0 = await menu(); q.pos0 = await pos();
    await p.locator('.q-menu:visible').last().getByText('Staging Heavy Duty - 9919', { exact: true }).click(); await p.waitForTimeout(1500); q.menu1 = await menu(); q.pos1 = await pos(); q.chips1 = await F.chips(); await p.screenshot({ path: OUT + 'C715549-1-A-unticked.png' });
    await p.locator('.q-menu:visible').last().getByText('ZZAUTOTEST V1R-87 Location C', { exact: true }).click(); await p.waitForTimeout(1500); q.menu2 = await menu(); q.pos2 = await pos(); q.chips2 = await F.chips(); await p.screenshot({ path: OUT + 'C715549-2-only-B.png' });
    await p.keyboard.press('Escape'); await settle(); q.menuOpen = await p.locator('.q-menu:visible').count(); q.heads = await p.evaluate(() => [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/arrow_drop_up|keyboard_arrow_\w+/g, '').trim()));
    await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715549-3-closed.png' });
  } catch (e) { q.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'C715549-error.png' }).catch(() => {}); }
  o.C715549 = q; console.log('C715549', q.err || 'ok', JSON.stringify(q).slice(0, 700)); }
{ const q = { id: 'C715557' };
  try { await s.go(REPORTS.arc); await p.waitForTimeout(3500); await settle(); await F.pick('Customer', 'Mobile Truck & Trailer Repair Blackfoot'); await settle(); q.chips = await F.chips();
    q.rows = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')).filter(Boolean).slice(0, 5); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715557-one-customer.png' });
  } catch (e) { q.err = String(e).slice(0, 300); }
  o.C715557 = q; console.log('C715557', q.err || 'ok', JSON.stringify(q).slice(0, 500)); }
// C715556 (added 20:55): customer B must have NOTHING open (the case: "one row, customer A ... customer B has nothing open"). d3b2 ticked two customers that
// both have documents. Here: A/R Summary, Customer menu: tick "Desert Edge Truck Service & Repair" (A) and "4 Star Truck Repair" (B, listed in the menu, nothing
// open), picture with the menu open, close; rows, Totals row.
{ const q = { id: 'C715556' };
  try { await s.go(REPORTS.ars); await p.waitForTimeout(3500); await settle(); await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(1200);
    const m = p.locator('.q-menu:visible').last(); const inp = m.locator('input').first();
    for (const n of ['Desert Edge Truck Service & Repair', '4 Star Truck Repair']) { await inp.fill(n); await p.waitForTimeout(1500); await m.locator('.q-item').filter({ hasText: n }).first().click(); await p.waitForTimeout(1200); await inp.fill(''); await p.waitForTimeout(1200); }
    q.menu = (await m.innerText()).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 14); q.chips1 = await F.chips(); await p.screenshot({ path: OUT + 'C715556-1-ticked.png' });
    await p.keyboard.press('Escape'); await settle(); q.chips = await F.chips();
    q.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((d) => d.innerText.trim())).filter((c) => c.join('')));
    q.totals = await p.evaluate(() => { const t = [...document.querySelectorAll('main tr')].filter((r) => /^\s*Totals(\s|$)/.test(r.innerText)).pop(); return t ? [...t.querySelectorAll('td')].map((d) => d.innerText.trim()) : null; });
    await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715556-2-closed.png' });
  } catch (e) { q.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'C715556-error.png' }).catch(() => {}); }
  o.C715556 = q; console.log('C715556', q.err || 'ok', JSON.stringify(q).slice(0, 700)); }
// C715555 (added 21:05): d3b2's first 22 menu rows differ in order - A/P Summary "#1 Diesel, -1 Diesel, 10 Trucking, …, @Home Towing" vs Inventory Value
// "-1 Diesel, @Home Towing, #1 Diesel, 10 Trucking, …" (S5-R13: "Vendor exactly as Inventory Value's Vendor filter"). Before judging (L0661): read BOTH full
// lists by scrolling each menu, compare the sets and the orders, and test each against a plain code-point sort and a locale sort to name the rule each uses.
async function fullMenu(url) { await s.go(url); await p.waitForTimeout(3500); await settle(); await p.locator('main button', { hasText: /Vendor:/ }).first().click(); await p.waitForTimeout(1500);
  const m = p.locator('.q-menu:visible').last(); const seen = []; const has = new Set(); let stall = 0;
  for (let i = 0; i < 400 && stall < 5; i++) { const items = (await m.locator('.q-item').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).filter((t) => t && !/^All vendors/.test(t));
    let add = 0; for (const t of items) if (!has.has(t)) { has.add(t); seen.push(t); add++; } stall = add ? 0 : stall + 1;
    await m.evaluate((el) => { const sc = [el, ...el.querySelectorAll('*')].find((x) => x.scrollHeight > x.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(x).overflowY)); if (sc) sc.scrollTop += 300; }); await p.waitForTimeout(250); }
  await p.keyboard.press('Escape'); return seen; }
{ const q = { id: 'C715555' };
  try { const a = await fullMenu(REPORTS.aps); const b = await fullMenu('/reports/inventory-value'); q.nA = a.length; q.nB = b.length;
    const sa = new Set(a), sb = new Set(b); q.onlyA = a.filter((x) => !sb.has(x)).slice(0, 15); q.onlyB = b.filter((x) => !sa.has(x)).slice(0, 15);
    const common = (l, other) => l.filter((x) => other.has(x)); const ca = common(a, sb), cb = common(b, sa); q.sameOrder = JSON.stringify(ca) === JSON.stringify(cb);
    let first = -1; for (let i = 0; i < Math.min(ca.length, cb.length); i++) if (ca[i] !== cb[i]) { first = i; break; } q.firstDiff = first; q.aAt = ca.slice(Math.max(0, first - 2), first + 6); q.bAt = cb.slice(Math.max(0, first - 2), first + 6);
    const cp = (l) => JSON.stringify(l) === JSON.stringify([...l].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)));
    const lc = (l) => JSON.stringify(l) === JSON.stringify([...l].sort((x, y) => x.localeCompare(y)));
    const ci = (l) => JSON.stringify(l) === JSON.stringify([...l].sort((x, y) => x.toLowerCase() < y.toLowerCase() ? -1 : x.toLowerCase() > y.toLowerCase() ? 1 : 0));
    q.aRule = { codePoint: cp(a), locale: lc(a), lowerCase: ci(a) }; q.bRule = { codePoint: cp(b), locale: lc(b), lowerCase: ci(b) }; q.aHead = a.slice(0, 12); q.bHead = b.slice(0, 12);
  } catch (e) { q.err = String(e).slice(0, 300); }
  o.C715555 = q; console.log('C715555', q.err || 'ok', JSON.stringify(q).slice(0, 900)); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
