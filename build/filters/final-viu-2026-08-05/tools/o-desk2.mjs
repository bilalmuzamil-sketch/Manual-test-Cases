import * as H from './h.mjs'; import fs from 'fs';
const {browser,page,netlog}=await H.open({settle:16000});
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/desk2.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const geo=()=>page.evaluate(()=>{const t=document.querySelector('table,thead');
  const chips=[...document.querySelectorAll('button.filter-chip')];
  const tabs=[...document.querySelectorAll('.q-tab,[role=tab]')];
  return {tableTop:t?Math.round(t.getBoundingClientRect().y):null,chipsVisible:chips.length,
    chipsY:chips[0]?Math.round(chips[0].getBoundingClientRect().y):null,
    tabsY:tabs[0]?Math.round(tabs[0].getBoundingClientRect().y):null,
    rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3).length,
    clearFilters:!!document.querySelector('[data-test-id="clear_filters"]'),
    toggle:(()=>{const b=document.querySelector('[data-test-id="toggle_filter_bar"]');
      return b?{cls:b.className.slice(0,110),badge:!!b.querySelector('.q-badge,[class*=dot]'),
        html:b.innerHTML.slice(0,220),color:getComputedStyle(b).color}:null;})()};});
async function reset(){await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(11000);
 const cf=page.locator('[data-test-id="clear_filters"]');if(await cf.count()){await cf.first().click({timeout:15000}).catch(()=>{});await page.waitForTimeout(4000);} }

// ===== COLLAPSE with a filter active =====
await reset();
await page.locator('button.filter-chip').filter({hasText:'Status'}).first().click({timeout:20000}); await page.waitForTimeout(2000);
await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000}); await page.waitForTimeout(4000);
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
{ const o={}; o.expanded=await geo();
  await page.locator('[data-test-id="toggle_filter_bar"]').first().click({timeout:15000}); await page.waitForTimeout(4000);
  o.collapsed=await geo(); await H.shot(page,'desk2-collapsed');
  o.TABLE_MOVED_UP = o.collapsed.tableTop < o.expanded.tableTop-4;
  o.CHIPS_HIDDEN = o.collapsed.chipsVisible===0;
  o.FILTER_STILL_APPLIES = o.collapsed.rows===o.expanded.rows;
  o.INDICATOR_WHEN_ACTIVE = o.collapsed.toggle;
  await page.locator('[data-test-id="toggle_filter_bar"]').first().click({timeout:15000}); await page.waitForTimeout(4000);
  o.reexpanded=await geo(); o.reexpandedChips=(await H.chips(page)).map(c=>c.text.replace(/\n/g,'|'));
  await H.shot(page,'desk2-reexpanded');
  R.collapseActive=o; S('collapseActive');
  console.log('COLLAPSE (filter active): tableTop',o.expanded.tableTop,'->',o.collapsed.tableTop,'MOVED_UP',o.TABLE_MOVED_UP);
  console.log('  chipsVisible',o.expanded.chipsVisible,'->',o.collapsed.chipsVisible,'CHIPS_HIDDEN',o.CHIPS_HIDDEN);
  console.log('  rows',o.expanded.rows,'->',o.collapsed.rows,'STILL_APPLIES',o.FILTER_STILL_APPLIES);
  console.log('  toggle when active:',JSON.stringify(o.INDICATOR_WHEN_ACTIVE));
  console.log('  re-expanded chips:',o.reexpandedChips.join(' | '),'| clearFilters',o.reexpanded.clearFilters);
}
// ===== COLLAPSE with NO filter active: indicator? =====
await reset();
{ const o={}; o.expanded=await geo();
  await page.locator('[data-test-id="toggle_filter_bar"]').first().click({timeout:15000}); await page.waitForTimeout(4000);
  o.collapsed=await geo(); o.TABLE_MOVED_UP=o.collapsed.tableTop<o.expanded.tableTop-4;
  await H.shot(page,'desk2-collapsed-nofilter');
  await page.locator('[data-test-id="toggle_filter_bar"]').first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(3000);
  R.collapseNoFilter=o; S('collapseNoFilter');
  console.log('COLLAPSE (no filter): tableTop',o.expanded.tableTop,'->',o.collapsed.tableTop,'MOVED_UP',o.TABLE_MOVED_UP,'| toggle',JSON.stringify(o.collapsed.toggle&&o.collapsed.toggle.badge));
}
// ===== SEARCH-ONLY EMPTY STATE (SV-8847) =====
await reset();
{ const o={};
  await page.locator('[data-test-id="page_search_toggle"]').first().click({timeout:15000}); await page.waitForTimeout(2200);
  o.afterToggle=await page.evaluate(()=>({inputs:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>({ph:i.placeholder,testid:i.getAttribute('data-test-id')}))}));
  const inp=page.locator('input[placeholder="Search"]').last();
  o.inputCount=await inp.count();
  if(o.inputCount){ await inp.click({timeout:9000}); await inp.type('ZZQQNOMATCHXX',{delay:60}); await page.waitForTimeout(6000); }
  o.state=await page.evaluate(()=>{const t=document.body.innerText; const m=t.search(/No work orders|No results|no results/i);
    return {rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3).length,
      emptyBlock:m>=0?t.slice(Math.max(0,m-30),m+260):null,
      clearLinks:[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})),
      url:location.href};});
  await H.shot(page,'desk2-searchonly-empty');
  R.searchOnlyEmpty=o; S('searchEmpty');
  console.log('SEARCH-ONLY EMPTY: inputs after toggle',JSON.stringify(o.afterToggle.inputs));
  console.log('  rows',o.state.rows,'| url',o.state.url.slice(-60));
  console.log('  MESSAGE:',JSON.stringify(o.state.emptyBlock));
  console.log('  CLEAR LINKS OFFERED:',JSON.stringify(o.state.clearLinks));
}
// ===== FILTER+SEARCH empty state: are they cleared independently? (S8-R5) =====
{ const o={};
  await page.locator('button.filter-chip').filter({hasText:'Status'}).first().click({timeout:20000}).catch(()=>{}); await page.waitForTimeout(2000);
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(4000);
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  o.state=await page.evaluate(()=>{const t=document.body.innerText; const m=t.search(/No work orders|No results|no results/i);
    return {rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3).length,
      emptyBlock:m>=0?t.slice(Math.max(0,m-30),m+260):null,
      clearLinks:[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})),
      searchBoxValue:(()=>{const i=[...document.querySelectorAll('input')].filter(x=>x.offsetParent&&x.placeholder==='Search')[0];return i?i.value:null;})(),
      url:location.href};});
  await H.shot(page,'desk2-filter-and-search-empty');
  R.filterAndSearchEmpty=o; S('bothEmpty');
  console.log('FILTER+SEARCH EMPTY: rows',o.state.rows,'| searchBox',JSON.stringify(o.state.searchBoxValue),'| url',o.state.url.slice(-70));
  console.log('  MESSAGE:',JSON.stringify(o.state.emptyBlock));
  console.log('  CLEAR LINKS:',JSON.stringify(o.state.clearLinks));
}
S('done'); await browser.close();
