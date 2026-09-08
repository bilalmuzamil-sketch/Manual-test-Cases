import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
// LOGIN 1: flip to Full View with REAL clicks + capture toast
let s=await boot('sv9315','/administration/roles-permissions/'+ROLE+'/edit','admin');
let page=s.page; await page.waitForTimeout(6000);
const fvSeg=page.locator('.wo-settings__segment', {hasText:'Full View'}).first();
await fvSeg.scrollIntoViewIfNeeded().catch(()=>{});
await fvSeg.click().catch(e=>console.log('fv click err',e.message));
await page.waitForTimeout(1000);
console.log('after real click, active=', await page.evaluate(()=>{const s=[...document.querySelectorAll('.wo-settings__segment')].find(e=>/--active/.test(e.className));return s?(s.textContent||'').trim():'?';}));
// click footer Save (last visible Save button)
const saveBtns=page.locator('button:has-text("Save"), .q-btn:has-text("Save")');
const n=await saveBtns.count(); console.log('save buttons:', n);
await saveBtns.last().click().catch(e=>console.log('save err',e.message));
await page.waitForTimeout(2500);
const toast=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-notification,.q-notification__message,[role=alert]')].map(e=>(e.textContent||'').trim()).filter(Boolean);return t.slice(0,4);});
console.log('toast after save:', JSON.stringify(toast));
await page.waitForTimeout(3000);
await s.browser.close();
// LOGIN 2: fresh -> check fe_permissions for woTechViewMode
s=await boot('sv9315','/workorders','admin'); page=s.page; await page.waitForTimeout(6000);
const perms=await page.evaluate(()=>{let w=null;try{w=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null');}catch(e){}const wd=w?.data??w;let fe=wd?.fe_permissions??wd?.fePermissions;const arr=Array.isArray(fe)?fe:[];return {tech:arr.includes('woTechViewMode'), count:arr.length, tmpl:wd?.template_slug};});
console.log('LOGIN2 perms: woTechViewMode=', perms.tech, 'count=', perms.count, 'template=', perms.tmpl);
if(!perms.tech){
  console.log('>>> NOW IN FULL VIEW <<<');
  // open a WO, Lines, Add Part, inspect row
  await page.goto('https://sv9315.qa.shopview.com/workorders?tab=estimate',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
  await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
  await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(11000);
  await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
  await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
  await page.locator('[data-a="1"]').first().click().catch(()=>{}); await page.waitForTimeout(4500);
  const flds=await page.evaluate(()=>[...document.querySelectorAll('.q-field__label')].map(e=>(e.textContent||'').trim()).filter(Boolean));
  console.log('INLINE FIELDS:', JSON.stringify([...new Set(flds)]));
  const body=await page.evaluate(()=>document.body.innerText);
  for(const t of ['Cost','Sell price','Sell Price','More options','More Options','Category']) console.log('  ',t,':',body.includes(t));
  const moreCtrls=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,[role=button]')].map(e=>((e.textContent||'')+'|'+(e.getAttribute('aria-label')||'')).replace(/\s+/g,' ').trim()).filter(t=>/more option/i.test(t)));
  console.log('More options controls:', JSON.stringify(moreCtrls));
  await page.screenshot({path:OUT+'/FULLVIEW-CONFIRMED-v26.35.9.png'}).catch(()=>{});
} else {
  console.log('STILL TECH VIEW - flip did not persist');
  await page.screenshot({path:OUT+'/flip-failed-v26.35.9.png'}).catch(()=>{});
}
await s.browser.close();
