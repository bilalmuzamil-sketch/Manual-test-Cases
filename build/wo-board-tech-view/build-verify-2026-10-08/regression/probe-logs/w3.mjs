import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('w3'); const w=st().woB; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+600);};
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:/^Stop$/}).first().click(); await page.waitForTimeout(2500);
 await page.getByLabel('What have you been doing on this line?').fill('ZZAUTOTEST worked on line'); await page.waitForTimeout(800);
 await page.locator('.q-dialog button').filter({hasText:'Clock Out'}).click(); await page.waitForTimeout(4000); log('after clock out',await menu(page),await notes(page)); await dump('W3-after-clockout');
 await page.reload(); await page.waitForTimeout(7000); log('LINES',await lines()); log('TOP',(await body()).slice(0,300));
 // labor menu
 const mv=page.locator('button[aria-label="Add labor fee or discount"]'); await mv.first().click(); await page.waitForTimeout(1200); log('LABOR MENU',await menu(page)); await esc();
 // line menu > Edit labor
 const row=page.locator('tr').filter({hasText:'Replace - Drag link'}).first(); await row.locator('i:has-text("more_vert")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Edit labor'}).first().click(); await page.waitForTimeout(3000); log('EDIT LABOR',await menu(page)); log('EL btns',await btns(page,'.q-dialog')); await dump('W3-edit-labor');
 await page.locator('.q-dialog button:has-text("close")').first().click().catch(()=>{}); await page.waitForTimeout(1000); await esc();
 // header checkbox
 const hc=page.locator('thead .q-checkbox, thead [role=checkbox]').first(); log('hdr cb',await page.locator('thead .q-checkbox, thead [role=checkbox]').count()); await hc.click(); await page.waitForTimeout(1500); log('AFTER SELECT ALL btns',(await btns(page)).slice(0,60)); await page.screenshot({path:OUT+'W3-lines-selected.png'}); await dump('W3-lines-selected');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W3-err');}
await b.browser.close();
