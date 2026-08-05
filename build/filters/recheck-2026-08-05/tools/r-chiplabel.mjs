// Which chip types lose their value label after a reload? All five, one run.
import * as H from './h.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString(),perChip:{}};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-chiplabel.json',JSON.stringify(R,null,1));console.log('..'+n);};
const act=async page=>(await H.chips(page)).map(c=>({t:c.text.replace('|keyboard_arrow_down',''),active:c.cls.includes('filter-chip--active')}));
const {browser,page}=await H.open();
for(const chip of ['Status','Customer','Lead Technician','Service Advisor','Asset on Site']){
  await H.resetFilters(page);
  const o={};
  await H.openChip(page,chip);
  const ids=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_/.test(t)).slice(0,1));
  o.optionId=ids[0];
  o.optionLabel=await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.innerText.trim().replace(/\n.*/,''):null;},ids[0]);
  await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:20000});
  await page.waitForTimeout(3000); await H.closePanel(page); await page.waitForTimeout(1500);
  o.afterSelect=(await act(page)).filter(c=>c.active);
  await page.reload({waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(14000);
  o.afterReload=(await act(page)).filter(c=>c.active);
  o.url=page.url();
  o.labelSurvivesReload = JSON.stringify(o.afterSelect)===JSON.stringify(o.afterReload);
  R.perChip[chip]=o; S(chip);
  await H.shot(page,'rcl-'+chip.replace(/ /g,'').toLowerCase());
}
await H.resetFilters(page); S('done'); await browser.close();
