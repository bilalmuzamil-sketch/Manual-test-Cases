import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/settings','admin');
await page.waitForTimeout(7000);
// dump the administration left/side sub-nav labels + hrefs
const nav=await page.evaluate(()=>{
  const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return [...document.querySelectorAll('a,.q-item,.q-tab,[role=tab]')].map(e=>({h:e.getAttribute('href')||'',t:clean(e)})).filter(x=>x.t&&x.t.length<45);
});
console.log('ADMIN NAV:', JSON.stringify(nav));
// find Roles & Permissions link
const rp=nav.find(x=>/role|permission/i.test(x.t));
console.log('R&P CANDIDATE:', JSON.stringify(rp||null));
if(rp){
  const clicked=await page.evaluate(t=>{const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};const el=[...document.querySelectorAll('a,.q-item,.q-tab,[role=tab]')].find(e=>clean(e)===t);if(el){el.scrollIntoView();el.click();return true;}return false;}, rp.t);
  console.log('CLICKED R&P:', clicked, 'URL now:', page.url());
  await page.waitForTimeout(6000);
  console.log('URL AFTER:', page.url());
  await page.screenshot({path:OUT+'/roles-perm-page-sv8683.png',fullPage:true}).catch(()=>{});
  // dump role rows
  const roles=await page.evaluate(()=>{const clean=e=>(e.textContent||'').replace(/\s+/g,' ').trim();return [...document.querySelectorAll('table tbody tr,.q-item')].map(clean).filter(t=>t&&t.length<60).slice(0,25);});
  console.log('ROLE ROWS:', JSON.stringify(roles));
  // open a Technician role's edit (pencil) read-only
  const opened=await page.evaluate(()=>{const rows=[...document.querySelectorAll('table tbody tr')];for(const tr of rows){if(/technician/i.test(tr.textContent||'')){const btn=tr.querySelector('button,.q-btn,a,[class*=edit]');if(btn){btn.click();return (tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,40);}}}return null;});
  console.log('OPENED TECH ROLE:', JSON.stringify(opened));
  await page.waitForTimeout(6000);
  await page.screenshot({path:OUT+'/role-toggles-sv8683.png',fullPage:true}).catch(()=>{});
  const toggles=await page.evaluate(()=>{const clean=e=>(e.textContent||'').replace(/\s+/g,' ').trim();const scope=document.querySelector('.q-dialog,[role=dialog]')||document;return [...new Set([...scope.querySelectorAll('.q-toggle,.q-checkbox,label')].map(clean).filter(t=>t&&t.length<55))];});
  console.log('PERMISSION TOGGLES:', JSON.stringify(toggles));
}
await browser.close();
