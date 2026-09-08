import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const s=await boot('sv9315','/workorders?tab=estimate','admin');
const page=s.page; await page.waitForTimeout(7000);
// open a WO
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c));const li=head.findIndex(h=>/^Lines/.test(h));for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab);if(c.join('').trim().length<3)continue;if(parseInt(c[li])>0){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click(); await page.waitForTimeout(10000);
// search the whole page for any control mentioning view / tech / full
const hits=await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('button,[role=button],.q-btn,[role=switch],.q-toggle,.q-tab,a,[class*=view],[class*=toggle]').forEach(e=>{
    const t=((e.textContent||'')+' | '+(e.getAttribute('aria-label')||'')+' | '+(e.title||'')).replace(/\s+/g,' ').trim();
    if(/tech view|full view|view mode|\bview\b/i.test(t) && t.length<70) out.push(t);
  });
  return [...new Set(out)].slice(0,25);
});
console.log('VIEW-ish controls on WO screen:', JSON.stringify(hits,null,1));
// check the account menu (top-right) for view/profile prefs
await page.locator('button:has-text("AS"), .q-avatar, [class*=avatar]').first().click().catch(()=>{});
await page.waitForTimeout(1500);
const menu=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu a, .q-list .q-item')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,15));
console.log('ACCOUNT MENU:', JSON.stringify(menu));
await s.browser.close();
