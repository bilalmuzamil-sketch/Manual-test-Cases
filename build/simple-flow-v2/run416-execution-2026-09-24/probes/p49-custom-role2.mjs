import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NAME='ZZAUTOTEST Receive Later';
const { browser, page } = await bootProdLogin('/administration/roles-permissions', { settle: 14000 });
page.setDefaultTimeout(25000);
await page.locator('.q-btn:has-text("Create custom role")').first().click(); await page.waitForTimeout(6000);
// pick the Admin card, then Apply
const picked = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog'); if (!d) return 'no dialog';
  const card = [...d.querySelectorAll('div,li,button')].find(e => /^Admin\b/.test((e.innerText||'').trim()) && (e.innerText||'').length < 60);
  if (!card) return 'no Admin card'; card.click(); return 'picked Admin';
});
console.log(picked); await page.waitForTimeout(2000);
const applied = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog'); if (!d) return 'no dialog';
  const b = [...d.querySelectorAll('button,.q-btn')].find(x => (x.innerText||'').trim() === 'Apply');
  if (!b) return 'no Apply button: ' + [...d.querySelectorAll('button,.q-btn')].map(x=>(x.innerText||'').trim()).join('|');
  b.click(); return 'applied';
});
console.log(applied); await page.waitForTimeout(10000);
console.log('editor URL:', page.url());
const nameField = page.locator('.q-field:has-text("Role Name") input').first();
await nameField.fill(NAME);
const flip = await page.evaluate(() => { let l=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { l=el; break; }
  if (!l) return 'label missing'; let row=l.parentElement,tg=null; for(let i=0;i<6&&row;i++){tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement;}
  if (tg.getAttribute('aria-checked')==='true') return 'already on';
  tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); return 'turned on'; });
console.log('Receive later ->', flip);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${EV}/C44606-new-role-before-save.png`, fullPage: true });
const allBtns = await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).map(x=>(x.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
console.log('buttons on the create form:', JSON.stringify(allBtns));
const saved = await page.evaluate(() => { const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
    .find(x=>/^(Save|Create Role|Create|Save Role)$/i.test((x.innerText||'').trim()));
  if (!b) return 'no save-like button'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed ' + (b.innerText||'').trim(); });
console.log('save:', saved); await page.waitForTimeout(6000);
const anyway = await page.evaluate(() => { const d=document.querySelector('.q-dialog'); if(!d) return 'no dialog';
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Anyway|Create|Confirm/i.test((x.innerText||'').trim()));
  if (b) { b.click(); return 'pressed ' + (b.innerText||'').trim(); } return 'dialog says: ' + (d.innerText||'').replace(/\s+/g,' ').slice(0,200); });
console.log(anyway); await page.waitForTimeout(10000);
console.log('URL after save:', page.url());
await page.goto('https://app.shopview.com/administration/roles-permissions', {waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const t = await page.evaluate(()=>document.body.innerText);
console.log('the new role appears on the list:', t.includes(NAME));
await page.screenshot({ path: `${EV}/C44606-roles-after.png`, fullPage: true });
fs.writeFileSync(`${EV}/C44606-roles-after.txt`, t);
await browser.close();
