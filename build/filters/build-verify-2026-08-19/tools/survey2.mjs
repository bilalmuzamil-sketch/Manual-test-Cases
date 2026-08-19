import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', {});
await page.goto('https://app.staging.shopview.com/workorders', { waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(7000);
// dump ALL data-test-ids in the filter area (top region)
const all = await page.evaluate(()=>{
  const dt=[...document.querySelectorAll('[data-test-id]')].map(e=>({id:e.getAttribute('data-test-id'), tag:e.tagName, txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,30)}));
  return dt.filter(x=>!/location_on|content_copy/.test(x.id));
});
console.log('ALL_DTI', JSON.stringify(all,null,0).slice(0,3000));
// Try to find a filter-add control: look for buttons/icons near the chips
const filterCtrls = await page.evaluate(()=>{
  const cands=[...document.querySelectorAll('button,[role=button],[data-test-id]')];
  return cands.map(c=>({id:c.getAttribute&&c.getAttribute('data-test-id'), aria:c.getAttribute&&c.getAttribute('aria-label'), txt:(c.textContent||'').replace(/\s+/g,' ').trim().slice(0,25)})).filter(c=>/filter|add|more|status|customer|technician|advisor|asset|clear|collapse|expand/i.test((c.id||'')+(c.aria||'')+(c.txt||''))).slice(0,40);
});
console.log('FILTER_CTRLS', JSON.stringify(filterCtrls));
// click the Asset on Site chip dropdown to see options
try {
  const arrow = await page.$('[data-test-id=filter_chip_vehicleHere]');
  if(arrow){ await arrow.click(); await page.waitForTimeout(1500);
    const opts = await page.evaluate(()=>[...document.querySelectorAll('[role=option],[role=menuitem],.q-item,li')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40).slice(0,20));
    console.log('ASSET_DROPDOWN', JSON.stringify(opts));
  }
} catch(e){ console.log('asset err', e.message); }
await browser.close();
