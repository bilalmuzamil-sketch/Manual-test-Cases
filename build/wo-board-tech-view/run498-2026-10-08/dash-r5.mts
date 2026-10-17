/**
 * dash-r5.mts — 17 Oct 2026, ROUND 5: C368246 alone (ONLY=C368246), "Dashboard cards that show a table list their rows as before".
 * On 17 Oct each card's "View details" opened real tables (the pictures show rows) but the reader counted 0 rows and never clicked a heading:
 * it looked only inside the element it had marked as "the card", which did not hold the opened area. Now, per card:
 *   - before the click every visible row-like element on the page is marked as already there;
 *   - after the click the OPENED AREA is found: the nearest ancestor of the "View details" control that grew by 40 px or more, else a window
 *     / drawer / menu that appeared; failing both, the whole page with the already-there elements left out;
 *   - rows are read inside it by each selector in turn — `tbody tr`, `[role=row]`, `.q-tr`, `.q-item`, `li`, then any group of 3+ siblings
 *     of the same tag and class — and the reading says which selector hit and how many rows (positive control: the first rows' text);
 *   - headings by `thead th`, `[role=columnheader]`, `.q-th`; ONE heading is clicked twice and that column's values read before and after
 *     each click (the column found by the heading's position among its siblings);
 *   - a picture of the opened area per card. START STATE found / set logged. Output EV/dash-r5-<ONLY>.json; pictures C368246-r5-*.png.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, t, shot } from './wob.mts';
import { startState } from './fixup-1017.mts';
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const OUT = path.join(EV, `dash-r5${only.length ? '-' + only.join('-') : ''}.json`);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(30_000); const a = api(p);
await startState(p, a, 'dash-r5');
const R: Record<string, any> = {}; const o: any = (R.C368246 = { cards: [] });
const W = (ms: number) => p.waitForTimeout(ms);
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []) as Promise<string[]>;
const toDash = async () => { if (!/\/dashboard/.test(p.url())) { await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await W(8000); } };
/** mark the "View details" controls (text CONTAINING the words, climbed to the clickable element) — returns their card titles */
const markControls = () => p.evaluate(`(() => { document.querySelectorAll('[data-zz-vd]').forEach(e => e.removeAttribute('data-zz-vd'));
  const vis = (e) => e.getBoundingClientRect().width > 0; const leafs = [...document.querySelectorAll('main *, .q-page *')].filter(e => vis(e) && /View details/i.test(e.textContent || '') && ![...e.children].some(c => /View details/i.test(c.textContent || '')));
  return leafs.map((l, i) => { const ctl = l.closest('button, a, [role=button], .q-btn, .cursor-pointer, .q-expansion-item__container, .q-item') || l; ctl.setAttribute('data-zz-vd', String(i)); let card = ctl.parentElement; while (card && card.getBoundingClientRect().height < 150) card = card.parentElement;
    return { i, control: (ctl.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40), title: card ? (card.innerText.split('\\n').map(x => x.trim()).filter(Boolean)[0] || '').slice(0, 50) : null }; }); })()`).catch(() => []) as Promise<any[]>;
/** before the click: remember every visible row-like element and the heights of the control's ancestors */
const beforeClick = (_i: number) => p.evaluate(`(() => { document.querySelectorAll('[data-zz-pre]').forEach(e => e.removeAttribute('data-zz-pre')); document.querySelectorAll('[data-zz-area]').forEach(e => e.removeAttribute('data-zz-area')); document.querySelectorAll('[data-zz-row]').forEach(e => e.removeAttribute('data-zz-row'));
  let n = 0; for (const e of document.querySelectorAll('tr, [role=row], .q-tr, .q-item, li, .q-dialog, .q-drawer, .q-menu')) if (e.getBoundingClientRect().width > 0) { e.setAttribute('data-zz-pre', '1'); n++; } return n; })()`).catch(() => null);
