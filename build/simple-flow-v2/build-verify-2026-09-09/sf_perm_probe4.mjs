import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/roles-permissions','admin');
await page.waitForTimeout(7000);
await page.screenshot({path:OUT+'/rp-list-sv8683.png',fullPage:true}).catch(()=>{});
// dump role rows w/ their edit affordance
const rows=await page.evaluate(()=>{const clean=e=>(e.textContent||'').replace(/\s+/g,' ').trim();return [...document.querySelectorAll('table tbody tr')].map((tr,i)=>({i,t:clean(tr).slice(0,50)}));});
console.log('RP ROWS:', JSON.stringify(rows));
// open a NON-admin role editor via its more_vert/edit (avoid Admin). Prefer a row NOT starting with Admin.
const target=rows.find(r=>!/^admin/i.test(r.t));
console.log('TARGET ROLE:', JSON.stringify(target||null));
if(target){
  // click the row's more_vert then an "Edit"/"View" item, or the row itself
  await page.evaluate(i=>{const tr=[...document.querySelectorAll('table tbody tr')][i];const mv=tr.querySelector('.q-btn,[class*=more],button,i.material-icons');if(mv)mv.click();else tr.click();}, target.i);
  await page.waitForTimeout(2500);
  // click Edit in any popup menu
  await page.evaluate(()=>{const el=[...document.querySelectorAll('.q-menu .q-item, .q-item, button, a')].find(e=>/^edit$|view|permission/i.test((e.textContent||'').trim()));if(el)el.click();});
  await page.waitForTimeout(6000);
  console.log('URL:', page.url());
  await page.screenshot({path:OUT+'/rp-editor-sv8683.png',fullPage:true}).catch(()=>{});
  const toggles=await page.evaluate(()=>{const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};return [...new Set([...document.querySelectorAll('.q-toggle,.q-checkbox,.q-item,label')].map(clean).filter(t=>t&&t.length<60&&/receiv|order|pick|financ|review|approv|create|edit|vendor|complet|line|part|invoice/i.test(t)))];});
  console.log('PERMISSION TOGGLES:', JSON.stringify(toggles));
}
await browser.close();
