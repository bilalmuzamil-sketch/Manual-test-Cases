// probe_notes3.cjs — C30013 item 4 ONLY: are notes kept PER WORK ORDER?
//
// The previous run answered this wrongly: it chose a candidate pair from the
// API but then opened whatever block happened to be on screen, so it compared
// two shifts that never received a note.  This run does it the other way round
// - add the note first, then look up THAT shift's own work order and its
// siblings - so the comparison is always about the shift actually written to.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;
async function board() {
  const r = await fetch(`${API}/api/schedule/board?from=2026-07-01T00:00:00Z&to=2026-08-31T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  return (await r.json()).data.board;
}
const clickTid = (page, tid) => page.evaluate(({ t }) => {
  const e = document.querySelector(`[data-test-id="${t}"]`); if (!e) return { ok: false, why: 'no ' + t };
  e.scrollIntoView({ block: 'center' }); e.click(); return { ok: true };
}, { t: tid });
async function setNote(page, txt) {
  return page.evaluate(({ t }) => {
    const o = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
      .filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    const s = o[o.length - 1]; const ta = s && s.querySelector('[data-test-id=input_shift_detail_note]');
    if (!ta) return { ok: false, why: 'no note field' };
    ta.focus(); const proto = ta.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(ta, t);
    ta.dispatchEvent(new Event('input', { bubbles: true })); ta.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, val: ta.value };
  }, { t: txt });
}

(async () => {
  const h = await makeHarness('notes3'); const page = h.page; const rec = {};
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 30 && r.height > 12 && r.x > 300 && r.y > 200 && r.y < innerHeight - 40; });
    if (blocks.length) { blocks[0].scrollIntoView({ block: 'center' }); blocks[0].click(); }
  });
  await page.waitForTimeout(4500);
  rec.wo_on_screen = await page.evaluate(`(() => { const s=${LAST}; const e=s&&s.querySelector('[data-test-id=text_shift_detail_work_order]'); return e?e.innerText.trim():null; })()`);
  await clickTid(page, 'button_shift_detail_add_note'); await page.waitForTimeout(2500);
  rec.typed = await setNote(page, 'ZZAUTOTEST per-order check'); await page.waitForTimeout(1000);
  rec.confirm = await clickTid(page, 'button_shift_detail_note_confirm'); await page.waitForTimeout(5000);
  rec.shown_in_modal = await page.evaluate(`(() => { const s=${LAST}; return s? /ZZAUTOTEST per-order check/.test(s.innerText||'') : null; })()`);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2500);

  // WHICH shift did we actually write to?  find it by the note itself.
  const b1 = await board();
  const written = b1.shifts.find(s => s.note === 'ZZAUTOTEST per-order check');
  if (!written) { rec.error = 'note not found on any shift'; }
  else {
    const woId = written.workOrder.id;
    const family = b1.shifts.filter(s => s.workOrder && s.workOrder.id === woId);
    rec.written_shift = { id: written.id, wo: written.workOrder.number, note: written.note };
    rec.family = { work_order: written.workOrder.number, count: family.length,
                   notes: family.map(s => ({ id: s.id, startsAt: s.startsAt, note: s.note })) };
    rec.siblings_with_note = family.filter(s => s.id !== written.id && s.note === written.note).length;
    rec.siblings_total = family.length - 1;
    rec.per_work_order = rec.siblings_total === 0 ? 'UNDECIDABLE - this work order has only one shift'
      : (rec.siblings_with_note === rec.siblings_total ? 'PER WORK ORDER' : 'PER SHIFT');
  }

  // clean up
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(12000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(4000);
  await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 30 && r.height > 12 && r.x > 300 && r.y > 200 && r.y < innerHeight - 40; });
    if (blocks.length) { blocks[0].scrollIntoView({ block: 'center' }); blocks[0].click(); }
  });
  await page.waitForTimeout(4500);
  rec.cleanup_click = await clickTid(page, 'button_shift_detail_note_delete'); await page.waitForTimeout(5000);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2000);
  await h.browser.close();

  const b2 = await board();
  rec.left_behind = b2.shifts.filter(s => (s.note || '').includes('ZZAUTOTEST')).map(s => ({ id: s.id, note: s.note }));
  rec.clean = rec.left_behind.length === 0;
  fs.writeFileSync(`${OUT}/notes3.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), read_at_utc: new Date().toISOString() }, null, 1));
  console.log(JSON.stringify(rec, null, 1));
})();
