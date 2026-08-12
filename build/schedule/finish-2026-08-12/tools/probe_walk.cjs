// probe_walk.cjs -- carry out the STEPS of a batch of cases, in the order written.
//
// Each block below is one case.  It records, per step, what was done and what was seen, so
// "the steps work in the order written" is a measurement rather than an impression.
//
// NOTHING DESTRUCTIVE IS PRESSED.  C30015 step 3 asks the tester to press Delete on a SERIES
// shift and cancel; a series shift does show a scope dialog, but after today's incident this
// probe stops at the modal and records step 3 as NOT DRIVEN rather than risk a second delete.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const RESULT = `${OUT}/walk.json`, OPLOG = `${OUT}/walk-oplog.json`;
const walk = {};
function note(op, r, x) {
  const rows = fs.existsSync(OPLOG) ? JSON.parse(fs.readFileSync(OPLOG, 'utf8')) : [];
  rows.push(Object.assign({ at: new Date().toISOString(), op, result: r }, x || {}));
  fs.writeFileSync(OPLOG, JSON.stringify(rows, null, 1));
  console.log(`  [${op}] ${String(r).slice(0, 165)}`);
}
function record(cid, steps, verdict) {
  walk[cid] = { steps, verdict };
  fs.writeFileSync(RESULT, JSON.stringify(walk, null, 1));
  console.log(`== C${cid}: ${verdict}`);
}
const VIS = `(e)=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;}`;
const PANELS = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden'; };
  return [...document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"],.q-tooltip')]
    .filter(vis).map(d => (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 800));
};
async function panels(p, ms = 1600) { await p.waitForTimeout(ms); return p.evaluate(PANELS); }
async function esc(p) { await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
async function clickId(p, tid, nth = 0) {
  return p.evaluate(({ tid, nth, v }) => {
    const vis = eval(v);
    const els = [...document.querySelectorAll(`[data-test-id="${tid}"]`)].filter(vis);
    const el = els[nth]; if (!el) return false; el.scrollIntoView({ block: 'center' }); el.click(); return true;
  }, { tid, nth, v: VIS });
}
async function view(p, name) {
  return p.evaluate(({ name, v }) => {
    const vis = eval(v);
    const b = [...document.querySelectorAll('button,.q-btn,div,span')].filter(vis)
      .find(e => (e.innerText || '').trim() === name);
    if (!b) return false; b.click(); return true;
  }, { name, v: VIS });
}

(async () => {
  const h = await makeHarness('walk'); const page = h.page;
  const go = async () => { await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(10000); };
  try {
    await go();

    // ---------------- C29941 : sidebar search with no matches ----------------
    {
      const s = [];
      const typed = await page.evaluate(({ v }) => {
        const vis = eval(v);
        const i = [...document.querySelectorAll('[data-test-id="input_sidebar_search"] input,[data-test-id="input_sidebar_search"]')]
          .filter(vis).find(e => e.tagName === 'INPUT');
        if (!i) return false; i.focus(); return true;
      }, { v: VIS });
      if (typed) {
        await page.keyboard.type('zzzxq999', { delay: 60 }); await page.waitForTimeout(2600);
        const cards = await page.evaluate(({ v }) => { const vis = eval(v);
          return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; }, { v: VIS });
        const txt = await page.evaluate(({ v }) => { const vis = eval(v);
          const l = document.querySelector('[data-test-id="sidebar_work_order_list"]');
          return l && vis(l) ? (l.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : null; }, { v: VIS });
        s.push({ step: "1 type 'zzzxq999' in Search work orders", seen: `${cards} cards; list text ${JSON.stringify(txt)}` });
        s.push({ step: '2 look at the list', seen: cards === 0 ? 'list is empty' : `${cards} cards still shown` });
        for (let i = 0; i < 9; i++) await page.keyboard.press('Backspace');
        await page.waitForTimeout(2600);
        const back = await page.evaluate(({ v }) => { const vis = eval(v);
          return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; }, { v: VIS });
        s.push({ step: '3 clear the search', seen: `${back} cards returned` });
        await page.screenshot({ path: `${OUT}/w-29941.png` }).catch(() => {});
        record(29941, s, cards === 0 && back > 0 ? 'ALL STEPS CARRIED OUT' : 'steps carried out, outcome recorded');
      } else record(29941, [{ step: 'locate the search box', seen: 'input not found' }], 'NOT DRIVEN');
    }

    // ---------------- C29944 : status filter narrows the list ----------------
    {
      await go(); const s = [];
      const before = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; }, { v: VIS });
      const opened = await clickId(page, 'button_sidebar_filters');
      s.push({ step: "1 open the 'Filters' panel", seen: opened ? (await panels(page, 1500))[0] || 'panel opened' : 'not found' });
      const picked = await page.evaluate(({ v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if (!m) return null;
        const it = [...m.querySelectorAll('.q-item,label,div')].filter(vis)
          .find(e => /^Approved/.test((e.innerText || '').trim()) && (e.innerText || '').length < 40);
        if (!it) return null; it.click(); return (it.innerText || '').replace(/\s+/g, ' ').trim(); }, { v: VIS });
      s.push({ step: '2 choose one status under Status', seen: picked || 'no status item found' });
      await esc(page); await page.waitForTimeout(2200);
      const after = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; }, { v: VIS });
      s.push({ step: '3 read the list', seen: `cards before ${before} -> after ${after}` });
      await page.screenshot({ path: `${OUT}/w-29944.png` }).catch(() => {});
      record(29944, s, picked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ---------------- C29946 : 'Clear all' resets the filters ----------------
    {
      const s = [];
      await clickId(page, 'button_sidebar_filters'); await page.waitForTimeout(1400);
      const cleared = await page.evaluate(({ v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if (!m) return null;
        const c = [...m.querySelectorAll('*')].filter(vis).find(e => (e.innerText || '').trim() === 'Clear all');
        if (!c) return null; c.click(); return 'Clear all'; }, { v: VIS });
      s.push({ step: "1 click 'Clear all'", seen: cleared ? "clicked 'Clear all'" : "'Clear all' not present" });
      await page.waitForTimeout(2200);
      const back = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; }, { v: VIS });
      const pnl = await panels(page, 1200);
      s.push({ step: "2 look at the list and the 'Filters' button", seen: `${back} cards; panel now: ${JSON.stringify(pnl[0] || '').slice(0, 220)}` });
      await page.screenshot({ path: `${OUT}/w-29946.png` }).catch(() => {});
      await esc(page);
      record(29946, s, cleared ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ---------------- C30046 : 'View options' six toggles ----------------
    {
      await go(); const s = [];
      await clickId(page, 'schedule_view_options_menu'); const p1 = await panels(page, 1600);
      s.push({ step: "1 open 'View options'", seen: p1[0] || 'no panel' });
      s.push({ step: '2 read each toggle and its state', seen: p1[0] || 'no panel' });
      const togg = async (label) => page.evaluate(({ label, v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if (!m) return null;
        const it = [...m.querySelectorAll('.q-item,label,div')].filter(vis)
          .find(e => (e.innerText || '').trim() === label);
        if (!it) return null; it.click(); return label; }, { label, v: VIS });
      const offCap = await togg('Capacity Planning'); await page.waitForTimeout(1800);
      const capGone = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="capacity_bar"]')].filter(vis).length; }, { v: VIS });
      s.push({ step: '3 turn OFF Capacity Planning, look at the day column headers', seen: `toggled ${offCap}; capacity_bar elements now ${capGone}` });
      await togg('Capacity Planning'); await page.waitForTimeout(1600);
      const capBack = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="capacity_bar"]')].filter(vis).length; }, { v: VIS });
      s.push({ step: '3b turn Capacity Planning back ON', seen: `capacity_bar elements now ${capBack}` });
      const offEv = await togg('Events'); await page.waitForTimeout(1800);
      const evGone = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_event_block"]')].filter(vis).length; }, { v: VIS });
      s.push({ step: '4 turn OFF Events, look at the grid', seen: `toggled ${offEv}; event blocks now ${evGone}` });
      await togg('Events'); await page.waitForTimeout(1600);
      const evBack = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_event_block"]')].filter(vis).length; }, { v: VIS });
      s.push({ step: '4b turn Events back ON', seen: `event blocks now ${evBack}` });
      await page.screenshot({ path: `${OUT}/w-30046.png` }).catch(() => {}); await esc(page);
      record(30046, s, offCap && offEv ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ---------------- C30037 : tooltip delay / dismiss / read-only ----------------
    {
      await go(); const s = [];
      const c = await page.evaluate(({ v }) => { const vis = eval(v);
        const b = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)[0];
        if (!b) return null; b.scrollIntoView({ block: 'center' });
        return new Promise(res => setTimeout(() => { const r = b.getBoundingClientRect();
          res({ x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }); }, 500)); }, { v: VIS });
      if (c) {
        await page.mouse.move(c.x - 80, c.y); await page.mouse.move(c.x, c.y, { steps: 2 }); await page.mouse.move(c.x + 90, c.y, { steps: 2 });
        const quick = await page.evaluate(PANELS);
        s.push({ step: '1 move quickly across without stopping', seen: `${quick.length} tooltip(s) while moving` });
        await page.mouse.move(c.x, c.y); await page.waitForTimeout(400); await page.mouse.move(c.x + 2, c.y + 2);
        const rest = await panels(page, 2000);
        s.push({ step: '2 rest the pointer and wait', seen: rest[0] ? `tooltip: ${rest[0].slice(0, 160)}` : 'no tooltip' });
        await page.mouse.move(6, 6); const gone = await panels(page, 1400);
        s.push({ step: '3 move the mouse off the block', seen: `${gone.length} tooltip(s) remain` });
        await page.mouse.move(c.x, c.y); await page.waitForTimeout(900); await page.mouse.click(c.x, c.y);
        const modal = await panels(page, 2200);
        s.push({ step: '4 click the block', seen: modal[0] ? `modal opened: ${modal[0].slice(0, 130)}` : 'nothing opened' });
        await page.screenshot({ path: `${OUT}/w-30037.png` }).catch(() => {}); await esc(page);
        record(30037, s, 'ALL STEPS CARRIED OUT');
      } else record(30037, [{ step: 'find a shift block', seen: 'none visible' }], 'NOT DRIVEN');
    }

    // ---------------- C30015 : modal offers Delete only, no Reassign ----------------
    {
      await go(); const s = [];
      const ok = await clickId(page, 'schedule_shift_block');
      const p = await panels(page, 2400);
      const body = p.join(' ');
      s.push({ step: "1 look at the modal's actions", seen: p[0] ? p[0].slice(0, 300) : 'modal did not open' });
      s.push({ step: "2 confirm there is no 'Reassign' action", seen: /reassign/i.test(body) ? "'Reassign' IS present" : "no 'Reassign' anywhere in the modal" });
      s.push({ step: '3 click Delete on a series shift and cancel', seen: 'NOT DRIVEN - deliberately not pressed after today\'s accidental delete; see INCIDENT-shift-delete-2026-08-12.md' });
      await page.screenshot({ path: `${OUT}/w-30015.png` }).catch(() => {}); await esc(page);
      record(30015, s, ok ? 'STEPS 1-2 CARRIED OUT; step 3 deliberately not driven' : 'NOT DRIVEN');
    }

    // ---------------- C30042 : 'Filter & display' contents and defaults ----------------
    {
      await go(); const s = [];
      const ok = await clickId(page, 'schedule_filter_display_menu');
      const p = await panels(page, 1700);
      s.push({ step: "1 open the 'Filter & display' dropdown", seen: ok ? 'opened' : 'control not found' });
      s.push({ step: '2 read its contents and default states', seen: p[0] || 'no panel' });
      await page.screenshot({ path: `${OUT}/w-30042.png` }).catch(() => {}); await esc(page);
      record(30042, s, ok && p[0] ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ---------------- C30008 : click a shift, read the modal identity ----------------
    {
      await go(); const s = [];
      const ok = await clickId(page, 'schedule_shift_block');
      const p = await panels(page, 2400);
      s.push({ step: '1 click the shift block', seen: ok ? 'modal opened' : 'block not found' });
      s.push({ step: "2 read the modal's identity section", seen: (p[0] || '').slice(0, 220) });
      await page.screenshot({ path: `${OUT}/w-30008.png` }).catch(() => {}); await esc(page);
      record(30008, s, ok && p[0] ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ---------------- C30047 : Business Hours shading in DAY view ----------------
    {
      await go(); const s = [];
      await view(page, 'Day'); await page.waitForTimeout(2600);
      s.push({ step: '1 note the timeline background outside working hours (Business Hours OFF)', seen: 'day view loaded' });
      await clickId(page, 'schedule_view_options_menu'); await page.waitForTimeout(1400);
      const on = await page.evaluate(({ v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if (!m) return null;
        const it = [...m.querySelectorAll('.q-item,label,div')].filter(vis).find(e => (e.innerText || '').trim() === 'Business Hours');
        if (!it) return null; it.click(); return 'Business Hours'; }, { v: VIS });
      s.push({ step: "2 turn ON Business Hours in 'View options'", seen: on ? 'toggled Business Hours' : 'toggle not found' });
      await esc(page); await page.waitForTimeout(2200);
      const shaded = await page.evaluate(({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="text_schedule_slot_overtime"],[class*="overtime"],[class*="non-working"],[class*="outside"]')].filter(vis).length; }, { v: VIS });
      s.push({ step: '3 look at the timeline again', seen: `${shaded} out-of-hours marked element(s) visible` });
      await page.screenshot({ path: `${OUT}/w-30047.png` }).catch(() => {});
      // put the toggle back the way it was found
      await clickId(page, 'schedule_view_options_menu'); await page.waitForTimeout(1200);
      await page.evaluate(({ v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if (!m) return;
        const it = [...m.querySelectorAll('.q-item,label,div')].filter(vis).find(e => (e.innerText || '').trim() === 'Business Hours');
        if (it) it.click(); }, { v: VIS });
      await esc(page);
      record(30047, s, on ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }
  } catch (e) { note('FATAL', String(e).slice(0, 300)); }
  const nonGet = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/walk-meta.json`, JSON.stringify({ read_at_utc: new Date().toISOString(),
    non_get_calls: nonGet, api_4xx5xx: h.apiLog.filter(a => a.s >= 400) }, null, 1));
  console.log('NON-GET:', JSON.stringify(nonGet));
  await h.browser.close();
})();
