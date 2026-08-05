import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-custchip2.json',JSON.stringify(R,null,1));console.log('..'+n);};
let picked=null;
{ const {browser,page}=await H.open();
  await H.resetFilters(page);
  await H.openChip(page,'Customer');
  const ids=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_/.test(t)).slice(0,1));
  picked=await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.innerText.trim():null;},ids[0]);
  await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:20000});
  await page.waitForTimeout(3500);
  await H.closePanel(page); await page.waitForTimeout(2500);
  R.beforeLeaving={picked,url:page.url(),chips:(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active')}))};
  await H.shot(page,'rc2-01-just-selected');
  S('set'); await browser.close(); }
{ const {browser,page,netlog}=await boot();
  await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(18000);
  R.freshContext={url:page.url(),rows:(await H.rows(page)).n,
    chips:(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active')}))};
  await H.shot(page,'rc2-02-fresh-restored');
  R.openCustomer=await H.openChip(page,'Customer');
  const p=await H.panel(page);
  R.panelTags=p&&p.tags; R.panelInput=p&&p.inputs;
  R.panelTickedLabels=(p&&p.options||[]).filter(o=>/check/.test(JSON.stringify(o.icons||[]))||o.checked==='true').map(o=>o.label);
  await H.shot(page,'rc2-03-panel-restored');
  R.chipsWithPanelOpen=(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active')}));
  R.custListCalls=netlog.filter(n=>n.phase==='res'&&/list-options/.test(n.url)).map(n=>({s:n.status,u:n.url.replace(/^https:\/\/[^/]+/,'').slice(0,120)}));
  R.woCalls=H.listCalls(netlog).slice(-2);
  S('fresh'); await browser.close(); }
{ const {browser,page}=await H.open(); await H.resetFilters(page); S('cleanup'); await browser.close(); }
