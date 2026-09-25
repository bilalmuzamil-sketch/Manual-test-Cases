// The source's sentence is conditional on Tech View: "A Technician in Tech View cannot complete,
// because they cannot approve. They can still pick parts." So before calling the product wrong I must
// prove the person WAS in Tech View. The source gives the test itself: "Tech View hides Approve".
//   Positive control: put this person in front of a line AWAITING APPROVAL. If Approve is hidden for
//   them and shown for an admin on the same line, Tech View is in force and the finding stands.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const WHO=process.env.WHO||'admin';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={who:WHO};
async function lines(){return await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)});}return o;});}
await openWo(page,WO); await page.waitForTimeout(8000);
if (WHO==='admin') {
  // make a line that is awaiting approval, so both people can be shown the same line
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(b)b.click();});
  await page.waitForTimeout(5000);
  const ins=page.locator('.q-dialog input:visible');
  if(await ins.count()){ await ins.nth(0).click(); await ins.nth(0).type('ZZAUTOTEST tech view control',{delay:40});
    if(await ins.count()>1){await ins.nth(1).click(); await ins.nth(1).type('ZZAUTOTEST',{delay:40});}
    await page.waitForTimeout(1000);
    await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim())); if(b)b.click();});
    await page.waitForTimeout(9000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000); }
}
const ls=await lines();
R.lines=ls.map(l=>({status:l.badges.join('+'),buttons:l.buttons}));
console.log(`\n=== as ${WHO} ===`);
for(const l of R.lines) console.log('   ',l.status,'->',JSON.stringify(l.buttons));
const na=R.lines.filter(l=>/Needs Approval/i.test(l.status));
R.needsApprovalLines=na;
R.approveOfferedOnNeedsApproval = na.some(l=>l.buttons.some(b=>/^Approve$/i.test(b)));
console.log('   lines awaiting approval:',na.length,'| Approve offered on them:',R.approveOfferedOnNeedsApproval);
R.pageMentionsApprove=await page.evaluate(()=>/\bApprove\b/.test(document.body.innerText));
console.log('   the word Approve anywhere on the page:',R.pageMentionsApprove);
await page.screenshot({path:`${EV}/p3q-techview-${WHO}.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/p3q-techview-${WHO}.json`,JSON.stringify(R,null,1));
await browser.close();
