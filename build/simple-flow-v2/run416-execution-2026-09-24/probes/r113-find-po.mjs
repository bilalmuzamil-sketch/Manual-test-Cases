// Find the id of another purchase order belonging to the vendor Delete Test that still has parts
// left to receive, so the reproduction uses two clean ones.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const {browser,page}=await bootProdLogin('/parts/orders',{settle:15000,viewport:{width:1680,height:1000}});
const out=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height&&/Delete Test/.test(t.innerText||''))
  .map(t=>{const a=t.querySelector('a[href*="/order/"]');
    const onclick=t.getAttribute('data-id')||'';
    return {text:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,70), href:a?a.getAttribute('href'):null, id:onclick};}));
console.log(JSON.stringify(out,null,1));
// click each and read the url
for(let i=0;i<out.length&&i<5;i++){
  await page.goto('https://app.shopview.com/parts/orders',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const name=await page.evaluate((n)=>{const rows=[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height&&/Delete Test/.test(t.innerText||''));
    if(!rows[n])return null; rows[n].click(); return (rows[n].innerText||'').replace(/\s+/g,' ').trim().slice(0,40);},i);
  if(!name) break; await page.waitForTimeout(7000);
  console.log(name,'->',page.url().replace('https://app.shopview.com',''));
}
await browser.close();
