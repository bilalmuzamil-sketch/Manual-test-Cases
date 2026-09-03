// ISOLATE THE VARIABLE (the §8.0-c lesson, applied to my own claim).
// I reported "account-level credits omit the disclaimer, invoice-raised ones print it". But CM-4199 was
// BOTH invoice-raised AND carried part lines, so two variables moved together. Untick "Parts are being
// returned" in the INVOICE's Issue Credit dialog: that gives a money-only credit that is STILL tied to
// an invoice. If it prints the disclaimer, the deciding factor is the invoice link. If it does not, the
// deciding factor is the part lines.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='2fa6c0dc-10a6-4334-8d63-fa4425239556', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(12000);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.locator('.q-tab:has-text("Finance")').first().click(); await page.waitForTimeout(9000);
const kebabs = page.locator('.q-btn:has-text("more_vert")');
for (let i=0;i<await kebabs.count();i++){
  await kebabs.nth(i).click({force:true}).catch(()=>{}); await page.waitForTimeout(2200);
  const items = await page.evaluate(L=>{ const lab=eval(L);
    return [...document.querySelectorAll('.q-menu .q-item')].map((e,k)=>{e.setAttribute('data-qa-mi',String(k));return lab(e);}).filter(Boolean); }, lab);
  const ic = items.findIndex(t=>/issue credit/i.test(t));
  if (ic>=0) { await page.locator(`[data-qa-mi="${ic}"]`).first().click(); await page.waitForTimeout(7000); break; }
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
// untick "Parts are being returned"
const before = await page.evaluate(L=>{ const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog')].pop(); return lab(x).slice(0,240); }, lab);
console.log('dialog with parts:', before);
const box = page.locator('.q-dialog .q-checkbox:has-text("Parts are being returned"), .q-dialog .q-toggle:has-text("Parts are being returned")').first();
if (await box.count()) { await box.click({force:true}); }
else { await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog')].pop();
  const el=[...x.querySelectorAll('*')].find(e=>/^Parts are being returned$/.test((e.textContent||'').trim()) && e.children.length===0);
  if (el) { const c=el.closest('.q-checkbox,.q-toggle,label'); if (c) c.click(); } }); }
await page.waitForTimeout(3000);
const after = await page.evaluate(L=>{ const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog')].pop();
  return { whole: lab(x).slice(0,400),
    inputs:[...x.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
      let p=i.parentElement,ctx=''; for(let d=0;d<7&&p;d++,p=p.parentElement){const t=lab(p); if(t.length>=3&&t.length<=90){ctx=t;break;}}
      return {k,value:i.value,ctx};}),
    buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean) };}, lab);
console.log('dialog WITHOUT parts:', JSON.stringify(after).slice(0,1300));
const amt = after.inputs.find(i=>/^\$?Amount$/i.test(i.ctx) || /amount/i.test(i.ctx));
if (!amt) { log('no Amount box after unticking - cannot isolate this way'); await page.screenshot({path:`${OUT}/disclaimer-isolate-fail.png`, fullPage:true}); await browser.close(); process.exit(3); }
const e=page.locator(`[data-qa-in="${amt.k}"]`); await e.click(); await e.fill(''); await e.type('25.00',{delay:60}); await e.press('Tab'); await page.waitForTimeout(1500);
await page.locator('.q-dialog .q-radio', { hasText:'Issue Store Credit' }).first().click().catch(()=>{}); await page.waitForTimeout(1500);
const ta=page.locator('.q-dialog textarea').first(); if (await ta.count()) await ta.fill('ZZAUTOTEST money-only credit ON an invoice, to isolate the disclaimer variable');
await page.waitForTimeout(800);
const b4=calls.length;
await page.locator('.q-dialog button:has-text("Issue Credit")').last().click({timeout:20000});
await page.waitForTimeout(9000);
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
await page.screenshot({path:`${OUT}/disclaimer-isolate.png`, fullPage:true});
await browser.close();
