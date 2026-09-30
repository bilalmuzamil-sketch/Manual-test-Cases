import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
const build = await page.evaluate(()=>{
  const m=document.body.innerText.match(/v\d+\.\d+\.\d+-[0-9a-f]+/); if(m) return m[0];
  return (window.__APP_VERSION__||document.querySelector('meta[name="version"]')?.content||'not on page');
});
console.log('build marker on page:', build);
async function q(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:45}); await page.waitForTimeout(3500);
  if(tab){ await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
    .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2500); }
  const rows=await page.evaluate(()=>[...document.querySelectorAll('.search-row')]
    .map(r=>r.innerText.replace(/\s*\n\s*/g,' | ')));
  console.log(JSON.stringify(term).padEnd(42), '->', rows[0]?.slice(0,150) || 'NO ROWS');
}
await q('H8A3X9','Customers');
await q('H8A 3X9','Customers');
await q('zzhidden.vendor@staging.shopview.local','Vendors');
await q('.Brake Parts','Parts');
await browser.close();
