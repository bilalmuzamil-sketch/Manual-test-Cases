/** c682439-440.mts — 19 Oct 2026, run 498 "Design-" cases on STAGING, following their steps (window 1440 px, browser launched WITHOUT
 *  --hide-scrollbars, L0464, so scrollbars are drawn; same signed-in state, no new sign-in).
 *  C682440 "At Compact, count bubbles leave the Tech View status name readable": S2-33351 (Ready for Review, red and blue counts). The pill
 *  is `td.status .q-badge[role=status]`, the counts `.service-actions .q-badge` (red) and `.parts-actions .q-badge` (blue) (probe-pill.json).
 *  For List and for Tech View at Compact / Regular / Comfortable: the box of the status WORDS (a Range over the pill's text), each bubble's
 *  box, and how far each bubble reaches down into the words (share of the words' height) and across them; plus a 2x crop of the pill.
 *  C682439 "In the Dark theme, Board View column scrollbars are thin and dark": profile menu > Dark; Board View, All tab, no search; for every
 *  column on screen its scrollbar width (offsetWidth - clientWidth) and the brightness of that strip read from the SCREEN (canvas), and the
 *  board's own background next to it; then scroll Unassigned with the wheel and read again; reload and read again. Theme and density put
 *  back. Output EV/c682439-440.json; pictures EV/C682439-*.png, EV/C682440-*.png. Records only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { EV, t, display, tab, search } from './wob.mts';
import { api } from './data.mts';

const { browser: b0, page: p0 } = await open('/workorders?tab=all');
const scale = Number(process.env.WOB_SCALE || 1);
const { chromium } = await import('playwright');
const state = await p0.context().storageState(); const APPU = new URL(p0.url()).origin;
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true,
  proxy: { server: `http://127.0.0.1:${fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim()}` }, args: ['--no-sandbox', '--ignore-certificate-errors'], ignoreDefaultArgs: ['--hide-scrollbars'] });
const ctx = await browser.newContext({ storageState: state, viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale, ignoreHTTPSErrors: true });
const p = await ctx.newPage(); await b0.close().catch(() => {});
await p.goto(APPU + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(6000);
const W = (ms: number) => p.waitForTimeout(ms); const a = api(p);
const o: any = { scale };
const PREFU = '/api/users/me/preferences/work-orders-list'; const pv0 = (await a.get(PREFU)).body?.data?.value ?? {}; o.densityBefore = pv0.density ?? null;

// pixel helper: brightness of a screen box, read from a screenshot through a canvas
async function lum(box: { x: number; y: number; width: number; height: number }) {
  if (box.width < 1 || box.height < 1) return null;
  const buf = await p.screenshot({ clip: box });
  return p.evaluate(`(async () => { const img = new Image(); img.src = 'data:image/png;base64,${buf.toString('base64')}'; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, img.width, img.height).data; let max = 0, sum = 0, n = 0; for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; max = Math.max(max, l); sum += l; n++; }
    return { mean: Math.round(sum / n), max: Math.round(max) }; })()`);
}
const theme = async (word: RegExp) => { await p.locator('[data-test-id="profile_menu_button"]').click(); await W(1000);
  let it = p.locator('.q-menu button, .q-menu .q-btn, .q-menu [role="radio"], .q-menu [role="button"]').filter({ hasText: word }).last();
  if (!(await it.count())) it = p.locator('.q-menu').getByText(word).last();
  const found = await it.count(); if (found) await it.click().catch(() => {}); await W(1500); await p.keyboard.press('Escape').catch(() => {}); await W(800);
  return { found, body: await p.evaluate(`getComputedStyle(document.body).backgroundColor`) }; };

// ───── C682440
const PILL = (num: string) => `(() => { const rows = [...document.querySelectorAll('tr')].filter(r => r.innerText.includes(${JSON.stringify(num)}) && r.getBoundingClientRect().height > 0);
  const r = rows[0]; if (!r) return null; const cell = r.querySelector('td.status') || r; const pill = cell.querySelector('.q-badge[role="status"]:not(.q-badge--floating)'); if (!pill) return { row: true, pill: null };
  const tn = [...pill.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()); const rg = document.createRange(); if (tn) rg.selectNodeContents(tn); const tb = tn ? rg.getBoundingClientRect() : pill.getBoundingClientRect(); const pb = pill.getBoundingClientRect();
  const bub = (sel, color) => { const e = cell.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); const into = Math.max(0, Math.min(b.bottom, tb.bottom) - Math.max(b.top, tb.top)); const across = Math.max(0, Math.min(b.right, tb.right) - Math.max(b.left, tb.left));
    return { color, text: e.textContent.trim(), box: { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }, downIntoWordsPx: Math.round(into * 10) / 10, downIntoWordsShare: Math.round(into / tb.height * 100) / 100, acrossWordsPx: Math.round(across) }; };
  return { status: pill.textContent.trim(), shown: getComputedStyle(pill).textTransform, pill: { x: Math.round(pb.left), y: Math.round(pb.top), w: Math.round(pb.width), h: Math.round(pb.height) }, words: { x: Math.round(tb.left), y: Math.round(tb.top), w: Math.round(tb.width), h: Math.round(tb.height) },
    red: bub('.service-actions .q-badge', 'red'), blue: bub('.parts-actions .q-badge', 'blue'), density: r.getAttribute('data-density') }; })()`;
const crop = async (name: string, r: any) => { if (!r?.pill) return; const x = Math.max(0, r.pill.x - 30), y = Math.max(0, r.pill.y - 22); await p.screenshot({ path: path.join(EV, `C682440-${name}.png`), clip: { x, y, width: r.pill.w + 90, height: r.pill.h + 44 } }).catch(() => {}); };
const N = 'S2-33351';
await tab(p, 'All'); await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await W(1000);
await display(p, 'List'); await search(p, N); await W(3000);
o.c440 = { list: await p.evaluate(PILL(N)) }; await crop('s1-list', o.c440.list); await p.screenshot({ path: path.join(EV, 'C682440-s1-list-page.png') });
await display(p, 'Tech View'); await W(3000);
// step 4: open the group holding the work order if it is collapsed
const openGroup = async () => { const rows = await p.evaluate(`[...document.querySelectorAll('tr')].filter(r => r.innerText.includes(${JSON.stringify(N)})).length`); if (!rows) { await p.locator('[data-test-id^="button_tech_view_group_toggle_"]').first().click().catch(() => {}); await W(1200); } return rows; };
o.c440.rowShownBeforeOpen = await openGroup();
for (const d of ['compact', 'regular', 'comfortable']) {
  await p.locator('[data-test-id="button_density"]').click().catch(() => {}); await W(700);
  await p.locator(`[data-test-id="option_density_${d}"]`).click().catch(() => {}); await W(1800); await openGroup();
  o.c440[d] = await p.evaluate(PILL(N)); await crop(`s${d === 'compact' ? 5 : 6}-${d}`, o.c440[d]);
  if (d === 'compact') await p.screenshot({ path: path.join(EV, 'C682440-s5-compact-page.png') });
}
await search(p, '');

// ───── C682439 (Dark)
o.c439 = { dark: await theme(/^\s*(dark_mode\s*)?Dark\s*$/i) };
await tab(p, 'All'); await display(p, 'Board View'); await W(3000);
await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await W(800);
const COLS = `(() => { return [...document.querySelectorAll('[data-test-id^="board_column_"]')].filter(e => /^board_column_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id'))).map(c => { const r = c.getBoundingClientRect(); if (r.width <= 0 || r.right > innerWidth || r.left < 0) return null;
  const b = c.querySelector('.board-column__body') || [...c.querySelectorAll('*')].find(e => /(auto|scroll)/.test(getComputedStyle(e).overflowY)); if (!b) return null; const bb = b.getBoundingClientRect(); const sb = b.offsetWidth - b.clientWidth;
  const name = (c.querySelector('[data-test-id^="board_column_name_"]') || {}).textContent?.trim() || (c.getAttribute('data-test-id').endsWith('unassigned') ? 'Unassigned' : '?');
  return { name, scrollbarPx: sb, scrollable: b.scrollHeight > b.clientHeight + 5, top: Math.round(b.scrollTop), strip: { x: Math.round(bb.right - Math.max(sb, 1) - 1), y: Math.round(bb.top + 20), width: Math.max(sb, 1), height: Math.max(10, Math.round(Math.min(bb.height, innerHeight - bb.top) - 40)) },
    beside: { x: Math.round(r.right + 4), y: Math.round(bb.top + 20), width: 8, height: 60 } }; }).filter(Boolean); })()`;
const readCols = async () => { const cols: any[] = await p.evaluate(COLS) as any[]; for (const c of cols) { c.stripLum = await lum(c.strip); c.boardLum = await lum(c.beside); } return cols.map(({ strip, beside, ...rest }) => rest); };
o.c439.s1 = await readCols(); await p.screenshot({ path: path.join(EV, 'C682439-s1-dark-board.png') });
const ub = await p.locator('[data-test-id="board_column_unassigned"]').boundingBox();
if (ub) { await p.mouse.move(ub.x + ub.width / 2, ub.y + Math.min(ub.height, 600) / 2); for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 400); await W(300); } await W(1000); }
o.c439.s2 = await readCols(); await p.screenshot({ path: path.join(EV, 'C682439-s2-dark-scrolled.png') });
await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000);
o.c439.s3 = await readCols(); await p.screenshot({ path: path.join(EV, 'C682439-s3-dark-reloaded.png') });
o.c439.light = await theme(/^\s*(light_mode\s*)?Light\s*$/i);
// put the density back
if (o.densityBefore) { await p.locator('[data-test-id="button_density"]').click().catch(() => {}); await W(600); await p.locator(`[data-test-id="option_density_${o.densityBefore}"]`).click().catch(() => {}); await W(1200); }
await display(p, 'List').catch(() => {});
fs.writeFileSync(path.join(EV, 'c682439-440.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C682439/440', JSON.stringify(o).slice(0, 6000));
await done(browser);
