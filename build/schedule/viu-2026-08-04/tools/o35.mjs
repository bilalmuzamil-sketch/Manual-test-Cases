import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton'});
const E='/tmp/sviu/evidence/'; const F={};
// Staff edit for Ayesha Khan (staff id 1e81b8a0-9a45-4f16-89e3-209bf240990a)
for(const url of ['/administration/staff','/administration/locations']){
  await page.goto(APP+url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(6000);
  F[url]={url:page.url(),text:(await page.evaluate(()=>document.body.innerText)).slice(0,700)};
  console.log('==',url,'->',F[url].url); console.log(F[url].text.slice(0,500));
}
fs.writeFileSync('/tmp/sviu/f-settings-routes.json',JSON.stringify(F,null,1));
await browser.close();