const ancHeights = (i: number) => p.evaluate(`(() => { const c = document.querySelector('[data-zz-vd="${i}"]'); const out = []; for (let e = c, k = 0; e && k < 10; e = e.parentElement, k++) out.push(Math.round(e.getBoundingClientRect().height)); return out; })()`).catch(() => []) as Promise<number[]>;
/** after the click: find and mark the opened area */
const findArea = (i: number, before: number[]) => p.evaluate(`(() => { const c = document.querySelector('[data-zz-vd="${i}"]'); const before = ${JSON.stringify(before)};
  const pop = [...document.querySelectorAll('.q-dialog, .q-drawer, .q-menu, [role=dialog]')].filter(e => e.getBoundingClientRect().width > 0 && !e.hasAttribute('data-zz-pre')).pop();
  if (pop) { pop.setAttribute('data-zz-area', '1'); return { kind: 'a window/drawer/menu that appeared', tag: pop.tagName, cls: String(pop.className).slice(0, 50) }; }
  let k = 0; for (let e = c; e && k < 10; e = e.parentElement, k++) { const h = Math.round(e.getBoundingClientRect().height); if (before[k] !== undefined && h - before[k] >= 40) { e.setAttribute('data-zz-area', '1'); return { kind: 'the card grew', level: k, from: before[k], to: h, tag: e.tagName, cls: String(e.className).slice(0, 50) }; } }
  const main = document.querySelector('main, .q-page'); if (main) main.setAttribute('data-zz-area', '1'); return { kind: 'nothing grew: the whole page, already-there rows left out' }; })()`).catch((e: any) => ({ error: String(e).slice(0, 80) }));
/** rows inside the area by each selector in turn; the first that hits (new rows only) wins */
const readRows = () => p.evaluate(`(() => { const area = document.querySelector('[data-zz-area="1"]'); if (!area) return { error: 'no area' }; const vis = (e) => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0; const fresh = (e) => !e.hasAttribute('data-zz-pre');
  const sels = ['tbody tr', '[role=row]', '.q-tr', '.q-item', 'li']; const tried = {};
  for (const s of sels) { const l = [...area.querySelectorAll(s)].filter(e => vis(e) && fresh(e) && !e.querySelector('th') && (e.innerText || '').trim()); tried[s] = l.length; if (l.length) { l.forEach((e, k) => e.setAttribute('data-zz-row', String(k))); return { selector: s, rows: l.length, tried, first: l.slice(0, 4).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 100)) }; } }
  // any group of 3+ visible siblings with the same tag and class
  const groups = new Map(); for (const e of area.querySelectorAll('*')) { if (!vis(e) || !fresh(e) || !(e.innerText || '').trim()) continue; const k = e.parentElement; if (!k) continue; const key = e.tagName + '.' + String(e.className); const m = groups.get(k) || {}; (m[key] = m[key] || []).push(e); groups.set(k, m); }
  let best = null; for (const [, m] of groups) for (const key of Object.keys(m)) if (m[key].length >= 3 && (!best || m[key].length > best.l.length)) best = { key, l: m[key] };
  if (best) { best.l.forEach((e, k) => e.setAttribute('data-zz-row', String(k))); return { selector: 'repeated siblings ' + best.key.slice(0, 60), rows: best.l.length, tried, first: best.l.slice(0, 4).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 100)) }; }
  return { selector: null, rows: 0, tried, areaText: area.innerText.replace(/\\s+/g, ' ').slice(0, 200) }; })()`).catch((e: any) => ({ error: String(e).slice(0, 80) }));
const heads = () => p.evaluate(`(() => { const area = document.querySelector('[data-zz-area="1"]'); if (!area) return []; document.querySelectorAll('[data-zz-th]').forEach(e => e.removeAttribute('data-zz-th'));
  const l = [...area.querySelectorAll('thead th, [role=columnheader], .q-th')].filter(e => e.getBoundingClientRect().width > 0); l.forEach((e, k) => e.setAttribute('data-zz-th', String(k)));
  return l.map((e, k) => ({ k, text: e.innerText.replace(/\\s+/g, ' ').replace(/arrow_(up|down)ward|arrow_drop_(up|down)|unfold_more/g, '').trim(), sortable: /sortable/.test(String(e.className)) || !!e.querySelector('i, .q-icon, svg'), index: [...e.parentElement.children].indexOf(e) })); })()`).catch(() => []) as Promise<any[]>;
const colValues = (index: number) => p.evaluate(`[...document.querySelectorAll('[data-zz-area="1"] [data-zz-row]')].map(r => { const cells = [...r.children].filter(c => c.getBoundingClientRect().width > 0); const c = r.querySelectorAll('td, [role=cell], .q-td').length ? [...r.querySelectorAll('td, [role=cell], .q-td')][${index}] : cells[${index}]; return c ? c.innerText.replace(/\\s+/g, ' ').trim() : null; }).slice(0, 10)`).catch(() => []) as Promise<(string | null)[]>;
const areaPic = async (name: string) => { const b = await p.locator('[data-zz-area="1"]').first().boundingBox().catch(() => null); const vs = p.viewportSize() ?? { width: 1600, height: 900 };
  if (b) { await p.locator('[data-zz-area="1"]').first().scrollIntoViewIfNeeded().catch(() => {}); const b2 = await p.locator('[data-zz-area="1"]').first().boundingBox().catch(() => null) ?? b; const x = Math.max(0, b2.x - 8), y = Math.max(0, b2.y - 8); const w = Math.min(vs.width - x, b2.width + 16), h = Math.min(vs.height - y, b2.height + 16); if (w > 10 && h > 10) { await p.screenshot({ path: path.join(EV, `${name}.png`), clip: { x, y, width: w, height: h } }).catch(() => {}); return `${name}.png`; } }
  await shot(p, name); return `${name}.png`; };
