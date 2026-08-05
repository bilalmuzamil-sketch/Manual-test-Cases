// PERS-02 / PERS-04 / SV-8828 re-check on d00239b, plus the two o-fin steps that errored.
import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-pers.json',JSON.stringify(R,null,1));console.log('..'+n);};
{
  const {browser,page,netlog}=await H.open();
  await H.resetFilters(page);
  // set TWO filters: Status Paid + a customer
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:20000});
  await page.waitForTimeout(3000);
  await H.closePanel(page);
  await H.openChip(page,'Customer');
  const ids=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_/.test(t)).slice(0,2));
  const custLabel=await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.innerText.trim():null;},ids[0]);
  await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:20000});
  await page.waitForTimeout(3000);
  await H.closePanel(page);
  R.setState={chips:(await H.chips(page)).filter(c=>c.cls.includes('active')).map(c=>c.text),url:page.url(),rows:(await H.rows(page)).n,customerPicked:custLabel};
  await H.shot(page,'rp-01-filters-set');
  // read back the saved preference
  const pref=await H.api('GET','/api/users/me/preferences/work-orders-list');
  R.prefAfterSet={status:pref.status,body:typeof pref.body==='string'?pref.body.slice(0,1200):JSON.stringify(pref.body).slice(0,1200)};
  R.prefCalls=H.prefCalls(netlog);
  S('set'); await browser.close();
}
// ---- BRAND NEW browser context: nothing remembered locally. Does the app restore the filters? ----
{
  const {browser,page,netlog}=await boot();
  await page.evaluate(()=>{localStorage.removeItem('wo-list');sessionStorage.clear();});
  await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(14000);
  R.freshVisit={url:page.url(),chips:await H.chips(page),rows:await H.rows(page),
    activeChips:(await H.chips(page)).filter(c=>c.cls.includes('active')).map(c=>c.text)};
  R.freshVisit.backToSaved=await page.evaluate(()=>{
    const b=document.querySelector('[data-test-id="back_to_saved_filters"]');
    const any=[...document.querySelectorAll('button,a')].filter(e=>/back to my|saved filter/i.test(e.innerText||''));
    return {byTestId:!!b, text:b?b.innerText.trim():null, byText:any.map(e=>e.innerText.trim())};});
  R.freshVisit.listCalls=H.listCalls(netlog).slice(-3);
  await H.shot(page,'rp-02-fresh-context');
  S('fresh'); await browser.close();
}
// ---- the two o-fin steps that errored: Imported untick + seven-value chip format ----
{
  const {browser,page,netlog}=await H.open();
  await H.resetFilters(page);
  await H.openChip(page,'Status');
  // tick ALL nine statuses without reopening (now possible) -> chip format with 7+ values
  const opts=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_status_/.test(t)));
  R.statusOptionIds=opts;
  const seven=opts.filter(o=>!/imported/.test(o)).slice(0,7);
  for(const o of seven){ try{await page.locator(`[data-test-id="${o}"]`).first().click({timeout:8000});await page.waitForTimeout(900);}catch(e){R['tickErr_'+o]=e.message.slice(0,90);} }
  await page.waitForTimeout(3000);
  R.sevenValuesChipFormat={ticked:seven,chips:(await H.chips(page)).map(c=>({t:c.text,w:c.w,active:c.cls.includes('active')})),url:page.url(),panelOpen:await H.panelOpen(page)};
  await H.shot(page,'rp-03-seven-values');
  S('seven');
  await H.resetFilters(page);
  // Imported exclusivity: tick Imported, then untick it
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_imported"]').first().click({timeout:20000});
  await page.waitForTimeout(3500);
  R.importedOn={chips:(await H.chips(page)).map(c=>({t:c.text,disabled:c.disabled,active:c.cls.includes('active')})),url:page.url(),rows:(await H.rows(page)).n,panelOpen:await H.panelOpen(page)};
  await H.shot(page,'rp-04-imported-on');
  if(!await H.panelOpen(page)) await H.openChip(page,'Status');
  try{
    await page.locator('[data-test-id="filter_option_status_imported"]').first().click({timeout:15000});
    await page.waitForTimeout(3500);
    R.importedUntick={ok:true,chips:(await H.chips(page)).map(c=>({t:c.text,disabled:c.disabled,active:c.cls.includes('active')})),url:page.url(),rows:(await H.rows(page)).n};
  }catch(e){R.importedUntick={ok:false,err:e.message.slice(0,200)};}
  await H.shot(page,'rp-05-imported-untick');
  R.finalPrefs=H.prefCalls(netlog);
  await H.resetFilters(page);
  S('done'); await browser.close();
}
