// Contrast test: add the PACKAGE line while CREATING the purchase order (the path that
// already worked before the fix) - it must still work.
import {boot} from './b.mjs';
import {clickId,typeId,qSelect,tableText,ids} from './po.mjs';
const env=process.argv[2]||'qa', VENDOR=process.argv[3], PART=process.argv[4], QTY=process.argv[5], IPP=process.argv[6], COST=process.argv[7], TAG=process.argv[8]||'create';
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const {browser,page,net}=await boot(env);
try{
  await page.goto(APP+'/parts/orders',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(3500);
  await clickId(page,'button_new_po');
  await page.waitForTimeout(2500);
  await qSelect(page,'select_order_vendor',VENDOR);
  await page.waitForTimeout(700);
  console.log('part ->',await qSelect(page,'select_part',PART+' Inventory',{typed:PART}));
  await page.waitForTimeout(700);
  await typeId(page,'input_order_item_quantity',QTY);
  await clickId(page,'checkbox_order_item_package');
  await page.waitForTimeout(900);
  await typeId(page,'input_order_item_items_per_package',IPP);
  await typeId(page,'input_order_item_cost',COST);
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-form.png`});
  await clickId(page,'button_add_order_item');
  await page.waitForTimeout(1800);
  console.log('table:\n'+await tableText(page));
  await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-added.png`});
  await clickId(page,'button_save_and_close_order');
  await page.waitForTimeout(4000);
  console.log('CREATE PAYLOAD:',JSON.stringify(net.filter(n=>/orders\/create/.test(n.u)).map(n=>({st:n.st,body:n.body})),null,1));
}catch(e){ console.log('ERR',e.message); await page.screenshot({path:`/tmp/sv9833/ev-${env}-${TAG}-err.png`}); }
await browser.close();
