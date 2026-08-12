// BATCH 5 -- the working-hours editor reached properly, the SHOP business hours screen,
// and the precondition C30050 turns on: does ANY technician have configured working hours?
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b5.json`);

const dlgText = (page) => ev(page, ({ v }) => { const vis=eval(v);
  const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
  const leaves=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>(e.innerText||'').trim()).filter(Boolean);
  const ins=[...d.querySelectorAll('input')].filter(vis).map(e=>({ tid:e.getAttribute('data-test-id'), val:e.value, ph:e.getAttribute('placeholder') }));
  return { leaves, inputs: ins, text:(d.innerText||'').replace(/\s+/g,' ').trim() }; });

// open the Edit Staff dialog for row N and report the working-hours toggle state
async function openStaffRow(page, idx) {
  await esc(page, 3); await page.waitForTimeout(500);
  const who = await ev(page, ({ idx, v }) => { const vis=eval(v);
    const rows=[...document.querySelectorAll('tbody tr')].filter(vis);
    const r=rows[idx]; if(!r) return null;
    const t=(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,80);
    const btn=[...r.querySelectorAll('button,i,[data-test-id]')].find(e=>/edit|create|pencil/i.test((e.innerText||'')+(e.getAttribute('data-test-id')||'')));
    (btn||r).click(); return t; }, { idx });
  await page.waitForTimeout(3200);
  const st = await ev(page, ({ v }) => { const vis=eval(v);
    const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
    const lab=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
      /Set working hours for this technician/i.test((e.innerText||'').trim()))[0];
    if(!lab) return { hasToggle:false };
    let r=lab; for(let i=0;i<5&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement;}
    const t=r.querySelector('input[type="checkbox"],[role="switch"],[aria-checked]');
    return { hasToggle:true, state: t ? (t.getAttribute('aria-checked') ?? String(t.checked)) : null,
             cls:(r.className||'').toString().slice(0,60) }; });
  return { who, st };
}

(async () => {
  const h = await makeHarness('b5'); const page = h.page;
  try {
    await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);

    // ---- the precondition sweep: read the toggle for several technicians ----
    const sweep = [];
    for (const idx of [0,1,2,3,4,5]) {
      const r = await openStaffRow(page, idx);
      if (r.who) sweep.push(`${JSON.stringify((r.who||'').slice(0,45))} -> ${JSON.stringify(r.st)}`);
    }
    await esc(page, 3);
    record(30050, [
      { step: "PRECONDITION CHECK - the case requires 'Technicians have configured working hours'", seen: sweep.join(' | ') },
      { step: 'this is why the Tech Hours toggle result is reported the way it is', seen: 'see walk_hard.json C30050 for the toggle behaviour itself' },
    ], 'PRECONDITION EVIDENCE - see walk_hard.json for the toggle drive');

    // ---- reach the editor properly: toggle ON, wait, screenshot, read ----
    const r0 = await openStaffRow(page, 0);
    const before = await dlgText(page);
    const clicked = await ev(page, ({ v }) => { const vis=eval(v);
      const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return false;
      const lab=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
        /Set working hours for this technician/i.test((e.innerText||'').trim()))[0]; if(!lab) return false;
      let r=lab; for(let i=0;i<5&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement;}
      r.click(); return true; });
    await page.waitForTimeout(3500);
    // scroll the dialog so anything below the fold renders (a lesson from an earlier pass)
    await ev(page, () => { const d=document.querySelector('.q-dialog .q-card,[role="dialog"]');
      if(d){ const sc=[...d.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+20)||d; sc.scrollTop=sc.scrollHeight; } });
    await page.waitForTimeout(1800);
    const after = await dlgText(page);
    await page.screenshot({ path: `${OUT}/b5-workinghours.png` }).catch(()=>{});
    const newLeaves = after ? after.leaves.filter(t => !(before&&before.leaves||[]).includes(t)) : [];
    record(38848, [
      { step: '1 open a staff member for editing', seen: `opened ${JSON.stringify((r0.who||'').slice(0,60))}; toggle state ${JSON.stringify(r0.st)}` },
      { step: "2 turn on 'Set working hours for this technician'", seen: clicked ? 'toggled on' : 'toggle not found' },
      { step: '3 read what the toggle reveals (dialog scrolled to the bottom first)', seen: `NEW text after toggling: ${JSON.stringify(newLeaves)}` },
    ], clicked ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    record(38850, [
      { step: '1 open the technician hours editor', seen: clicked ? 'editor revealed' : 'not revealed' },
      { step: "2 look for 'Add Hours' and the per-day rows", seen: after ? `inputs now ${JSON.stringify(after.inputs)}; new visible text ${JSON.stringify(newLeaves)}` : 'no dialog' },
    ], (after && newLeaves.some(t=>/add hours/i.test(t))) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    // put it back
    if (clicked) { await ev(page, ({ v }) => { const vis=eval(v);
      const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return;
      const lab=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
        /Set working hours for this technician/i.test((e.innerText||'').trim()))[0];
      if(lab){let r=lab; for(let i=0;i<5&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement;} r.click();} });
      await page.waitForTimeout(1200); }
    await esc(page, 3);

    // ---- C38847 : the SHOP business hours, reached from the locations table ----
    await page.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(12000);
    const opened = await ev(page, ({ v }) => { const vis=eval(v);
      const rows=[...document.querySelectorAll('tbody tr')].filter(vis);
      const r=rows.find(x=>/Heavy Duty/i.test(x.innerText||''))||rows[0]; if(!r) return null;
      const t=(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,70);
      const btn=[...r.querySelectorAll('button,i,[data-test-id],a')].find(e=>/edit|create|pencil/i.test((e.innerText||'')+(e.getAttribute('data-test-id')||'')));
      (btn||r).click(); return { t, viaButton: !!btn }; });
    await page.waitForTimeout(4500);
    const loc = await ev(page, ({ v }) => { const vis=eval(v);
      const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0];
      const scope=d||document.body;
      const leaves=[...scope.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>(e.innerText||'').trim()).filter(Boolean);
      return { isDialog:!!d, url:location.pathname,
               businessHours: leaves.filter(t=>/business hours/i.test(t)),
               days:[...new Set(leaves.filter(t=>/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(t)))],
               fromTo:[...new Set(leaves.filter(t=>/^(From|To)$/i.test(t)))],
               leaves: leaves.slice(0,60) }; });
    // if a business-hours toggle exists, turn it on and read the per-day editor
    let bhOn = null, bhAfter = null;
    if (loc.businessHours.length) {
      bhOn = await ev(page, ({ v }) => { const vis=eval(v);
        const lab=[...document.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&/business hours/i.test((e.innerText||'').trim()))[0];
        if(!lab) return false;
        let r=lab; for(let i=0;i<5&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement;}
        r.click(); return true; });
      await page.waitForTimeout(2600);
      bhAfter = await ev(page, ({ v }) => { const vis=eval(v);
        const leaves=[...document.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0).map(e=>(e.innerText||'').trim()).filter(Boolean);
        return { days:[...new Set(leaves.filter(t=>/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(t)))],
                 fromTo:[...new Set(leaves.filter(t=>/^(From|To)$/i.test(t)))],
                 times: leaves.filter(t=>/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(t)).slice(0,10) }; });
      if (bhOn) { await ev(page, ({ v }) => { const vis=eval(v);
        const lab=[...document.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&/business hours/i.test((e.innerText||'').trim()))[0];
        if(lab){let r=lab; for(let i=0;i<5&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=120)break; r=r.parentElement;} r.click();} });
        await page.waitForTimeout(1500); }
    }
    await page.screenshot({ path: `${OUT}/b5-location.png` }).catch(()=>{});
    record(38847, [
      { step: '1 open Settings and the shop/location list', seen: `at ${loc.url}` },
      { step: '2 open the shop for editing', seen: opened ? `opened ${JSON.stringify(opened)}` : 'no row opened' },
      { step: '3 find the business-hours toggle', seen: loc.businessHours.length ? `found: ${JSON.stringify(loc.businessHours)}` : `NOT found on this screen; visible text: ${JSON.stringify(loc.leaves.slice(0,40))}` },
      { step: '4 turn it on and read the per-day From/To editor', seen: bhAfter ? JSON.stringify(bhAfter) : 'not driven (no toggle found)' },
    ], loc.businessHours.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL - the business-hours control was not found on the location screen');
    await esc(page, 3);

    fs.writeFileSync(`${OUT}/b5-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, api_4xx: h.apiLog.filter(a=>a.s>=400), at:new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
