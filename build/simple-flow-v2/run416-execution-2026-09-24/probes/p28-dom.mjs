import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, '068f9856-9d28-4500-a3dd-dd6d7aafb15a');
await page.waitForTimeout(3000);
const info = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const t = (el.textContent||'').trim();
    if ((t === 'Needs Approval' || t === 'Approved') && el.children.length === 0) {
      let p = el, chain = [];
      for (let i = 0; i < 7 && p; i++) { chain.push(p.tagName.toLowerCase()+'.'+((p.className||'').toString().split(' ').slice(0,3).join('.'))); p = p.parentElement; }
      out.push({ label: t, chain: chain.join(' < ') });
    }
  }
  return out.slice(0, 6);
});
console.log(JSON.stringify(info, null, 1));
// also dump the classes of the top-level line containers
const cls = await page.evaluate(() => [...new Set([...document.querySelectorAll('[class*=line], [class*=Line]')].map(e=>(e.className||'').toString().slice(0,80)))].slice(0,25));
console.log('LINE-ish classes:', JSON.stringify(cls, null, 1));
await browser.close();
