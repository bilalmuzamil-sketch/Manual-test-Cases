// probe_modal.cjs — open an existing shift's detail modal and read it.
//
// C30013 (notes added / edited / deleted per work order) needs NO drag at all -
// its preconditions ask only for an open detail modal - so its HOLD reason
// ("needs a drag that could not be completed") was wrong on its face.
//
// This run also records the modal's delete control, which is what makes the
// committing runs reversible.
//
// READ-ONLY unless NOTE=1, which exercises the note add/edit/delete cycle with
// ZZAUTOTEST text and removes it again.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');
const NOTE = process.env.NOTE === '1';
const TAG = NOTE ? 'modal-note' : 'modal';
const LAST = `(() => { const o=Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
  .filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0); return o[o.length-1]; })()`;

(async () => {
  const h = await makeHarness(TAG); const page = h.page; const rec = { note_run: NOTE, steps: [] };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn')).find(e => (e.textContent || '').trim() === 'Week'); if (b) b.click(); });
  await page.waitForTimeout(5000);

  // click a shift block that is inside the viewport
  rec.opened = await page.evaluate(() => {
    const vh = innerHeight, vw = innerWidth;
    const blocks = Array.from(document.querySelectorAll('[data-test-id^=schedule_shift],[data-test-id^=shift_],[class*=shift-block],[class*=schedule-event]'))
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 30 && r.height > 12 && r.x > 300 && r.x < vw - 20 && r.y > 200 && r.y < vh - 40; });
    if (!blocks.length) {
      const any = Array.from(document.querySelectorAll('[data-test-id]')).map(e => e.getAttribute('data-test-id'));
      return { ok: false, sample_tids: Array.from(new Set(any)).filter(t => /shift|event|block/i.test(t)).slice(0, 30) };
    }
    const b = blocks[0]; b.scrollIntoView({ block: 'center' });
    const r = b.getBoundingClientRect();
    b.click();
    return { ok: true, tid: b.getAttribute('data-test-id'), text: (b.innerText || '').replace(/\s+/g, ' ').slice(0, 90), n: blocks.length };
  });
  await page.waitForTimeout(5000);
  rec.steps.push({ step: 'shift modal', overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/${TAG}-01-modal.png` }).catch(() => {});

  // hunt for the notes area and the delete control
  rec.hunt = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {open:false};
     const tids = Array.from(s.querySelectorAll('[data-test-id]')).map(e=>e.getAttribute('data-test-id'));
     return { open:true, all_tids: tids,
       note_tids: tids.filter(t=>/note/i.test(t)),
       delete_tids: tids.filter(t=>/delete|remove|trash/i.test(t)),
       textareas: Array.from(s.querySelectorAll('textarea,input[type=text]')).map(e=>({tid:e.getAttribute('data-test-id'), ph:e.placeholder, val:(e.value||'').slice(0,60)})) }; })()`);

  if (NOTE && (rec.hunt.note_tids || []).length) {
    // ADD
    rec.note_add = await page.evaluate(`(async () => { const s=${LAST}; if(!s) return {ok:false};
      const ta = s.querySelector('textarea,[data-test-id*=note] textarea, [data-test-id*=note] input');
      if(!ta) return {ok:false, why:'no note field'};
      ta.scrollIntoView({block:'center'}); ta.focus();
      const set = Object.getOwnPropertyDescriptor(ta.constructor.prototype,'value').set;
      set.call(ta,'ZZAUTOTEST note'); ta.dispatchEvent(new Event('input',{bubbles:true})); ta.dispatchEvent(new Event('change',{bubbles:true}));
      return {ok:true, val: ta.value}; })()`);
    await page.waitForTimeout(1500);
    rec.note_save = await page.evaluate(`(() => { const s=${LAST}; if(!s) return {ok:false};
      const b=Array.from(s.querySelectorAll('button,.q-btn')).find(e=>/^(save|add|post|add note)$/i.test((e.innerText||'').trim()) && !e.disabled);
      if(!b) return {ok:false, buttons: Array.from(s.querySelectorAll('button,.q-btn')).map(e=>(e.innerText||'').trim()).slice(0,20)};
      b.click(); return {ok:true, pressed:(b.innerText||'').trim()}; })()`);
    await page.waitForTimeout(4000);
    rec.steps.push({ step: 'after note add', overlay: await page.evaluate(READ_OVERLAY) });
    await page.screenshot({ path: `${OUT}/${TAG}-02-noteadded.png` }).catch(() => {});
  }

  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(2000);
  fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify({ ...rec, api_writes: h.apiLog.filter(a => a.m !== 'GET'), api_4xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();
  console.log('OPENED:', JSON.stringify(rec.opened).slice(0, 250));
  for (const s of rec.steps) {
    console.log('\n### ' + s.step + ' (overlays: ' + s.overlay.open + ')');
    const seen = new Set();
    (s.overlay.nodes || []).forEach(n => { if (!seen.has(n.shown)) { seen.add(n.shown); console.log('   TXT ' + JSON.stringify(n.shown)); } });
    (s.overlay.buttons || []).forEach(b => console.log('   BTN ' + JSON.stringify(b.shown).slice(0, 60) + ' tid=' + b.tid + (b.disabled ? ' DISABLED' : '')));
  }
  console.log('\nHUNT:', JSON.stringify(rec.hunt, null, 1).slice(0, 1600));
  console.log('WRITES:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
})();
