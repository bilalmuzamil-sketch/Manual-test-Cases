// Desktop VIU: bar/status/customer/tech/advisor/asset/chips/collapse/empty/tabs/persistence/url
import * as H from './h.mjs'; import fs from 'fs';
const {browser,page,netlog}=await H.open({settle:16000});
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/desk.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const listQ=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>decodeURIComponent(n.url.split('?')[1]||'').slice(0,200));
async function reset(){await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(11000);
 const cf=page.locator('[data-test-id="clear_filters"]');if(await cf.count()){await cf.first().click({timeout:15000}).catch(()=>{});await page.waitForTimeout(4000);} }
await reset();
// ---- BAR-01/02/03: where is the bar, and are the chips on the tab row? ----
R.barGeometry=await page.evaluate(()=>{
  const tabs=[...document.querySelectorAll('.q-tab,[role=tab]')].map(t=>{const r=t.getBoundingClientRect();return{t:t.innerText.trim(),y:Math.round(r.y),bottom:Math.round(r.bottom)};});
  const chips=[...document.querySelectorAll('button.filter-chip')].map(b=>{const r=b.getBoundingClientRect();return{t:b.innerText.trim().replace(/\n/g,'|'),y:Math.round(r.y),x:Math.round(r.x),testid:b.getAttribute('data-test-id')};});
  const tbl=document.querySelector('table,thead'); const tr=tbl?tbl.getBoundingClientRect():null;
  const toolbarIcons=[...document.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')).filter(t=>/toggle_filters|filter_bar|column|layout|search/i.test(t));
  return {tabs,chips,tableTop:tr?Math.round(tr.y):null,toolbarIcons,
    SAME_ROW: chips.length&&tabs.length? Math.abs(chips[0].y-tabs[0].y)<26 : null,
    tabsY:tabs[0]&&tabs[0].y, chipsY:chips[0]&&chips[0].y};});
await H.shot(page,'desk-01-bar'); S('bar');
console.log('BAR: tabsY',R.barGeometry.tabsY,'chipsY',R.barGeometry.chipsY,'SAME_ROW',R.barGeometry.SAME_ROW);
console.log('  chips:',R.barGeometry.chips.map(c=>c.t+'@y'+c.y).join('  '));
console.log('  toolbarIcons:',JSON.stringify(R.barGeometry.toolbarIcons));
// ---- STAT-01: the nine statuses + Clear Selection ----
{ const o={};
  await page.locator('button.filter-chip').filter({hasText:'Status'}).first().click({timeout:20000}); await page.waitForTimeout(2200);
  o.panel=await H.panel(page);
  o.optionLabels=(o.panel.options||[]).map(x=>x.label).filter(Boolean);
  o.clearSelection=(o.panel.buttons||[]).filter(b=>/clear/i.test(b.t));
  await H.shot(page,'desk-02-status'); R.status=o; S('status');
  console.log('STATUS panel options:',JSON.stringify(o.optionLabels));
  console.log('  clear:',JSON.stringify(o.clearSelection));
  // STAT-02: tick one -> applies immediately, no apply button
  const n0=listQ().length; const u0=page.url();
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000}); await page.waitForTimeout(4000);
  R.stat02={url:page.url(),applied:page.url()!==u0,calls:listQ().length-n0,
    applyBtn:await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)).map(b=>b.innerText.trim())),
    rows:await H.rows(page), panelStillOpen:!!(await H.panel(page))};
  console.log('STAT-02 applied on tick:',R.stat02.applied,'| applyBtn',JSON.stringify(R.stat02.applyBtn),'| rows',R.stat02.rows.n,R.stat02.rows.statuses,'| panelOpen',R.stat02.panelStillOpen);
  // STAT-03 multi-select without reopening (SV-8824)
  try{ await page.locator('[data-test-id="filter_option_status_declined"]').first().click({timeout:9000}); await page.waitForTimeout(4000);
    R.stat03={ok:true,url:page.url(),rows:await H.rows(page),chips:(await H.chips(page)).map(c=>c.text.replace(/\n/g,'|'))};
  }catch(e){R.stat03={ok:false,err:e.message.slice(0,140)};}
  console.log('STAT-03 second tick without reopening:',JSON.stringify(R.stat03&&{ok:R.stat03.ok,url:R.stat03.url&&R.stat03.url.slice(-52),n:R.stat03.rows&&R.stat03.rows.n,st:R.stat03.rows&&R.stat03.rows.statuses}));
  console.log('  chips:',R.stat03.chips&&R.stat03.chips.join(' | '));
  S('status2');
}
// ---- CHIP-01/03: chip active look + Clear Filters presence ----
R.chipsActive=await H.chips(page);
R.clearFiltersPresent=await page.evaluate(()=>{const e=document.querySelector('[data-test-id="clear_filters"]');
  if(!e) return {present:false}; const r=e.getBoundingClientRect();
  const chips=[...document.querySelectorAll('button.filter-chip')].map(b=>b.getBoundingClientRect());
  const last=chips[chips.length-1];
  return {present:true,text:e.innerText.trim(),x:Math.round(r.x),y:Math.round(r.y),rightOfChips:last? r.x>last.right-5:null};});
