import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
async function setView(page,w){await page.evaluate((w)=>{const els=[...document.querySelectorAll('*')].filter(e=>(e.textContent||'').trim()===w&&e.children.length<=2&&e.offsetParent);const el=els[0];if(!el)return;let c=el;for(let i=0;i<4&&c;i++){if(c.matches('[role=radio],.q-radio,button,label,.q-toggle,[role=option],[class*=segment]')){c.click();return;}c=c.parentElement;}el.click();},w);
  await page.waitForTimeout(1200);
  await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-sv','1');}, lab);
  await page.locator('[data-sv="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);}
// LOGIN 1: set Full View + confirm See Financial ON
let s=await boot('sv9315','/administration/roles-permissions/'+ROLE+'/edit','admin');
await s.page.waitForTimeout(6000);
const seefin=await s.page.evaluate(()=>document.body.innerText.includes('See Financial Data'));
console.log('role screen has See Financial Data toggle:', seefin);
await setView(s.page,'Full View');
console.log('LOGIN1: set Full View + saved');
await s.browser.close();
// LOGIN 2 (FRESH): perms reload -> Full View
s=await boot('sv9315','/workorders?tab=estimate','admin');
await s.page.waitForTimeout(7000);
console.log('LOGIN2 identity fe_permissions:', s.nFePerms, 'template:', s.templateSlug);
await s.page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await s.page.locator('[data-o="1"] td').nth(1).click(); await s.page.waitForTimeout(11000);
await s.page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await s.page.waitForTimeout(5000);
await s.page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e)));if(b)b.setAttribute('data-a','1');}, lab);
await s.page.locator('[data-a="1"]').first().click().catch(()=>{}); await s.page.waitForTimeout(4500);
const flds=await s.page.evaluate(()=>[...document.querySelectorAll('.q-field__label')].map(e=>(e.textContent||'').trim()).filter(Boolean));
console.log('INLINE FIELD LABELS:', JSON.stringify([...new Set(flds)]));
const body=await s.page.evaluate(()=>document.body.innerText);
for(const t of ['Cost','Sell price','More Options','More options','Category']) console.log('  ',t,':',body.includes(t));
const moreCtrl=await s.page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(e=>e.offsetParent&&(/More Options/i.test(lab(e))||/More Options/i.test(e.getAttribute('aria-label')||''))).map(e=>lab(e)||e.getAttribute('aria-label'));}, lab);
console.log('More Options controls:', JSON.stringify(moreCtrl));
await s.page.screenshot({path:OUT+'/fullview-freshlogin-v26.35.9.png'}).catch(()=>{});
await s.browser.close();
// LOGIN 3: restore Tech View
s=await boot('sv9315','/administration/roles-permissions/'+ROLE+'/edit','admin');
await s.page.waitForTimeout(6000);
await setView(s.page,'Tech view');
console.log('RESTORED Tech view');
await s.browser.close();
