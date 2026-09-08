import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
const { browser, page } = await boot('sv9315', '/administration/roles-permissions/'+ROLE+'/edit', 'admin');
await page.waitForTimeout(6000);
async function setView(w){return await page.evaluate((w)=>{const els=[...document.querySelectorAll('*')].filter(e=>(e.textContent||'').trim()===w&&e.children.length<=2&&e.offsetParent);const el=els[0];if(!el)return 'nf';let c=el;for(let i=0;i<4&&c;i++){if(c.matches('[role=radio],.q-radio,button,label,.q-toggle,[role=option],[class*=segment]')){c.click();return 'clk';}c=c.parentElement;}el.click();return 'raw';},w);}
await setView('Full View'); await page.waitForTimeout(1000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s','1');}, lab);
await page.locator('[data-s="1"]').click().catch(()=>{}); await page.waitForTimeout(3500);
await page.goto('https://sv9315.qa.shopview.com/workorders?tab=estimate',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
// hover an existing part row, click its Edit part control
const hasEdit=await page.evaluate(()=>{const e=[...document.querySelectorAll('button,[role=button]')].find(x=>/Edit part/i.test(x.getAttribute('aria-label')||''));if(e){e.scrollIntoView();e.setAttribute('data-e','1');return true;}return false;});
console.log('has Edit part control:', hasEdit);
if(hasEdit){ await page.locator('[data-e="1"]').click({force:true}).catch(()=>{}); await page.waitForTimeout(3500);
  const dlg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return 'NO DIALOG - inline edit';const h=d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title,.q-card__section');return 'DIALOG: '+(h?(h.textContent||'').trim().slice(0,50):d.innerText.slice(0,60));});
  console.log('edit result:', JSON.stringify(dlg));
  // what did the row become? dump visible field labels + any More Options
  const after=await page.evaluate(()=>({flds:[...document.querySelectorAll('.q-field__label')].map(e=>(e.textContent||'').trim()).filter(Boolean).slice(0,14), moreOpts:document.body.innerText.includes('More Options')||document.body.innerText.includes('More options')}));
  console.log('after edit:', JSON.stringify(after));
  await page.screenshot({path:OUT+'/edit-part-v26.35.9.png'}).catch(()=>{});
}
await page.goto('https://sv9315.qa.shopview.com/administration/roles-permissions/'+ROLE+'/edit',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
await setView('Tech view'); await page.waitForTimeout(1000);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-s2','1');}, lab);
await page.locator('[data-s2="1"]').click().catch(()=>{}); await page.waitForTimeout(3500);
console.log('RESTORED Tech view');
await browser.close();
