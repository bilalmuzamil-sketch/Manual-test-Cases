import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
// filters WITH results: any global Clear-filters button in toolbar?
await page.goto('https://app.staging.shopview.com/workorders?tab=all&status=estimate',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
const withResults=await page.evaluate(()=>{
  const rows=document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length;
  const clearBtns=[...document.querySelectorAll('button,a,[data-test-id]')].filter(e=>/clear filter/i.test(e.textContent||'')).map(e=>({txt:(e.textContent||'').trim().slice(0,20),dti:e.getAttribute('data-test-id')}));
  return {rows, clearFiltersButtons:clearBtns};
});
console.log('WITH_RESULTS', JSON.stringify(withResults));
// no-results empty state with filter + search
await page.goto('https://app.staging.shopview.com/workorders?tab=all&status=review',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
// add a search
const st=await page.$('[data-test-id=page_search_toggle]'); if(st){ await st.click(); await T(800);
  const si=await page.$('input[type=text]'); if(si){ await si.type('zzzznomatch'); await T(2000);} }
const empty=await page.evaluate(()=>{
  const rows=document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length;
  // find the empty-state container text
  const body=document.body.innerText;
  const idx=body.search(/no work orders|no results|no matching/i);
  const around= idx>=0? body.slice(idx, idx+220): null;
  const clearBtns=[...document.querySelectorAll('button,a')].filter(e=>/clear/i.test(e.textContent||'')).map(e=>(e.textContent||'').trim()).filter(Boolean);
  return {rows, emptyText:around, clearButtons:[...new Set(clearBtns)]};
});
console.log('EMPTY_WITH_SEARCH', JSON.stringify(empty));
await browser.close();
