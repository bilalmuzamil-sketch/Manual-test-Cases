import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page } = await bootProdLogin('/settings', { settle: 18000 });
await page.waitForTimeout(6000);
const t = await page.evaluate(()=>document.body.innerText);
console.log('=== TEXT (after sidebar) ===');
console.log(t.split('\n').slice(40).join('\n').slice(0,2500));
const hrefs = await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')+' :: '+(a.innerText||'').trim().replace(/\n/g,'|')).filter(s=>!s.startsWith('#')));
console.log('=== LINKS ==='); console.log(hrefs.join('\n').slice(0,2500));
await browser.close();
