// d3c_darkpin.mjs — 11 Nov 2026 ~17:05: d3b's step 7 for C715505-508 scrolled back to the top before the dark picture, so "the pinned row is
// readable in dark theme" was never seen while a row was pinned. Here: Expand all, scroll into the big group, switch to dark WITHOUT scrolling,
// picture; read the pinned row's text and colours (text vs background) as the readable check; switch back to light.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./d3c/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p);
const headBtn = () => p.locator('main thead th').first().locator('button').first();
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(800); };
async function setDark(on) { const isDark = () => p.evaluate(() => document.body.classList.contains('body--dark')); if ((await isDark()) === on) return true; const av = p.locator('header button, header .q-avatar').filter({ hasText: /^[A-Z]{2}$/ }).last(); await av.click().catch(() => {}); await p.waitForTimeout(1200);
  const item = p.locator('.q-menu').last().getByText(on ? 'Dark' : 'Light', { exact: true }).last(); if (await item.count()) { await item.click(); await p.waitForTimeout(2000); } await p.keyboard.press('Escape'); await p.waitForTimeout(800); return (await isDark()) === on; }
const pinned = (re) => p.evaluate(([src]) => { const re = new RegExp(src); const th = document.querySelector('main thead'); const hb = th.getBoundingClientRect().bottom;
  const el = document.elementFromPoint(700, hb + 20); const tr = el && el.closest('tr, .pinned, [class*=pinned], div'); const t = (tr && tr.innerText || '').replace(/\s+/g, ' ').trim();
  const cs = el && getComputedStyle(el); let bgEl = el; while (bgEl && getComputedStyle(bgEl).backgroundColor === 'rgba(0, 0, 0, 0)') bgEl = bgEl.parentElement;
  return { text: t.slice(0, 160), matches: re.test(t), color: cs && cs.color, bg: bgEl && getComputedStyle(bgEl).backgroundColor, dark: document.body.classList.contains('body--dark') }; }, [re.source]);
const R = {};
for (const [id, k, re] of [['C715505', 'ard', /91 or more/], ['C715506', 'arc', /Desert Edge/], ['C715507', 'apd', /91 or more/], ['C715508', 'apu', /Willoughby/]]) {
  const o = { id }; try { await p.setViewportSize({ width: 1440, height: 900 }); await s.go(REPORTS[k]); await p.waitForTimeout(3000); await settle(); await headBtn().click(); await settle();
    const g = await S.find(new RegExp('^' + re.source)).catch(() => null); o.found = !!g; await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop += 900; })()`); await p.waitForTimeout(900);
    o.light = await pinned(re); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + id + '-1-light-pinned.png' });
    o.darkOn = await setDark(true); await p.waitForTimeout(800); o.dark = await pinned(re); await p.mouse.move(5, 890); await p.screenshot({ path: OUT + id + '-2-dark-pinned.png' }); await setDark(false);
  } catch (e) { o.err = String(e).slice(0, 300); try { await setDark(false); } catch {} } R[id] = o; console.log(id, o.err || 'ok', JSON.stringify(o).slice(0, 500)); }
fs.writeFileSync(OUT + 'd3c.json', JSON.stringify(R, null, 1)); await s.close?.(); process.exit(0);
