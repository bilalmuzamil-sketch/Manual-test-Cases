import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('r5c'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const tog=async()=>page.locator('[role=switch],[role=checkbox],[role=radio],.q-toggle,.q-checkbox').filter({visible:true});
async function mkRole(name,offIdx){
 await page.goto(B+'/administration/staff'); await page.waitForTimeout(4000); await page.getByText('Roles & Permissions').first().click(); await page.waitForTimeout(5000);
 if((await body()).includes(name)){ log('role exists',name); return; }
 await page.getByText('Create Custom Role').first().click(); await page.waitForTimeout(2500);
 await page.locator('.q-dialog').getByText('Service Advisor',{exact:true}).first().click(); await page.waitForTimeout(800); await page.locator('.q-dialog').getByRole('button',{name:'Apply'}).click(); await page.waitForTimeout(4000);
 await page.getByLabel('Role name*').fill(name);
 const els=await page.evaluateHandle(()=>[...document.querySelectorAll('[role=switch],[role=checkbox],[role=radio],.q-toggle,.q-checkbox')].filter(e=>e.offsetParent&&!e.parentElement.closest('.q-toggle,.q-checkbox')));
 if(offIdx.includes(35)){ const t=page.getByText('See Financial Data',{exact:true}).first(); await t.scrollIntoViewIfNeeded(); const tg=t.locator('xpath=ancestor::*[.//*[contains(@class,"q-toggle")]][1]//*[contains(@class,"q-toggle")]').first(); await tg.click({force:true}); await page.waitForTimeout(1000); await page.screenshot({path:OUT+'R5-fin-toggle.png'}); log('dialogs',await menu(page)); await page.locator('.q-dialog').getByRole('button',{name:'Disable'}).click(); await page.waitForTimeout(1500); }
 else for(const i of offIdx){ await page.evaluate(([els,i])=>els[i].click(),[els,i]); await page.waitForTimeout(600); }
 log(name,'STATE',await page.evaluate(()=>[...document.querySelectorAll('[role=switch],[role=checkbox],[role=radio],.q-toggle,.q-checkbox')].filter(e=>e.offsetParent&&!e.parentElement.closest('.q-toggle,.q-checkbox')).map((e,i)=>i+':'+(e.getAttribute('aria-checked')||e.querySelector('[aria-checked]')?.getAttribute('aria-checked'))).join(' ')));
 await dump('R5-role-'+name.replace(/\W/g,'')); await page.getByRole('button',{name:'Create'}).last().click(); await page.waitForTimeout(4000); log(name,'after create',page.url(),await notes(page),(await menu(page)).slice(0,300));
}
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(1500);
 await mkRole('ZZAUTOTEST No Financial',[35]);
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R5-err');}
await b.browser.close();
