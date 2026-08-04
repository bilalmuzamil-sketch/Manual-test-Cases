import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-status2.json',JSON.stringify(R,null,1));console.log('..'+n);};
R.urlOnLoad=page.url();
R.chipsOnLoad=await H.chips(page);
R.resetDone=await H.resetFilters(page);
R.urlAfterReset=page.url();
R.chipsAfterReset=await H.chips(page);
R.rowsAfterReset=await H.rows(page);
R.clearFiltersVisibleWhenNoFilters=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="clear_filters"]');return b?{present:true,vis:b.offsetParent!==null,text:b.innerText.trim()}:{present:false};});
S('reset');
// open Status, assert panel, tick ONE, immediately check panel open state
R.open1=await H.openChip(page,'Status');
R.panel1=await H.panel(page);
let n=H.listCalls(netlog).length;
await page.locator('[data-test-id="filter_option_status_estimate"]').first().click({timeout:20000});
await page.waitForTimeout(600);
R.panelImmediatelyAfterTick=await H.panel(page);
await page.waitForTimeout(3500);
R.panel3sAfterTick=await H.panel(page);
R.tick1={calls:H.listCalls(netlog).slice(n),rows:await H.rows(page),chips:await H.chips(page),url:page.url()};
await H.shot(page,'sx-01-one-status');
S('tick1');
// second tick WITHOUT reopening if panel still open
R.panelStillOpenBeforeSecond=await H.panelOpen(page);
if(!R.panelStillOpenBeforeSecond) R.reopen=await H.openChip(page,'Status');
n=H.listCalls(netlog).length;
await page.locator('[data-test-id="filter_option_status_approved"]').first().click({timeout:20000});
await page.waitForTimeout(3500);
R.tick2={calls:H.listCalls(netlog).slice(n),rows:await H.rows(page),chips:await H.chips(page),url:page.url(),panel:await H.panel(page)};
await H.shot(page,'sx-02-two-status');
S('tick2');
// Clear Selection by test id
n=H.listCalls(netlog).length;
if(!await H.panelOpen(page)) await H.openChip(page,'Status');
R.clearSel=await H.clearSelById(page,'status');
R.afterClearSel={calls:H.listCalls(netlog).slice(n),rows:await H.rows(page),chips:await H.chips(page),url:page.url(),panel:await H.panel(page)};
await H.shot(page,'sx-03-clearsel');
S('clearsel');
// outside click on a genuinely empty area (page header whitespace)
await H.openChip(page,'Status');
await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:20000});
await page.waitForTimeout(3000);
await page.mouse.click(1300,60); await page.waitForTimeout(2000);
R.outside={panelOpen:await H.panelOpen(page),chips:await H.chips(page),rows:await H.rows(page),url:page.url()};
await H.shot(page,'sx-04-outside');
S('outside');
// IMPORTED exclusivity
await H.resetFilters(page);
await H.openChip(page,'Status');
n=H.listCalls(netlog).length;
await page.locator('[data-test-id="filter_option_status_imported"]').first().click({timeout:20000});
await page.waitForTimeout(4000);
R.imported={calls:H.listCalls(netlog).slice(n),chips:await H.chips(page),rows:await H.rows(page),url:page.url(),panel:await H.panel(page)};
await H.shot(page,'sx-05-imported');
// with imported active, try opening Customer
R.importedThenCustomer=await H.openChip(page,'Customer');
R.importedCustomerPanel=await H.panel(page);
R.importedChipsState=await H.chips(page);
await H.shot(page,'sx-06-imported-customer');
S('imported');
// try to add a second status while Imported is on
if(!await H.panelOpen(page)) await H.openChip(page,'Status');
const p=await H.panel(page);
R.importedStatusPanel=p;
if(p){ try{ await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:8000});
  await page.waitForTimeout(3500); R.importedPlusPaid={chips:await H.chips(page),url:page.url(),rows:await H.rows(page),panel:await H.panel(page)};}
  catch(e){R.importedPlusPaid={ERROR:e.message.slice(0,150)};} }
await H.shot(page,'sx-07-imported-plus');
await H.resetFilters(page);
R.finalUrl=page.url();
R.prefs=H.prefCalls(netlog);
S('done');
await browser.close();
