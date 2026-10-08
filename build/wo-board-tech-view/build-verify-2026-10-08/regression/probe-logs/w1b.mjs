import {start,mk,L,menu,inputs,addLine,setLead,leadVal,notes,save,st,B} from './h.mjs';
const log=L('w1b'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+700);};
const audit=async(tag)=>{ await page.locator('button:has-text("more_vert")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Audit Log'}).first().click(); await page.waitForTimeout(4000); const t=await menu(page); log(tag,t.slice(0,1800)); await dump(tag); await page.locator('.q-dialog button:has-text("close")').first().click().catch(()=>{}); await page.waitForTimeout(800); };
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await setLead(page,'ZZAUTOTEST Ben',log); log('NOTES2',await notes(page)); log('LEAD shown before reload',await leadVal(page)); await dump('W1-lead-ben-before-reload');
 await page.reload(); await page.waitForTimeout(7000); log('LEAD2',await leadVal(page)); log('LINES2',await lines()); await dump('W1-after-lead-ben');
 await audit('W1-audit-2');
 // mileage + lead together
 const m=page.getByLabel('Mileage'); await m.click(); await m.fill('120500'); await page.waitForTimeout(800); log('save btn visible',await page.getByRole('button',{name:/^Save$/}).count(), await btns2());
 async function btns2(){return page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&/Save|Cancel/.test(e.innerText)).map(e=>e.innerText.trim()));}
 await setLead(page,'ZZAUTOTEST Cal',log); log('after lead w/ dirty mileage',await notes(page), await btns2()); await dump('W1-mileage-and-lead');
 const sv=page.getByRole('button',{name:/^Save$/}); if(await sv.count()){ await sv.first().click(); await page.waitForTimeout(3000); log('after Save',await notes(page)); }
 await page.reload(); await page.waitForTimeout(7000); log('LEAD3',await leadVal(page)); log('MILEAGE3',await page.getByLabel('Mileage').inputValue()); log('LINES3',await lines());
 await audit('W1-audit-3');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W1b-err');}
await b.browser.close();
