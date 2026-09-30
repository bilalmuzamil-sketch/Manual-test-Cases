import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
const top = await page.evaluate(()=>{
  const out=[];
  for (const el of document.querySelectorAll('header *, .q-header *, [class*="toolbar"] *')) {
    const t=(el.innerText||'').trim();
    const aria=el.getAttribute('aria-label'); const ph=el.placeholder;
    if ((t && t.length<40 && el.children.length===0) || aria || ph)
      out.push({tag:el.tagName, text:t.slice(0,40), aria, ph, cls:(el.className||'').toString().slice(0,60)});
  }
  return out.slice(0,40);
});
console.log(JSON.stringify(top,null,1));
await browser.close();
