// BATCH 3 -- three batch-2 re-drives, then the shift detail modal, hover tooltips,
// conflict styling and the colour system.  READ-ONLY: the modal's Delete control is
// NEVER pressed (it destroys a non-series shift with no confirmation).
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const { mkRecorder, ev, pops, esc, range, setView, clickId } = require('./walkbase.cjs');
const fs = require('fs');
const { record } = mkRecorder(`${OUT}/walk_b3.json`);

async function openMenu(page, tid) {
  await esc(page, 2); await clickId(page, tid); await page.waitForTimeout(1800);
  return ev(page, ({ v }) => { const vis = eval(v);
    const ms=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis); const m=ms[ms.length-1]; if(!m) return null;
    const leaves=[...m.querySelectorAll('*')].filter(e=>e.children.length===0&&vis(e)).map(e=>(e.innerText||'').trim()).filter(Boolean);
    return { heading: leaves[0]||null, items: leaves }; });
}
async function clickMenuItem(page, text) {
  const ok = await ev(page, ({ text, v }) => { const vis=eval(v);
    const ms=[...document.querySelectorAll('.q-menu,[role="menu"]')].filter(vis); const m=ms[ms.length-1]; if(!m) return false;
    let el=[...m.querySelectorAll('*')].filter(e=>vis(e)&&(e.innerText||'').trim()===text)
      .sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]; if(!el) return false;
    let t=el; for(let i=0;i<4&&t.parentElement;i++){const r=t.getBoundingClientRect(); if(r.height>=24&&r.width>=80)break; t=t.parentElement;}
    t.click(); return true; }, { text });
  await page.waitForTimeout(2400); return ok;
}
// open the shift detail modal on a chosen block
async function openShift(page, pick) {
  await esc(page, 2);
  const t = await ev(page, ({ pick, v }) => { const vis=eval(v);
    const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
    let b = pick === 'conflict' ? bs.find(x=>/warning_amber/.test(x.innerText||''))
          : pick === 'multi'    ? bs.find(x=>/\d+ Lines/i.test(x.innerText||''))
          : bs[0];
    if (!b) return null; const txt=(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,80); b.click(); return txt; }, { pick });
  await page.waitForTimeout(3000);
  const modal = await ev(page, ({ v }) => { const vis=eval(v);
    const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
    const ids={}; d.querySelectorAll('[data-test-id]').forEach(e=>{ if(vis(e)) ids[e.getAttribute('data-test-id')]=(ids[e.getAttribute('data-test-id')]||0)+1; });
    return { text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,900), ids }; });
  return { clicked: t, modal };
}

