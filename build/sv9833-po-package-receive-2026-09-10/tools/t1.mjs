// Step 1: create an inventory PO with ONE plain (non-package) control line, on the create screen.
import {boot} from './b.mjs';
import {clickId,typeId,qSelect,tableText,ids} from './po.mjs';
const env=process.argv[2]||'qa';
const APP=env==='qa'?'https://sv9833.qa.shopview.com':'https://app.staging.shopview.com';
const VENDOR=process.argv[3]||'Stillwater Diesel Repair';
const CTRL=process.argv[4]||'122993';
const {browser,page,net}=await boot(env);
try{
  await page.goto(APP+'/parts/orders',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(3500);
  await clickId(page,'button_new_po');
  await page.waitForTimeout(2500);
  console.log('vendor ->',await qSelect(page,'select_order_vendor',VENDOR));
  await page.waitForTimeout(800);
  console.log('part ->',await qSelect(page,'select_part',CTRL+' Inventory',{typed:CTRL}));
  await page.waitForTimeout(800);
  await typeId(page,'input_order_item_quantity',2);
  await typeId(page,'input_order_item_cost','9.75');
  await page.screenshot({path:`/tmp/sv9833/dbg-${env}-t1-form.png`});
  await clickId(page,'button_add_order_item');
  await page.waitForTimeout(1800);
  console.log('table after add:\n'+await tableText(page));
  await page.screenshot({path:`/tmp/sv9833/dbg-${env}-t1-added.png`});
  await clickId(page,'button_save_and_close_order');
  await page.waitForTimeout(3500);
  console.log('URL after save',page.url());
  console.log('NET:',JSON.stringify(net,null,1).slice(0,1500));
}catch(e){ console.log('ERR',e.message); await page.screenshot({path:`/tmp/sv9833/dbg-${env}-t1-err.png`}); }
await browser.close();
