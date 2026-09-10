// Add Order Item with a BRAND-NEW part (not in inventory or catalog) + Package ticked.
import {boot} from './b.mjs';
import {clickId,typeId,tableText} from './po.mjs';
const env=process.argv[2], PO=process.argv[3], PN=process.argv[4], IPP=process.argv[5]||'19', COST=process.argv[6]||'10', TAG=process.argv[7]||'newpart';
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const {browser,page,net}=await boot(env);
try{
  await page.goto(APP+'/order/'+PO,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(4000);
  await clickId(page,'button_add_order_item');
  await page.waitForTimeout(2500);
  const el=await page.$('[data-test-id="select_part"]'); await el.click(); await page.waitForTimeout(400);
  await page.keyboard.type(PN,{delay:55}); await page.waitForTimeout(3000);
  await clickId(page,'add_new_special_order_part');
  await page.waitForTimeout(1500);
  await typeId(page,'input_order_item_description','ZZAUTOTEST package part');
  await typeId(page,'input_order_item_quantity','1');
  await clickId(page,'checkbox_order_item_package');
  await page.waitForTimeout(900);
  await typeId(page,'input_order_item_items_per_package',IPP);
  await typeId(page,'input_base',COST);
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-form.png`});
  await clickId(page,'button_save_order_item');
  await page.waitForTimeout(4000);
  console.log('ADD-ITEM PAYLOAD:',JSON.stringify(net.filter(n=>/add-item/.test(n.u)).map(n=>({st:n.st,body:n.body})),null,1));
  console.log('table:\n'+await tableText(page));
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-done.png`});
}catch(e){ console.log('ERR',e.message); await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-err.png`}); }
await browser.close();
