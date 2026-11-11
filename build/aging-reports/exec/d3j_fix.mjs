// d3j_fix.mjs — 11 Nov 2026 ~21:35: d3h's C715556 and C715555 blocks re-run with the menu rows read the way d3b did (".q-item, label, .q-checkbox" for clicks,
// the menu's innerText lines for reading): d3h clicked ".q-item" (none on these menus) and so ticked nothing / read zero vendors.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./d3j/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
// C715556 (added 20:55): customer B must have NOTHING open (the case: "one row, customer A ... customer B has nothing open"). d3b2 ticked two customers that
// both have documents. Here: A/R Summary, Customer menu: tick "Desert Edge Truck Service & Repair" (A) and "4 Star Truck Repair" (B, listed in the menu, nothing
// open), picture with the menu open, close; rows, Totals row.
{ const q = { id: 'C715556' };
  try { await s.go(REPORTS.ars); await p.waitForTimeout(3500); await settle(); await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(1200);
    const m = p.locator('.q-menu:visible').last(); const inp = m.locator('input').first();
    for (const n of ['Desert Edge Truck Service & Repair', '4 Star Truck Repair']) { await inp.fill(''); await inp.type(n.slice(0, 12)); await p.waitForTimeout(1500); await m.locator('.q-item, label, .q-checkbox').filter({ hasText: n }).first().click(); await p.waitForTimeout(1200); await inp.fill(''); await p.waitForTimeout(1200); }
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
  for (let i = 0; i < 400 && stall < 5; i++) { const items = (await m.innerText()).split('\n').map((t) => t.replace(/\s+/g, ' ').trim()).filter((t) => t && !/^All vendors|^search$|^\d+ selected$/.test(t));
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
