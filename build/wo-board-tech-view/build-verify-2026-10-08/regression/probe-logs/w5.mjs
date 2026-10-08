import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('w5'); const w=st().woB; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.locator('button:has-text("more_vert")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Timesheets'}).first().click(); await page.waitForTimeout(4000); log('URL',page.url());
 const row=page.locator('tr').filter({hasText:'ZZAUTOTEST worked'}).first(); await row.hover(); await page.waitForTimeout(1000);
 log('ROW elems',await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>r.innerText.includes('ZZAUTOTEST worked')).map(r=>[...r.querySelectorAll('button,i,[role=button]')].map(e=>(e.getAttribute('aria-label')||'')+'~'+e.innerText.trim()))));
 await page.screenshot({path:OUT+'W5-timesheet-row.png'});
 const rb=row.locator('button'); const n=await rb.count(); for(let i=0;i<n;i++){ await rb.nth(i).click().catch(()=>{}); await page.waitForTimeout(1500); log('ROWBTN',i,await menu(page)); await dump('W5-ts-btn'+i); await esc(); }
 await row.click({button:'right'}).catch(()=>{}); await page.waitForTimeout(1000); log('RIGHT',await menu(page)); await esc();
 await row.locator('td').nth(1).click().catch(()=>{}); await page.waitForTimeout(2000); log('ROW CLICK',await menu(page)); await dump('W5-ts-rowclick');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W5-err');}
await b.browser.close();
