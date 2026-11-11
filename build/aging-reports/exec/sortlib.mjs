// sortlib.mjs — 11 Nov 2026: helpers for the S2 sort tests on sv11315 (aging reports). Reads the table as the tester sees it:
// headers (clean label + aria-sort), every row in screen order collected while scrolling (virtual scroll), cells per row; segments a
// bucket/group (its header row … its "Total for" row); clicks a header by its exact label. Icon ligatures are stripped from text.
export const ICONS = /\b(keyboard_arrow_(down|right|up)|arrow_drop_(up|down)|arrow_(up|down)ward|expand_(more|less)|chevron_(right|left))\b/g;
export const clean = (t) => (t || '').replace(ICONS, ' ').replace(/\s+/g, ' ').trim();
export function mkSort(p) {
  const SC = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`;
  const ths = async () => (await p.evaluate(`[...document.querySelectorAll('main thead th')].map(th => ({ t: th.innerText, aria: th.getAttribute('aria-sort'), cls: th.className, cursor: getComputedStyle(th).cursor }))`)).map((h) => ({ ...h, t: clean(h.t) }));
  const sorted = async () => (await ths()).filter((h) => h.aria && h.aria !== 'none').map((h) => h.t + ':' + h.aria);
  const rowsNow = () => p.evaluate(`[...document.querySelectorAll('main tbody tr')].map(tr => ({ text: tr.innerText.replace(/\\s+/g,' ').trim(), cells: [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\\s+/g,' ').trim()) })).filter(r => r.text)`);
  async function collect() { const seen = [], has = new Set(); let stall = 0; await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(500);
    for (let i = 0; i < 600 && stall < 4; i++) { const rs = await rowsNow(); let add = 0; for (const r of rs) { const k = r.text; if (!has.has(k)) { has.add(k); seen.push({ ...r, raw: r.text, text: clean(r.text), cells: r.cells.map(clean) }); add++; } }
      const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(moved ? 450 : 1100); if (!moved) { await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = Math.max(0, e.scrollTop - 400); })()`); await p.waitForTimeout(250); await p.evaluate(`(() => { const e = ${SC}; e.scrollTop = e.scrollHeight; })()`); await p.waitForTimeout(900); } stall = (!moved && !add) ? stall + 1 : 0; }
    /* 11 Nov: the next page of a bucket loads on a scroll EVENT at the bottom; sitting at the bottom fires none, so nudge up and back (C715305 stopped at 200 of 361) */
    /* 11 Nov: a Detail bucket over 100 lines loads its next 100 only when the bottom is reached; 4 x 1.1 s at the bottom lets it arrive (C715305 first read missed rows) */
    await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(300); return seen; }
  async function find(re) { await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(400);
    let stall = 0; for (let i = 0; i < 400; i++) { const l = p.locator('main tbody tr').filter({ hasText: re }).first(); if (await l.count()) { await l.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); return l; }
      const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(moved ? 400 : 900); stall = moved ? 0 : stall + 1; if (stall >= 4) return null; } return null; }
  /* 11 Nov: A/R Collection, A/P Unpaid and the Summaries load 30 groups at a time; at the bottom the next 30 arrive after a moment, so a
     single "did not move" is not the end of the list — wait for 4 in a row before giving up (C715298 first run: 'not-found'). */
  async function expand(re) { const l = await find(re); if (!l) return 'not-found'; const t = await l.innerText(); if (/keyboard_arrow_right/.test(t)) { await l.locator('button, i.q-icon').first().click(); await p.waitForTimeout(2500); return 'opened'; } return 'already-open'; }
  async function collapse(re) { const l = await find(re); if (!l) return 'not-found'; const t = await l.innerText(); if (/keyboard_arrow_down/.test(t)) { await l.locator('button, i.q-icon').first().click(); await p.waitForTimeout(1500); return 'closed'; } return 'already-closed'; }
  async function clickTh(label) { const loc = p.locator('main thead th').filter({ hasText: new RegExp('^\\s*(keyboard_arrow_(down|right)\\s*)?' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*(arrow_drop_(up|down))?\\s*$') }).first();
    if (!(await loc.count())) return 'no-header'; await loc.locator('span, div').filter({ hasText: label }).last().click().catch(async () => { await loc.click(); }); await p.waitForTimeout(2500); return 'clicked'; }
  function segment(rows, startRe) { const i = rows.findIndex((r) => startRe.test(r.text)); if (i < 0) return null; const out = []; for (let k = i + 1; k < rows.length; k++) { if (/^Total for /.test(rows[k].text) || /keyboard_arrow_(right|down)/.test(rows[k].raw || '')) break; out.push(rows[k]); } return { head: rows[i].text, rows: out }; }
  return { SC, ths, sorted, collect, find, expand, collapse, clickTh, segment };
}
