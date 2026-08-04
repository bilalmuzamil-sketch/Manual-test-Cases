import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
const { browser, page, netlog } = await boot('admin');
for (const route of ['/administration/labor-rates','/administration/locations']){
  try{ const before=netlog.length; await page.goto(APP+route,{waitUntil:'domcontentloaded',timeout:45000}); await page.waitForTimeout(7000);
    const txt=(await page.locator('body').innerText().catch(()=>'')).replace(/\n+/g,' | ');
    console.log('\n== ',route,'->',page.url(),'\n', txt.slice(txt.indexOf('Vendors')>0?txt.indexOf('Vendors')+8:0, 2500));
    console.log('NEW NET:'); for(const n of netlog.slice(before)) console.log('  ',n.status,n.method,n.url.replace(/^https:\/\/[^/]+/,''));
  }catch(e){console.log(route,'ERR',e.message.slice(0,120));}
}
await browser.close();
