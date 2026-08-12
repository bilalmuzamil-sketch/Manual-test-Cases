// BATCH 1 -- default view, day-view timeline, toolbar, conflicts, capacity, mini calendar,
// sidebar search/filters, Filter & display + View options toggles.
// READ-ONLY: nothing destructive is pressed. Non-GET call list printed at exit.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId, clickText } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b1.json`);

(async () => {
  const h = await makeHarness('b1'); const page = h.page;
  const nonGet = () => h.apiLog.filter(a => a.m !== 'GET');
  try {
    // ================= C43554 : which view does it open on? FIRST ACTION of a fresh context =====
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);
    const openView = await ev(page, ({ v }) => { const vis = eval(v);
      const t = document.querySelector('[data-test-id="schedule_view_toggle"]'); if (!t) return null;
      return [...t.querySelectorAll('button,.q-btn,div,span')].filter(vis)
        .map(e => ({ t: (e.innerText || '').trim(), pressed: e.getAttribute('aria-pressed') }))
        .filter(x => ['Day','Week','Month'].includes(x.t)); });
    record(43554, [
      { step: '1 open the Schedule module in a browser that has never touched the view control', seen: `first action of this context; range ${JSON.stringify(await range(page))}` },
      { step: '2 read the Day / Week / Month buttons', seen: JSON.stringify(openView) },
    ], 'ALL STEPS CARRIED OUT');

    // ================= C30006 : now line on today's day view =================
    {
      const nl = await ev(page, ({ v }) => { const vis = eval(v);
        const t = document.querySelector('[data-test-id="text_schedule_now_time"]');
        return { present: !!(t && vis(t)), label: t ? (t.innerText||'').trim() : null }; });
      record(30006, [
        { step: '1 open day view for today', seen: `range ${JSON.stringify(await range(page))}` },
        { step: '2 look for the current-time marker', seen: `now-time label present ${nl.present}, reads ${JSON.stringify(nl.label)}` },
      ], nl.present ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no now marker found');
    }

    // ================= C30001 : day view auto-scrolls to working-day start ==========
    {
      const sc = await ev(page, () => {
        const c = document.querySelector('[data-test-id="schedule_calendar"]'); if (!c) return null;
        const sc = c.querySelector('.scroll,[class*="scroll"]') || c;
        return { scrollTop: sc.scrollTop, scrollHeight: sc.scrollHeight, clientHeight: sc.clientHeight,
                 scrollLeft: sc.scrollLeft, scrollWidth: sc.scrollWidth, clientWidth: sc.clientWidth }; });
      record(30001, [
        { step: '1 open day view', seen: `range ${JSON.stringify(await range(page))}` },
        { step: '2 note where the timeline is scrolled to on arrival', seen: JSON.stringify(sc) },
      ], sc ? 'PARTIAL - scroll offset read; "working-day start" needs the hour label at the left edge' : 'PARTIAL');
    }

    // ================= C30003 : sticky headers on vertical scroll ============
    {
      const before = await ev(page, ({ v }) => { const vis = eval(v);
        const h = document.querySelector('[data-test-id="text_schedule_resource_header"]');
        return h && vis(h) ? h.getBoundingClientRect().top : null; });
      await ev(page, () => { const c = document.querySelector('[data-test-id="schedule_calendar"]');
        const sc = c && (c.querySelector('.scroll,[class*="scroll"]') || c); if (sc) sc.scrollTop = 400; });
      await page.waitForTimeout(1200);
      const after = await ev(page, ({ v }) => { const vis = eval(v);
        const h = document.querySelector('[data-test-id="text_schedule_resource_header"]');
        return h && vis(h) ? h.getBoundingClientRect().top : null; });
      await ev(page, () => { const c = document.querySelector('[data-test-id="schedule_calendar"]');
        const sc = c && (c.querySelector('.scroll,[class*="scroll"]') || c); if (sc) sc.scrollTop = 0; });
      record(30003, [
        { step: '1 scroll the grid down vertically', seen: 'scrollTop set to 400' },
        { step: '2 watch the date/time header row', seen: `header top ${before} -> ${after} (unchanged = stuck)` },
      ], (before !== null && after !== null) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ================= C30039 : Today button ==============================
    {
      await clickId(page, 'button_mini_calendar_next'); await page.waitForTimeout(1500);
      await ev(page, ({ v }) => { const vis = eval(v);
        const ds = [...document.querySelectorAll('[data-test-id^="button_mini_calendar_day_"]')].filter(vis);
        if (ds[20]) ds[20].click(); });
      await page.waitForTimeout(2600);
      const away = await range(page);
      const ok = await clickId(page, 'button_schedule_today'); await page.waitForTimeout(2600);
      const back = await range(page);
      record(30039, [
        { step: '1 move the grid away from today', seen: `range now ${JSON.stringify(away)}` },
        { step: "2 click 'Today'", seen: ok ? `button clicked; range ${JSON.stringify(back)}` : "no 'Today' button found" },
      ], ok ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ================= C30040 : arrows step by the active view's unit =============
    {
      const steps = [];
      for (const view of ['Day','Week','Month']) {
        await setView(page, view);
        const b = await range(page);
        await clickId(page, 'button_schedule_next'); await page.waitForTimeout(2400);
        const n = await range(page);
        await clickId(page, 'button_schedule_prev'); await page.waitForTimeout(2400);
        const p = await range(page);
        steps.push({ step: `in ${view} view click the right then the left arrow`, seen: `${JSON.stringify(b)} -> ${JSON.stringify(n)} -> back to ${JSON.stringify(p)}` });
      }
      record(30040, steps, 'ALL STEPS CARRIED OUT');
    }

    // ================= C30041 : toolbar search fields it matches ================
    {
      await setView(page, 'Week');
      const opened = await clickId(page, 'button_schedule_search_toggle');
      await page.waitForTimeout(1200);
      const inp = await ev(page, ({ v }) => { const vis = eval(v);
        const ins = [...document.querySelectorAll('input')].filter(vis)
          .map(e => ({ ph: e.getAttribute('placeholder'), tid: e.getAttribute('data-test-id') }));
        return ins; });
      const trials = [];
      for (const [what, term] of [['customer','Pamill'],['work order','12876'],['unit','713'],['technician','Larry'],['line','ramp']]) {
        const typed = await ev(page, async ({ term, v }) => { const vis = eval(v);
          const el = [...document.querySelectorAll('input')].filter(vis)
            .find(e => /search/i.test((e.getAttribute('placeholder')||'') + (e.getAttribute('data-test-id')||'')));
          if (!el) return false;
          const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
          set.call(el, term); el.dispatchEvent(new Event('input',{bubbles:true})); return true; }, { term });
        await page.waitForTimeout(2200);
        const n = await ev(page, ({ v }) => { const vis = eval(v);
          return [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis).length; });
        trials.push(`${what} "${term}" -> ${n} shift block(s)${typed?'':' (INPUT NOT FOUND)'}`);
      }
      await ev(page, ({ v }) => { const vis = eval(v);
        const el = [...document.querySelectorAll('input')].filter(vis)
          .find(e => /search/i.test((e.getAttribute('placeholder')||'') + (e.getAttribute('data-test-id')||'')));
        if (el) { const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
          set.call(el,''); el.dispatchEvent(new Event('input',{bubbles:true})); } });
      await page.waitForTimeout(1800);
      record(30041, [
        { step: '1 open the toolbar search', seen: opened ? `opened; visible inputs ${JSON.stringify(inp)}` : 'search toggle not found' },
        { step: '2 type a term of each kind and watch the grid', seen: trials.join(' | ') },
      ], opened ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ================= C30027 / C30028 : conflict pill ==========================
    {
      const pill = await ev(page, ({ v }) => { const vis = eval(v);
        const b = document.querySelector('[data-test-id="button_schedule_conflicts"]');
        return b && vis(b) ? (b.innerText||'').replace(/\s+/g,' ').trim() : null; });
      const opened = await clickId(page, 'button_schedule_conflicts');
      await page.waitForTimeout(1600);
      const list = await pops(page);
      record(30027, [
        { step: '1 look at the toolbar for a conflict indicator', seen: `pill reads ${JSON.stringify(pill)}` },
        { step: '2 click it', seen: opened ? `popup: ${JSON.stringify(list)}` : 'pill not clickable' },
      ], (pill && opened && list.length) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C30028 : click an entry in the dropdown
      const beforeRange = await range(page);
      const clicked = await ev(page, ({ v }) => { const vis = eval(v);
        const m = [...document.querySelectorAll('.q-menu,[role="menu"],.q-dialog')].filter(vis)[0];
        if (!m) return null;
        const it = [...m.querySelectorAll('.q-item,li,div[role="option"],button')].filter(vis)
          .filter(e => (e.innerText||'').trim().length > 8)[0];
        if (!it) return null; const t=(it.innerText||'').replace(/\s+/g,' ').trim().slice(0,120); it.click(); return t; });
      await page.waitForTimeout(3000);
      const afterRange = await range(page);
      const modalAfter = await pops(page);
      record(30028, [
        { step: '1 open the conflict list', seen: `popup had ${list.length} panel(s)` },
        { step: '2 click one of the conflicts', seen: clicked ? `clicked ${JSON.stringify(clicked)}` : 'no clickable conflict entry found in the popup' },
        { step: '3 note where the grid goes', seen: `range ${JSON.stringify(beforeRange)} -> ${JSON.stringify(afterRange)}; open panels now ${JSON.stringify(modalAfter.map(x=>x.slice(0,90)))}` },
      ], clicked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await esc(page, 2);
    }

    // ================= C30030 / C30031 / C30032 / C30033 : capacity bars ==========
    {
      await setView(page, 'Week'); await page.waitForTimeout(1500);
      const bars = await ev(page, ({ v }) => { const vis = eval(v);
        const bs = [...document.querySelectorAll('[data-test-id="capacity_bar"]')].filter(vis);
        return bs.slice(0, 8).map(b => {
          const kids = [...b.querySelectorAll('*')].map(k => { const s = getComputedStyle(k);
            return { w: k.getBoundingClientRect().width, bg: s.backgroundColor, cls: (k.className||'').toString().slice(0,50) }; });
          return { outer: b.getBoundingClientRect().width, title: b.getAttribute('title'), aria: b.getAttribute('aria-label'), kids: kids.slice(0,4) };
        }); });
      const ot = await ev(page, ({ v }) => { const vis = eval(v);
        const t = [...document.querySelectorAll('[data-test-id="text_schedule_header_overtime"]')].filter(vis);
        return t.map(e => ({ txt: (e.innerText||'').trim(), color: getComputedStyle(e).color })); });
      record(30030, [
        { step: '1 look at a technician row with shifts on it', seen: `${bars.length} capacity bars read` },
        { step: '2 read the bar fill against the track', seen: JSON.stringify(bars.slice(0,3)) },
      ], bars.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no capacity bar rendered');
      record(30032, [
        { step: '1 find a technician booked past their own daily hours', seen: `${ot.length} 'OT' tag(s) present in the grid` },
        { step: "2 read the tag", seen: JSON.stringify(ot) },
      ], ot.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no OT tag present in this range');
      // C30033 hover a capacity bar
      const hov = await ev(page, ({ v }) => { const vis = eval(v);
        const b = [...document.querySelectorAll('[data-test-id="capacity_bar"]')].filter(vis)[0];
        if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width/2, y: r.y + r.height/2 }; });
      let tip = [];
      if (hov) { await page.mouse.move(hov.x, hov.y); await page.waitForTimeout(2200); tip = await pops(page); }
      record(30033, [
        { step: '1 hover the capacity bar', seen: hov ? `hovered at ${Math.round(hov.x)},${Math.round(hov.y)}` : 'no capacity bar to hover' },
        { step: '2 read what appears', seen: tip.length ? JSON.stringify(tip) : 'no tooltip appeared' },
      ], (hov && tip.length) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await page.mouse.move(5, 5);
      record(30031, [
        { step: '1 look for a technician booked over capacity', seen: `OT tags present: ${ot.length}` },
        { step: '2 read the bar for the amber overflow past the track', seen: JSON.stringify(bars.slice(0,2)) },
      ], 'PARTIAL - needs a row proven over capacity; recorded what the bars actually render');
    }

    fs.writeFileSync(`${OUT}/b1-meta.json`, JSON.stringify({
      build_read: 'v3.5-65d6500', non_get_calls: nonGet(), bridge_errors: h.bridgeErrors,
      api_4xx: h.apiLog.filter(a => a.s >= 400), at: new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(nonGet()));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
  } catch (e) { console.log('FATAL', String(e).slice(0, 500)); }
  await h.browser.close();
})();
