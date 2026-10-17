/** probe-r6.mts — 17 Oct 2026, live probe (read only, nothing saved): two markup questions for the round-6 live fixes.
 *  A (C96916): a Tech View row of the case's customer — the Number cell's markup, every test id inside the row, links and pointer
 *     elements; then the number TEXT is clicked with the mouse and the address read (positive control: the address changes), Back.
 *  B (C581892): the Schedule — which elements scroll (size, scrollTop), the people column's cells first/last, a mouse WHEEL over the
 *     people column and the cells read again, any search / filter inputs, and whether "Esther Howard" is anywhere in the page.
 *  Output EV/probe-r6.json, pictures EV/probe-r6-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t, display, tab, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(20_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const part = (process.env.ONLY || 'A,B').split(',');
try {
  if (part.includes('A')) { const A: any = (o.A = {});
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await search(p, 'ZZAUTOTEST F1 Scroll Back Theresa'); await W(3000);
    A.row = await p.evaluate(`(() => { const r = [...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].find(x => /S\\d+-\\d+/.test(x.innerText)); if (!r) return null; r.setAttribute('data-zz-r', '1');
      const heads = [...document.querySelectorAll('thead th')].map(h => h.innerText.replace(/arrow_drop_(up|down)/g, '').trim()); const ni = heads.findIndex(h => /^Number$/i.test(h)); const cells = [...r.children];
      const nc = ni >= 0 ? cells[ni] : cells.find(c => /^\\s*S\\d+-\\d+/.test(c.innerText));
      return { rowTid: r.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), numberColumn: ni, numberCellHtml: nc ? nc.outerHTML.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>').slice(0, 700) : null,
        tids: [...r.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>')).slice(0, 30), links: [...r.querySelectorAll('a')].map(e => (e.getAttribute('href') || '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>') + ' ' + e.innerText.trim()).slice(0, 5),
        pointers: [...r.querySelectorAll('*')].filter(e => getComputedStyle(e).cursor === 'pointer' && e.children.length === 0).map(e => e.tagName + '.' + String(e.className).slice(0, 30) + ' ' + (e.innerText || '').trim().slice(0, 20)).slice(0, 10) }; })()`);
    const num = await p.evaluate(`(() => { const r = document.querySelector('[data-zz-r="1"]'); if (!r) return null; const e = [...r.querySelectorAll('*')].find(x => x.children.length === 0 && /^S\\d+-\\d+$/.test((x.textContent || '').trim())); if (!e) return null; e.scrollIntoView({ block: 'center', inline: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, text: e.textContent.trim(), tag: e.tagName, cls: String(e.className).slice(0, 50) }; })()`) as any;
    A.numberText = num; const u0 = p.url();
    if (num) { await p.mouse.click(num.x, num.y); for (let i = 0; i < 8 && p.url() === u0; i++) await W(700); A.urlAfterClick = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'); A.opened = p.url() !== u0; await p.screenshot({ path: path.join(EV, 'probe-r6-A-after-click.png') }).catch(() => {});
      if (A.opened) { await p.goBack({ waitUntil: 'domcontentloaded' }); await W(5000); A.urlAfterBack = p.url().replace(APP, ''); } }
    console.log(t(), 'probe A', JSON.stringify(A).slice(0, 3000)); }
  if (part.includes('B')) { const B: any = (o.B = {});
    await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded' }); await W(9000);
    const read = () => p.evaluate(`(() => { const cells = [...document.querySelectorAll('.fc-datagrid-body .fc-datagrid-cell-cushion')].filter(e => e.getBoundingClientRect().width > 0); const vis = cells.filter(e => { const b = e.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight; });
      return { cells: cells.length, visible: vis.length, firstVisible: (vis[0] || {}).innerText?.replace(/\\s+/g, ' ').slice(0, 40) || null, lastVisible: (vis[vis.length - 1] || {}).innerText?.replace(/\\s+/g, ' ').slice(0, 40) || null, lastInDom: (cells[cells.length - 1] || {}).innerText?.replace(/\\s+/g, ' ').slice(0, 40) || null, estherInDom: /Esther Howard/.test(document.body.innerText), winScrollY: scrollY, docH: document.documentElement.scrollHeight }; })()`);
    B.at0 = await read();
    B.scrollers = await p.evaluate(`[...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 10 && /(auto|scroll|overlay)/.test(getComputedStyle(e).overflowY)).map(e => { const b = e.getBoundingClientRect(); return { tag: e.tagName, cls: String(e.className).slice(0, 70), tid: e.getAttribute('data-test-id'), x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), sh: e.scrollHeight, ch: e.clientHeight, st: e.scrollTop }; }).slice(0, 15)`);
    B.inputs = await p.evaluate(`[...document.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ ph: e.getAttribute('placeholder'), tid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label') }))`);
    B.buttons = await p.evaluate(`[...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().top < 200).map(e => (e.getAttribute('data-test-id') || '') + '|' + (e.getAttribute('aria-label') || '') + '|' + e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 20)).slice(0, 25)`);
    await p.screenshot({ path: path.join(EV, 'probe-r6-B-schedule.png') }).catch(() => {});
    // the mouse wheel over the people column
    const c = await p.locator('.fc-datagrid-body .fc-datagrid-cell-cushion').nth(3).boundingBox().catch(() => null); B.peopleCellBox = c;
    if (c) { await p.mouse.move(c.x + 20, c.y + c.height / 2); for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 900); await W(500); } B.afterWheel = await read();
      B.scrollersAfterWheel = await p.evaluate(`[...document.querySelectorAll('*')].filter(e => e.scrollTop > 0).map(e => ({ tag: e.tagName, cls: String(e.className).slice(0, 70), st: e.scrollTop, sh: e.scrollHeight, ch: e.clientHeight })).slice(0, 10)`);
      await p.screenshot({ path: path.join(EV, 'probe-r6-B-after-wheel.png') }).catch(() => {}); }
    // the window itself
    await p.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)'); await W(1200); B.afterWindowScroll = await read();
    console.log(t(), 'probe B', JSON.stringify(B).slice(0, 4000)); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'probe-r6.json'), JSON.stringify(o, null, 1)); await done(browser);
