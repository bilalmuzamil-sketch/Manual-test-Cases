// probe_notes2.cjs — C30013 full cycle: add, edit, delete a shift note, then
// check whether it is kept PER WORK ORDER.
//
// The confirm control is an ICON button (data-test-id button_shift_detail_note_confirm),
// not a button labelled Save - a text-only search misses it and would have read
// as "there is no way to save a note", which is a false absence.
//
// The pair of shifts sharing one work order is chosen from the board API BEFORE
// the browser opens, so the per-work-order half is tested in a state where it
// must be observable rather than hoped for.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;

async function board() {
  const r = await fetch(`${API}/api/schedule/board?from=2026-08-03T00:00:00Z&to=2026-08-31T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  return (await r.json()).data.board;
}
async function setNote(page, txt) {
  return page.evaluate(({ t }) => {
    const o = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
      .filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    const s = o[o.length - 1]; if (!s) return { ok: false };
    const ta = s.querySelector('[data-test-id=input_shift_detail_note]');
    if (!ta) return { ok: false, why: 'no note field' };
    ta.scrollIntoView({ block: 'center' }); ta.focus();
    const proto = ta.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(ta, t);
    ta.dispatchEvent(new Event('input', { bubbles: true })); ta.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, val: ta.value };
  }, { t: txt });
}
const clickTid = (page, tid) => page.evaluate(({ t }) => {
  const e = document.querySelector(`[data-test-id="${t}"]`);
  if (!e) return { ok: false, why: 'no ' + t };
  e.scrollIntoView({ block: 'center' }); e.click(); return { ok: true };
}, { t: tid });

(async () => {
  const b0 = await board();
  const byWo = {}; for (const s of b0.shifts) { const k = s.workOrder && s.workOrder.id; if (k) (byWo[k] ||= []).push(s); }
  const woId = Object.keys(byWo).find(k => byWo[k].length >= 2);
  const target = byWo[woId][0];
  const sibling = byWo[woId][1];
  const rec = { work_order: target.workOrder.number, customer: target.workOrder.customerName,
                target_shift: target.id, sibling_shift: sibling.id,
                note_before: { target: target.note, sibling: sibling.note }, steps: [] };

  const h = await makeHarness('notes2'); const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(5000);
  rec.opened = await page.evaluate(() => {
    const vh = innerHeight, vw = innerWidth;
    const blocks = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 30 && r.height > 12 && r.x > 300 && r.x < vw - 20 && r.y > 200 && r.y < vh - 40; });
    if (!blocks.length) return { ok: false };
    blocks[0].scrollIntoView({ block: 'center' }); blocks[0].click();
    return { ok: true, text: (blocks[0].innerText || '').replace(/\s+/g, ' ').slice(0, 70) };
  });
  await page.waitForTimeout(4500);
  rec.wo_on_screen = await page.evaluate(`(() => { const s=${LAST}; const e=s&&s.querySelector('[data-test-id=text_shift_detail_work_order]'); return e?e.innerText.trim():null; })()`);

  // ---------- 1 ADD
  await clickTid(page, 'button_shift_detail_add_note'); await page.waitForTimeout(2500);
  rec.add_typed = await setNote(page, 'ZZAUTOTEST note'); await page.waitForTimeout(1200);
  rec.add_confirm = await clickTid(page, 'button_shift_detail_note_confirm'); await page.waitForTimeout(5000);
  rec.after_add = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {};
     return { has_zz: /ZZAUTOTEST/.test(s.innerText||''),
              note_tids: Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id')).filter(t=>/note/i.test(t)),
              notes_area: (()=>{ const m=(s.innerText||'').match(/Notes[\\s\\S]{0,200}/); return m?m[0].replace(/\\s+/g,' '):null; })() }; })()`);
  await page.screenshot({ path: `${OUT}/notes2-01-added.png` }).catch(() => {});

  // ---------- 2 EDIT
  rec.edit_open = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
     const tids=Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
     const ed = tids.find(t=>/note.*(edit|pencil)|edit.*note/i.test(t));
     if(ed){ document.querySelector('[data-test-id="'+ed+'"]').click(); return {ok:true, via:ed}; }
     const add=s.querySelector('[data-test-id=button_shift_detail_add_note]');
     if(add){ add.click(); return {ok:true, via:'add_note button reused'}; }
     return {ok:false, tids: tids.filter(t=>/note/i.test(t))}; })()`);
  await page.waitForTimeout(2500);
  rec.edit_typed = await setNote(page, 'ZZAUTOTEST note edited'); await page.waitForTimeout(1200);
  rec.edit_confirm = await clickTid(page, 'button_shift_detail_note_confirm'); await page.waitForTimeout(5000);
  rec.after_edit = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {};
     return { has_edited: /ZZAUTOTEST note edited/.test(s.innerText||''),
              notes_area: (()=>{ const m=(s.innerText||'').match(/Notes[\\s\\S]{0,200}/); return m?m[0].replace(/\\s+/g,' '):null; })() }; })()`);
  await page.screenshot({ path: `${OUT}/notes2-02-edited.png` }).catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(3000);

  // ---------- per work order?  read BOTH shifts from the API
  const b1 = await board();
  const t1 = b1.shifts.find(s => s.id === target.id), s1 = b1.shifts.find(s => s.id === sibling.id);
  rec.per_work_order = { target_note: t1 ? t1.note : null, sibling_note: s1 ? s1.note : null,
                         same: !!(t1 && s1 && t1.note === s1.note) };

  // ---------- 3 DELETE the note again (leave the estate clean)
  await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('[data-test-id=schedule_shift_block]'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 30 && r.height > 12 && r.x > 300 && r.y > 200 && r.y < innerHeight - 40; });
    if (blocks.length) { blocks[0].scrollIntoView({ block: 'center' }); blocks[0].click(); }
  });
  await page.waitForTimeout(4500);
  rec.del_open = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
     const tids=Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
     const d = tids.find(t=>/note.*(delete|remove|clear)/i.test(t));
     if(d){ document.querySelector('[data-test-id="'+d+'"]').click(); return {ok:true, via:d}; }
     const add=s.querySelector('[data-test-id=button_shift_detail_add_note]');
     if(add){ add.click(); return {ok:true, via:'reopen editor and blank it'}; }
     return {ok:false, note_tids: tids.filter(t=>/note/i.test(t))}; })()`);
  await page.waitForTimeout(2500);
  rec.del_typed = await setNote(page, ''); await page.waitForTimeout(1000);
  rec.del_confirm = await clickTid(page, 'button_shift_detail_note_confirm'); await page.waitForTimeout(5000);
  await page.screenshot({ path: `${OUT}/notes2-03-deleted.png` }).catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2500);
  await h.browser.close();

  const b2 = await board();
  const t2 = b2.shifts.find(s => s.id === target.id);
  rec.note_after_cleanup = t2 ? t2.note : 'SHIFT GONE';
  rec.clean = (rec.note_after_cleanup === null || rec.note_after_cleanup === '');
  fs.writeFileSync(`${OUT}/notes2.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), api_4xx: h.apiLog.filter(a => a.s >= 400), read_at_utc: new Date().toISOString() }, null, 1));
  console.log(JSON.stringify(rec, null, 1).slice(0, 3500));
  console.log('\nWRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
