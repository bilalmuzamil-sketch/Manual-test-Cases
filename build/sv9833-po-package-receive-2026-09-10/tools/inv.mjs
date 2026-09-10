import {boot} from './b.mjs';
import {clickId} from './po.mjs';
const env=process.argv[2], PN=process.argv[3], TAG=process.argv[4];
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const {browser,page}=await boot(env);
try{
  await page.goto(APP+'/parts',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(4500);
  await clickId(page,'page_search_toggle');
  await page.waitForTimeout(900);
  await page.keyboard.type(PN,{delay:45});
  await page.waitForTimeout(4000);
  const t=await page.evaluate(()=>{const tb=document.querySelector('table');return tb?tb.innerText.split('\n').slice(0,8).join('\n'):null;});
  console.log(env,'TABLE:\n'+t);
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}.png`});
}catch(e){console.log('ERR',e.message); await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-err.png`});}
await browser.close();