await H.shot(page,'desk-03-chips-active'); S('chips');
console.log('CHIPS active:',R.chipsActive.map(c=>c.text.replace(/\n/g,'|')+' bg'+c.bg).join(' | '));
console.log('CLEAR FILTERS:',JSON.stringify(R.clearFiltersPresent));
// ---- COLL-01/05: collapse the bar; does the table move up? ----
{ const o={};
  o.before={tableTop:await page.evaluate(()=>{const t=document.querySelector('table,thead');return t?Math.round(t.getBoundingClientRect().y):null;}),
            chipsVisible:(await H.chips(page)).length, rows:(await H.rows(page)).n, url:page.url()};
  const tg=page.locator('[data-test-id="button_toggle_filters"]');
  o.togglePresent=await tg.count();
  if(o.togglePresent){ await tg.first().click({timeout:15000}); await page.waitForTimeout(3500); }
  o.after={tableTop:await page.evaluate(()=>{const t=document.querySelector('table,thead');return t?Math.round(t.getBoundingClientRect().y):null;}),
           chipsVisible:(await H.chips(page)).length, rows:(await H.rows(page)).n, url:page.url()};
  o.TABLE_MOVED_UP=(o.before.tableTop!=null&&o.after.tableTop!=null)? o.after.tableTop<o.before.tableTop-4 : null;
  o.FILTERS_STILL_APPLIED=o.after.rows===o.before.rows;
  o.indicator=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_toggle_filters"]');
    return b? {cls:b.className.slice(0,90),html:b.innerHTML.slice(0,200),badge:!!b.querySelector('.q-badge,[class*=dot],[class*=indicator]')}:null;});
  await H.shot(page,'desk-04-collapsed');
  // expand again
  if(o.togglePresent){ await tg.first().click({timeout:15000}); await page.waitForTimeout(3500); }
  o.reexpanded={chipsVisible:(await H.chips(page)).length,chips:(await H.chips(page)).map(c=>c.text.replace(/\n/g,'|')),
    clearFilters:await page.evaluate(()=>!!document.querySelector('[data-test-id="clear_filters"]'))};
  await H.shot(page,'desk-05-reexpanded');
  R.collapse=o; S('collapse');
  console.log('COLLAPSE: togglePresent',o.togglePresent,'| tableTop',o.before.tableTop,'->',o.after.tableTop,'| MOVED_UP',o.TABLE_MOVED_UP);
  console.log('  chipsVisible',o.before.chipsVisible,'->',o.after.chipsVisible,'| rows',o.before.rows,'->',o.after.rows,'| indicator',JSON.stringify(o.indicator&&o.indicator.badge));
  console.log('  re-expanded chips:',o.reexpanded.chips.join(' | '),'| clearFilters',o.reexpanded.clearFilters);
}
// ---- EMPTY-01/02 + PSRCH: search-only empty state (SV-8847) ----
await reset();
{ const o={};
  const sb=page.locator('[data-test-id="button_open_search"],[data-test-id="button_open_mobile_search"]');
  o.searchBtnPresent=await sb.count();
  if(o.searchBtnPresent){ await sb.first().click({timeout:15000}).catch(()=>{}); await page.waitForTimeout(1800); }
  const inp=page.locator('input[placeholder*="Search" i]').first();
  o.inputPresent=await inp.count();
  if(o.inputPresent){ await inp.fill('ZZQQNOMATCHXX'); await page.waitForTimeout(5000); }
  o.state=await page.evaluate(()=>{const t=document.body.innerText; const m=t.search(/No work orders|No results|no results/i);
    return {rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3).length,
      emptyBlock:m>=0?t.slice(Math.max(0,m-40),m+300):null,
      clearLinks:[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})),
      url:location.href};});
  await H.shot(page,'desk-06-searchonly-empty');
  R.searchOnlyEmpty=o; S('searchempty');
  console.log('SEARCH-ONLY EMPTY: rows',o.state.rows);
  console.log('  message:',JSON.stringify(o.state.emptyBlock&&o.state.emptyBlock.slice(0,220)));
  console.log('  clear links offered:',JSON.stringify(o.state.clearLinks));
  console.log('  url:',o.state.url.slice(-70));
}
S('done'); await browser.close();
