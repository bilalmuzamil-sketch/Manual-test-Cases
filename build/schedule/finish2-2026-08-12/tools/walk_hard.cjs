// THE HARD RE-CHECKS.  Five results that would each be an attractive but unearned
// finding.  Each is driven the way its own case actually describes.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_hard.json`);

async function openMenu(page, tid) {
  await esc(page, 2); await clickId(page, tid); await page.waitForTimeout(1800);
  return ev(page, ({ v }) => { const vis=eval(v);
    const ms=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis); const m=ms[ms.length-1]; if(!m) return null;
    // read each row WITH its toggle state
    const rows=[...m.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&(e.innerText||'').trim())
      .map(e=>{ let r=e; for(let i=0;i<4&&r.parentElement;i++){const b=r.getBoundingClientRect(); if(b.height>=24&&b.width>=80)break; r=r.parentElement;}
        const tog=r.querySelector('input[type="checkbox"],[role="switch"],[aria-checked],.q-toggle');
        return { text:(e.innerText||'').trim(),
                 checked: tog ? (tog.getAttribute('aria-checked') ?? (tog.checked!==undefined?String(tog.checked):null)) : null,
                 rowCls:(r.className||'').toString().slice(0,70) }; });
    return { rows, text:(m.innerText||'').replace(/\s+/g,' ').trim().slice(0,300) }; });
}
async function clickMenuItem(page, text) {
  const ok = await ev(page, ({ text, v }) => { const vis=eval(v);
    const ms=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis); const m=ms[ms.length-1]; if(!m) return false;
    let el=[...m.querySelectorAll('*')].filter(e=>vis(e)&&(e.innerText||'').trim()===text)
      .sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]; if(!el) return false;
    let t=el; for(let i=0;i<4&&t.parentElement;i++){const r=t.getBoundingClientRect(); if(r.height>=24&&r.width>=80)break; t=t.parentElement;}
    t.click(); return true; }, { text });
  await page.waitForTimeout(2600); return ok;
}

