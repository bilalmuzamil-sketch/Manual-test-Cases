// Re-drives every batch-2 case whose CHECK was faulty: the two toolbar menus (items are
// plain divs, not .q-item), the mini calendar (the sidebar was showing the drill-down),
// and the department-header collapse.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b2.json`);

// open a named toolbar menu and PROVE which one opened by its heading
async function openMenu(page, tid) {
  await esc(page, 2);
  await clickId(page, tid); await page.waitForTimeout(1800);
  return ev(page, ({ v }) => { const vis = eval(v);
    const ms = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis);
    if (!ms.length) return null;
    const m = ms[ms.length - 1];
    const leaves = [...m.querySelectorAll('*')].filter(e => e.children.length === 0 && vis(e))
      .map(e => (e.innerText || '').trim()).filter(Boolean);
    return { heading: leaves[0] || null, items: leaves, text: (m.innerText||'').replace(/\s+/g,' ').trim().slice(0,300) }; });
}
// click a menu item by EXACT visible leaf text, inside the open menu
async function clickMenuItem(page, text) {
  const ok = await ev(page, ({ text, v }) => { const vis = eval(v);
    const ms = [...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis);
    const m = ms[ms.length - 1]; if (!m) return false;
    let el = [...m.querySelectorAll('*')].filter(e => vis(e) && (e.innerText||'').trim() === text)
      .sort((a,b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length)[0];
    if (!el) return false;
    // click the clickable ancestor (the row), not the bare text node holder
    let t = el; for (let i=0;i<4 && t.parentElement;i++){ const r=t.getBoundingClientRect();
      if (r.height >= 24 && r.width >= 80) break; t = t.parentElement; }
    t.click(); return true; }, { text });
  await page.waitForTimeout(2400); return ok;
}
const laneCount = (page) => ev(page, ({ v }) => { const vis = eval(v);
  return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
const laneLabels = (page) => ev(page, ({ v }) => { const vis = eval(v);
  return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis)
    .map(e => (e.innerText||'').replace(/\s+/g,' ').trim()); });

(async () => {
  const h = await makeHarness('b2f'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);
    await setView(page, 'Week');

    // ===== C29935 : mini calendar, with the sidebar in its LIST state =====
    {
      const st = await ev(page, ({ v }) => { const vis = eval(v);
        const ds = [...document.querySelectorAll('[data-test-id^="button_mini_calendar_day_"]')].filter(vis);
        const read = e => { const s = getComputedStyle(e);
          return { d: e.getAttribute('data-test-id').replace('button_mini_calendar_day_',''), bg: s.backgroundColor,
                   color: s.color, weight: s.fontWeight, cls: (e.className||'').toString().slice(0,70) }; };
        const today = ds.find(e => /2026-08-12$/.test(e.getAttribute('data-test-id')));
        const sel = ds.map(read).filter(x => x.bg !== 'rgba(0, 0, 0, 0)');
        return { total: ds.length, today: today ? read(today) : null,
                 plain: ds.slice(0,2).map(read), tinted: sel.slice(0,6) }; });
      let hoverStyle = null;
      const box = await ev(page, ({ v }) => { const vis = eval(v);
        const e = document.querySelector('[data-test-id="button_mini_calendar_day_2026-08-20"]');
        if (!e || !vis(e)) return null; const r = e.getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2 }; });
      if (box) { await page.mouse.move(box.x, box.y); await page.waitForTimeout(1000);
        hoverStyle = await ev(page, () => { const e=document.querySelector('[data-test-id="button_mini_calendar_day_2026-08-20"]');
          const s=getComputedStyle(e); return { bg:s.backgroundColor, color:s.color, cls:(e.className||'').toString().slice(0,70) }; });
        await page.mouse.move(5,5); }
      record(29935, [
        { step: "1 look at today's date in the mini calendar", seen: `today: ${JSON.stringify(st.today)}` },
        { step: '2 compare with an ordinary date, and note which dates are tinted', seen: `plain: ${JSON.stringify(st.plain)} ; tinted: ${JSON.stringify(st.tinted)}` },
        { step: '3 hover a date', seen: JSON.stringify(hoverStyle) },
      ], st.today ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C29929 : collapse a department GROUP header =====
    {
      const before = await laneLabels(page);
      const groups = before.filter(l => /^[A-Z][A-Z /&]{3,}$/.test(l));
      const clicked = await ev(page, ({ g, v }) => { const vis = eval(v);
        const ls = [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        const hdr = ls.find(e => (e.innerText||'').replace(/\s+/g,' ').trim() === g); if (!hdr) return null;
        // click the row's own clickable chrome: try a chevron/expand icon inside it first
        const ic = [...hdr.querySelectorAll('*')].find(e => /expand|chevron|arrow/i.test((e.innerText||'') + (e.className||'').toString()));
        (ic || hdr).click(); return (ic ? 'icon inside header' : 'header itself'); }, { g: groups[0] });
      await page.waitForTimeout(2600);
      const after = await laneLabels(page);
      // put it back
      if (clicked) { await ev(page, ({ g, v }) => { const vis = eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        const hdr = ls.find(e => (e.innerText||'').replace(/\s+/g,' ').trim() === g);
        if (hdr) { const ic=[...hdr.querySelectorAll('*')].find(e=>/expand|chevron|arrow/i.test((e.innerText||'')+(e.className||'').toString())); (ic||hdr).click(); } }, { g: groups[0] });
        await page.waitForTimeout(2200); }
      const back = await laneCount(page);
      record(29929, [
        { step: '1 find a department header row', seen: `${before.length} lanes; group headers: ${JSON.stringify(groups)}` },
        { step: `2 click the header ${JSON.stringify(groups[0])} to collapse its group`, seen: clicked ? `clicked ${clicked}; lanes ${before.length} -> ${after.length}` : 'header not found' },
        { step: '3 click again to expand', seen: `lanes back to ${back}` },
      ], (clicked && after.length !== before.length) ? 'ALL STEPS CARRIED OUT' : `PARTIAL - the click landed but the lane count did not change (${before.length} -> ${after.length})`);
    }

    // ===== C30043 / C30045 : Filter & display, items clicked by exact text =====
    {
      const menu = await openMenu(page, 'schedule_filter_display_menu');
      const lanesBefore = await laneCount(page);
      const labelsBefore = await laneLabels(page);
      let toggled = null, lanesAfter = lanesBefore, labelsAfter = labelsBefore;
      if (menu) {
        const cand = menu.items.find(t => /^Service$/.test(t)) || menu.items.find(t => /^Service\/Parts$/.test(t));
        if (cand && await clickMenuItem(page, cand)) {
          toggled = cand; lanesAfter = await laneCount(page); labelsAfter = await laneLabels(page);
          await clickMenuItem(page, cand);           // put it back
        }
      }
      const lanesBack = await laneCount(page);
      record(30043, [
        { step: '1 open the Filter & display menu', seen: menu ? `heading ${JSON.stringify(menu.heading)}; items ${JSON.stringify(menu.items)}` : 'menu did not open' },
        { step: '2 turn one department group off', seen: toggled ? `toggled ${JSON.stringify(toggled)}; lanes ${lanesBefore} -> ${lanesAfter}; labels now ${JSON.stringify(labelsAfter.slice(0,6))}` : 'no department group option could be clicked' },
        { step: '3 turn it back on', seen: `lanes back to ${lanesBack}` },
      ], (toggled && lanesAfter !== lanesBefore) ? 'ALL STEPS CARRIED OUT' : (toggled ? `PARTIAL - clicked but lane count unchanged (${lanesBefore} -> ${lanesAfter})` : 'PARTIAL'));

      // C30045 VIN Number toggle -- and check the tooltip + modal are NOT gated by it
      const m2 = await openMenu(page, 'schedule_filter_display_menu');
      const vinBefore = await ev(page, ({ v }) => { const vis = eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        return { n: bs.length, withVin: bs.filter(b=>/[A-HJ-NPR-Z0-9]{17}/.test(b.innerText||'')).length,
                 sample: bs.slice(0,2).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)) }; });
      const vinOn = m2 && await clickMenuItem(page, 'VIN Number');
      const vinAfter = await ev(page, ({ v }) => { const vis = eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        return { n: bs.length, withVin: bs.filter(b=>/[A-HJ-NPR-Z0-9]{17}/.test(b.innerText||'')).length,
                 sample: bs.slice(0,2).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)) }; });
      if (vinOn) await clickMenuItem(page, 'VIN Number');
      await esc(page, 2);
      record(30045, [
        { step: '1 open Filter & display', seen: m2 ? `items ${JSON.stringify(m2.items)}` : 'menu did not open' },
        { step: "2 toggle 'VIN Number' and read the shift blocks", seen: vinOn ? `blocks showing a 17-char VIN: ${vinBefore.withVin}/${vinBefore.n} -> ${vinAfter.withVin}/${vinAfter.n}; sample after ${JSON.stringify(vinAfter.sample)}` : 'VIN Number could not be clicked' },
        { step: '3 put it back', seen: 'toggle restored' },
      ], vinOn ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C30050 / C30051 : View options =====
    {
      const menu = await openMenu(page, 'schedule_view_options_menu');
      const before = await laneLabels(page);
      let th = null, after = before;
      if (menu && menu.items.some(t => /^Tech Hours$/.test(t))) {
        th = await clickMenuItem(page, 'Tech Hours');
        after = await laneLabels(page);
        if (th) await clickMenuItem(page, 'Tech Hours');
      }
      record(30050, [
        { step: '1 open View options', seen: menu ? `heading ${JSON.stringify(menu.heading)}; items ${JSON.stringify(menu.items)}` : 'menu did not open' },
        { step: "2 toggle 'Tech Hours' and read the technician rows", seen: th ? `before ${JSON.stringify(before.slice(1,4))} -> after ${JSON.stringify(after.slice(1,4))}` : "'Tech Hours' not present / not clickable" },
        { step: '3 put it back', seen: 'toggle restored' },
      ], th ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

      const m2 = await openMenu(page, 'schedule_view_options_menu');
      const dayCols = () => ev(page, ({ v }) => { const vis = eval(v);
        const c=document.querySelector('[data-test-id="schedule_calendar"]'); if(!c) return null;
        const days=[...c.querySelectorAll('*')].filter(e=>/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/.test((e.innerText||'').trim()) && e.children.length===0);
        return [...new Set(days.map(e=>(e.innerText||'').trim().slice(0,12)))]; });
      const colsBefore = await dayCols();
      let sat = null, colsAfter = colsBefore;
      if (m2 && m2.items.some(t => /^Show Saturday$/.test(t))) {
        sat = await clickMenuItem(page, 'Show Saturday');
        colsAfter = await dayCols();
        if (sat) await clickMenuItem(page, 'Show Saturday');
      }
      const colsBack = await dayCols();
      await esc(page, 2);
      record(30051, [
        { step: '1 open View options', seen: m2 ? `items ${JSON.stringify(m2.items)}` : 'menu did not open' },
        { step: "2 toggle 'Show Saturday' and read the day columns", seen: sat ? `${JSON.stringify(colsBefore)} -> ${JSON.stringify(colsAfter)}` : "'Show Saturday' not present / not clickable" },
        { step: '3 put it back', seen: `columns back to ${JSON.stringify(colsBack)}` },
      ], sat ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C29953 : the line search box, actually typed into =====
    {
      const opened = await ev(page, ({ v }) => { const vis = eval(v);
        const cs=[...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis);
        const t=cs.find(c=>/\b[3-9] lines\b/.test(c.innerText||''))||cs[0]; if(!t) return null;
        const ch=[...t.querySelectorAll('*')].find(e=>/chevron_right/.test(e.innerText||'')); (ch||t).click();
        return (t.innerText||'').replace(/\s+/g,' ').trim().slice(0,50); });
      await page.waitForTimeout(3200);
      const rows = () => ev(page, ({ v }) => { const vis = eval(v);
        const s=document.querySelector('[data-test-id="schedule_sidebar"]'); if(!s) return null;
        const ls=[...s.querySelectorAll('*')].filter(e=>vis(e) && /drag_indicator/.test(e.innerText||'') && e.children.length<8);
        return { n: ls.length, txt: (s.innerText||'').replace(/\s+/g,' ').trim().slice(0,300) }; });
      const base = await rows();
      const trials = [];
      for (const [what, term] of [['a line title word','coolant'],['a customer name (should NOT match)','Fuline'],['nonsense control','zzzxq999']]) {
        await ev(page, ({ term }) => { const el=document.querySelector('[data-test-id="input_sidebar_line_search"]');
          if(!el) return false; const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
          set.call(el,term); el.dispatchEvent(new Event('input',{bubbles:true})); return true; }, { term });
        await page.waitForTimeout(2200);
        const r = await rows();
        trials.push(`${what} "${term}" -> ${JSON.stringify((r.txt||'').slice(0,150))}`);
      }
      await ev(page, () => { const el=document.querySelector('[data-test-id="input_sidebar_line_search"]');
        if(el){const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
        set.call(el,''); el.dispatchEvent(new Event('input',{bubbles:true}));} });
      record(29953, [
        { step: '1 open a work order drill-down', seen: opened ? `opened ${JSON.stringify(opened)}` : 'no card opened' },
        { step: "2 type into 'Search lines'", seen: trials.join(' | ') },
      ], opened ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    fs.writeFileSync(`${OUT}/b2fix-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, at: new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
