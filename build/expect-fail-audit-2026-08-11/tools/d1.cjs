const {boot}=require('./bootF.cjs');
const FAKE='00000000-dead-4dea-9999-000000000000';
(async()=>{
  const {page,apiLog,APP}=await boot({});
  await page.waitForTimeout(4000);
  console.log('===== SV-8832: a filter value that does not exist, carried in the URL =====');
  const n0=apiLog.length;
  await page.goto(APP+'/workorders?company_id='+FAKE+'&tab=all',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(6000);
  const reqs=apiLog.slice(n0).filter(a=>/\/api\/work-orders\?/.test(a.u));
  const carried=reqs.filter(a=>a.u.includes(FAKE)||a.u.includes(encodeURIComponent(FAKE)));
  console.log('work-orders requests:',reqs.length,'| requests still carrying the dead value:',carried.length);
  if(carried.length) console.log('  e.g.',decodeURIComponent(carried[0].u).slice(0,190));
  const ui=await page.evaluate(()=>({
    url:location.href,
    chip:(document.querySelector('[data-test-id=filter_chip_company_id]')||{}).innerText?.trim().replace(/\s+/g,' ')||'',
    rows:document.querySelectorAll('tbody tr').length,
    empty:/no work orders|nothing to show|no results/i.test(document.body.innerText)
  }));
  console.log('URL kept the dead value:', ui.url.includes(FAKE));
  console.log('Customer chip reads:', JSON.stringify(ui.chip));
  console.log('table rows:', ui.rows, '| empty-state shown:', ui.empty);
  await page.screenshot({path:'/tmp/efa/ev-8832.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
