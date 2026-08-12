// Why does the WIP table report 1 row when its tab says (15)? Establish the DOM truth
// before any count is written down. A wrong row count would become a false finding.
const {boot,RENDERED}=require('../../verify-final-2026-08-12/tools/harness.cjs');
const fs=require('fs');
(async()=>{
  const H=await boot({viewport:{width:1680,height:1080}});
  const {page}=H;
  await page.goto(H.APP+'/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(8000);
  const r=await page.evaluate(`(()=>{
    const out={};
    out.tables=[...document.querySelectorAll('table')].map(t=>({
      tid:t.getAttribute('data-test-id'),
      cls:(t.className||'').toString().slice(0,70),
      thead_th:t.querySelectorAll('thead th').length,
      tbody_tr:t.querySelectorAll('tbody tr').length,
      any_tr:t.querySelectorAll('tr').length}));
    out.testid_tables=[...document.querySelectorAll('[data-test-id^=table_]')].map(e=>({
      tid:e.getAttribute('data-test-id'), tag:e.tagName.toLowerCase(),
      inner_tr:e.querySelectorAll('tr').length,
      inner_tbody_tr:e.querySelectorAll('tbody tr').length}));
    // row-like test-ids anywhere
    out.row_testids=[...new Set([...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id')).filter(x=>/row|wip_/.test(x)))].slice(0,40);
    // is it virtualised?
    out.virtual=!!document.querySelector('.q-virtual-scroll, [class*=virtual]');
    // what does the first table actually contain
    const t=document.querySelector('[data-test-id^=table_]');
    if(t){
      const trs=[...t.querySelectorAll('tr')];
      out.first_table_rows=trs.slice(0,8).map(tr=>({
        cells:[...tr.querySelectorAll('td,th')].map(c=>(c.innerText||'').replace(/\\s+/g,' ').trim()).slice(0,5),
        parent:tr.parentElement.tagName.toLowerCase()}));
    }
    return out;
  })()`);
  console.log(JSON.stringify(r,null,1));
  fs.writeFileSync('/tmp/rs812/probe_table.json',JSON.stringify(r,null,1));
  await H.browser.close();
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
