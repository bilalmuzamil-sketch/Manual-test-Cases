import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page } = await boot('sv8683','/administration/settings','admin');
await page.waitForTimeout(6000);
// every link/item in the admin area with its href
const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>({t:(a.textContent||'').replace(/\s+/g,' ').trim(),h:a.getAttribute('href')})).filter(x=>x.h&&x.h.includes('administ')));
console.log('ADMIN LINKS:', JSON.stringify([...new Map(links.map(l=>[l.h,l])).values()],null,0));
// full innerText of the settings page (to see sections/tabs)
const it=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').trim());
console.log('SETTINGS PAGE TEXT (first 800):', it.slice(0,800));
await browser.close();
