// Receive later is not offered in the receive window any more. Before calling that a fault, check
// the two settings that govern it - I turned them on and off myself earlier in this pass.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const {browser,page}=await bootProdLogin('/administration/settings',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const tab=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>/^\s*Work Orders\s*$/.test(e.innerText||'')&&e.getBoundingClientRect().width);
  if(t){t.click();return 'opened the Work Orders tab';} return 'no Work Orders tab found';});
console.log(tab); await page.waitForTimeout(6000);
const settings=await page.evaluate(()=>[...document.querySelectorAll('.q-toggle')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>{const row=e.closest('div,tr')||e;
    return {label:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,90),
            on:e.getAttribute('aria-checked')==='true'||/q-toggle--truthy/.test(e.className)};}));
console.log('\nthe work order settings, as they stand:');
settings.forEach(s=>console.log('  ',s.on?'ON ':'off','|',s.label));
await browser.close();
