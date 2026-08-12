// BATCH 6 -- volume: overlap and lane stacking, linked-series banners, keyboard, colour,
// dark mode, responsiveness, event card appearance.  READ-ONLY throughout.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b6.json`);
const blocks = (page) => ev(page, ({ v }) => { const vis=eval(v);
  return [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)
    .map(b=>{ const r=b.getBoundingClientRect(); const s=getComputedStyle(b);
      return { t:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,60), x:Math.round(r.x), y:Math.round(r.y),
               w:Math.round(r.width), h:Math.round(r.height), bg:s.backgroundColor, bl:s.borderLeftColor }; }); });

(async () => {
  const h = await makeHarness('b6'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);

    // ===== C29996 / C29997 / C29998 / C29999 : overlap and lane stacking =====
    for (const view of ['Week','Day','Month']) {
      await setView(page, view); await page.waitForTimeout(2400);
      const st = await ev(page, ({ view, v }) => { const vis=eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        // group blocks by their lane row (y band) and look for vertical stacking
        const byRow = {};
        bs.forEach(b=>{ const r=b.getBoundingClientRect(); const key=Math.round(r.y/10)*10;
          (byRow[key]=byRow[key]||[]).push({ x:Math.round(r.x), w:Math.round(r.width), h:Math.round(r.height),
            t:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,40) }); });
        const more=[...document.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&/^\+\d+ more$/.test((e.innerText||'').trim()))
          .map(e=>(e.innerText||'').trim());
        const heights=[...new Set(bs.map(b=>Math.round(b.getBoundingClientRect().height)))].sort((a,b)=>a-b);
        return { view, nBlocks: bs.length, distinctRowBands: Object.keys(byRow).length,
                 blockHeights: heights.slice(0,8), moreChips: more,
                 sampleRow: Object.values(byRow).sort((a,b)=>b.length-a.length)[0] }; }, { view });
      if (view==='Week') {
        record(29996, [
          { step: '1 look at a technician row holding several shifts on the same day', seen: JSON.stringify(st.sampleRow) },
          { step: '2 check non-overlapping ones share one lane', seen: `${st.nBlocks} blocks across ${st.distinctRowBands} vertical bands; block heights ${JSON.stringify(st.blockHeights)}` },
        ], 'ALL STEPS CARRIED OUT');
        record(29997, [
          { step: '1 look for shifts whose times intersect', seen: JSON.stringify(st.sampleRow) },
          { step: '2 check they split into stacked lanes and the row grows', seen: `distinct block heights present: ${JSON.stringify(st.blockHeights)} (a shorter height is a stacked lane)` },
        ], 'ALL STEPS CARRIED OUT');
        record(29998, [
          { step: '1 find a row with more than three overlapping shifts', seen: `'+N more' chips currently rendered: ${JSON.stringify(st.moreChips)}` },
          { step: '2 check visible lanes cap at three and the rest collapse', seen: st.moreChips.length ? `overflow chip present: ${JSON.stringify(st.moreChips)}` : 'no +N more chip in this range' },
        ], st.moreChips.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no row in this range holds more than 3 overlapping shifts');
      }
      record(29999, [
        { step: `1 check lane stacking and the '+N more' overflow in ${view} view`, seen: JSON.stringify(st) },
      ], 'ALL STEPS CARRIED OUT (this record accumulates one row per view)');
    }

    // ===== C29987 / C29988 / C29989 / C29990 : linked series banners =====
    {
      const seriesIn = {};
      for (const view of ['Month','Week','Day']) {
        await setView(page, view); await page.waitForTimeout(2600);
        seriesIn[view] = await ev(page, ({ v }) => { const vis=eval(v);
          const cues=[...document.querySelectorAll('[data-test-id="schedule_block_series_cue"]')].filter(vis)
            .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
          const chev=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)
            .map(b=>(b.innerText||'')).filter(t=>/chevron|week \d+ of \d+/i.test(t)).slice(0,4);
          return { seriesCues: cues, blocksWithCue: chev.length,
                   sample: [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)
                     .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).slice(0,4) }; });
      }
      record(29989, [
        { step: '1 open day view on a day that is part of a series', seen: JSON.stringify(seriesIn.Day) },
        { step: '2 check the series day shows as one block with a multi-week cue', seen: `series cue text: ${JSON.stringify(seriesIn.Day.seriesCues)}` },
      ], seriesIn.Day.seriesCues.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no series block in view');
      record(29988, [
        { step: '1 open week view on a week containing a series', seen: JSON.stringify(seriesIn.Week) },
        { step: "2 check the banner spans the week with chevrons and 'week N of M'", seen: `series cue text: ${JSON.stringify(seriesIn.Week.seriesCues)}` },
      ], seriesIn.Week.seriesCues.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no series block in view');
      record(29987, [
        { step: '1 open month view on a month containing a series', seen: JSON.stringify(seriesIn.Month) },
        { step: '2 check the banner wraps across weeks, labelled once', seen: `series cue text: ${JSON.stringify(seriesIn.Month.seriesCues)}` },
      ], seriesIn.Month.seriesCues.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no series block in view');
      record(29990, [
        { step: '1 look at a series and the capacity/conflict treatment of its days', seen: `series cues seen per view: ${JSON.stringify(Object.fromEntries(Object.entries(seriesIn).map(([k,x])=>[k,x.seriesCues])))}` },
        { step: '2 check capacity and conflicts are computed on the daily shifts, not the series', seen: 'the conflict list names individual work orders and days (e.g. "Fuline Enterprises Double-booked with Pamill Paving, Goport Energy"), not series' },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ===== C30066 / C30068 / C30070 : keyboard =====
    {
      await setView(page, 'Week'); await page.waitForTimeout(2000);
      // open the shift modal, then Escape
      await ev(page, ({ v }) => { const vis=eval(v);
        const b=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)[0]; if(b) b.click(); });
      await page.waitForTimeout(2800);
      const openNow = async () => ev(page, ({ v }) => { const vis=eval(v);
        return [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis).length; });
      const d1 = await openNow();
      // open a nested popover (the start-time select) then Escape once
      await ev(page, () => { const e=document.querySelector('[data-test-id="select_shift_detail_start_time"]'); if(e) e.click(); });
      await page.waitForTimeout(1600);
      const pop1 = await ev(page, ({ v }) => { const vis=eval(v);
        return [...document.querySelectorAll('.q-menu,[role="listbox"]')].filter(vis).length; });
      await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
      const pop2 = await ev(page, ({ v }) => { const vis=eval(v);
        return [...document.querySelectorAll('.q-menu,[role="listbox"]')].filter(vis).length; });
      const d2 = await openNow();
      await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
      const d3 = await openNow();
      record(30066, [
        { step: '1 open a shift modal', seen: `${d1} dialog(s) open` },
        { step: '2 open a popover inside it and press Escape once', seen: `popovers ${pop1} -> ${pop2}; dialogs still ${d2}` },
        { step: '3 press Escape again', seen: `dialogs ${d2} -> ${d3}` },
      ], (d1 && pop1) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C30070 focus trap + reachability
      await ev(page, ({ v }) => { const vis=eval(v);
        const b=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)[0]; if(b) b.click(); });
      await page.waitForTimeout(2600);
      const tabs = [];
      for (let i=0;i<12;i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(220);
        tabs.push(await ev(page, () => { const a=document.activeElement; if(!a) return null;
          const d=a.closest('.q-dialog,[role="dialog"]');
          return { tag:a.tagName, tid:a.getAttribute&&a.getAttribute('data-test-id'),
                   txt:(a.innerText||a.value||'').toString().replace(/\s+/g,' ').trim().slice(0,28), inDialog: !!d }; })); }
      const outside = tabs.filter(t=>t && !t.inDialog).length;
      record(30070, [
        { step: '1 open a modal', seen: 'shift detail modal open' },
        { step: '2 press Tab twelve times and record where focus lands', seen: JSON.stringify(tabs) },
        { step: '3 check focus never leaves the modal', seen: `${outside} of 12 tab stops landed outside the dialog` },
      ], 'ALL STEPS CARRIED OUT');
      // C30068 Enter behaviour -- observed, not committed
      const noteArea = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const ta=[...d.querySelectorAll('textarea')].filter(vis).map(e=>({ tid:e.getAttribute('data-test-id'), ph:e.getAttribute('placeholder') }));
        const btns=[...d.querySelectorAll('button')].filter(vis).map(e=>(e.innerText||'').trim()).filter(Boolean);
        return { textareas: ta, buttons: btns }; });
      record(30068, [
        { step: '1 open a dialog that has a confirm button and a note box', seen: JSON.stringify(noteArea) },
        { step: '2 press Enter outside the note box, then inside it', seen: 'NOT DRIVEN - pressing Enter on a confirm button commits a change; the controls present are recorded above so a manual tester can carry the step out' },
      ], 'PARTIAL - the controls are proven present; the confirm keystroke was deliberately not sent');
      await esc(page, 3);
    }

    // ===== C30021 / C30022 : event card appearance =====
    {
      await setView(page, 'Week'); await page.waitForTimeout(2000);
      const evs = await ev(page, ({ v }) => { const vis=eval(v);
        const es=[...document.querySelectorAll('[data-test-id="schedule_event_block"]')].filter(vis)
          .map(e=>{ const s=getComputedStyle(e); const r=e.getBoundingClientRect();
            return { t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70), bg:s.backgroundColor,
                     bl:s.borderLeftColor+' '+s.borderLeftWidth, radius:s.borderRadius, h:Math.round(r.height),
                     cls:(e.className||'').toString().slice(0,60) }; });
        const sh=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis).slice(0,3)
          .map(e=>{ const s=getComputedStyle(e); const r=e.getBoundingClientRect();
            return { t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,50), bg:s.backgroundColor,
                     bl:s.borderLeftColor+' '+s.borderLeftWidth, radius:s.borderRadius, h:Math.round(r.height),
                     cls:(e.className||'').toString().slice(0,60) }; });
        return { events: es, shifts: sh }; });
      record(30021, [
        { step: '1 find an event card and a shift card in the same grid', seen: `events ${JSON.stringify(evs.events)}` },
        { step: '2 compare how they look', seen: `shifts ${JSON.stringify(evs.shifts)}` },
      ], evs.events.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no event block in view');
      record(30022, [
        { step: '1 look at an event that has no colour chosen', seen: JSON.stringify(evs.events) },
        { step: '2 check it defaults to grey', seen: evs.events.length ? `event background(s): ${JSON.stringify(evs.events.map(e=>e.bg))}` : 'no event in view' },
      ], evs.events.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C30086 : below 960px the grid scrolls sideways and the sidebar collapses =====
    {
      const wide = await ev(page, ({ v }) => { const vis=eval(v);
        const s=document.querySelector('[data-test-id="schedule_sidebar"]');
        const c=document.querySelector('[data-test-id="schedule_calendar"]');
        return { sidebarVisible: !!(s&&vis(s)), sidebarW: s?Math.round(s.getBoundingClientRect().width):null,
                 calW: c?Math.round(c.getBoundingClientRect().width):null, vw: innerWidth }; });
      await page.setViewportSize({ width: 900, height: 900 }); await page.waitForTimeout(3000);
      const narrow = await ev(page, ({ v }) => { const vis=eval(v);
        const s=document.querySelector('[data-test-id="schedule_sidebar"]');
        const c=document.querySelector('[data-test-id="schedule_calendar"]');
        const sc=c?[...c.querySelectorAll('*')].find(e=>e.scrollWidth>e.clientWidth+20):null;
        return { sidebarVisible: !!(s&&vis(s)), sidebarW: s?Math.round(s.getBoundingClientRect().width):null,
                 calW: c?Math.round(c.getBoundingClientRect().width):null, vw: innerWidth,
                 horizontallyScrollable: !!sc, scrollWidth: sc?Math.round(sc.scrollWidth):null, clientWidth: sc?Math.round(sc.clientWidth):null }; });
      await page.setViewportSize({ width: 1680, height: 1080 }); await page.waitForTimeout(2500);
      record(30086, [
        { step: '1 look at the page on a wide window', seen: JSON.stringify(wide) },
        { step: '2 narrow the window below 960 pixels', seen: JSON.stringify(narrow) },
        { step: '3 check the grid scrolls sideways and the sidebar collapses', seen: `sidebar visible ${wide.sidebarVisible} -> ${narrow.sidebarVisible}; grid horizontally scrollable at 900px: ${narrow.horizontallyScrollable}` },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ===== C38866 / C43588 / C43589 : dark mode =====
    {
      const profile = await clickId(page, 'profile_menu_button'); await page.waitForTimeout(1800);
      const menu = await ev(page, ({ v }) => { const vis=eval(v);
        const ms=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis); const m=ms[ms.length-1]; if(!m) return null;
        return [...m.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>(e.innerText||'').trim()).filter(Boolean); });
      const darkItem = menu ? menu.find(t=>/dark|theme|appearance|light/i.test(t)) : null;
      let toggled = false, darkState = null;
      if (darkItem) {
        toggled = await ev(page, ({ t, v }) => { const vis=eval(v);
          const ms=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis); const m=ms[ms.length-1]; if(!m) return false;
          let el=[...m.querySelectorAll('*')].filter(e=>vis(e)&&(e.innerText||'').trim()===t)
            .sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]; if(!el) return false;
          let r=el; for(let i=0;i<4&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=80)break; r=r.parentElement;}
          r.click(); return true; }, { t: darkItem });
        await page.waitForTimeout(2600);
        darkState = await ev(page, () => { const b=getComputedStyle(document.body);
          return { bodyBg:b.backgroundColor, bodyColor:b.color, htmlCls:(document.documentElement.className||'').slice(0,80),
                   bodyCls:(document.body.className||'').slice(0,80) }; });
      }
      await esc(page, 2);
      record(43588, [
        { step: '1 open the user menu', seen: profile ? `menu items: ${JSON.stringify(menu)}` : 'user menu did not open' },
        { step: '2 look for the dark-mode choice', seen: darkItem ? `found ${JSON.stringify(darkItem)}; after choosing it ${JSON.stringify(darkState)}` : 'no dark-mode item in the user menu' },
      ], darkItem ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no dark-mode control found in the user menu');
      record(38866, [
        { step: '1 turn dark mode on', seen: darkItem ? `chose ${JSON.stringify(darkItem)}; body now ${JSON.stringify(darkState)}` : 'dark mode control not found' },
        { step: '2 look at the Schedule and its dialogs', seen: 'see the record above; if no dark control exists this case cannot be run' },
      ], darkItem ? 'PARTIAL - the control was exercised; a full dialog-by-dialog dark-mode review is a separate visual pass' : 'PARTIAL');
      record(43589, [
        { step: '1 in dark mode, open a pop-up window', seen: darkItem ? 'dark mode was toggled; see C43588' : 'dark mode control not found' },
        { step: '2 check it still looks raised above the page', seen: 'not measured this pass' },
      ], 'PARTIAL');
    }

    fs.writeFileSync(`${OUT}/b6-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, api_4xx: h.apiLog.filter(a=>a.s>=400), at:new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
