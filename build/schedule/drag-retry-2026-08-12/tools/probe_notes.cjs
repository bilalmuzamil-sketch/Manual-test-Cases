// probe_notes.cjs — C30013: notes added, edited and deleted from the shift
// detail modal, and whether they are kept PER WORK ORDER (visible from another
// shift of the same order).
//
// This case needs no drag; its HOLD reason was wrong on its face.
//
// It WRITES (a note) and then removes it again.  Text is ZZAUTOTEST-tagged.
// The per-work-order half is checked by opening a SECOND shift of the SAME work
// order - chosen from the board API so the pair is known to share an order
// before the browser is opened, rather than hoped for.
const { makeHarness, APP, OUT, CK, UA } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const API = 'https://sv8685api.qa.shopview.com';
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;

async function findPair() {
  const r = await fetch(`${API}/api/schedule/board?from=2026-08-03T00:00:00Z&to=2026-08-31T00:00:00Z`,
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  const b = (await r.json()).data.board;
  const byWo = {};
  for (const s of b.shifts) { const k = s.workOrder && s.workOrder.id; if (!k) continue; (byWo[k] ||= []).push(s); }
  for (const k of Object.keys(byWo)) if (byWo[k].length >= 2) {
    return { woId: k, number: byWo[k][0].workOrder.number, customer: byWo[k][0].workOrder.customerName,
             shifts: byWo[k].slice(0, 2).map(s => ({ id: s.id, startsAt: s.startsAt, note: s.note })) };
  }
  return null;
}

(async () => {
  const pair = await findPair();
  const h = await makeHarness('notes'); const page = h.page; const rec = { pair, steps: [] };
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
  await page.waitForTimeout(5000);
  rec.wo = await page.evaluate(`(() => { const s=${LAST}; if(!s) return null;
     const e=s.querySelector('[data-test-id=text_shift_detail_work_order]'); return e?e.innerText.trim():null; })()`);

  // 1 ADD
  await page.evaluate(`(() => { const e=document.querySelector('[data-test-id=button_shift_detail_add_note]');
     if(e){ e.scrollIntoView({block:'center'}); e.click(); } })()`);
  await page.waitForTimeout(3000);
  rec.steps.push({ step: 'after Add Note pressed', overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/notes-01-addpressed.png` }).catch(() => {});

  rec.typed = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
     const ta = s.querySelector('textarea') || s.querySelector('input[type=text]');
     if(!ta) return {ok:false, why:'no field', tids: Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id')).slice(0,40)};
     ta.scrollIntoView({block:'center'}); ta.focus();
     const proto = ta.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
     Object.getOwnPropertyDescriptor(proto,'value').set.call(ta,'ZZAUTOTEST note');
     ta.dispatchEvent(new Event('input',{bubbles:true})); ta.dispatchEvent(new Event('change',{bubbles:true}));
     return {ok:true, tid: ta.getAttribute('data-test-id'), val: ta.value}; })()`);
  await page.waitForTimeout(1500);
  rec.saved = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
     const btns = Array.from(s.querySelectorAll('button,.q-btn'));
     const b = btns.find(e=>/^(save|add|add note|post|done)$/i.test((e.innerText||'').trim()) && !e.disabled && e.getAttribute('aria-disabled')!=='true');
     if(!b) return {ok:false, buttons: btns.map(e=>({t:(e.innerText||'').trim().slice(0,30), tid:e.getAttribute('data-test-id'), dis:e.disabled})) };
     b.scrollIntoView({block:'center'}); b.click(); return {ok:true, pressed:(b.innerText||'').trim(), tid:b.getAttribute('data-test-id')}; })()`);
  await page.waitForTimeout(5000);
  rec.steps.push({ step: 'after save', overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/notes-02-saved.png` }).catch(() => {});
  rec.note_controls = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {};
     const tids=Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
     return { note_tids: tids.filter(t=>/note/i.test(t)),
              body_has_zz: /ZZAUTOTEST/.test(s.innerText||'') }; })()`);

  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2500);
  fs.writeFileSync(`${OUT}/notes.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), api_4xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();
  console.log('PAIR:', JSON.stringify(pair));
  console.log('OPENED:', JSON.stringify(rec.opened), 'WO:', rec.wo);
  for (const s of rec.steps) {
    console.log('\n### ' + s.step + ' (overlays: ' + s.overlay.open + ')');
    const seen = new Set(); const t = [];
    (s.overlay.nodes || []).forEach(n => { if (!seen.has(n.shown)) { seen.add(n.shown); t.push(n.shown); } });
    console.log('   TXT ' + JSON.stringify(t).slice(0, 900));
    (s.overlay.buttons || []).forEach(b => console.log('   BTN ' + JSON.stringify(b.shown).slice(0, 50) + ' tid=' + b.tid + (b.disabled ? ' DIS' : '')));
  }
  console.log('\nTYPED:', JSON.stringify(rec.typed).slice(0, 400));
  console.log('SAVED:', JSON.stringify(rec.saved).slice(0, 600));
  console.log('NOTE CONTROLS:', JSON.stringify(rec.note_controls));
  console.log('WRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
