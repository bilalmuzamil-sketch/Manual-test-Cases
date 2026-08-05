import * as H from './h.mjs'; import fs from 'fs';
const {browser,page,netlog}=await H.open({settle:16000});
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/search.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const st=()=>page.evaluate(()=>{const t=document.body.innerText; const m=t.search(/No work orders|No results|no results/i);
  return {rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3).length,
    emptyBlock:m>=0?t.slice(Math.max(0,m-30),m+280):null,
    clearLinks:[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})),
    searchVal:(()=>{const i=document.querySelector('[data-test-id=page_search_input]');return i?i.value:null;})(),
    url:location.href};});
const calls=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>decodeURIComponent(n.url.split('?')[1]||'').slice(0,190));
async function reset(){await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(11000);
 const cf=page.locator('[data-test-id="clear_filters"]');if(await cf.count()){await cf.first().click({timeout:15000}).catch(()=>{});await page.waitForTimeout(4000);} }
async function openSearch(){ await page.locator('[data-test-id="page_search_toggle"]').first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(1800);
  return page.locator('[data-test-id="page_search_input"]').first(); }

// ---- A) SEARCH ONLY, no match  (SV-8847 / EMPTY-01 / EMPTY-02 / PSRCH-09) ----
await reset();
{ const o={}; const n0=calls().length;
  const inp=await openSearch(); o.inputPresent=await inp.count();
  o.placeholder=await page.evaluate(()=>{const i=document.querySelector('[data-test-id=page_search_input]');return i?i.placeholder:null;});
  await inp.click(); const t0=Date.now(); await inp.type('ZZQQNOMATCHXX',{delay:55});
  await page.waitForTimeout(400);  o.at400ms={calls:calls().length-n0};
  await page.waitForTimeout(6000); o.state=await st(); o.debounceCalls=calls().slice(n0);
  await H.shot(page,'search-01-nomatch');
  R.searchOnly=o; S('searchOnly');
  console.log('SEARCH ONLY no-match: placeholder',JSON.stringify(o.placeholder),'rows',o.state.rows);
  console.log('  MESSAGE   :',JSON.stringify(o.state.emptyBlock));
  console.log('  CLEAR LINKS:',JSON.stringify(o.state.clearLinks));
  console.log('  url       :',o.state.url.slice(-72));
  console.log('  api calls :',JSON.stringify(o.debounceCalls.slice(-2)));
}
// ---- B) FILTER + SEARCH both active, no match (S8-R5 independence) ----
{ const o={};
  await page.locator('button.filter-chip').filter({hasText:'Status'}).first().click({timeout:20000}).catch(()=>{}); await page.waitForTimeout(2000);
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(4500);
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  o.state=await st(); await H.shot(page,'search-02-filter-and-search');
  o.clearLinkTexts=(o.state.clearLinks||[]).map(x=>x.t);
  R.filterPlusSearch=o; S('both');
  console.log('FILTER+SEARCH no-match: rows',o.state.rows,'searchVal',JSON.stringify(o.state.searchVal),'url',o.state.url.slice(-72));
  console.log('  MESSAGE:',JSON.stringify(o.state.emptyBlock));
  console.log('  CLEAR LINKS:',JSON.stringify(o.state.clearLinks));
  // press Clear Filters -> does the search survive? (S8-R5)
  const cf=page.locator('[data-test-id="clear_filters"]');
  if(await cf.count()){ await cf.first().click({timeout:15000}); await page.waitForTimeout(5000);
    R.afterClearFilters=await st();
    console.log('  after Clear Filters: rows',R.afterClearFilters.rows,'searchVal',JSON.stringify(R.afterClearFilters.searchVal),'url',R.afterClearFilters.url.slice(-72));
    console.log('    SEARCH SURVIVED CLEAR FILTERS:', R.afterClearFilters.searchVal==='ZZQQNOMATCHXX'); }
  S('afterClear');
}
// ---- C) search matches something: in-place, no apply button, url? ----
await reset();
{ const o={}; const n0=calls().length;
  const inp=await openSearch(); await inp.click(); await inp.type('Aagate',{delay:55});
  await page.waitForTimeout(6000);
  o.state=await st(); o.rowsSample=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].slice(0,4).map(r=>r.innerText.replace(/\n/g,'|').slice(0,70)));
  o.applyBtn=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/apply|submit/i.test(b.innerText)).map(b=>b.innerText.trim()));
  o.calls=calls().slice(n0);
  o.urlHasSearch=/search=/.test(o.state.url)||/q=/.test(o.state.url);
  await H.shot(page,'search-03-match');
  R.searchMatch=o; S('match');
  console.log('SEARCH match "Aagate": rows',o.state.rows,'url',o.state.url.slice(-72),'urlHasSearchParam',o.urlHasSearch);
  console.log('  applyBtn:',JSON.stringify(o.applyBtn),'| sample:',JSON.stringify(o.rowsSample.slice(0,2)));
  console.log('  api:',JSON.stringify(o.calls.slice(-1)));
  // Enter changes nothing?
  const before=o.state.rows; await page.keyboard.press('Enter'); await page.waitForTimeout(3500);
  R.afterEnter=await st(); console.log('  after Enter: rows',R.afterEnter.rows,'same?',R.afterEnter.rows===before,'url',R.afterEnter.url.slice(-60));
  S('enter');
}
S('done'); await browser.close();
