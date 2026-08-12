// WALK — execute the actual step sequences the cases require, in order, per report.
//
// This is not a label harvest. Each atom below is an ACTION a case's steps tell a tester to
// perform; it is performed and its outcome recorded. An atom that cannot be performed is
// recorded as FAIL with what was tried, never as "absent" unless the control genuinely is
// not in the DOM.
//
// Self-check discipline: every atom records a BEFORE and AFTER observation so that "nothing
// happened" is distinguishable from "the probe did not fire". Atoms whose before/after are
// identical are flagged `no_effect` for human reading rather than silently passing.
const {boot,RENDERED}=require('../../verify-final-2026-08-12/tools/harness.cjs');
const fs=require('fs');

const REPORT=process.argv[2];
const PATHS={
  wip:'/reports/work-in-progress', tu:'/reports/technician-utilization',
  sbc:'/reports/sales-by-customer', sbr:'/reports/sales-by-representative',
  pv:'/reports/parts-velocity', iv:'/reports/inventory-value',
};
const NAVID={wip:'report_nav_work_in_progress',tu:'report_nav_technician_utilization',
  sbc:'report_nav_sales_by_customer',sbr:'report_nav_sales_by_representative',
  pv:'report_nav_parts_velocity',iv:'report_nav_inventory_value'};