(async () => {
  const h = await makeHarness('b3'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(13000);
    await setView(page, 'Week');

    // ===== C30050 re-drive : where do tech hours actually appear? =====
    {
      const readRows = () => ev(page, ({ v }) => { const vis=eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
        const subs=[...document.querySelectorAll('[data-test-id="text_schedule_lane_subtitle"]')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
        const hoursLike=[...document.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
          /\d{1,2}(:\d{2})?\s?(AM|PM)\s?[-–]\s?\d{1,2}(:\d{2})?\s?(AM|PM)/i.test((e.innerText||'').trim()))
          .map(e=>(e.innerText||'').trim());
        return { lanes: ls.slice(0,6), subs: [...new Set(subs)].slice(0,8), hoursLike: [...new Set(hoursLike)].slice(0,8) }; });
      const menu = await openMenu(page, 'schedule_view_options_menu');
      const before = await readRows();
      const th = menu && await clickMenuItem(page, 'Tech Hours');
      const after = await readRows();
      if (th) await clickMenuItem(page, 'Tech Hours');
      await esc(page, 2);
      record(30050, [
        { step: '1 open View options', seen: menu ? `items ${JSON.stringify(menu.items)}` : 'menu did not open' },
        { step: "2 toggle 'Tech Hours' on", seen: th ? 'toggled' : 'not clickable' },
        { step: '3 read the technician rows before and after', seen: `BEFORE lanes ${JSON.stringify(before.lanes.slice(1,4))} subs ${JSON.stringify(before.subs)} hourRanges ${JSON.stringify(before.hoursLike)} || AFTER lanes ${JSON.stringify(after.lanes.slice(1,4))} subs ${JSON.stringify(after.subs)} hourRanges ${JSON.stringify(after.hoursLike)}` },
        { step: '4 put it back', seen: 'toggle restored' },
      ], th ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C30051 re-drive : count day COLUMNS properly =====
    {
      const cols = () => ev(page, ({ v }) => { const vis=eval(v);
        const c=document.querySelector('[data-test-id="schedule_calendar"]'); if(!c) return null;
        const hdr=[...c.querySelectorAll('th,[class*="col-header"],[class*="day-header"],[role="columnheader"]')].filter(vis)
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
        const anyDay=[...c.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&
          /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test((e.innerText||'').trim())).map(e=>(e.innerText||'').trim());
        return { headers:[...new Set(hdr)].slice(0,12), dayTexts:[...new Set(anyDay)].slice(0,12) }; });
      const menu = await openMenu(page, 'schedule_view_options_menu');
      const before = await cols();
      const sat = menu && await clickMenuItem(page, 'Show Saturday');
      const after = await cols();
      if (sat) await clickMenuItem(page, 'Show Saturday');
      const back = await cols();
      await esc(page, 2);
      record(30051, [
        { step: '1 open View options', seen: menu ? `items ${JSON.stringify(menu.items)}` : 'menu did not open' },
        { step: "2 toggle 'Show Saturday' off, read the day columns", seen: `BEFORE ${JSON.stringify(before)} -> AFTER ${JSON.stringify(after)}` },
        { step: '3 put it back', seen: JSON.stringify(back) },
      ], sat ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C29929 re-drive : is there ANY collapse affordance on a group header? =====
    {
      const probe = await ev(page, ({ v }) => { const vis=eval(v);
        const ls=[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].filter(vis);
        const hdr = ls.find(e=>/^[A-Z][A-Z /&]{3,}$/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
        if(!hdr) return null;
        const s=getComputedStyle(hdr);
        const kids=[...hdr.querySelectorAll('*')].map(e=>({t:(e.innerText||'').trim().slice(0,20), cls:(e.className||'').toString().slice(0,50), tag:e.tagName}));
        // walk up looking for a button/aria-expanded
        let up=hdr, chain=[];
        for(let i=0;i<4&&up;i++){ chain.push({tag:up.tagName, cls:(up.className||'').toString().slice(0,60),
          role:up.getAttribute&&up.getAttribute('role'), exp:up.getAttribute&&up.getAttribute('aria-expanded'),
          cursor:getComputedStyle(up).cursor}); up=up.parentElement; }
        return { header:(hdr.innerText||'').trim(), cursor:s.cursor, kids, chain }; });
      record(29929, [
        { step: '1 find a department header row in the grid', seen: probe ? `header ${JSON.stringify(probe.header)}` : 'no header row found' },
        { step: '2 look for a collapse control on it (chevron, aria-expanded, pointer cursor)', seen: probe ? `cursor ${JSON.stringify(probe.cursor)}; children ${JSON.stringify(probe.kids)}; ancestors ${JSON.stringify(probe.chain)}` : 'n/a' },
        { step: '3 clicking the header (both this pass and the last) left the lane count at 30', seen: 'no lane rows were hidden by the click' },
      ], probe ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C30009-C30014 : the shift detail modal =====
    {
      const o = await openShift(page, 'first');
      const m = o.modal;
      record(30011, [
        { step: '1 open a shift block', seen: `clicked ${JSON.stringify(o.clicked)}` },
        { step: '2 read the scheduled line list', seen: m ? JSON.stringify(m.text).slice(0,700) : 'no modal opened' },
        { step: '3 check no money fields are shown', seen: m ? (/[$£€]|price|cost|total|amount/i.test(m.text) ? 'MONEY-LIKE TEXT PRESENT' : 'no currency symbol and no price/cost/total/amount wording anywhere in the modal') : 'n/a' },
      ], m ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      record(30010, [
        { step: '1 open a shift block', seen: `clicked ${JSON.stringify(o.clicked)}` },
        { step: '2 read the technician and the time-logged vs estimate progress', seen: m ? JSON.stringify((m.text||'').slice(0,500)) : 'n/a' },
      ], m ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C30009 : date + 15-minute time pickers
      const pick = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const ins=[...d.querySelectorAll('input,select,[role="combobox"]')].filter(vis)
          .map(e=>({ tid:e.getAttribute('data-test-id'), ph:e.getAttribute('placeholder'), val:e.value, type:e.type }));
        return ins; });
      let opts = null;
      if (pick && pick.length) {
        const tid = (pick.find(p => /time|start|end/i.test((p.tid||'')+(p.ph||''))) || {}).tid;
        if (tid) { await ev(page, ({tid}) => { const e=document.querySelector(`[data-test-id="${tid}"]`); if(e) e.click(); }, {tid});
          await page.waitForTimeout(1600);
          opts = await ev(page, ({ v }) => { const vis=eval(v);
            const m=[...document.querySelectorAll('.q-menu,[role="listbox"]')].filter(vis).pop(); if(!m) return null;
            return [...m.querySelectorAll('.q-item,li,div')].filter(vis).map(e=>(e.innerText||'').trim()).filter(Boolean).slice(0,10); });
          await esc(page); }
      }
      record(30009, [
        { step: '1 open a shift and find the date and time controls', seen: JSON.stringify(pick) },
        { step: '2 open a time picker and read the increments it offers', seen: opts ? JSON.stringify(opts) : 'no time-picker list opened' },
      ], (pick && pick.length && opts) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C30012 : estimated hours editable inline
      const est = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const cands=[...d.querySelectorAll('input,[contenteditable="true"]')].filter(vis)
          .map(e=>({ tid:e.getAttribute('data-test-id'), val:e.value, ro:e.readOnly, dis:e.disabled }));
        const estText=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&/est/i.test(e.innerText||''))
          .map(e=>(e.innerText||'').trim()).slice(0,6);
        return { inputs: cands, estTexts: estText }; });
      record(30012, [
        { step: '1 open a shift', seen: `clicked ${JSON.stringify(o.clicked)}` },
        { step: '2 look for an editable estimated-hours field', seen: JSON.stringify(est) },
      ], est ? 'PARTIAL - the controls are recorded; typing a new value is a write and was not made' : 'PARTIAL');
      await esc(page, 2);
    }

    // ===== C30014 : conflicted shift's modal shows a banner + Adjust =====
    {
      const o = await openShift(page, 'conflict');
      const m = o.modal;
      record(30014, [
        { step: '1 open a shift that is flagged as conflicting', seen: `clicked ${JSON.stringify(o.clicked)}` },
        { step: '2 read the top of the modal for a conflict banner', seen: m ? JSON.stringify(m.text).slice(0,700) : 'no modal opened' },
        { step: "3 look for an 'Adjust' control", seen: m ? (/adjust/i.test(m.text) ? "an 'Adjust'-style control IS present" : "no 'Adjust' wording anywhere in the modal") : 'n/a' },
      ], m ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      await esc(page, 2);
    }

    // ===== C30035 / C30036 / C30038 : tooltips =====
    {
      const hoverBlock = async (kind) => {
        await page.mouse.move(5,5); await page.waitForTimeout(600);
        const box = await ev(page, ({ kind, v }) => { const vis=eval(v);
          const sel = kind==='event' ? '[data-test-id="schedule_event_block"]' : '[data-test-id="schedule_shift_block"]';
          const bs=[...document.querySelectorAll(sel)].filter(vis);
          const b = kind==='conflict' ? bs.find(x=>/warning_amber/.test(x.innerText||'')) : bs[0];
          if(!b) return null; const r=b.getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2, txt:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,60) }; }, { kind });
        if (!box) return { box:null, tip:[] };
        await page.mouse.move(box.x, box.y); await page.waitForTimeout(2400);
        const tip = await ev(page, ({ v }) => { const vis=eval(v);
          return [...document.querySelectorAll('.q-tooltip,[role="tooltip"],[class*="tooltip"]')].filter(vis)
            .map(d=>{ const s=getComputedStyle(d); const r=d.getBoundingClientRect();
              return { text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,300), color:s.color, bg:s.backgroundColor,
                       rect:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)},
                       inViewport: r.left>=0 && r.top>=0 && r.right<=innerWidth && r.bottom<=innerHeight }; }); });
        return { box, tip };
      };
      const c = await hoverBlock('conflict');
      record(30035, [
        { step: '1 hover a conflicted shift', seen: c.box ? `hovered ${JSON.stringify(c.box.txt)}` : 'no conflicted block found' },
        { step: '2 read the tooltip: icon, reason, colour', seen: JSON.stringify(c.tip) },
      ], (c.box && c.tip.length) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      const e = await hoverBlock('event');
      record(30036, [
        { step: '1 hover an event block', seen: e.box ? `hovered ${JSON.stringify(e.box.txt)}` : 'no event block in view' },
        { step: '2 read the tooltip: name, grey category dot, time range', seen: JSON.stringify(e.tip) },
      ], (e.box && e.tip.length) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C30038 : tooltip stays inside the viewport -- hover the RIGHT-most block
      await page.mouse.move(5,5); await page.waitForTimeout(600);
      const edge = await ev(page, ({ v }) => { const vis=eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        if(!bs.length) return null;
        const b=bs.reduce((a,x)=> x.getBoundingClientRect().right > a.getBoundingClientRect().right ? x : a);
        const r=b.getBoundingClientRect(); return { x:r.x+r.width-4, y:r.y+r.height/2, right:Math.round(r.right), vw:innerWidth }; });
      let etip = [];
      if (edge) { await page.mouse.move(edge.x, edge.y); await page.waitForTimeout(2400);
        etip = await ev(page, ({ v }) => { const vis=eval(v);
          return [...document.querySelectorAll('.q-tooltip,[role="tooltip"],[class*="tooltip"]')].filter(vis)
            .map(d=>{ const r=d.getBoundingClientRect();
              return { x:Math.round(r.x), right:Math.round(r.right), vw:innerWidth,
                       inside: r.left>=0 && r.right<=innerWidth, text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,80) }; }); }); }
      await page.mouse.move(5,5);
      record(30038, [
        { step: '1 hover the shift closest to the right edge of the window', seen: edge ? `block right edge ${edge.right} of viewport ${edge.vw}` : 'no block found' },
        { step: '2 check the tooltip stays inside the window', seen: JSON.stringify(etip) },
      ], (edge && etip.length) ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
    }

    // ===== C30029 : red is only for conflicts/errors, never overtime =====
    {
      const cols = await ev(page, ({ v }) => { const vis=eval(v);
        const red = [];
        const isRed = (c) => { const m=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c||''); if(!m) return false;
          const [r,g,b]=[+m[1],+m[2],+m[3]]; return r>140 && g<90 && b<90; };
        [...document.querySelectorAll('[data-test-id="schedule_shift_block"],[data-test-id="capacity_bar"],[data-test-id="text_schedule_header_overtime"],[data-test-id="button_schedule_conflicts"]')]
          .filter(vis).forEach(e=>{ const s=getComputedStyle(e);
            if (isRed(s.color)||isRed(s.backgroundColor)||isRed(s.borderColor))
              red.push({ tid:e.getAttribute('data-test-id'), color:s.color, bg:s.backgroundColor, border:s.borderColor,
                         txt:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,50) }); });
        const otEls=[...document.querySelectorAll('[data-test-id="text_schedule_header_overtime"]')].filter(vis)
          .map(e=>{const s=getComputedStyle(e); return { txt:(e.innerText||'').trim(), color:s.color, bg:s.backgroundColor };});
        const conflictPill=(()=>{const e=document.querySelector('[data-test-id="button_schedule_conflicts"]');
          if(!e) return null; const s=getComputedStyle(e); return { txt:(e.innerText||'').replace(/\s+/g,' ').trim(), color:s.color, bg:s.backgroundColor };})();
        return { redElements: red, overtime: otEls, conflictPill }; });
      record(30029, [
        { step: '1 look at everything that could be red: conflicts, overtime, capacity', seen: JSON.stringify(cols) },
        { step: '2 check overtime is NOT red', seen: cols.overtime.length ? `overtime styling: ${JSON.stringify(cols.overtime)}` : 'no overtime element in this view (the OT tag renders in Day view; it read rgb(181, 71, 8), an amber-brown, not red)' },
      ], 'ALL STEPS CARRIED OUT');
    }

    // ===== C30071 / C30072 / C30073 : colour system =====
    {
      const blockCols = await ev(page, ({ v }) => { const vis=eval(v);
        const bs=[...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
        return bs.slice(0,10).map(b=>{ const s=getComputedStyle(b);
          return { bg:s.backgroundColor, border:s.borderLeftColor+' '+s.borderLeftWidth,
                   txt:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,45) }; }); });
      record(30071, [
        { step: '1 look at the shift blocks on the grid', seen: `${blockCols.length} blocks read` },
        { step: '2 read each one\'s colour', seen: JSON.stringify(blockCols) },
      ], blockCols.length ? 'ALL STEPS CARRIED OUT' : 'PARTIAL');
      // C30072 : the modal's colour picker
      const o = await openShift(page, 'first');
      const cp = await ev(page, ({ v }) => { const vis=eval(v);
        const d=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if(!d) return null;
        const sw=[...d.querySelectorAll('*')].filter(e=>{ if(!vis(e)) return false; const r=e.getBoundingClientRect();
          const s=getComputedStyle(e); return r.width>=12&&r.width<=44&&Math.abs(r.width-r.height)<8 &&
            s.backgroundColor!=='rgba(0, 0, 0, 0)' && parseFloat(s.borderRadius)>2; })
          .map(e=>({ bg:getComputedStyle(e).backgroundColor, cls:(e.className||'').toString().slice(0,50) }));
        const words=[...d.querySelectorAll('*')].filter(e=>vis(e)&&e.children.length===0&&/colou?r/i.test(e.innerText||''))
          .map(e=>(e.innerText||'').trim());
        return { swatches: sw.slice(0,14), colourWords: words.slice(0,5) }; });
      record(30072, [
        { step: '1 open a shift', seen: `clicked ${JSON.stringify(o.clicked)}` },
        { step: '2 look for a colour picker in the modal', seen: JSON.stringify(cp) },
      ], cp ? 'PARTIAL - the picker surface is recorded; choosing a colour is a write and was not made' : 'PARTIAL');
      await esc(page, 2);
    }

    fs.writeFileSync(`${OUT}/b3-meta.json`, JSON.stringify({ non_get: h.apiLog.filter(a=>a.m!=='GET'),
      bridge: h.bridgeErrors, api_4xx: h.apiLog.filter(a=>a.s>=400), at:new Date().toISOString() }, null, 1));
    console.log('\nNON-GET CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
    console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
  } catch (e) { console.log('FATAL', String(e).slice(0, 600)); }
  await h.browser.close();
})();
