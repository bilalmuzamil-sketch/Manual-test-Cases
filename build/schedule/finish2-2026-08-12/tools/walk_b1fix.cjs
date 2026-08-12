// Re-drives the four batch-1 results whose CHECK was faulty, not whose answer was.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b1.json`);
(async () => {
  const h = await makeHarness('b1f'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);

    // -- why did the now-marker visibility check fail?  measure it properly.
    const now = await ev(page, () => {
      const t = document.querySelector('[data-test-id="text_schedule_now_time"]');
      if (!t) return { found: false };
      const r = t.getBoundingClientRect(); const s = getComputedStyle(t);
      // the LINE itself: look for a sibling/ancestor element that spans the grid
      const host = t.closest('[class*="now"],[class*="current"]') || t.parentElement;
      const hr = host ? host.getBoundingClientRect() : null; const hs = host ? getComputedStyle(host) : null;
      return { found: true, text: (t.innerText||'').trim(),
        rect: { w: r.width, h: r.height, x: Math.round(r.x), y: Math.round(r.y) },
        display: s.display, visibility: s.visibility, opacity: s.opacity, color: s.color,
        hostClass: host ? (host.className||'').toString().slice(0,80) : null,
        hostRect: hr ? { w: Math.round(hr.width), h: Math.round(hr.height), x: Math.round(hr.x), y: Math.round(hr.y) } : null,
        hostBg: hs ? hs.backgroundColor : null, hostBorder: hs ? hs.borderTopColor + ' ' + hs.borderTopWidth : null };
    });
    record(30006, [
      { step: '1 open day view for today', seen: `range ${JSON.stringify(await range(page))}` },
      { step: '2 look for the current-time marker and its label', seen: JSON.stringify(now) },
    ], now.found && now.text ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

    // -- C30001 : is the timeline scrolled to the working-day start?  read the FIRST hour label actually in view.
    {
      const s = await ev(page, () => {
        const c = document.querySelector('[data-test-id="schedule_calendar"]'); if (!c) return null;
        const cr = c.getBoundingClientRect();
        const labels = [...c.querySelectorAll('*')].filter(e => /^\d{1,2} (AM|PM)$/.test((e.innerText||'').trim()) && e.children.length === 0);
        const inView = labels.filter(e => { const r = e.getBoundingClientRect(); return r.left >= cr.left - 2 && r.right <= cr.right + 2 && r.width > 0; });
        const all = labels.map(e => (e.innerText||'').trim());
        // find the horizontal scroller
        let sc = null, node = c;
        const cand = [...c.querySelectorAll('*')].find(e => e.scrollWidth > e.clientWidth + 20);
        sc = cand || c;
        return { firstInView: inView.slice(0,4).map(e=>(e.innerText||'').trim()), totalLabels: all.length,
          allFirst6: all.slice(0,6), scrollLeft: sc.scrollLeft, scrollWidth: sc.scrollWidth, clientWidth: sc.clientWidth,
          scCls: (sc.className||'').toString().slice(0,60) };
      });
      record(30001, [
        { step: '1 open day view', seen: `range ${JSON.stringify(await range(page))}` },
        { step: '2 note which hour the timeline is showing at its left edge on arrival', seen: JSON.stringify(s) },
      ], s ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // -- C30032 : where does the OT tag live?  read it in the view it appears in.
    {
      const res = {};
      for (const view of ['Day','Week','Month']) {
        await setView(page, view); await page.waitForTimeout(2000);
        res[view] = await ev(page, ({ v }) => { const vis = eval(v);
          const t = [...document.querySelectorAll('[data-test-id="text_schedule_header_overtime"]')];
          return t.map(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
            return { txt: (e.innerText||'').trim(), color: s.color, w: Math.round(r.width), h: Math.round(r.height), visible: vis(e) }; }); });
      }
      const any = Object.values(res).some(a => a.length);
      record(30032, [
        { step: '1 find a technician booked past their own daily hours', seen: `the capacity tooltip for Mon Jul 27 reads "1 tech in overtime · +6.2h" and "Mudassir 15.2h / 9h · +6.2h", so an over-hours technician exists` },
        { step: "2 look for the 'OT' text tag in each view", seen: JSON.stringify(res) },
      ], any ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // -- C30041 : the TOOLBAR search, addressed by its own test id this time.
    {
      await setView(page, 'Week');
      const opened = await clickId(page, 'button_schedule_search_toggle'); await page.waitForTimeout(1400);
      const baseline = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis).length; });
      const trials = [];
      for (const [what, term] of [['customer','Pamill'],['work order number','12876'],['unit','713'],['technician','Larry'],['line name','ramp'],['nonsense control','zzzxq999']]) {
        const typed = await ev(page, ({ term }) => {
          const el = document.querySelector('[data-test-id="input_schedule_search"]');
          if (!el) return false;
          const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
          set.call(el, term); el.dispatchEvent(new Event('input',{bubbles:true})); return true; }, { term });
        await page.waitForTimeout(2400);
        const st = await ev(page, ({ v }) => { const vis = eval(v);
          const bs = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
          return { n: bs.length, first: bs.slice(0,2).map(b => (b.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)) }; });
        trials.push(`${what} "${term}" -> ${st.n}${typed ? '' : ' (INPUT NOT FOUND)'} ${JSON.stringify(st.first)}`);
      }
      await ev(page, () => { const el = document.querySelector('[data-test-id="input_schedule_search"]');
        if (el) { const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
          set.call(el,''); el.dispatchEvent(new Event('input',{bubbles:true})); } });
      await page.waitForTimeout(1800);
      const restored = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis).length; });
      record(30041, [
        { step: '1 open the toolbar search (its own field, data-test-id input_schedule_search)', seen: opened ? `opened; baseline ${baseline} shift blocks in view` : 'toggle not found' },
        { step: '2 type a term of each kind and watch the grid', seen: trials.join(' | ') },
        { step: '3 clear the search', seen: `back to ${restored} blocks` },
      ], opened ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }
    fs.writeFileSync(`${OUT}/b1fix-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'), bridge: h.bridgeErrors, at:new Date().toISOString() },null,1));
    console.log('\nNON-GET:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  } catch (e) { console.log('FATAL', String(e).slice(0,500)); }
  await h.browser.close();
})();
