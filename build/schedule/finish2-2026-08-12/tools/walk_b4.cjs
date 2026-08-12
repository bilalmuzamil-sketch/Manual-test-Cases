// BATCH 4 -- Working Hours Settings (C38847-C38851) and the precondition C30050 depends on:
// does ANY technician actually have configured working hours?
// READ-ONLY: no Save is pressed, no staff record is written.  Roles are never touched.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b4.json`);

(async () => {
  const h = await makeHarness('b4'); const page = h.page;
  try {
    // ---------- Settings -> Staff -> edit a technician ----------
    await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);
    const listed = await ev(page, ({ v }) => { const vis=eval(v);
      const rows=[...document.querySelectorAll('tr,[role="row"]')].filter(vis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length>8);
      return { n: rows.length, sample: rows.slice(0,4) }; });
    // open the edit dialog for a technician row
    const openedFor = await ev(page, ({ v }) => { const vis=eval(v);
      const rows=[...document.querySelectorAll('tr,[role="row"]')].filter(vis);
      const tech=rows.find(r=>/technician/i.test(r.innerText||'')) || rows[1];
      if(!tech) return null; const t=(tech.innerText||'').replace(/\s+/g,' ').trim().slice(0,70);
      const btn=[...tech.querySelectorAll('button,a,i')].find(e=>/edit|more_vert|create/i.test((e.innerText||'')+(e.getAttribute('data-test-id')||'')));
      (btn||tech).click(); return t; });
    await page.waitForTimeout(3500);
    let dlg = await ev(page, ({ v }) => { const vis=eval(v);
      const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
      const ids={}; d.querySelectorAll('[data-test-id]').forEach(e=>{ if(vis(e)) ids[e.getAttribute('data-test-id')]=(ids[e.getAttribute('data-test-id')]||0)+1; });
      return { text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,1200), ids }; });
    if (!dlg) { // fall back: click the row's name cell
      await ev(page, ({ v }) => { const vis=eval(v);
        const rows=[...document.querySelectorAll('tr,[role="row"]')].filter(vis);
        const tech=rows.find(r=>/technician/i.test(r.innerText||''))||rows[1]; if(tech) tech.click(); });
      await page.waitForTimeout(3500);
      dlg = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const ids={}; d.querySelectorAll('[data-test-id]').forEach(e=>{ if(vis(e)) ids[e.getAttribute('data-test-id')]=(ids[e.getAttribute('data-test-id')]||0)+1; });
        return { text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,1200), ids }; });
    }
    record(38848, [
      { step: '1 open Settings and find the staff list', seen: `${listed.n} rows; e.g. ${JSON.stringify(listed.sample.slice(0,2))}` },
      { step: '2 open a technician for editing', seen: openedFor ? `opened ${JSON.stringify(openedFor)}` : 'no row opened' },
      { step: "3 look for the 'Set working hours for this technician' toggle and read its default", seen: dlg ? JSON.stringify(dlg.text).slice(0,900) : 'no dialog opened' },
    ], dlg ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');

    // turn the toggle ON and read the editor -- C38847-style per-day rows, C38850 Add Hours
    let editor = null, toggled = null;
    if (dlg) {
      toggled = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const lab=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
          /Set working hours for this technician/i.test((e.innerText||'').trim()))[0];
        if(!lab) return null;
        let r=lab; for(let i=0;i<4&&r.parentElement;i++){ const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement; }
        const before = (()=>{ const t=r.querySelector('input[type="checkbox"],[role="switch"],[aria-checked]');
          return t ? (t.getAttribute('aria-checked') ?? String(t.checked)) : null; })();
        r.click(); return { label:(lab.innerText||'').trim(), stateBefore: before }; });
      await page.waitForTimeout(2200);
      editor = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const leaves=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>(e.innerText||'').trim()).filter(Boolean);
        const dayRows=leaves.filter(t=>days.includes(t));
        const fromTo=leaves.filter(t=>/^(From|To)$/i.test(t));
        const addHours=leaves.filter(t=>/add hours/i.test(t));
        const ins=[...d.querySelectorAll('input')].filter(vis).map(e=>({ tid:e.getAttribute('data-test-id'), val:e.value, ph:e.getAttribute('placeholder') }));
        return { dayRows:[...new Set(dayRows)], fromTo:[...new Set(fromTo)], addHours, inputCount: ins.length,
                 inputs: ins.slice(0,8), text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,900) }; });
    }
    record(38850, [
      { step: "1 turn on 'Set working hours for this technician'", seen: toggled ? `toggle ${JSON.stringify(toggled)}` : 'toggle not found' },
      { step: "2 look for 'Add Hours' and what it appends", seen: editor ? `'Add Hours' present: ${JSON.stringify(editor.addHours)}; day rows ${JSON.stringify(editor.dayRows)}; ${editor.inputCount} inputs` : 'no editor' },
    ], editor ? 'PARTIAL - the control is proven present; pressing it and Saving is a write and was not made' : 'PARTIAL');
    record(38851, [
      { step: '1 open the technician hours editor', seen: editor ? `${editor.inputCount} time inputs, day rows ${JSON.stringify(editor.dayRows)}` : 'no editor' },
      { step: '2 enter overlapping ranges and try to Save', seen: 'NOT DRIVEN - entering values and pressing Save writes to a staff record, which kills the session of anyone holding that role; deliberately not done' },
    ], 'PARTIAL - the editor is reachable; the overlap rejection itself was not driven');
    record(38849, [
      { step: '1 open a technician with no custom hours', seen: toggled ? `the toggle's state before this pass touched it was ${JSON.stringify(toggled.stateBefore)}` : 'not established' },
      { step: '2 check what hours the schedule uses for them', seen: editor ? JSON.stringify(editor.text).slice(0,600) : 'not established' },
    ], 'PARTIAL - inheritance from shop business hours is not proven from this screen alone');
    // put the toggle back
    if (toggled) { await ev(page, ({ v }) => { const vis=eval(v);
      const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return;
      const lab=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
        /Set working hours for this technician/i.test((e.innerText||'').trim()))[0];
      if(lab){ let r=lab; for(let i=0;i<4&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement;} r.click(); } });
      await page.waitForTimeout(1200); }
    await esc(page, 3);

    // ---------- C38847 : Settings -> Locations -> the pencil -> business hours ----------
    await page.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(12000);
    const locPage = await ev(page, ({ v }) => { const vis=eval(v);
      const rows=[...document.querySelectorAll('tr,[role="row"],.q-item')].filter(vis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length>4);
      const ids={}; document.querySelectorAll('[data-test-id]').forEach(e=>{ if(vis(e)) ids[e.getAttribute('data-test-id')]=(ids[e.getAttribute('data-test-id')]||0)+1; });
      return { rows: rows.slice(0,6), ids, url: location.pathname }; });
    const openedLoc = await ev(page, ({ v }) => { const vis=eval(v);
      const btn=[...document.querySelectorAll('button,a,i,[data-test-id]')].filter(vis)
        .find(e=>/edit|pencil|create/i.test((e.innerText||'')+(e.getAttribute('data-test-id')||'')));
      if(!btn) return null; const t=(btn.getAttribute('data-test-id')||btn.innerText||'').trim().slice(0,50); btn.click(); return t; });
    await page.waitForTimeout(4000);
    const locDlg = await ev(page, ({ v }) => { const vis=eval(v);
      const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0];
      const scope = d || document.body;
      const leaves=[...scope.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>(e.innerText||'').trim()).filter(Boolean);
      const bh = leaves.filter(t=>/business hours/i.test(t));
      const days = leaves.filter(t=>/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(t));
      return { isDialog: !!d, businessHoursText: bh, dayRows:[...new Set(days)],
               text:(scope.innerText||'').replace(/\s+/g,' ').trim().slice(0,900), url: location.pathname }; });
    record(38847, [
      { step: '1 open Settings and find the shop/location list', seen: `at ${locPage.url}; rows ${JSON.stringify(locPage.rows.slice(0,3))}` },
      { step: '2 open the location for editing', seen: openedLoc ? `clicked ${JSON.stringify(openedLoc)}` : 'no edit control found' },
      { step: "3 look for the business-hours toggle and its per-day From/To editor", seen: JSON.stringify(locDlg).slice(0,900) },
    ], locDlg.businessHoursText.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - the business-hours control was not reached on this screen');
    await esc(page, 3);

    fs.writeFileSync(`${OUT}/b4-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, api_4xx: h.apiLog.filter(a=>a.s>=400), at:new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
