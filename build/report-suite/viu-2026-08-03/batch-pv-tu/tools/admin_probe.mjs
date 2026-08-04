import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const { browser, page, netlog } = await boot('admin');
for (const route of ['/administration/settings','/administration/shops','/administration/workplaces']){
  try{ await page.goto(APP+route,{waitUntil:'domcontentloaded',timeout:45000}); await page.waitForTimeout(6000);
    const txt=(await page.locator('body').innerText().catch(()=>'')).replace(/\n+/g,' | ');
    console.log('\n== ',route,'->',page.url(),'\n', txt.slice(0,1800));
  }catch(e){console.log(route,'ERR',e.message.slice(0,120));}
}
console.log('\nNET:'); for(const n of netlog) if(/api\/(work|shop|organi|setting|labor|rate)/i.test(n.url)) console.log(' ',n.status,n.method,n.url.replace(/^https:\/\/[^/]+/,''));
await browser.close();
