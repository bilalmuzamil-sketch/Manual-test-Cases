// PERS-04 end to end. Exact test data named: ZZAUTOTEST Filters Recheck (805c112d-...) + Lastone Construction (54d98c61-...)
import * as H from './h.mjs';
import {boot,APP,api} from './boot.mjs';
import fs from 'fs';
const R=JSON.parse(fs.readFileSync('/tmp/frc/obs/r-pers04.json','utf8'));
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-pers04.json',JSON.stringify(R,null,1));console.log('..'+n);};
const ZZ='805c112d-cd94-4783-9507-c3cfab137a6e', ZZNAME='ZZAUTOTEST Filters Recheck';
const REAL='54d98c61-217d-44ad-89bb-79005c902fff', REALNAME='Lastone Construction';
const act=async p=>(await H.chips(p)).map(c=>({t:c.text.replace('|keyboard_arrow_down',''),active:c.cls.includes('filter-chip--active')})).filter(c=>c.active);
{ const {browser,page}=await H.open();
  await H.resetFilters(page);
  await H.openChip(page,'Customer');
  // type to find the ZZAUTOTEST one, tick it, then the real one
  await page.locator('[data-test-id="filter_search_company_id"]').first().fill('ZZAUTOTEST');
  await page.waitForTimeout(3000);
  R.zzVisibleInList=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id^="filter_option_"]')].map(e=>e.innerText.trim().replace(/\n.*/,'')));
  const zid=await page.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu [data-test-id^="filter_option_"]')].find(x=>/ZZAUTOTEST/.test(x.innerText));return e&&e.getAttribute('data-test-id');});
  R.zzOptionTestId=zid;
  if(zid){ await page.locator(`[data-test-id="${zid}"]`).first().click({timeout:15000}); await page.waitForTimeout(3000); }
  await page.locator('[data-test-id="filter_search_company_id"]').first().fill('Lastone Construction');
  await page.waitForTimeout(3000);
  const rid=await page.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu [data-test-id^="filter_option_"]')].find(x=>/Lastone Construction/.test(x.innerText));return e&&e.getAttribute('data-test-id');});
  if(rid){ await page.locator(`[data-test-id="${rid}"]`).first().click({timeout:15000}); await page.waitForTimeout(3000); }
  await H.closePanel(page); await page.waitForTimeout(2000);
  R.bothSelected={chips:await act(page),url:page.url(),rows:(await H.rows(page)).n};
  await H.shot(page,'p04-01-both-selected');
  const pref=await api('GET','/api/users/me/preferences/work-orders-list');
  R.prefWithBoth=(typeof pref.body==='string'?pref.body:JSON.stringify(pref.body)).slice(0,900);
  S('selected'); await browser.close(); }
// delete the ZZAUTOTEST customer while off the page
{ let d=await api('POST','/api/customers/delete',{company_id:ZZ});
  R.delete={status:d.status,body:JSON.stringify(d.body).slice(0,400)};
  if(d.status>=400){ d=await api('DELETE','/api/customers/'+ZZ); R.delete2={status:d.status,body:JSON.stringify(d.body).slice(0,400)}; }
  S('deleted'); }
{ const {browser,page,netlog}=await boot();
  await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(16000);
  R.afterDelete={url:page.url(),chips:await act(page),rows:(await H.rows(page)).n,
    bodyHasError:await page.evaluate(()=>/error|failed|not found/i.test(document.body.innerText.slice(0,4000))),
    toast:await page.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-banner,[role=alert]')].map(e=>e.innerText.trim()))};
  await H.shot(page,'p04-02-after-delete');
  R.openCustomerAfter=await H.openChip(page,'Customer');
  const p=await H.panel(page);
  R.panelAfterDelete={tags:(p&&p.tags||[]).map(t=>t.t.replace('\ncancel','')),
    tickedLabels:(p&&p.options||[]).filter(o=>/check/.test(JSON.stringify(o.icons||[]))).map(o=>o.label.replace('\ncheck','')),
    listHasZZ:JSON.stringify(p&&p.options||[]).includes('ZZAUTOTEST')};
  await H.shot(page,'p04-03-panel-after-delete');
  R.listCallAfterDelete=H.listCalls(netlog).slice(-1);
  S('after'); await browser.close(); }
{ const b=await H.open(); await H.resetFilters(b.page); S('cleanup'); await b.browser.close(); }
