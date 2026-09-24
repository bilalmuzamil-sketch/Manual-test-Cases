import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page } = await bootProdLogin('/settings', { settle: 14000 });
const info = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const t = (el.textContent || '').trim();
    if (t === 'Work Orders' && el.children.length === 0) {
      let p = el, chain = [];
      for (let i = 0; i < 5 && p; i++) { chain.push(p.tagName + '.' + (p.className || '').toString().slice(0, 60) + (p.getAttribute && p.getAttribute('role') ? '[role=' + p.getAttribute('role') + ']' : '')); p = p.parentElement; }
      out.push(chain.join(' < '));
    }
  }
  return out;
});
console.log(info.join('\n\n'));
console.log('--- url', page.url());
await browser.close();