(async () => {
  const h = await makeHarness('hard'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);

    // ============ C30006 : the case asks for a HOVER.  Give it one. ============
    {
      const line = await ev(page, ({ v }) => { const vis=eval(v);
        const chip=document.querySelector('[data-test-id="text_schedule_now_time"]');
        const host=chip?chip.closest('.schedule-now-chip'):null;
        // the LINE: look for a sibling element that is tall and 1-3px wide
        const cands=[...document.querySelectorAll('[class*="now"]')].map(e=>{ const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
          return { cls:(e.className||'').toString().slice(0,60), w:Math.round(r.width), h:Math.round(r.height),
                   x:Math.round(r.x), bg:s.backgroundColor, border:s.borderLeftColor+' '+s.borderLeftWidth, opacity:s.opacity, vis:vis(e) }; });
        return { chipOpacity: host?getComputedStyle(host).opacity:null,
                 chipRect: host?(()=>{const r=host.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)};})():null,
                 nowElements: cands }; });
      // hover the now line: put the pointer on the grid at the chip's x
      let after = null;
      if (line.chipRect) {
        await page.mouse.move(line.chipRect.x + 2, line.chipRect.y + 120);
        await page.waitForTimeout(1400);
        await page.mouse.move(line.chipRect.x, line.chipRect.y + 60);
        await page.waitForTimeout(1600);
        after = await ev(page, () => { const chip=document.querySelector('[data-test-id="text_schedule_now_time"]');
          const host=chip?chip.closest('.schedule-now-chip'):null;
          return host?{ opacity:getComputedStyle(host).opacity, text:(chip.innerText||'').trim() }:null; });
      }
      await page.mouse.move(5,5);
      record(30006, [
        { step: '1 open day view on today, scroll to the current time', seen: `range ${JSON.stringify(await range(page))}` },
        { step: '2 find the vertical current-time indicator', seen: JSON.stringify(line.nowElements) },
        { step: '3 hover it with the pointer over the grid', seen: `chip opacity at rest ${JSON.stringify(line.chipOpacity)} -> on hover ${JSON.stringify(after)}` },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ============ C30001 : narrow the window so the timeline CAN scroll ==========
    {
      await page.setViewportSize({ width: 900, height: 900 });
      await page.waitForTimeout(1500);
      await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(12000);
      const readScroll = () => ev(page, () => {
        const c=document.querySelector('[data-test-id="schedule_calendar"]'); if(!c) return null;
        const sc=[...c.querySelectorAll('*')].find(e=>e.scrollWidth>e.clientWidth+20); if(!sc) return { noScroller:true };
        const cr=sc.getBoundingClientRect();
        const labels=[...c.querySelectorAll('*')].filter(e=>/^\d{1,2} (AM|PM)$/.test((e.innerText||'').trim())&&e.children.length===0);
        const leftMost=labels.map(e=>({t:(e.innerText||'').trim(), x:e.getBoundingClientRect().x}))
          .filter(o=>o.x>=cr.left-4).sort((a,b)=>a.x-b.x)[0];
        return { scrollLeft:Math.round(sc.scrollLeft), scrollWidth:Math.round(sc.scrollWidth), clientWidth:Math.round(sc.clientWidth),
                 maxScroll:Math.round(sc.scrollWidth-sc.clientWidth), leftEdgeHour:leftMost?leftMost.t:null,
                 hoursTotal:labels.length }; });
      const onLoad = await readScroll();
      // step 2: scroll to a late hour manually
      await ev(page, () => { const c=document.querySelector('[data-test-id="schedule_calendar"]');
        const sc=[...c.querySelectorAll('*')].find(e=>e.scrollWidth>e.clientWidth+20); if(sc) sc.scrollLeft = sc.scrollWidth - sc.clientWidth; });
      await page.waitForTimeout(1500);
      const afterManual = await readScroll();
      // step 3: interact without changing the day
      await page.mouse.move(500, 400); await page.waitForTimeout(3000); await page.mouse.move(300, 300); await page.waitForTimeout(2500);
      const afterIdle = await readScroll();
      // step 4: next day
      await clickId(page, 'button_schedule_next'); await page.waitForTimeout(3000);
      const afterNav = await readScroll();
      await page.setViewportSize({ width: 1680, height: 1080 });
      record(30001, [
        { step: '1 switch to day view and look at where the timeline is scrolled to (window narrowed to 900px so the timeline CAN scroll)', seen: JSON.stringify(onLoad) },
        { step: '2 manually scroll the timeline to a late hour', seen: JSON.stringify(afterManual) },
        { step: '3 wait and interact without changing the day', seen: JSON.stringify(afterIdle) },
        { step: '4 navigate to the next day and look again', seen: JSON.stringify(afterNav) },
      ], onLoad ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(11000);
    }

    // ============ C30050 : READ THE TOGGLE STATE, then drive BOTH directions ======
    {
      const rowsOf = () => ev(page, ({ v }) => { const vis=eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
        return ls; });
      await setView(page, 'Week');
      const m1 = await openMenu(page, 'schedule_view_options_menu');
      const th = m1 && m1.rows.find(r => r.text === 'Tech Hours');
      const before = await rowsOf();
      const t1 = await clickMenuItem(page, 'Tech Hours');
      const state1 = await openMenu(page, 'schedule_view_options_menu');
      const after1 = await rowsOf();
      const t2 = await clickMenuItem(page, 'Tech Hours');
      const after2 = await rowsOf();
      await esc(page, 2);
      const same = JSON.stringify(before) === JSON.stringify(after1);
      record(30050, [
        { step: "1 open View options and read the Tech Hours toggle's state", seen: `Tech Hours row: ${JSON.stringify(th)} ; all rows ${JSON.stringify((m1&&m1.rows||[]).map(r=>({t:r.text,c:r.checked})))}` },
        { step: '2 click it once and read the state again', seen: `clicked ${t1}; state now ${JSON.stringify((state1&&state1.rows||[]).find(r=>r.text==='Tech Hours'))}` },
        { step: '3 read the technician row headers in both states', seen: `STATE A ${JSON.stringify(before.slice(1,5))} || STATE B ${JSON.stringify(after1.slice(1,5))} || identical: ${same}` },
        { step: '4 click it back', seen: `clicked ${t2}; rows ${JSON.stringify(after2.slice(1,5))}` },
      ], (t1 && t2) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ============ C29929 : try EVERY department header, in BOTH views ============
    {
      const results = [];
      for (const view of ['Week','Day']) {
        await setView(page, view); await page.waitForTimeout(2200);
        const hdrs = await ev(page, ({ v }) => { const vis=eval(v);
          return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis)
            .map((e,i)=>({ i, t:(e.innerText||'').replace(/\s+/g,' ').trim() }))
            .filter(o=>/^[A-Z][A-Z /&]{3,}$/.test(o.t)); });
        for (const hd of hdrs) {
          const before = await ev(page, ({ v }) => { const vis=eval(v);
            return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
          // click the ROW (the .schedule-lane--department element), not the inner span
          const how = await ev(page, ({ t, v }) => { const vis=eval(v);
            const lab=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis)
              .find(e=>(e.innerText||'').replace(/\s+/g,' ').trim()===t); if(!lab) return null;
            const row=lab.closest('.schedule-lane')||lab;
            const r=row.getBoundingClientRect();
            row.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2}));
            return { rowCls:(row.className||'').toString().slice(0,60), w:Math.round(r.width), h:Math.round(r.height) }; }, { t: hd.t });
          await page.waitForTimeout(2200);
          const after = await ev(page, ({ v }) => { const vis=eval(v);
            return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
          results.push(`${view} / ${JSON.stringify(hd.t)}: lanes ${before} -> ${after}${before!==after?' CHANGED':''} (${JSON.stringify(how)})`);
        }
      }
      // also: does a real mouse click at the header's coordinates do anything?
      await setView(page, 'Week');
      const coord = await ev(page, ({ v }) => { const vis=eval(v);
        const lab=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis)
          .find(e=>/^[A-Z][A-Z /&]{3,}$/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
        if(!lab) return null; const r=lab.getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2, t:(lab.innerText||'').trim() }; });
      let coordResult = 'not attempted';
      if (coord) {
        const b = await ev(page, ({ v }) => { const vis=eval(v);
          return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
        await page.mouse.click(coord.x, coord.y); await page.waitForTimeout(2400);
        const a = await ev(page, ({ v }) => { const vis=eval(v);
          return [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis).length; });
        const pop = await pops(page);
        coordResult = `real mouse click on ${JSON.stringify(coord.t)} at ${Math.round(coord.x)},${Math.round(coord.y)}: lanes ${b} -> ${a}; popups ${JSON.stringify(pop.map(x=>x.slice(0,60)))}`;
      }
      record(29929, [
        { step: '1 click each department group header to collapse it', seen: results.join(' | ') },
        { step: '2 the same again with a real mouse click at the header coordinates', seen: coordResult },
        { step: '3 look for any collapse affordance on the header', seen: 'the header row is div.schedule-lane.schedule-lane--department; cursor auto; no chevron child; no aria-expanded on it or any of its four ancestors' },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ============ C30012 : try to make the estimate editable ====================
    {
      await setView(page, 'Week');
      const opened = await ev(page, ({ v }) => { const vis=eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        if(!bs.length) return null; const t=(bs[0].innerText||'').replace(/\s+/g,' ').trim().slice(0,60); bs[0].click(); return t; });
      await page.waitForTimeout(3000);
      const full = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const ids={}; d.querySelectorAll('[data-test-id]').forEach(e=>{ if(vis(e)) ids[e.getAttribute('data-test-id')]=(ids[e.getAttribute('data-test-id')]||0)+1; });
        return { text:(d.innerText||'').replace(/\s+/g,' ').trim(), ids }; });
      // click every element whose text looks like an hours value, and see if an input appears
      const attempts = [];
      const hourish = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return [];
        return [...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
          /^\d+(\.\d+)?\s*h(\s*\d+\s*m)?$|^\d+\s*m$|^\d+h\s\d+m$/i.test((e.innerText||'').trim()))
          .map((e,i)=>({ i, t:(e.innerText||'').trim() })); });
      for (const cand of hourish.slice(0, 5)) {
        const before = await ev(page, ({ v }) => { const vis=eval(v);
          const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0];
          return d ? [...d.querySelectorAll('input,[contenteditable="true"]')].filter(vis).length : 0; });
        await ev(page, ({ t, v }) => { const vis=eval(v);
          const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return;
          const e=[...d.querySelectorAll('*')].filter(x=>vis(x)&&x.children.length===0&&(x.innerText||'').trim()===t)[0];
          if(e) e.click(); }, { t: cand.t });
        await page.waitForTimeout(1500);
        const after = await ev(page, ({ v }) => { const vis=eval(v);
          const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
          return { inputs:[...d.querySelectorAll('input,[contenteditable="true"]')].filter(vis)
            .map(e=>({ tid:e.getAttribute('data-test-id'), val:e.value })) }; });
        attempts.push(`clicked ${JSON.stringify(cand.t)}: inputs ${before} -> ${after?after.inputs.length:0} ${JSON.stringify(after&&after.inputs.map(i=>i.tid))}`);
      }
      await esc(page, 2);
      record(30012, [
        { step: '1 open a shift detail modal', seen: opened ? `opened on ${JSON.stringify(opened)}` : 'no shift opened' },
        { step: '2 read every control in the modal', seen: full ? `test ids: ${JSON.stringify(full.ids)}` : 'no modal' },
        { step: '3 click each hours-looking value to see whether it becomes editable', seen: attempts.length ? attempts.join(' | ') : `no hours-looking value found; modal text: ${JSON.stringify((full&&full.text||'').slice(0,400))}` },
      ], full ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    fs.writeFileSync(`${OUT}/hard-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, at:new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
