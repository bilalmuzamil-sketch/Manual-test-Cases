import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-cust2.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,200)};}S(k);};
await H.resetFilters(page);
await T('pickLastoneConstruction',async()=>{
  await H.openChip(page,'Customer');
  await page.locator('[data-test-id="filter_search_company_id"]').fill('Lastone Construction');
  await page.waitForTimeout(2500);
  const p=await H.panel(page); const o=p.options[0];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000});
  await page.waitForTimeout(4000);
  return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.shot(page,'cy-01');
// S3-R4: is the SELECTED customer marked in the list?
await T('selectedMarkedInList',async()=>{
  await H.openChip(page,'Customer');
  await page.locator('[data-test-id="filter_search_company_id"]').fill('Lastone');
  await page.waitForTimeout(2500);
  return page.evaluate(()=>{const m=document.querySelector('.q-menu');
    const opts=[...m.querySelectorAll('.filter-search-list-panel__options [role=listitem]')].map(o=>({
      label:o.innerText.trim(),cls:o.className,html:o.innerHTML.slice(0,400),
      icons:[...o.querySelectorAll('i,.q-icon,svg')].map(i=>i.textContent.trim()||'svg'),
      bg:getComputedStyle(o).backgroundColor,fw:getComputedStyle(o).fontWeight}));
    const tags=[...m.querySelectorAll('.filter-search-list-panel__tags .q-chip')].map(c=>c.innerText.trim().replace(/\n/g,' '));
    return {opts,tags,optionsText:[...m.querySelectorAll('.filter-search-list-panel__options')].map(x=>x.innerText)};});});
await H.shot(page,'cy-02-selected-in-list');
// combined status+customer (S8-R3 AND across filters)
await T('combined',async()=>{
  await H.closePanel(page);
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000});
  await page.waitForTimeout(4000);
  const n=H.listCalls(netlog).length;
  return {calls:H.listCalls(netlog).slice(n>0?n-1:0),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.shot(page,'cy-03-combined');
await T('combinedNoMatch',async()=>{
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000});
  await page.waitForTimeout(2500);
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_declined"]').first().click({timeout:15000});
  await page.waitForTimeout(4000);
  const rows=await H.rows(page);
  const empty=await page.evaluate(()=>{const t=document.querySelector('tbody');const q=document.querySelector('.q-table__bottom,[class*=no-data],[class*=empty]');
    return {tbody:t?t.innerText.trim().slice(0,300):null,
      pageBottom:document.body.innerText.slice(-500),
      clearLinks:[...document.querySelectorAll('button,a')].filter(e=>/clear filters/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id'),y:Math.round(e.getBoundingClientRect().y)}))};});
  return {url:page.url(),chips:await H.chips(page),rows,empty};});
await H.shot(page,'cy-04-nomatch');
await H.resetFilters(page);
await browser.close(); console.log('DONE');
