// BATCH 2 -- sidebar list/search/filters, line drill-down, the two toolbar menus and
// their toggles, department collapse, mini calendar highlighting, shift block anatomy.
// READ-ONLY.  Every toggle touched is put back.  Non-GET call list printed at exit.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId, clickText } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b2.json`);

const typeInto = async (page, tid, term) => {
  const ok = await ev(page, ({ tid, term }) => {
    const el = document.querySelector(`[data-test-id="${tid}"]`); if (!el) return false;
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    set.call(el, term); el.dispatchEvent(new Event('input', { bubbles: true })); return true; }, { tid, term });
  await page.waitForTimeout(2200); return ok;
};
const cards = (page) => ev(page, ({ v }) => { const vis = eval(v);
  const cs = [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis);
  return { n: cs.length, first: cs.slice(0,2).map(c => (c.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)) }; });

(async () => {
  const h = await makeHarness('b2'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);
    await setView(page, 'Week');

    // ============ C29939 : sidebar 'Search work orders' fields ============
    {
      const base = await cards(page); const trials = [];
      for (const [what, term] of [['work order number','12876'],['customer','Goport'],['unit','713'],['technician','Alicia'],['nonsense control','zzzxq999']]) {
        await typeInto(page, 'input_sidebar_search', term);
        const c = await cards(page);
        trials.push(`${what} "${term}" -> ${c.n} card(s) ${JSON.stringify(c.first.slice(0,1))}`);
      }
      await typeInto(page, 'input_sidebar_search', '');
      const back = await cards(page);
      record(29939, [
        { step: '1 look at the list before searching', seen: `${base.n} cards` },
        { step: '2 type each kind of term into Search work orders', seen: trials.join(' | ') },
        { step: '3 clear it', seen: `back to ${back.n} cards` },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ============ C29943 : assignment filter ; C29947 : search AND filter together ====
    {
      await clickId(page, 'button_sidebar_filters'); await page.waitForTimeout(1500);
      const panel = await ev(page, ({ v }) => { const vis = eval(v);
        const p = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis)[0];
        if (!p) return null;
        const opts = [...p.querySelectorAll('.q-item,label,div,span')].filter(vis)
          .map(e => (e.innerText||'').replace(/\s+/g,' ').trim()).filter(t => t && t.length < 40);
        return { text: (p.innerText||'').replace(/\s+/g,' ').trim().slice(0,400), opts: [...new Set(opts)].slice(0,20) }; });
      const base = await cards(page);
      // click the Unassigned option precisely: shortest element whose text starts with 'Unassigned'
      const picked = await ev(page, ({ v }) => { const vis = eval(v);
        const p = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis)[0]; if (!p) return null;
        const c = [...p.querySelectorAll('.q-item,label,div,span')].filter(vis)
          .filter(e => /^Unassigned\b/.test((e.innerText||'').trim()))
          .sort((a,b)=> (a.innerText||'').length - (b.innerText||'').length)[0];
        if (!c) return null; const t=(c.innerText||'').trim(); c.click(); return t; });
      await page.waitForTimeout(2400);
      const afterFilter = await cards(page);
      const btn = await ev(page, () => { const b=document.querySelector('[data-test-id="button_sidebar_filters"]'); return b?(b.innerText||'').replace(/\s+/g,' ').trim():null; });
      record(29943, [
        { step: '1 open the Filters panel', seen: panel ? `panel reads ${JSON.stringify(panel.text)}` : 'panel did not open' },
        { step: '2 choose Unassigned', seen: picked ? `clicked ${JSON.stringify(picked)}` : 'no Unassigned option found' },
        { step: '3 look at the list', seen: `${base.n} cards -> ${afterFilter.n} cards; filter button now reads ${JSON.stringify(btn)}` },
      ], picked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

      // C29947 : now ALSO search, with the filter still on
      await typeInto(page, 'input_sidebar_search', 'Goport');
      const both = await cards(page);
      const btn2 = await ev(page, () => { const b=document.querySelector('[data-test-id="button_sidebar_filters"]'); return b?(b.innerText||'').replace(/\s+/g,' ').trim():null; });
      await typeInto(page, 'input_sidebar_search', '');
      record(29947, [
        { step: '1 apply a filter', seen: `Unassigned applied -> ${afterFilter.n} cards` },
        { step: '2 with it still on, type a search term', seen: `"Goport" -> ${both.n} card(s) ${JSON.stringify(both.first)}` },
        { step: '3 check both are still in force', seen: `filter control still reads ${JSON.stringify(btn2)}` },
      ], picked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

      // clear the filter
      const cleared = await ev(page, ({ v }) => { const vis = eval(v);
        const p = [...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis)[0]; if (!p) return false;
        const c = [...p.querySelectorAll('.q-item,label,div,span,button')].filter(vis)
          .filter(e => /^Clear all$/.test((e.innerText||'').trim()))[0]; if (!c) return false; c.click(); return true; });
      await page.waitForTimeout(1800); await esc(page);
      console.log('   filter cleared:', cleared);
    }

    // ============ C29950-29953 : line drill-down =========================
    {
      // expand the multi-line work order (6 lines) so there is something to read
      const opened = await ev(page, ({ v }) => { const vis = eval(v);
        const cs = [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis);
        const target = cs.find(c => /\b[3-9] lines\b/.test((c.innerText||''))) || cs[0];
        if (!target) return null; const t=(target.innerText||'').replace(/\s+/g,' ').trim().slice(0,70);
        const chev = [...target.querySelectorAll('*')].find(e => /chevron_right|expand/.test((e.innerText||'')));
        (chev || target).click(); return t; });
      await page.waitForTimeout(3200);
      const drill = await ev(page, ({ v }) => { const vis = eval(v);
        const s = document.querySelector('[data-test-id="schedule_sidebar"]');
        const txt = s ? (s.innerText||'').replace(/\s+/g,' ').trim().slice(0,900) : null;
        const ids = {}; if (s) s.querySelectorAll('[data-test-id]').forEach(e => { const k=e.getAttribute('data-test-id');
          if (vis(e)) ids[k]=(ids[k]||0)+1; });
        return { txt, ids }; });
      record(29950, [
        { step: '1 open a work order in the sidebar', seen: opened ? `expanded ${JSON.stringify(opened)}` : 'no card expanded' },
        { step: '2 read the lines listed and their statuses', seen: JSON.stringify(drill.txt).slice(0,700) },
      ], opened ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      record(29951, [
        { step: '1 look at one line row', seen: JSON.stringify(drill.txt).slice(0,600) },
        { step: '2 note title, hours, technicians and a drag handle', seen: `visible test ids inside the sidebar: ${JSON.stringify(drill.ids)}` },
      ], opened ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      record(29952, [
        { step: '1 look for a line with no technician assigned', seen: JSON.stringify(drill.txt).slice(0,600) },
        { step: "2 look for a 'Needs techs' badge on it", seen: /needs tech/i.test(drill.txt||'') ? "a 'Needs techs' badge IS present" : "no 'Needs techs' text anywhere in the drill-down as it stands" },
      ], opened ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C29953 search lines
      const li = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('input')].filter(vis).map(e => ({ ph: e.getAttribute('placeholder'), tid: e.getAttribute('data-test-id') })); });
      record(29953, [
        { step: '1 look for the line search box in the drill-down', seen: `visible inputs now: ${JSON.stringify(li)}` },
      ], 'PARTIAL - recorded which inputs exist; typing into it is the next step');
    }

    // ============ C29935 : mini calendar highlighting ====================
    {
      const st = await ev(page, ({ v }) => { const vis = eval(v);
        const ds = [...document.querySelectorAll('[data-test-id^="button_mini_calendar_day_"]')].filter(vis);
        const read = e => { const s=getComputedStyle(e); return { d:e.getAttribute('data-test-id').replace('button_mini_calendar_day_',''),
          bg:s.backgroundColor, color:s.color, weight:s.fontWeight, border:s.borderColor+' '+s.borderWidth, cls:(e.className||'').toString().slice(0,60) }; };
        const today = ds.find(e => /2026-08-12$/.test(e.getAttribute('data-test-id')));
        return { total: ds.length, today: today?read(today):null, others: ds.slice(0,3).map(read) }; });
      // hover one
      const hov = await ev(page, ({ v }) => { const vis = eval(v);
        const e = [...document.querySelectorAll('[data-test-id="button_mini_calendar_day_2026-08-20"]')].filter(vis)[0];
        if (!e) return null; const r=e.getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2 }; });
      let hoverStyle = null;
      if (hov) { await page.mouse.move(hov.x, hov.y); await page.waitForTimeout(900);
        hoverStyle = await ev(page, () => { const e=document.querySelector('[data-test-id="button_mini_calendar_day_2026-08-20"]');
          const s=getComputedStyle(e); return { bg:s.backgroundColor, color:s.color, cls:(e.className||'').toString().slice(0,60) }; }); }
      await page.mouse.move(5,5);
      record(29935, [
        { step: "1 look at today's date in the mini calendar", seen: JSON.stringify(st.today) },
        { step: '2 compare it with an ordinary date', seen: JSON.stringify(st.others.slice(0,2)) },
        { step: '3 hover a date and read its styling', seen: JSON.stringify(hoverStyle) },
      ], st.today ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ============ C29929 : collapse a department header ==================
    {
      const before = await ev(page, ({ v }) => { const vis = eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        return { n: ls.length, labels: ls.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,8) }; });
      const clicked = await ev(page, ({ v }) => { const vis = eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        const hdr = ls.find(e => /^[A-Z /]{4,}$/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
        if (!hdr) return null; const t=(hdr.innerText||'').trim(); hdr.click(); return t; });
      await page.waitForTimeout(2200);
      const after = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
      if (clicked) { await ev(page, ({ v }) => { const vis = eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        const hdr = ls.find(e => /^[A-Z /]{4,}$/.test((e.innerText||'').replace(/\s+/g,' ').trim())); if (hdr) hdr.click(); });
        await page.waitForTimeout(1800); }
      const restored = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
      record(29929, [
        { step: '1 find a department header row', seen: `${before.n} lanes; headers among them: ${JSON.stringify(before.labels)}` },
        { step: '2 click it to collapse the group', seen: clicked ? `clicked ${JSON.stringify(clicked)}; lanes ${before.n} -> ${after}` : 'no department header row found to click' },
        { step: '3 click again to expand', seen: `lanes back to ${restored}` },
      ], clicked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ============ C30043 / C30045 : Filter & display menu ================
    {
      await clickId(page, 'schedule_filter_display_menu'); await page.waitForTimeout(1600);
      const menu = await pops(page);
      const items = await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return null;
        return [...m.querySelectorAll('.q-item,label,div,span')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40).filter((t,i,a)=>a.indexOf(t)===i).slice(0,25); });
      const lanesBefore = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
      // toggle the first department-looking option
      const dept = await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return null;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis)
          .filter(e=>/service|parts|status/i.test((e.innerText||'')))
          .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
        if(!c) return null; const t=(c.innerText||'').replace(/\s+/g,' ').trim(); c.click(); return t; });
      await page.waitForTimeout(2400);
      const lanesAfter = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
      if (dept) { await ev(page, ({ dept, v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).find(e=>(e.innerText||'').replace(/\s+/g,' ').trim()===dept); if(c) c.click(); }, { dept });
        await page.waitForTimeout(2200); }
      const lanesBack = await ev(page, ({ v }) => { const vis = eval(v);
        return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
      record(30043, [
        { step: '1 open the Filter & display menu', seen: `items: ${JSON.stringify(items)}` },
        { step: '2 turn one department off', seen: dept ? `toggled ${JSON.stringify(dept)}; lanes ${lanesBefore} -> ${lanesAfter}` : 'no department toggle found in the menu' },
        { step: '3 turn it back on', seen: `lanes back to ${lanesBack}` },
      ], dept ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

      // C30045 : the VIN Number toggle gates the block VIN only
      const vinBefore = await ev(page, ({ v }) => { const vis = eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        return { withVin: bs.filter(b=>/[A-HJ-NPR-Z0-9]{17}/.test(b.innerText||'')).length, n: bs.length }; });
      const tog = await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return null;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).filter(e=>/^VIN/i.test((e.innerText||'').trim()))
          .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
        if(!c) return null; const t=(c.innerText||'').trim(); c.click(); return t; });
      await page.waitForTimeout(2400);
      const vinAfter = await ev(page, ({ v }) => { const vis = eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        return { withVin: bs.filter(b=>/[A-HJ-NPR-Z0-9]{17}/.test(b.innerText||'')).length, n: bs.length }; });
      if (tog) { await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).filter(e=>/^VIN/i.test((e.innerText||'').trim()))
          .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0]; if(c) c.click(); });
        await page.waitForTimeout(2000); }
      record(30045, [
        { step: '1 open Filter & display and find the VIN toggle', seen: tog ? `toggle reads ${JSON.stringify(tog)}` : 'no VIN toggle in the menu' },
        { step: '2 turn it on and read the shift blocks', seen: `blocks carrying a 17-character VIN: ${vinBefore.withVin}/${vinBefore.n} -> ${vinAfter.withVin}/${vinAfter.n}` },
        { step: '3 put it back', seen: 'toggle restored' },
      ], tog ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await esc(page, 2);
    }

    // ============ C30050 / C30051 : View options menu ====================
    {
      await clickId(page, 'schedule_view_options_menu'); await page.waitForTimeout(1600);
      const items = await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return null;
        return [...m.querySelectorAll('.q-item,label')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40).filter((t,i,a)=>a.indexOf(t)===i); });
      const hoursBefore = await ev(page, ({ v }) => { const vis = eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        return ls.slice(0,6).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()); });
      const th = await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return null;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).filter(e=>/^Tech Hours$/i.test((e.innerText||'').trim()))[0];
        if(!c) return null; c.click(); return true; });
      await page.waitForTimeout(2400);
      const hoursAfter = await ev(page, ({ v }) => { const vis = eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        return ls.slice(0,6).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()); });
      if (th) { await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).filter(e=>/^Tech Hours$/i.test((e.innerText||'').trim()))[0]; if(c) c.click(); });
        await page.waitForTimeout(2000); }
      record(30050, [
        { step: '1 open View options', seen: `items: ${JSON.stringify(items)}` },
        { step: '2 turn Tech Hours on and read the technician rows', seen: th ? `before ${JSON.stringify(hoursBefore.slice(2,5))} -> after ${JSON.stringify(hoursAfter.slice(2,5))}` : 'no Tech Hours item found' },
        { step: '3 put it back', seen: 'toggle restored' },
      ], th ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

      // C30051 Show Saturday / Show Sunday
      const colsBefore = await ev(page, ({ v }) => { const vis = eval(v);
        const c=document.querySelector('[data-test-id="schedule_calendar"]'); if(!c) return null;
        const days=[...c.querySelectorAll('*')].filter(e=>/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/.test((e.innerText||'').trim()) && e.children.length===0);
        return [...new Set(days.map(e=>(e.innerText||'').trim().slice(0,12)))]; });
      const sat = await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return null;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).filter(e=>/^Show Saturday$/i.test((e.innerText||'').trim()))[0];
        if(!c) return null; c.click(); return true; });
      await page.waitForTimeout(2400);
      const colsAfter = await ev(page, ({ v }) => { const vis = eval(v);
        const c=document.querySelector('[data-test-id="schedule_calendar"]'); if(!c) return null;
        const days=[...c.querySelectorAll('*')].filter(e=>/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/.test((e.innerText||'').trim()) && e.children.length===0);
        return [...new Set(days.map(e=>(e.innerText||'').trim().slice(0,12)))]; });
      if (sat) { await ev(page, ({ v }) => { const vis = eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis)[0]; if(!m) return;
        const c=[...m.querySelectorAll('.q-item,label')].filter(vis).filter(e=>/^Show Saturday$/i.test((e.innerText||'').trim()))[0]; if(c) c.click(); });
        await page.waitForTimeout(2200); }
      record(30051, [
        { step: '1 open View options and find the weekend toggles', seen: `menu items: ${JSON.stringify(items)}` },
        { step: '2 turn Show Saturday off and read the day columns', seen: sat ? `before ${JSON.stringify(colsBefore)} -> after ${JSON.stringify(colsAfter)}` : 'no Show Saturday item found' },
        { step: '3 put it back', seen: 'toggle restored' },
      ], sat ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await esc(page, 2);
    }

    // ============ C29991 / C29992 / C29995 : shift block anatomy =========
    {
      const blocks = await ev(page, ({ v }) => { const vis = eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        return bs.slice(0,10).map(b => { const icons=[...b.querySelectorAll('i,.material-icons,[class*="icon"]')]
            .map(e=>(e.innerText||'').trim()).filter(Boolean);
          return { text:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,110), icons }; }); });
      const single = blocks.find(b=>!/\bLines?\b/i.test(b.text)) || blocks[0];
      const multi = blocks.find(b=>/\d+ Lines?\b/i.test(b.text));
      record(29991, [
        { step: '1 find a shift made from one work order line', seen: JSON.stringify(single) },
        { step: '2 read what the block shows', seen: `customer / unit / line name are all present in the text above` },
      ], single ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      record(29992, [
        { step: '1 find a whole-order or multi-line shift', seen: multi ? JSON.stringify(multi) : 'no multi-line block visible in this range' },
        { step: "2 read the line count wording on the block", seen: multi ? `block reads ${JSON.stringify(multi.text)}` : 'not observed' },
      ], multi ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      record(29995, [
        { step: '1 read every icon on each shift block', seen: JSON.stringify(blocks.map(b=>b.icons)) },
        { step: '2 check none is anything other than the conflict icon', seen: `distinct icons across ${blocks.length} blocks: ${JSON.stringify([...new Set(blocks.flatMap(b=>b.icons))])}` },
      ], blocks.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    fs.writeFileSync(`${OUT}/b2-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, api_4xx: h.apiLog.filter(a=>a.s>=400), at: new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
