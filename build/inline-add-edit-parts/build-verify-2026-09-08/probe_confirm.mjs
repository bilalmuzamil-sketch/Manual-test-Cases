import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
// CLEAN Admin login. NO role editing whatsoever.
const s=await boot('sv9315','/workorders?tab=estimate','admin');
const page=s.page; await page.waitForTimeout(7000);
const perms=await page.evaluate(()=>{let w=null;try{w=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null');}catch(e){}const wd=w?.data??w;let fe=wd?.fe_permissions??wd?.fePermissions;const arr=Array.isArray(fe)?fe:[];return {tech:arr.includes('woTechViewMode'), seeFin:arr.includes('seeFinancialData'), count:arr.length};});
console.log('Admin perms: woTechViewMode=', perms.tech, '| seeFinancialData=', perms.seeFin, '| count=', perms.count);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
await page.locator('[data-a="1"]').first().click().catch(()=>{}); await page.waitForTimeout(4500);
const flds=await page.evaluate(()=>[...document.querySelectorAll('.q-field__label')].map(e=>(e.textContent||'').trim()).filter(Boolean));
console.log('INLINE FIELD LABELS:', JSON.stringify([...new Set(flds)]));
const body=await page.evaluate(()=>document.body.innerText);
for(const t of ['Category','Cost','Sell price','More options','Add tech story for this line']) console.log('   ',t,':',body.includes(t));
const moreBtn=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(e=>e.offsetParent&&/^More options$/i.test(lab(e))).map(e=>lab(e));}, lab);
console.log('"More options" button present:', JSON.stringify(moreBtn));
await page.screenshot({path:OUT+'/ADMIN-fullrow-CONFIRMED-v26.35.9.png'}).catch(()=>{});
// click More options -> confirm the New Part Request modal
if(moreBtn.length){
  await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].find(e=>e.offsetParent&&/^More options$/i.test(lab(e)));if(b)b.setAttribute('data-mo','1');}, lab);
  await page.locator('[data-mo="1"]').click().catch(()=>{}); await page.waitForTimeout(3000);
  const modal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;const h=d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title,.q-card__section');return h?(h.textContent||'').trim().slice(0,50):d.innerText.slice(0,60);});
  console.log('MODAL after More options:', JSON.stringify(modal));
  await page.screenshot({path:OUT+'/ADMIN-partrequest-modal-CONFIRMED-v26.35.9.png'}).catch(()=>{});
}
await s.browser.close();
