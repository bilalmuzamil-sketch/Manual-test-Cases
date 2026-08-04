import { boot } from './boot8582.mjs';
import { APP, login, api } from './qa8582.mjs';
const {browser,page,netlog}=await boot('admin');
await page.goto(APP+'/administration/locations',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(7000);
console.log('ADMIN NAV HREFS:', JSON.stringify(await page.$$eval('a[href*="/administration"]',as=>as.map(a=>a.getAttribute('href')+' = '+a.innerText.trim()))));
// open the location edit dialog for Heavy Duty
const rows=await page.$$('tbody tr');
for(const tr of rows){const t=await tr.evaluate(e=>e.innerText); if(/Heavy Duty/.test(t)){const btn=await tr.$('button')||tr; const b=await btn.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); break;}}
await page.waitForTimeout(4000);
const dlg=await page.$('.q-dialog');
console.log('\nEDIT DIALOG TEXT:', dlg? (await dlg.evaluate(e=>e.innerText.replace(/\n+/g,' | '))).slice(0,1600) : '(no dialog)');
console.log('\nDIALOG INPUTS:', JSON.stringify(await page.$$eval('.q-dialog input',is=>is.map(i=>({label:i.closest('.q-field')?.querySelector('.q-field__label')?.innerText.trim(),v:i.value,tid:i.getAttribute('data-test-id')})))));
await page.screenshot({path:'../evidence/perms/location-edit-dialog.png'});
await browser.close();
