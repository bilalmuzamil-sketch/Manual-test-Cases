import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page } = await bootProdLogin('/administration/settings', { settle: 16000 });
console.log('URL:', page.url());
let t = await page.evaluate(()=>document.body.innerText);
console.log('=== text len', t.length);
console.log(t.slice(t.indexOf('Assets')>0?t.indexOf('Assets'):0, 2600));
// find the tab strip elements
const tabs = await page.evaluate(()=>[...document.querySelectorAll('[role=tab], .q-tab')].map(e=>(e.innerText||'').trim()));
console.log('TABS:', JSON.stringify(tabs));
await browser.close();
