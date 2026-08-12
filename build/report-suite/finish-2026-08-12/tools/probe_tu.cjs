// TU: the walk read 4 rows but its sort extractor read 0, and expand-all timed out.
// Before either is written down, establish WHY. Technician Utilization is a FINAL report
// with 60 cases and sorting/expanding are common case subjects, so "not established" here
// is expensive -- worth one targeted probe.
const {boot,RENDERED}=require('../../verify-final-2026-08-12/tools/harness.cjs');
const fs=require('fs');
(async()=>{
  const H=await boot({viewport:{width:1680,height:1080}});
  const {page}=H; const out={};
  await page.goto(H.APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(9000);

  out.structure=await page.evaluate(`(()=>{
    const t=document.querySelector('[data-test-id^=table_]');
    const o={table_tid:t?t.getAttribute('data-test-id'):null};
    if(!t) return o;
    const trs=[...t.querySelectorAll('tbody tr')];
    o.tbody_tr=trs.length;
    o.rows=trs.slice(0,8).map(tr=>({
      cell_tags:[...tr.children].map(c=>c.tagName.toLowerCase()),
      td:tr.querySelectorAll('td').length,
      th:tr.querySelectorAll('th').length,
      texts:[...tr.children].map(c=>(c.innerText||'').replace(/\\s+/g,' ').trim().slice(0,28)),
      cls:(tr.className||'').toString().slice(0,60)
    }));
    o.expand_ids=[...document.querySelectorAll('[data-test-id*=expand]')].map(e=>({
      tid:e.getAttribute('data-test-id'), tag:e.tagName.toLowerCase(),
      visible:(()=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);
        return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';})(),
      rect:(()=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)];})()
    }));
    return o;
  })()`);

  // now try the sort with a corrected extractor: read the FIRST cell whatever its tag
  const order=async()=>page.evaluate(`(()=>{
    const t=document.querySelector('[data-test-id^=table_]'); if(!t) return [];
    return [...t.querySelectorAll('tbody tr')].map(tr=>{
      const c=tr.children[0]; return c?(c.innerText||'').replace(/\\s+/g,' ').trim():'';
    }).filter(Boolean);
  })()`);
  out.order_before=await order();
  let clicked=false;
  try{ await page.click('[data-test-id=header_tu_total_hours]',{timeout:8000}); clicked=true; }
  catch(e){ out.sort_click_err=String(e).slice(0,140); }
  await page.waitForTimeout(4000);
  out.order_after=await order();
  out.sort_clicked=clicked;
  out.sort_changed=JSON.stringify(out.order_before)!==JSON.stringify(out.order_after);

  // expand: find a row-level expand control and click it
  const ex=await page.$$('[data-test-id*=expand]');
  out.expand_candidates=ex.length;
  if(ex.length){
    const before=(await page.evaluate(`document.querySelectorAll('[data-test-id^=table_] tbody tr').length`));
    try{ await ex[0].click({timeout:8000}); await page.waitForTimeout(3500); out.expand_clicked=true; }
    catch(e){ out.expand_err=String(e).slice(0,140); }
    out.rows_before_expand=before;
    out.rows_after_expand=await page.evaluate(`document.querySelectorAll('[data-test-id^=table_] tbody tr').length`);
  }
  out.bridge_errors=H.bridgeErrors.length;
  fs.writeFileSync('/tmp/rs812/probe_tu.json',JSON.stringify(out,null,1));
  console.log(JSON.stringify(out,null,1).slice(0,2600));
  await H.browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
