import {start,mk,L,btns,menu,inputs,B,OUT} from './lib2.mjs'; import fs from 'fs';
export {start,mk,L,btns,menu,inputs,B,OUT};
export const S='/tmp/cln/agent-R/state.json';
export const st=()=>{try{return JSON.parse(fs.readFileSync(S,'utf8'))}catch{return {}}};
export const save=(k,v)=>{const s=st(); s[k]=v; fs.writeFileSync(S,JSON.stringify(s,null,1));};
export async function pickOpt(page,txt,exact=false){ const loc=page.locator('.q-menu .q-item, [role=option]').filter({hasText: exact? new RegExp('^\\s*(check\\s*)?'+txt.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$') : txt}); await loc.first().click(); await page.waitForTimeout(1200); }
export async function newCustomer(page,name,log){
 await page.goto(B+'/customers'); await page.waitForTimeout(6000);
 await page.getByRole('button',{name:/New Customer/i}).first().click(); await page.waitForTimeout(2500);
 const d=page.locator('.q-dialog'); await d.getByLabel(/Name/i).first().fill(name); await d.getByRole('button',{name:'Save'}).click(); await page.waitForTimeout(6000);
 log&&log('CUSTOMER',name,page.url()); return page.url();
}
export async function newContact(page,first,last,log){
 await page.getByRole('tab',{name:/Contacts/}).first().click(); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:/New Contact/i}).first().click(); await page.waitForTimeout(2500);
 const d=page.locator('.q-dialog'); await d.getByLabel(/First Name/i).fill(first); await d.getByLabel(/Last Name/i).fill(last);
 await d.getByRole('button',{name:/^Save/}).first().click(); await page.waitForTimeout(3500); log&&log('CONTACT done');
}
export async function newAsset(page,{year='2022',make='Freight',model='M2',unit='',mileage=''},log){
 await page.getByRole('tab',{name:/Assets/}).first().click(); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:/New Asset/i}).first().click(); await page.waitForTimeout(2500);
 const d=page.locator('.q-dialog'); await d.getByLabel('Contact *').click(); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(800);
 await d.getByLabel('Year').fill(year); await d.getByLabel('Make *').click(); await d.getByLabel('Make *').pressSequentially(make,{delay:110}); await page.waitForTimeout(2500); await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1000);
 if(model){await d.getByLabel('Model').click(); await d.getByLabel('Model').pressSequentially(model,{delay:110}); await page.waitForTimeout(2500); await page.locator('.q-menu .q-item').first().click().catch(()=>{}); await page.waitForTimeout(1000);}
 if(unit) await d.getByLabel('Unit').fill(unit); if(mileage) await d.getByLabel('Mileage').fill(mileage);
 await d.getByRole('button',{name:'Save'}).click(); await page.waitForTimeout(4000); log&&log('ASSET saved',await menu(page));
}
export async function createWO(page,cust,log,assetIdx=0){
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000);
 await page.locator('button',{hasText:'Create Work Order'}).first().click(); await page.waitForTimeout(2500);
 const cf=page.locator('.q-dialog .q-field').nth(0); await cf.click(); await page.keyboard.type(cust,{delay:60}); await page.waitForTimeout(3000);
 await page.locator('.q-menu .q-item,[role=option]').filter({hasText:cust}).first().click(); await page.waitForTimeout(2000);
 const af=page.locator('.q-dialog .q-field').nth(1); await af.click(); await page.waitForTimeout(2000); await page.locator('.q-menu .q-item,[role=option]').nth(assetIdx).click().catch(()=>{}); await page.waitForTimeout(1000);
 log&&log('NWO dlg',(await menu(page)).slice(0,400)); await page.locator('.q-dialog button',{hasText:/^Save$/}).first().click(); await page.waitForTimeout(8000); if(await page.locator('.q-dialog').filter({hasText:'Confirmation'}).count()){ log&&log('CONFIRM',(await menu(page)).slice(-200)); await page.locator('.q-dialog').filter({hasText:'Confirmation'}).getByRole('button',{name:'Create'}).click(); await page.waitForTimeout(8000);} log&&log('after save url',page.url());
 const num=(await page.evaluate(()=>document.body.innerText)).match(/S\d+-\d+/); log&&log('WO',num&&num[0],page.url()); return {url:page.url().replace(/\/lines.*$/,''),num:num&&num[0]};
}
// New Line: free-text name + Enter (or canned when canned=true)
export async function addLine(page,name,approved,log,{close=true,tech=null,hours='1',canned=false}={}){
 const has=async()=>page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].some(d=>d.innerText.includes('What Are You Doing?')));
 if(!(await has())){ await page.getByRole('button',{name:'New Line'}).first().click(); await page.waitForTimeout(2500);} 
 const w=page.getByLabel('What are you doing?'); await w.click(); await w.pressSequentially(name,{delay:60}); await page.waitForTimeout(2500);
 if(canned){ await page.locator('.q-menu .q-item').filter({hasText:name}).first().click(); } else { await page.keyboard.press('Enter'); }
 await page.waitForTimeout(2000);
 if(tech){ const t=page.getByLabel('Add technician'); await t.click(); await t.pressSequentially(tech,{delay:60}); await page.waitForTimeout(2500); await page.locator('.q-menu .q-item').filter({hasText:tech}).first().click(); await page.waitForTimeout(1200); await page.keyboard.press('Escape'); await page.waitForTimeout(600);} 
 const lrTxt=await page.evaluate(()=>{const i=document.querySelector('.q-dialog input[aria-label="Labor rate"]'); return i? i.closest('.q-field').innerText.replace(/\s+/g,' '):'none';}); log&&log('LR',lrTxt);
 if(lrTxt!=='none' && !/Rate\s+\S+.*Rate|\$/.test(lrTxt.replace('Labor Rate','')) && !/Fleet|Rate .+/.test(lrTxt.replace(/^Labor Rate/,''))){ await page.getByLabel('Labor rate').click({force:true}).catch(()=>{}); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'HD Fleet Rate'}).first().click({timeout:4000}).catch(()=>{}); await page.waitForTimeout(800);} 
 const est=page.getByLabel('Estimated time'); if(hours && await est.count()) await est.fill(hours);
 if(approved){ const tg=page.locator('.q-dialog [aria-label="Line Approved"]').first(); if((await tg.getAttribute('aria-checked'))!=='true'){ await tg.scrollIntoViewIfNeeded().catch(()=>{}); await tg.click({force:true}); } await page.waitForTimeout(800);} 
 log&&log('NEWLINE before save',(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ')).join('|'))).slice(0,400));
 await page.getByRole('button',{name: close?/Save and close|Save & Close/:/Save and add next|Save & Add Line/}).first().click(); await page.waitForTimeout(4500);
}
export async function setLead(page,name,log){
 const f=page.locator('.q-field').filter({hasText:'Lead Technician'}).first(); await f.click({force:true}); await page.waitForTimeout(1200);
 await page.keyboard.type(name,{delay:60}).catch(()=>{}); await page.waitForTimeout(1800);
 await page.locator('.q-menu .q-item').filter({hasText:name}).first().click(); await page.waitForTimeout(3000); log&&log('after setLead',await menu(page), (await page.evaluate(()=>document.querySelector('.q-notification')?.innerText||'')));
}
export const leadVal=(page)=>page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(e=>e.getAttribute('aria-label')==='Lead technician'); return i? i.value : ([...document.querySelectorAll('*')].find(e=>e.children.length===0&&/Lead technician/i.test(e.innerText))?.parentElement?.innerText||'none');});
export const notes=(page)=>page.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' | '));
