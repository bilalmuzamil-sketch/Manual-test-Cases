import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg,i").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(6000);

// 1) Open Settings from left sidebar, capture the sidebar item labels
async function sidebar(){
  return await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('.q-drawer a, .q-drawer .q-item, aside a, nav a')].map(lab).filter(t=>t&&t.length<40).slice(0,60);}, lab);
}
await page.goto('https://sv8683.qa.shopview.com/settings',{waitUntil:'domcontentloaded'}).catch(()=>{});
await page.waitForTimeout(6000);
console.log('SETTINGS SIDEBAR:', JSON.stringify(await sidebar()));
await page.screenshot({path:OUT+'/settings-sidebar-sv8683.png'}).catch(()=>{});

// 2) Click the Roles & Permissions item (match by text)
const clicked=await page.evaluate(L=>{const lab=eval(L);const el=[...document.querySelectorAll('a,.q-item,button,div')].find(e=>/roles\s*&?\s*permission/i.test(lab(e))&&lab(e).length<40);if(el){el.setAttribute('data-rp','1');return lab(el);}return null;}, lab);
console.log('ROLES&PERM ITEM TEXT:', JSON.stringify(clicked));
if(clicked){
  await page.locator('[data-rp="1"]').first().click().catch(()=>{});
  await page.waitForTimeout(6000);
  await page.screenshot({path:OUT+'/roles-perm-page-sv8683.png'}).catch(()=>{});
  // capture role rows
  const roles=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('table tbody tr, .q-item')].map(lab).filter(Boolean).slice(0,30);}, lab);
  console.log('ROLE ROWS:', JSON.stringify(roles));
  // open the pencil on a NON-admin role (e.g. Technician) to view toggles read-only. Find a row that is NOT Administrator/Owner
  const opened=await page.evaluate(L=>{const lab=eval(L);const rows=[...document.querySelectorAll('table tbody tr')];for(const tr of rows){const t=lab(tr);if(/technician/i.test(t)){const pencil=tr.querySelector('button, .q-btn, [class*=edit], i');if(pencil){pencil.click();return t;}}}return null;}, lab);
  console.log('OPENED ROLE:', JSON.stringify(opened));
  await page.waitForTimeout(6000);
  await page.screenshot({path:OUT+'/role-toggles-sv8683.png',fullPage:true}).catch(()=>{});
  // dump all permission toggle labels on the page/dialog
  const toggles=await page.evaluate(L=>{const lab=eval(L);const scope=document.querySelector('.q-dialog,[role=dialog]')||document;return [...scope.querySelectorAll('.q-toggle, .q-checkbox, label, .row')].map(lab).filter(t=>t&&t.length<60);}, lab);
  console.log('TOGGLE LABELS:', JSON.stringify([...new Set(toggles)]));
}
await browser.close();