try {
  // step 1: Dashboard in the top menu, else the logo, else its address
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(4000);
  const navD = p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: /^\s*Dashboard\s*$/ }).first(); o.topMenuDashboard = await navD.count();
  if (o.topMenuDashboard) { await navD.click().catch(() => {}); await W(7000); } else { const logo = p.locator('a[href$="/dashboard"]').first(); if (await logo.count()) { await logo.click().catch(() => {}); await W(7000); } }
  await toDash(); o.url = p.url().replace(APP, ''); o.toastsStart = await toasts();
  const ctls = await markControls(); o.controls = ctls; await shot(p, 'C368246-r5-dashboard');
  console.log(t(), 'START STATE found C368246', JSON.stringify({ url: o.url, viewDetails: ctls.length, cards: ctls.map((x) => x.title) }));
  console.log(t(), 'START STATE set C368246', JSON.stringify({ url: o.url, toasts: o.toastsStart }));
  for (let i = 0; i < Math.min(ctls.length, 10); i++) { const c: any = { title: ctls[i].title };
    try {
      await toDash(); if (!(await p.locator(`[data-zz-vd="${i}"]`).count())) { await markControls(); c.remarked = true; }
      const ctl = p.locator(`[data-zz-vd="${i}"]`).first(); await ctl.scrollIntoViewIfNeeded().catch(() => {}); await W(500);
      await beforeClick(i); const h0 = await ancHeights(i); const url0 = p.url();
      await ctl.click().catch((e: any) => { c.clickError = String(e?.message || e).slice(0, 100); }); await W(4500);
      c.urlAfter = p.url() === url0 ? 'same page' : p.url().replace(APP, ''); c.heightsBefore = h0; c.heightsAfter = await ancHeights(i);
      c.area = await findArea(i, h0); c.rows = await readRows(); c.headings = await heads();
      const sortable = (c.headings as any[]).find((h) => h.sortable && h.text) ?? (c.headings as any[]).find((h) => h.text);
      if (sortable && (c.rows?.rows ?? 0) > 0) { const th = p.locator(`[data-zz-th="${sortable.k}"]`).first(); const v0 = await colValues(sortable.index);
        await th.click().catch(() => {}); await W(2000); await readRows(); const v1 = await colValues(sortable.index); await th.click().catch(() => {}); await W(2000); await readRows(); const v2 = await colValues(sortable.index);
        c.sort = { heading: sortable.text, column: sortable.index, before: v0, firstClick: v1, secondClick: v2, orderChanged: JSON.stringify(v0) !== JSON.stringify(v1) || JSON.stringify(v1) !== JSON.stringify(v2) };
      } else c.sort = (c.headings as any[]).length ? 'no rows read, so no heading clicked' : 'no headings found in the opened area';
      c.toasts = await toasts(); c.picture = await areaPic(`C368246-r5-${i + 1}-${String(ctls[i].title || 'card').replace(/[^A-Za-z0-9]+/g, '-').slice(0, 30)}`);
      console.log(t(), `C368246 card ${i + 1}`, JSON.stringify({ title: c.title, area: c.area, rows: c.rows?.rows, selector: c.rows?.selector, tried: c.rows?.tried, first: c.rows?.first?.slice(0, 2), headings: (c.headings as any[]).map((h) => h.text).slice(0, 8), sort: c.sort }));
      if (c.area?.kind?.startsWith('a window')) { await p.keyboard.press('Escape'); await W(1000); }
      else if (c.urlAfter !== 'same page') { await p.goBack().catch(() => {}); await W(4000); }
      else { await p.locator(`[data-zz-vd="${i}"]`).first().click().catch(() => {}); await W(1500); }   // close the card again
    } catch (e: any) { c.error = String(e?.message || e).slice(0, 200); }
    o.cards.push(c); fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, 'C368246-r5-error'); }
fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); console.log(t(), 'C368246', JSON.stringify(o).slice(0, 3000));
await RUN.end(); await done(browser);
