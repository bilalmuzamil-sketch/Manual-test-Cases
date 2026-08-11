const {boot}=require('./bootF.cjs');
(async()=>{
  const {page,APP}=await boot({});
  await page.waitForTimeout(5000);
  console.log('===== SV-8883 (C29557): is the filter bar on the same row as the tabs? =====');
  const geo=await page.evaluate(()=>{
    const g=s=>{const e=document.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return{y:Math.round(b.y),bottom:Math.round(b.bottom),x:Math.round(b.x)};};
    return {tabAll:g('[data-test-id=tab_all]'),chipStatus:g('[data-test-id=filter_chip_status]'),toggle:g('[data-test-id=toggle_filter_bar]')};
  });
  console.log('tab_all      :',JSON.stringify(geo.tabAll));
  console.log('filter chip  :',JSON.stringify(geo.chipStatus));
  const same = geo.tabAll && geo.chipStatus && !(geo.chipStatus.y >= geo.tabAll.bottom-2);
  console.log('SAME ROW (chip does NOT start below the tabs):', same);

  console.log('\n===== SV-8847 (C29606/07/38897): only a page search active -> what does the empty screen offer? =====');
  await page.goto(APP+'/workorders?search=zzzzznotarealthing&tab=all',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(6000);
  const es=await page.evaluate(()=>({
    url:location.href,
    rows:document.querySelectorAll('tbody tr').length,
    body:document.body.innerText.replace(/\s+/g,' ').slice(0,400),
    clearFilters:!!document.querySelector('[data-test-id*=clear_filters]'),
    clearBtns:[...new Set(Array.from(document.querySelectorAll('button')).filter(b=>b.offsetParent!==null&&/clear/i.test(b.innerText||'')).map(b=>(b.getAttribute('data-test-id')||'?')+' :: '+b.innerText.trim()))]
  }));
  console.log('rows:',es.rows,'| a clear_filters control present:',es.clearFilters);
  console.log('clear-ish buttons:',JSON.stringify(es.clearBtns));
  console.log('screen text:',es.body.slice(0,240));
  await page.screenshot({path:'/tmp/efa/ev-8847.png'});
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
