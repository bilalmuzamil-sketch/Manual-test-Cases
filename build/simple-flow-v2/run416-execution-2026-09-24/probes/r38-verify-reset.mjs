// Read the restore BACK (Rule 107): re-open the role and press Reset To Template a second time.
// If Save now stays DISABLED, the first reset really landed and the role is in its default shape.
// If Save goes enabled again, the save did not take and nothing measured on this role can be trusted.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='31e70dbe-8d9f-485b-9e32-457acd069743';
const {browser,page}=await bootProdLogin(`/administration/roles-permissions/${ROLE}/edit`,{settle:15000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const readSave=async()=>await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
  .find(x=>/^Save$/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
  return b?{present:true,disabled:b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test(b.className||'')}:{present:false};});
const R={};
R.saveOnOpen=await readSave(); console.log('Save on opening the role:',JSON.stringify(R.saveOnOpen));
const pressed=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
  .find(x=>/Reset To Template/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b)return 'no Reset button'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed Reset To Template';});
console.log(pressed); await page.waitForTimeout(3500);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Reset|Yes|Confirm|OK)$/i.test((x.innerText||'').trim()));if(b)b.click();});
await page.waitForTimeout(4000);
R.saveAfterSecondReset=await readSave();
console.log('Save after a SECOND reset:',JSON.stringify(R.saveAfterSecondReset));
R.roleIsNowDefault = R.saveAfterSecondReset.present && R.saveAfterSecondReset.disabled===true;
console.log('>>> the role is in its default shape:',R.roleIsNowDefault);
await page.screenshot({path:`${EV}/p3o-verify-reset.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/p3o-verify-reset.json`,JSON.stringify(R,null,1));
await browser.close();
