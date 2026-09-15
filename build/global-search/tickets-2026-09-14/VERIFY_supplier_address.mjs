// A new failure turned up today: a supplier cannot be found by its address line 2, although a
// customer can. Two reports already filed say the same shape of thing about the supplier's postcode
// and its state. Before any of that is put to the QA lead it is worth asking the whole question
// once: WHICH parts of a supplier's address are searched, and which are not - and the same for a
// customer, side by side. A complete answer is one decision for him; three partial ones are three.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/supplier-address`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), checks:{}};
const save=()=>fs.writeFileSync(`${DIR}/SUPPLIER-ADDRESS.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/','admin');
const ask=async(q,group,want,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(10000);
  await page.evaluate((g)=>{const e=document.querySelector(`[data-test-id="search_modal_tab_${g}"]`); e&&e.click();},group);
  await page.waitForTimeout(5000);
  const rows=await page.evaluate((g)=>[...document.querySelectorAll(`[data-test-id^="search_result_row_${g}"]`)]
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)),group);
  await page.screenshot({path:`${EV}/${label}.png`});
  const found=rows.some(t=>t.toLowerCase().includes(want.toLowerCase()));
  R.checks[label]={typed:q, group, wanted:want, found, rows:rows.slice(0,4)}; save();
  L(`${label.padEnd(26)} ${JSON.stringify(q).padEnd(24)} ${group.padEnd(10)} ${found?'FOUND':'not found'}`);
  return found;
};
// the supplier ZZAUTOTEST Kestrel Parts Supply, field by field, as its own record prints them
await ask('ZZAUTOTEST Kestrel','vendors','Kestrel','control-supplier-by-name');
await ask('88 Halbrook Trace','vendors','Kestrel','supplier-address-line-1');
await ask('Halbrook','vendors','Kestrel','supplier-street-word');
await ask('Bay 12C','vendors','Kestrel','supplier-address-line-2');
await ask('Marnston','vendors','Kestrel','supplier-city');
await ask('Ohio','vendors','Kestrel','supplier-state');
await ask('43055-2210','vendors','Kestrel','supplier-postcode');
await ask('kestrelsupply-zzt.com','vendors','Kestrel','supplier-website');
await ask('parts@kestrelsupply-zzt.com','vendors','Kestrel','supplier-email');
// the customer, the same fields, for the comparison
await ask('ZZAUTOTEST Bridgeport','customers','Bridgeport','control-customer-by-name');
await ask('1450 Kestrelway Industrial','customers','Bridgeport','customer-address-line-1');
await ask('Dock 7B','customers','Bridgeport','customer-address-line-2');
await ask('Fernvale','customers','Bridgeport','customer-city');
await ask('Ohio','customers','Bridgeport','customer-state');
await ask('44872-9931','customers','Bridgeport','customer-postcode');
L('DONE'); await browser.close();
