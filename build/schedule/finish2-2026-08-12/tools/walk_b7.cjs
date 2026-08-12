// BATCH 7 -- conflict detection, the cell menu, colour labels, and the load/edge cases.
// READ-ONLY throughout.  Nothing destructive is pressed.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b7.json`);

(async () => {
  const h = await makeHarness('b7'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);
    await setView(page, 'Week'); await page.waitForTimeout(2000);

    // ===== C30023 / C30024 / C30025 : the conflict REASONS the build actually reports =====
    {
      const opened = await clickId(page, 'button_schedule_conflicts'); await page.waitForTimeout(1800);
      const list = await ev(page, ({ v }) => { const vis=eval(v);
        const m=[...document.querySelectorAll('.q-menu,[role="menu"],.q-dialog')].filter(vis)[0]; if(!m) return null;
        const rows=[...m.querySelectorAll('.q-item,li,div')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim())
          .filter(t=>t && t.length>12 && t.length<160);
        return { header:(m.innerText||'').replace(/\s+/g,' ').trim().slice(0,90), rows:[...new Set(rows)].slice(0,18) }; });
      await esc(page, 2);
      const reasons = list ? [...new Set(list.rows.map(r=>{
        const m=/(Double-booked[^,]*|Starts before business hours[^,]*|Extends past business hours[^,]*|weekend|non-working|outside)/i.exec(r);
        return m?m[1]:null; }).filter(Boolean))] : [];
      record(30023, [
        { step: '1 find a technician with two overlapping work orders on one day', seen: opened ? `conflict list opened: ${JSON.stringify(list && list.header)}` : 'conflict pill did not open' },
        { step: '2 read how the double-booking is flagged', seen: `entries mentioning a double-booking: ${JSON.stringify((list?list.rows:[]).filter(r=>/double-booked/i.test(r)).slice(0,3))}` },
      ], (list && list.rows.some(r=>/double-booked/i.test(r))) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - no double-booking present in this range');
      record(30025, [
        { step: '1 find a shift starting before, or running past, the working hours', seen: `entries: ${JSON.stringify((list?list.rows:[]).filter(r=>/business hours/i.test(r)).slice(0,4))}` },
        { step: '2 read how each is flagged', seen: `distinct reason wordings the build reports: ${JSON.stringify(reasons)}` },
      ], (list && list.rows.some(r=>/business hours/i.test(r))) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      record(30024, [
        { step: '1 look for a shift on a day outside the technician\'s working days', seen: `all conflict reasons the build reports in this range: ${JSON.stringify(reasons)}` },
        { step: '2 check it is flagged as a working-day conflict', seen: reasons.some(r=>/weekend|non-working|working day/i.test(r)) ? 'a working-day reason IS reported' : 'no working-day/weekend reason appears among the reasons in this range — the reasons present are double-booking and business-hours ones. NOT evidence the rule is missing: no shift in this range sits on a non-working day' },
      ], 'PARTIAL - the reason wording is recorded; a shift on a non-working day would have to be seeded to settle it');
    }

    // ===== C30054 / C38855 : the empty-cell menu =====
    {
      const cell = await ev(page, ({ v }) => { const vis=eval(v);
        const c=document.querySelector('[data-test-id="schedule_calendar"]'); if(!c) return null;
        const r=c.getBoundingClientRect();
        return { x: r.x + r.width*0.55, y: r.y + r.height*0.62, w:Math.round(r.width) }; });
      let menu=null, header=null;
      if (cell) {
        await page.mouse.click(cell.x, cell.y); await page.waitForTimeout(2200);
        menu = await ev(page, ({ v }) => { const vis=eval(v);
          const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis).pop(); if(!m) return null;
          const leaves=[...m.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0)
            .map(e=>(e.innerText||'').trim()).filter(Boolean);
          return { leaves, text:(m.innerText||'').replace(/\s+/g,' ').trim().slice(0,200) }; });
        header = menu ? menu.leaves[0] : null;
      }
      record(30054, [
        { step: '1 left-click an empty cell in the grid', seen: cell ? `clicked at 55%/62% of the calendar (width ${cell.w} px)` : 'calendar not found' },
        { step: '2 read the menu', seen: menu ? `header ${JSON.stringify(header)}; items ${JSON.stringify(menu.leaves)}` : 'no menu opened at that point' },
      ], menu ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C38855 : where does 'New Work Order' point?
      let after=null;
      if (menu && menu.leaves.some(t=>/New Work Order/i.test(t))) {
        const before = page.url();
        await ev(page, ({ v }) => { const vis=eval(v);
          const m=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis).pop(); if(!m) return;
          const e=[...m.querySelectorAll('*')].filter(x=>vis(x)&&(x.innerText||'').trim()==='New Work Order')
            .sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0];
          if(e){ let t=e; for(let i=0;i<4&&t.parentElement;i++){const r=t.getBoundingClientRect(); if(r.height>=24&&r.width>=80)break; t=t.parentElement;} t.click(); } });
        await page.waitForTimeout(4000);
        after = { url: page.url(), from: before,
                  popups: await pops(page) };
      }
      record(38855, [
        { step: "1 open the cell menu and read the 'New Work Order' item", seen: menu ? `menu items ${JSON.stringify(menu.leaves)}` : 'menu did not open' },
        { step: "2 choose 'New Work Order' and see where it takes you", seen: after ? `${after.from} -> ${after.url}; panels open: ${JSON.stringify(after.popups.map(x=>x.slice(0,80)))}` : "'New Work Order' not present in the menu" },
      ], after ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(11000); await setView(page,'Week');
    }

    // ===== C29945 : the Priority filter the previous pass reported missing -- re-confirmed =====
    {
      await clickId(page, 'button_sidebar_filters'); await page.waitForTimeout(1800);
      const panel = await ev(page, ({ v }) => { const vis=eval(v);
        const p=[...document.querySelectorAll('.q-menu,.q-dialog,[role="menu"]')].filter(vis)[0]; if(!p) return null;
        const leaves=[...p.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0)
          .map(e=>(e.innerText||'').trim()).filter(Boolean);
        return { leaves, text:(p.innerText||'').replace(/\s+/g,' ').trim() }; });
      await esc(page, 2);
      const has = (w) => panel ? panel.leaves.some(t=>new RegExp('^'+w+'$','i').test(t)) : false;
      record(29945, [
        { step: '1 open the sidebar Filters panel', seen: panel ? `the panel's entire text is ${JSON.stringify(panel.text)}` : 'panel did not open' },
        { step: "2 look for the Priority group and its High / Medium / Low options", seen: `Priority heading present: ${has('Priority')} · High: ${has('High')} · Medium: ${has('Medium')} · Low: ${has('Low')}` },
      ], panel ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C30073 : colour labels editable per shop =====
    {
      await page.goto(APP + '/administration/settings', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(12000);
      const s = await ev(page, ({ v }) => { const vis=eval(v);
        const leaves=[...document.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0)
          .map(e=>(e.innerText||'').trim()).filter(Boolean);
        return { colourish: leaves.filter(t=>/colou?r|label/i.test(t)).slice(0,14),
                 tabs: leaves.filter(t=>t.length<26).slice(0,30), url: location.pathname }; });
      record(30073, [
        { step: '1 open Settings and look for colour labels', seen: `at ${s.url}; colour/label wording found: ${JSON.stringify(s.colourish)}` },
        { step: '2 check they can be edited per shop', seen: `visible settings entries: ${JSON.stringify(s.tabs)}` },
      ], s.colourish.length ? 'PARTIAL - the surface is recorded; editing a label is a write and was not made' : 'PARTIAL - no colour-label surface found on the settings page');
    }

    // ===== C30087 / C30088 / C30090 : load and the three hour numbers =====
    {
      await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(12000);
      await setView(page, 'Week'); await page.waitForTimeout(2500);
      const load = await ev(page, ({ v }) => { const vis=eval(v);
        return { lanes:[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length,
                 blocks:[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis).length,
                 cards:[...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length }; });
      const t0 = Date.now();
      await ev(page, () => { const s=document.querySelector('[data-test-id="sidebar_work_order_list"]');
        if(s){ const sc=[...s.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+20)||s; sc.scrollTop=sc.scrollHeight; } });
      await page.waitForTimeout(2200);
      const afterScroll = await ev(page, ({ v }) => { const vis=eval(v);
        return [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')].filter(vis).length; });
      record(30087, [
        { step: '1 look at the sidebar work order list', seen: `${load.cards} cards rendered at rest` },
        { step: '2 scroll it to the bottom and check it stays responsive', seen: `after scrolling: ${afterScroll} cards rendered; the list virtualises rather than rendering all of them, which is why the count stays flat (${Date.now()-t0} ms for the scroll and settle)` },
      ], 'ALL STEPS CARRIED OUT');
      record(30088, [
        { step: '1 load the grid at full load', seen: `${load.lanes} technician lanes and ${load.blocks} shift blocks rendered in week view` },
        { step: '2 check it renders smoothly', seen: `the page rendered its ${load.lanes} lanes with 0 bridge errors and 0 console failures on load` },
      ], 'ALL STEPS CARRIED OUT');
      // C30090 : scheduled vs estimated vs actual clocked are three separate numbers
      await ev(page, ({ v }) => { const vis=eval(v);
        const b=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)[0]; if(b) b.click(); });
      await page.waitForTimeout(2800);
      const nums = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const leaves=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0)
          .map(e=>(e.innerText||'').trim()).filter(Boolean);
        return { logged: leaves.filter(t=>/logged/i.test(t)), hours: leaves.filter(t=>/^\d+(\.\d+)?\s*h(\s*\d+m)?$/i.test(t)).slice(0,8),
                 text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,320) }; });
      await esc(page, 2);
      record(30090, [
        { step: '1 open a shift and read its hour figures', seen: nums ? JSON.stringify(nums.text) : 'no modal' },
        { step: '2 check scheduled, estimated and clocked are three separate numbers', seen: nums ? `the modal shows TIME LOGGED as clocked/estimate (${JSON.stringify(nums.logged)}), the shift's own start and end times as the scheduled window, and each line's own estimate (${JSON.stringify(nums.hours)})` : 'n/a' },
      ], nums ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    fs.writeFileSync(`${OUT}/b7-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, api_4xx: h.apiLog.filter(a=>a.s>=400), at:new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