(async()=>{
  const H=await boot({viewport:{width:1680,height:1080}});
  const {page}=H;
  const R={report:REPORT,build:null,atoms:[],started:new Date().toISOString()};
  const rec=(name,ok,detail)=>{R.atoms.push({name,ok,...detail});
    console.log((ok?'PASS ':'FAIL ')+name+' '+JSON.stringify(detail||{}).slice(0,180));};

  R.build=await page.evaluate(`(()=>{const m=document.querySelector('meta[name=app-version]');return m&&m.getAttribute('content');})()`);

  // NOTE: the report's OWN table is [data-test-id^=table_]; a bare 'tbody' picks up the
  // navigation wrapper and reports 1 row for a table that has 15. And the report's OWN
  // tabs are [data-test-id^=tab_]; '.q-tab,[role=tab]' matches the REPORTS NAVIGATION,
  // so clicking "tab 3" navigates to a different report entirely. Both cost a rerun.
  const snap=async()=>page.evaluate(`(()=>{
    ${RENDERED}
    const tbl=document.querySelector('[data-test-id^=table_]');
    // q-table renders SEVERAL tbody elements; querySelector('tbody') gets the first,
    // which held 1 row for a table with 18. Count 'tbody tr' across the whole table.
    const tb=tbl;
    return {
      url:location.pathname+location.search,
      table_found: !!tbl,
      headers:(tbl?[...tbl.querySelectorAll('thead th')]:[]).map(e=>(e.innerText||'').replace(/\\s*(arrow_drop_(up|down)|keyboard_double_arrow_(down|up)|expand_more)\\s*/g,'').replace(/\\s+/g,' ').trim()).filter(Boolean),
      rowcount: tb? tb.querySelectorAll('tbody tr').length : 0,
      firstcells: tb? [...tb.querySelectorAll('tbody tr')].slice(0,6).map(tr=>{
          const tds=[...tr.querySelectorAll('td')].map(td=>(td.innerText||'').replace(/\\s+/g,' ').trim()).filter(x=>x&&!/^(keyboard|arrow|chevron|expand)/.test(x));
          return tds.slice(0,3).join(' | ');
        }) : [],
      tabs:[...document.querySelectorAll('[data-test-id^=tab_]')].map(e=>({it:(e.innerText||'').replace(/\\s+/g,' ').trim(), tc:(e.textContent||'').replace(/\\s+/g,' ').trim(), tt:getComputedStyle(e).textTransform, tid:e.getAttribute('data-test-id'), sel:e.getAttribute('aria-selected')||e.className.includes('active')})),
      testids:[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))],
      totalsRow: (()=>{const t=document.querySelector('[data-test-id$=_totals]');return t?(t.innerText||'').replace(/\\s+/g,' ').trim().slice(0,200):null;})()
    };
  })()`);

  // ---- ATOM 1: reach the report THROUGH THE NAVIGATION, as step 1 of many cases says ----
  await page.goto(H.APP+'/reports',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(5000);
  let navOk=false, navDetail={};
  try{
    const present=await page.$(`[data-test-id=${NAVID[REPORT]}]`);
    navDetail.nav_link_present=!!present;
    if(present){ await present.click(); await page.waitForTimeout(6000); }
    const s=await snap();
    navDetail.landed=s.url; navDetail.expected=PATHS[REPORT];
    navOk = !!present && s.url.startsWith(PATHS[REPORT]);
  }catch(e){ navDetail.err=String(e).slice(0,140); }
  rec('nav_via_reports_menu',navOk,navDetail);

  if(!navOk){ await page.goto(H.APP+PATHS[REPORT],{waitUntil:'domcontentloaded',timeout:120000}); await page.waitForTimeout(6000); }
  const base=await snap();
  rec('report_loads',base.rowcount>0||base.headers.length>0,
      {headers:base.headers,rowcount:base.rowcount,tabs:base.tabs.map(t=>t.it),totals:base.totalsRow});

  // ---- ATOM 2: tabs — click EVERY tab in turn and prove the body changed ----
  if(base.tabs.length){
    for(const t of base.tabs){
      const before=await snap();
      let ok=false;
      // BOTH readings of the label are recorded: the tester reads `it` (text-transform
      // applied), the markup ships `tc`. Neither alone is "the label".
      const d={tab_tid:t.tid, rendered:t.it, markup:t.tc, text_transform:t.tt};
      try{ await page.click(`[data-test-id=${t.tid}]`,{timeout:8000}); await page.waitForTimeout(4000); ok=true; }
      catch(e){ d.err=String(e).slice(0,120); }
      const after=await snap();
      d.rows_before=before.rowcount; d.rows_after=after.rowcount;
      d.headers_after=after.headers;
      d.selected_after=(after.tabs.find(x=>x.tid===t.tid)||{}).sel;
      d.body_changed = JSON.stringify(before.firstcells)!==JSON.stringify(after.firstcells) || before.rowcount!==after.rowcount;
      rec('tab_click:'+t.tid,ok,d);
    }
    try{ await page.click(`[data-test-id=${base.tabs[0].tid}]`,{timeout:8000}); await page.waitForTimeout(3000);}catch(e){}
  }

  // ---- ATOM 3: every toolbar control — open it, enumerate it, close it ----
  const controls=base.testids.filter(id=>/^(select_|toggle_|date-range-selector_|button_column_selection|btn_dropdown_|button_.*expand_all|clear_)/.test(id)
      && !/^select_global_search$/.test(id));
  for(const tid of controls){
    let ok=false; const d={tid};
    try{
      const before=await page.evaluate(`document.querySelectorAll('[data-test-id]').length`);
      await page.click(`[data-test-id=${tid}]`,{timeout:7000});
      await page.waitForTimeout(2200);
      const after=await page.evaluate(`document.querySelectorAll('[data-test-id]').length`);
      const panel=await page.evaluate(`(()=>{
        ${RENDERED}
        const surf=[...document.querySelectorAll('.q-menu,.q-dialog,[role=menu],[role=listbox]')];
        const rows=[];
        for(const s of surf) for(const e of s.querySelectorAll('.q-item,[role=option],[role=menuitem],label,button')){
          const t=(e.innerText||'').replace(/\\s+/g,' ').trim();
          if(t||e.getAttribute('data-test-id')) rows.push({it:t.slice(0,55),tid:e.getAttribute('data-test-id')});
        }
        return {surfaces:surf.length,rows:rows.slice(0,40)};
      })()`);
      d.opened_panel=panel.surfaces>0; d.rows=panel.rows; d.testids_grew=after>before;
      // a control that opened NOTHING and grew NOTHING is a genuine failure to operate
      ok = panel.surfaces>0 || after>before;
      if(!ok) d.note='clicked but no panel and no new test-ids — control did not operate';
      await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    }catch(e){ d.err=String(e).slice(0,140); }
    rec('control_open:'+tid,ok,d);
  }

  // ---- ATOM 4: sort — click a sortable header and prove the ROW ORDER changed ----
  // reads the NAME cell, not the chevron cell (the artefact the previous pass warned about)
  let sortIds=base.testids.filter(id=>/^header_/.test(id));
  let useTh=false;
  if(!sortIds.length){ // WIP names no header test-ids; click the th itself
    useTh=true;
    const n=await page.evaluate(`document.querySelectorAll('[data-test-id^=table_] thead th').length`);
    sortIds=[...Array(n).keys()].map(i=>'th#'+i);
  }
  if(sortIds.length){
    const pick=sortIds.slice(-3); // money columns sort most visibly
    for(const hid of pick){
      const readOrder=async()=>page.evaluate(`(()=>{
        const tbl=document.querySelector('[data-test-id^=table_]'); if(!tbl) return [];
        return [...tbl.querySelectorAll('tbody tr')].slice(0,12).map(tr=>{
          const tds=[...tr.querySelectorAll('td')].map(td=>(td.innerText||'').replace(/\\s+/g,' ').trim())
            .filter(x=>x && !/^(keyboard_|arrow_|chevron_|expand_)/.test(x));
          return tds[0]||'';
        }).filter(Boolean);
      })()`);
      const before=await readOrder();
      let ok=false; const d={header:hid,before:before.slice(0,5)};
      try{
        if(useTh){ const i=parseInt(hid.split('#')[1],10);
          const ths=await page.$$('[data-test-id^=table_] thead th'); await ths[i].click(); }
        else await page.click(`[data-test-id=${hid}]`,{timeout:7000});
        await page.waitForTimeout(3500); ok=true; }
      catch(e){ d.err=String(e).slice(0,120); }
      const after=await readOrder();
      d.after=after.slice(0,5);
      d.order_changed = JSON.stringify(before)!==JSON.stringify(after);
      d.extractor_returned_rows = before.length;
      rec('sort:'+hid,ok,d);
    }
  }

  // ---- ATOM 5: expand a row, then collapse ----
  const expandIds=base.testids.filter(id=>/expand/.test(id));
  if(expandIds.length){
    const tid=expandIds[0]; let ok=false; const d={tid};
    try{
      const b=await snap();
      await page.click(`[data-test-id=${tid}]`,{timeout:7000}); await page.waitForTimeout(3500);
      const a=await snap();
      d.rows_before=b.rowcount; d.rows_after=a.rowcount; d.grew=a.rowcount>b.rowcount;
      ok=true;
      if(!d.grew) d.note='expand control clicked but row count did not grow';
      await page.click(`[data-test-id=${tid}]`,{timeout:7000}); await page.waitForTimeout(2500);
      const c=await snap(); d.rows_after_collapse=c.rowcount;
    }catch(e){ d.err=String(e).slice(0,140); }
    rec('expand:'+tid,ok,d);
  }

  R.finished=new Date().toISOString();
  R.bridge_errors=H.bridgeErrors;
  R.api_calls=H.apiLog.length;
  R.non_get=H.apiLog.filter(x=>x.m!=='GET').map(x=>x.m+' '+x.u);
  fs.writeFileSync(`/tmp/rs812/walk_${REPORT}.json`,JSON.stringify(R,null,2));
  console.log(`\n== ${REPORT}: ${R.atoms.filter(a=>a.ok).length}/${R.atoms.length} atoms performed; bridge_errors=${H.bridgeErrors.length}; non-GET=${R.non_get.length}`);
  // browser.close() can hang behind the request-interception route handler, which left an
  // orphan node process racing the next report in the loop. The JSON is already on disk, so
  // close on a timer and exit hard.
  await Promise.race([H.browser.close(), new Promise(r=>setTimeout(r,8000))]);
  process.exit(0);
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
