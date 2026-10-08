import {start,mk,log,B,OUT} from '/tmp/cln/woblib.mjs';
const WO='/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines';
const {browser,page}=await start(WO); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  await go(WO,9000);
  const cl=page.locator('.q-dialog button').filter({has:page.locator('i',{hasText:/^close$/})}).first(); if(await cl.count()){ await cl.click(); await page.waitForTimeout(1500);} 
  await page.screenshot({path:OUT+'wo-page-header.png'});
  // try clicking lead technician value with mouse on its element
  const v=page.getByText('Lead technician',{exact:true}).first();
  const bb=await v.boundingBox(); log('lead label box',JSON.stringify(bb));
  const html=await v.locator('xpath=../..').evaluate(e=>e.outerHTML.slice(0,1500)); log('lead html:',html.replace(/\s+/g,' ').slice(0,1200));
  // edit_note on header
  const en=page.locator('i').filter({hasText:/^edit_note$/}).first(); log('edit_note tooltip:',await tip(en)); await en.click({force:true}); await page.waitForTimeout(2500); log('edit_note opens:',(await ov()).slice(0,800)); await dump('wo-edit-note'); await esc();
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
