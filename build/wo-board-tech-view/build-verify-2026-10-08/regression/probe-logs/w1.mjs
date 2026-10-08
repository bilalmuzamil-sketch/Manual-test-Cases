import {start,mk,L,menu,inputs,addLine,setLead,leadVal,notes,save,st,B} from './h.mjs';
const log=L('w1'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+900);};
const audit=async(tag)=>{ await page.locator('button:has-text("more_vert")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Audit Log'}).first().click(); await page.waitForTimeout(4000); const t=await menu(page); log(tag,t.slice(0,1800)); await dump(tag); await esc(); };
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 if(await page.locator('.q-dialog').count()){ await esc(); }
 await addLine(page,'ZZAUTOTEST Line 1',true,log,{close:true});
 // approve the Needs Approval line
 const ap=page.getByRole('button',{name:/^Approve$/}); log('approve btns',await ap.count()); if(await ap.count()){ await ap.first().click(); await page.waitForTimeout(3000); log('after approve ov',await menu(page)); }
 await page.reload(); await page.waitForTimeout(7000); log('LINES0',await lines()); log('STATUS0',(await body()).match(/S10043-\d+ (\w+)/)?.[1]); log('LEAD0',await leadVal(page));
 await setLead(page,'ZZAUTOTEST Ana',log); log('NOTES',await notes(page));
 await page.reload(); await page.waitForTimeout(7000); log('LEAD1',await leadVal(page)); log('LINES1',await lines()); await dump('W1-after-lead-ana');
 await audit('W1-audit-1');
 await setLead(page,'ZZAUTOTEST Ben',log); log('NOTES2',await notes(page)); log('OV after Ben',await menu(page)); log('LEAD shown before reload',await leadVal(page));
 await page.reload(); await page.waitForTimeout(7000); log('LEAD2',await leadVal(page)); log('LINES2',await lines()); await dump('W1-after-lead-ben');
 await audit('W1-audit-2');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W1-err');}
await b.browser.close();
